import Team from "../models/team.model.js";
import Employee from "../models/employee.model.js";
import EmployeeTeam from "../models/employeeTeam.model.js";
import Log from "../models/log.model.js";

export const assignEmployee = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { employeeId, employeeIds } = req.body;
    const orgId = req.user.orgId;
    const userId = req.user.userId;

    // Check team belongs to organisation
    const team = await Team.findOne({
      where: { id: teamId, organisation_id: orgId },
    });
    if (!team)
      return res
        .status(404)
        .json({ message: "Team not found in your organisation" });

    // Normalise single or multiple
    let ids = [];
    if (employeeId) ids = [employeeId];
    if (Array.isArray(employeeIds)) ids = employeeIds;

    if (!ids.length)
      return res
        .status(400)
        .json({ message: "employeeId or employeeIds required" });

    const actuallyAssigned = [];

    for (const id of ids) {
      // Check employee belongs to org
      const emp = await Employee.findOne({
        where: { id, organisation_id: orgId },
      });
      if (!emp) continue;

      // Ensure not already assigned
      const exist = await EmployeeTeam.findOne({
        where: { employee_id: id, team_id: teamId },
      });
      if (!exist) {
        await EmployeeTeam.create({ employee_id: id, team_id: teamId });
        actuallyAssigned.push(id);
      }
    }

    // Log
    await Log.create({
      organisation_id: orgId,
      user_id: userId,
      action: "assigned_employee_to_team",
      meta: {
        teamId: Number(teamId),
        requestedEmployeeIds: ids,
        assignedEmployeeIds: actuallyAssigned,
      },
    });

    return res.status(200).json({
      message: "Employee(s) assigned successfully",
      assignedToTeam: teamId,
      employees: actuallyAssigned,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const unassignEmployee = async (req, res) => {
  try {
    const { teamId } = req.params;

    const employeeId = req.body?.employeeId || req.query?.employeeId;

    const orgId = req.user.orgId;
    const userId = req.user.userId;

    if (!employeeId)
      return res.status(400).json({ message: "employeeId required" });

    const team = await Team.findOne({
      where: { id: teamId, organisation_id: orgId },
    });
    if (!team)
      return res
        .status(404)
        .json({ message: "Team not found in your organisation" });

    const employee = await Employee.findOne({
      where: { id: employeeId, organisation_id: orgId },
    });
    if (!employee)
      return res
        .status(404)
        .json({ message: "Employee not found in your organisation" });

    const destroyed = await EmployeeTeam.destroy({
      where: { employee_id: employeeId, team_id: teamId },
    });

    await Log.create({
      organisation_id: orgId,
      user_id: userId,
      action: "unassigned_employee_from_team",
      meta: {
        teamId: Number(teamId),
        employeeId: Number(employeeId),
        removed: destroyed > 0,
      },
    });

    return res.status(200).json({
      message: "Employee unassigned successfully",
      teamId,
      employeeId,
      removed: destroyed > 0,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getEmployeeTeams = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const orgId = req.user.orgId;
    const userId = req.user.userId;

    if (!employeeId) {
      return res.status(400).json({ message: "employeeId missing" });
    }

    const emp = await Employee.findOne({
      where: { id: employeeId, organisation_id: orgId },
    });
    if (!emp) {
      return res
        .status(404)
        .json({ message: "Employee not found in your organisation" });
    }

    const rows = await EmployeeTeam.findAll({
      where: { employee_id: employeeId },
      attributes: ["team_id"],
      raw: true,
    });

    const teamIds = rows.map((r) => r.team_id);

    // Log the read action
    // await Log.create({
    //   organisation_id: orgId,
    //   user_id: userId,
    //   action: "get_employee_teams",
    //   meta: { employeeId: Number(employeeId), teamIds: teamIds },
    // });

    return res.status(200).json({ teams: teamIds });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
