import express from "express";
import auth from "../middleware/authMiddleware.js";

import {
  getEmployeeById,
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesByTeam,
} from "../controllers/employee.controller.js";

import { getEmployeeTeams } from "../controllers/teamAssignment.controller.js";

const router = express.Router();

router.use(auth);

// GET all employees
router.get("/", getEmployees);


// employee teams
router.get("/teams/:employeeId", getEmployeeTeams);

//Filter Optionssss
router.get("/team/:teamId", getEmployeesByTeam);


// CRUD
router.get("/:id", getEmployeeById);
router.post("/", createEmployee);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
