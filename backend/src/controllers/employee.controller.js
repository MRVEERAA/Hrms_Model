import Employee from "../models/employee.model.js";
import Log from "../models/log.model.js";

export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      where: { organisation_id: req.user.orgId },
      order: [["id", "DESC"]],
    });

    res.json({ success: true, employees });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      where: { id: req.params.id, organisation_id: req.user.orgId },
    });

    if (!employee) return res.status(404).json({ error: "Employee not found" });

    res.json({ success: true, employee });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, designation } = req.body;

    if (!first_name || !last_name || !email) {
      return res
        .status(400)
        .json({ error: "first_name, last_name & email are required" });
    }

    const exists = await Employee.findOne({
      where: { email, organisation_id: req.user.orgId },
    });
    if (exists)
      return res.status(409).json({ error: "Employee email already exists" });

    const employee = await Employee.create({
      organisation_id: req.user.orgId,
      first_name,
      last_name,
      email,
      phone,
      designation,
    });

    // log action
    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.userId,
      action: "create_employee",
      meta: { employeeId: employee.id },
    });

    res.status(201).json({ success: true, employee });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      where: { id: req.params.id, organisation_id: req.user.orgId },
    });

    if (!employee) return res.status(404).json({ error: "Employee not found" });

    await employee.update(req.body);

    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.userId,
      action: "update_employee",
      meta: { employeeId: employee.id },
    });

    res.json({ success: true, employee });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      where: { id: req.params.id, organisation_id: req.user.orgId },
    });

    if (!employee) return res.status(404).json({ error: "Employee not found" });

    await employee.destroy();

    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.userId,
      action: "delete_employee",
      meta: { employeeId: req.params.id },
    });

    res.json({ success: true, message: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};
