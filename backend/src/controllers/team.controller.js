import Team from "../models/team.model.js";
import Log from "../models/log.model.js";

export const getTeams = async (req, res) => {
  try {
    const teams = await Team.findAll({
      where: { organisation_id: req.user.orgId },
      order: [["id", "DESC"]],
    });

    res.json({ success: true, teams });
  } catch {
    res.status(500).json({ error: "Server Error" });
  }
};

export const getTeamById = async (req, res) => {
  try {
    const team = await Team.findOne({
      where: { id: req.params.id, organisation_id: req.user.orgId },
    });

    if (!team) return res.status(404).json({ error: "Team not found" });

    res.json({ success: true, team });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

export const createTeam = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "Team name required" });

    const team = await Team.create({
      name,
      organisation_id: req.user.orgId,
      description,
    });

    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.userId,
      action: "create_team",
      meta: { teamId: team.id },
    });

    res.status(201).json({ success: true, team });
  } catch (e) {
    res.status(500).json({ error: `Error in ${e}` });
  }
};

export const updateTeam = async (req, res) => {
  try {
    const team = await Team.findOne({
      where: { id: req.params.id, organisation_id: req.user.orgId },
    });

    if (!team) return res.status(404).json({ error: "Team not found" });

    await team.update(req.body);

    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.userId,
      action: "update_team",
      meta: { teamId: team.id },
    });

    res.json({ success: true, team });
  } catch {
    res.status(500).json({ error: "Server Error" });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findOne({
      where: { id: req.params.id, organisation_id: req.user.orgId },
    });

    if (!team) return res.status(404).json({ error: "Team not found" });

    await team.destroy();

    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.userId,
      action: "delete_team",
      meta: { teamId: req.params.id },
    });

    res.json({ success: true, message: "Team deleted" });
  } catch {
    res.status(500).json({ error: "Server Error" });
  }
};
