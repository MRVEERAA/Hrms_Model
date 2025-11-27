import express from "express";
import dotenv from "dotenv";
import sequelize from "./src/config/db.js";
import cors from "cors";
import path from "path";

import authRoutes from "./src/routes/auth.router.js";
import employeeRoutes from "./src/routes/employee.routes.js";
import teamRoutes from "./src/routes/team.routes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use env CLIENT_URL in production, fallback to dev frontend origin
const CLIENT_ORIGIN = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

const __dirname = path.resolve();

// API routers
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/teams", teamRoutes);

// Serve frontend built files in production (Vite dist)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend", "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
  });
}

// Connect DB + Run server
const startServer = async () => {
  try {
    // sync DB (use alter:false on existing production to avoid destructive changes)
    await sequelize.sync({ alter: process.env.NODE_ENV !== "production" });
    console.log("📌 Tables Synced");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Server Startup Error:", err);
    process.exit(1);
  }
};

startServer();
