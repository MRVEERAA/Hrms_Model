import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  ChevronLeft,
  CheckCircle2,
  ShieldCheck,
  Activity,
  Save,
  Hash,
} from "lucide-react";
import API from "../api/api";

export default function EmployeeTeamModal() {
  const { id: employeeId } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        console.error("❌ Failed to load data:", err);
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
        : [...prev, teamId],
    );
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const prevAssignedRes = await API.get(`/employees/teams/${employeeId}`);
      const prevAssigned = prevAssignedRes.data.teams || [];

      for (const team of teams) {
        const isSelected = selectedTeams.includes(team.id);
        const wasAssigned = prevAssigned.includes(team.id);

        if (isSelected && !wasAssigned) {
          await API.post(`/teams/${team.id}/assign`, {
            employeeId: Number(employeeId),
          });
        }

        if (!isSelected && wasAssigned) {
          await API.post(`/teams/${team.id}/unassign`, {
            employeeId: Number(employeeId),
          });
        }
      }
      navigate("/employees");
    } catch (err) {
      console.error("❌ Assignment update failed:", err);
      alert("Error updating team assignments.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center py-32 opacity-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Activity size={32} className="text-indigo-500" />
        </motion.div>
        <p className="mt-4 text-[10px] font-mono tracking-[0.2em] uppercase text-indigo-400">
          Syncing permissions...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans p-6 lg:p-12">
      <div className="max-w-2xl mx-auto">
        {/* TOP NAVIGATION */}
        <button
          onClick={() => navigate("/employees")}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-colors group mb-8"
        >
          <ChevronLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Directory
        </button>

        <section className="bg-[#090e1a]/40 border border-white/5 rounded-[2.5rem] p-8 lg:p-10 backdrop-blur-md relative overflow-hidden">
          {/* DECORATIVE BACKGROUND ICON */}
          <ShieldCheck
            size={200}
            className="absolute -bottom-10 -right-10 text-white/2 -rotate-12 pointer-events-none"
          />

          <header className="mb-10 relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-xl bg-linear-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                <Users size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Team Permissions
                </h1>
                <p className="text-slate-500 text-sm italic">
                  Assigning {employee.first_name} {employee.last_name} to
                  clusters.
                </p>
              </div>
            </div>
          </header>

          {/* TEAM SELECTION GRID */}
          <div className="grid gap-3 relative z-10">
            {teams.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl">
                <p className="text-slate-600 text-sm">
                  No active teams found in the database.
                </p>
              </div>
            ) : (
              teams.map((team) => {
                const isActive = selectedTeams.includes(team.id);
                return (
                  <motion.label
                    key={team.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                      isActive
                        ? "bg-indigo-500/10 border-indigo-500/40 shadow-lg shadow-indigo-500/5"
                        : "bg-white/3 border-white/5 hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-lg transition-colors ${isActive ? "text-indigo-400" : "text-slate-600"}`}
                      >
                        <Hash size={16} />
                      </div>
                      <span
                        className={`font-medium transition-colors ${isActive ? "text-white" : "text-slate-400"}`}
                      >
                        {team.name}
                      </span>
                    </div>

                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => toggleTeam(team.id)}
                        className="peer hidden"
                      />
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isActive
                            ? "bg-indigo-500 border-indigo-500"
                            : "border-white/10"
                        }`}
                      >
                        {isActive && (
                          <CheckCircle2 size={14} className="text-white" />
                        )}
                      </div>
                    </div>
                  </motion.label>
                );
              })
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-10 space-y-4 relative z-10">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
            >
              {saving ? (
                <Activity className="animate-spin" size={20} />
              ) : (
                <>
                  <Save size={18} />
                  Update Assignments
                </>
              )}
            </button>
            <Link
              to="/employees"
              className="block text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 hover:text-slate-400 transition-colors"
            >
              Cancel and Return
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
