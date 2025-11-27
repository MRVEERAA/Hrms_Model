import Organisation from "./organisation.js";
import User from "./user.model.js";
import Employee from "./employee.model.js";
import Team from "./team.model.js";
import EmployeeTeam from "./employeeTeam.model.js";
import Log from "./log.model.js";

// Organisation 1 -> many Users
Organisation.hasMany(User, { foreignKey: "organisation_id" });
User.belongsTo(Organisation, { foreignKey: "organisation_id" });

// Organisation 1 -> many Employees
Organisation.hasMany(Employee, { foreignKey: "organisation_id" });
Employee.belongsTo(Organisation, { foreignKey: "organisation_id" });

// Organisation 1 -> many Teams
Organisation.hasMany(Team, { foreignKey: "organisation_id" });
Team.belongsTo(Organisation, { foreignKey: "organisation_id" });

// Employee many <-> many Teams
Employee.belongsToMany(Team, {
  through: EmployeeTeam,
  foreignKey: "employee_id",
});
Team.belongsToMany(Employee, { through: EmployeeTeam, foreignKey: "team_id" });

// Logs
User.hasMany(Log, { foreignKey: "user_id" });
Log.belongsTo(User, { foreignKey: "user_id" });

Organisation.hasMany(Log, { foreignKey: "organisation_id" });
Log.belongsTo(Organisation, { foreignKey: "organisation_id" });

// Sync (only for development)
export const syncDB = async () => {
  await sequelize.sync({ alter: true });
  console.log("📌 Models synced with PostgreSQL");
};

export { Organisation, User, Employee, Team, EmployeeTeam, Log };
