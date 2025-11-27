import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Supabase requires SSL
      },
    },
  }
);

// test connection
sequelize
  .authenticate()
  .then(() => console.log("💚 Database Connected Successfully"))
  .catch((err) => console.error("❌ DB Connection Failed:", err));

export default sequelize;
