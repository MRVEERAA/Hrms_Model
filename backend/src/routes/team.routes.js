import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
} from "../controllers/team.controller.js";
import {
  assignEmployee,
  unassignEmployee,
} from "../controllers/teamAssignment.controller.js";

const router = express.Router();

router.use(auth);

// CRUD
router.get("/", getTeams);
router.post("/", createTeam);
router.get("/:id", getTeamById);
router.put("/:id", updateTeam);
router.delete("/:id", deleteTeam);

// Assign and Unassign
router.post("/:teamId/assign", assignEmployee);
router.post("/:teamId/unassign", unassignEmployee);

export default router;
