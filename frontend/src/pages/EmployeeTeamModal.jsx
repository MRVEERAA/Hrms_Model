import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/api";

export default function EmployeeTeamModal() {
  const { id: employeeId } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const empRes = await API.get(`/employees/${employeeId}`);
        const emp = empRes.data.employee;

        const teamRes = await API.get("/teams");
        const allTeams = teamRes.data.teams || [];

        const assignedRes = await API.get(`/employees/teams/${employeeId}`);

        const assignedIds = assignedRes.data.teams.map((t) => t) || [];

        if (!mounted) return;

        setEmployee(emp);
        setTeams(allTeams);
        setSelectedTeams(assignedIds);
        setLoading(false);
      } catch (err) {
        console.error("❌ Failed to load assign-team data:", err);
        navigate("/employees");
      }
    };

    loadData();

    return () => (mounted = false);
  }, [employeeId, navigate]);

  const toggleTeam = (teamId) => {
    setSelectedTeams((prev) =>
      prev.includes(teamId)
        ? prev.filter((t) => t !== teamId)
        : [...prev, teamId]
    );
  };

  const handleSubmit = async () => {
    try {
      const prevAssignedRes = await API.get(`/employees/teams/${employeeId}`);
      const prevAssigned = prevAssignedRes.data.teams || [];

      for (const team of teams) {
        const isSelected = selectedTeams.includes(team.id);
        const wasAssigned = prevAssigned.includes(team.id);

        // Assign
        if (isSelected && !wasAssigned) {
          await API.post(`/teams/${team.id}/assign`, {
            employeeId: Number(employeeId),
          });
        }

        // Unassign
        if (!isSelected && wasAssigned) {
          await API.post(`/teams/${team.id}/unassign`, {
            employeeId: Number(employeeId),
          });
        }
      }

      alert("Team assignments updated!");
      navigate("/employees");
    } catch (err) {
      console.error("❌ Assignment update failed:", err);
      alert("Error updating team assignments.");
    }
  };

  if (loading) {
    return <p className="text-center p-6 text-gray-500">Loading…</p>;
  }

  if (!employee) {
    return <p className="text-center p-6 text-red-500">Employee not found.</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <Link
        to="/employees"
        className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 rounded-lg"
      >
        ← Back
      </Link>

      <h1 className="text-2xl font-bold text-gray-800 mt-4">
        Assign Teams — {employee.first_name} {employee.last_name}
      </h1>

      <div className="mt-6 space-y-3">
        {teams.length === 0 ? (
          <p className="text-gray-500">No teams available.</p>
        ) : (
          teams.map((team) => (
            <label
              key={team.id}
              className="flex items-center gap-3 p-3 border rounded-lg shadow-sm"
            >
              <input
                type="checkbox"
                checked={selectedTeams.includes(team.id)}
                onChange={() => toggleTeam(team.id)}
                className="w-5 h-5"
              />
              <span className="text-gray-700 text-lg">{team.name}</span>
            </label>
          ))
        )}
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg"
      >
        Save
      </button>
    </div>
  );
}
