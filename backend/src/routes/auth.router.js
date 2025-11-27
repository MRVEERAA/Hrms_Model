import express from "express";
import { Register, Login } from "../controllers/auth.controller.js";

const router = express.Router();

//Auth Section Routers
router.post("/register", Register);
router.post("/login", Login);

export default router;
