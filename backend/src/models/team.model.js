import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Team = sequelize.define(
  "Team",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    organisation_id: { type: DataTypes.UUID, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
  },
  { tableName: "teams", timestamps: true }
);

export default Team;
