import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  getEmployeeById,
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employee.controller.js";
import { getEmployeeTeams } from "../controllers/teamAssignment.controller.js";

const router = express.Router();

router.use(auth); // protect all routes

router.get("/", getEmployees);
router.get("/:id", getEmployeeById);
router.post("/", createEmployee);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

//differ

router.get("/teams/:employeeId", getEmployeeTeams);

export default router;
