import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login.jsx";
import RegisterOrganisation from "./pages/RegisterOrganisation.jsx";
import Dashboard from "./pages/Dashboard.jsx";

import Employees from "./pages/Employees.jsx";
import EmployeeForm from "./pages/EmployeeForm.jsx";
// import EmployeeTeamAssignment from "./pages/EmployeeTeamAssignment.jsx";
import EmployeeTeamModal from "./pages/EmployeeTeamModal.jsx";

import Teams from "./pages/Teams.jsx";
import TeamForm from "./pages/TeamForm.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect "/" → "/login" */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterOrganisation />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* EMPLOYEES */}
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <Employees />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees/new"
          element={
            <ProtectedRoute>
              <EmployeeForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees/edit/:id"
          element={
            <ProtectedRoute>
              <EmployeeForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees/:id/assign-teams"
          element={
            <ProtectedRoute>
              <EmployeeTeamModal />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teams"
          element={
            <ProtectedRoute>
              <Teams />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teams/new"
          element={
            <ProtectedRoute>
              <TeamForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teams/edit/:id"
          element={
            <ProtectedRoute>
              <TeamForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
