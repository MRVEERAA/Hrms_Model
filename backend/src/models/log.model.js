import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Log = sequelize.define(
  "Log",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    organisation_id: { type: DataTypes.UUID }, // match Organisation ID type
    user_id: { type: DataTypes.UUID }, // match User ID type
    action: { type: DataTypes.STRING },
    meta: { type: DataTypes.JSONB },
  },
  { tableName: "logs", timestamps: false }
);

export default Log;
