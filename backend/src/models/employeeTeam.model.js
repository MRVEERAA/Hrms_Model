import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Employee from "./employee.model.js";
import Team from "./team.model.js";

const EmployeeTeam = sequelize.define(
  "EmployeeTeam",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "employees", key: "id" },
      onDelete: "CASCADE",
    },
    team_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Team, key: "id" },
      onDelete: "CASCADE",
    },
    assigned_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "employee_teams",
    timestamps: false,
  }
);

export default EmployeeTeam;
