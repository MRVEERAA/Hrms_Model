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

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL, // Main Vercel domain
  process.env.CLIENT_URL2, // Preview / build URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS Not Allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false, // <<< IMPORTANT for Express v5
    optionsSuccessStatus: 204, // <<< Auto handle OPTIONS
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/teams", teamRoutes);

//START SERVER

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
