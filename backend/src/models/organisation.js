import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Organisation = sequelize.define(
  "Organisation",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "organisations",
    timestamps: true,
  }
);

export default Organisation;
