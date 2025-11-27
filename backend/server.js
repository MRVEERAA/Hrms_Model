import express from "express";
import dotenv from "dotenv";
import sequelize from "./src/config/db.js";
import cors from "cors";

import authRoutes from "./src/routes/auth.router.js";
import employeeRoutes from "./src/routes/employee.routes.js";
import teamRoutes from "./src/routes/team.routes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const CLIENT_ORIGIN = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/teams", teamRoutes);

// Start server
const startServer = async () => {
  try {
    await sequelize.sync({ alter: false });
    console.log("📌 DB Synced");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

startServer();
