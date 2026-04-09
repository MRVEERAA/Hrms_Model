import { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  Mail,
  Phone,
  Trash2,
  Edit3,
  ChevronLeft,
  UserPlus,
  Activity,
  X,
} from "lucide-react";
import API from "../api/api";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await API.get("/employees");
      return res.data.employees || [];
    } catch (err) {
      console.error("❌ Fetch error:", err);
      return [];
    }
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await API.get("/teams");
      setTeams(res.data.teams || []);
    } catch (err) {
      console.error("❌ Teams error:", err);
    }
  };

  useEffect(() => {
    let mounted = true;
    fetchEmployees().then((data) => {
      if (mounted) {
        setEmployees(data);
        setLoading(false);
      }
    });
    fetchTeams();
    return () => {
      mounted = false;
    };
  }, [fetchEmployees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase();
      const email = emp.email.toLowerCase();
      const search = searchTerm.toLowerCase();

      return fullName.includes(search) || email.includes(search);
    });
  }, [employees, searchTerm]);

  const handleTeamFilter = async (teamId) => {
    setSelectedTeam(teamId);
    setLoading(true);
    try {
      const endpoint = teamId ? `/employees/team/${teamId}` : "/employees";
      const res = await API.get(endpoint);
      setEmployees(res.data.employees || []);
    } catch (err) {
      console.error("❌ Filter error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanent action: Delete this record?")) return;
    try {
      await API.delete(`/employees/${id}`);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans selection:bg-indigo-500/30">
      {/* TOP NAVIGATION BAR */}
      <header className="h-16 border-b border-white/50 bg-[#030712]/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-500 group"
          >
            <ChevronLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
          </button>
          <div className="h-4 w-px bg-white/10 mx-2" />
          <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Users size={16} className="text-indigo-400" />
            Directory
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/employees/new"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
          >
            <UserPlus size={14} />
            <span className="hidden sm:inline">Add Member</span>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 lg:p-12">
        {/* PAGE HEADER & SEARCH/FILTERS */}
        <section className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Team Personnel
            </h2>
            <p className="text-slate-500 text-sm">
              Showing {filteredEmployees.length} of {employees.length} active
              profiles.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
            {/* MODERN SEARCH BAR */}
            <div className="relative w-full sm:w-80 group">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors"
              />
              <input
                type="text"
                placeholder="Search name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/3 border border-white/8 rounded-xl py-2.5 pl-10 pr-10 text-xs font-medium text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* TEAM FILTER */}
            <div className="relative w-full sm:w-48 group">
              <Filter
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <select
                value={selectedTeam}
                onChange={(e) => handleTeamFilter(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-white/3 border border-white/8 rounded-xl text-xs font-medium text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer hover:bg-white/5 transition-all"
              >
                <option value="" className="bg-[#030712]">
                  All Departments
                </option>
                {teams.map((team) => (
                  <option
                    key={team.id}
                    value={team.id}
                    className="bg-[#030712]"
                  >
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* GRID CONTENT */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-50">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Activity size={32} className="text-indigo-500" />
            </motion.div>
            <p className="mt-4 text-[10px] font-mono tracking-[0.2em] uppercase text-indigo-400">
              Syncing database...
            </p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 border-2 border-dashed border-white/5 rounded-[2.5rem] bg-white/1"
          >
            <Search size={48} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-500 font-medium">
              No members match your criteria.
            </p>

            {/* CLEAR FILTERS BUTTON */}
            <button
              onClick={() => {
                setSearchTerm("");
                handleTeamFilter("");
              }}
              className="mt-6 px-6 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-bold rounded-xl border border-indigo-500/20 transition-all active:scale-95"
            >
              Clear all filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredEmployees.map((emp) => (
                <motion.div
                  key={emp.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    transition: { duration: 0.2 },
                  }}
                  className="group relative bg-[#090e1a]/40 border border-white/5 hover:border-indigo-500/30 rounded-4xl p-6 transition-all duration-300"
                >
                  {/* Floating Action Menu */}
                  <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Link
                      to={`/employees/edit/${emp.id}`}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                      <Edit3 size={14} />
                    </Link>
                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="p-2 bg-white/5 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20 group-hover:scale-105 transition-transform uppercase">
                      {emp.first_name[0]}
                      {emp.last_name[0]}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight">
                        {emp.first_name} {emp.last_name}
                      </h3>
                      <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                        ID_{emp.id.toString().padStart(4, "0")}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-white/3">
                    <div className="flex items-center gap-3 text-xs text-slate-400 truncate">
                      <Mail size={14} className="text-slate-600 shrink-0" />
                      {emp.email}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <Phone size={14} className="text-slate-600 shrink-0" />
                      {emp.phone || "No contact linked"}
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                        Active Member
                      </span>
                    </div>
                    <Link
                      to={`/employees/${emp.id}/assign-teams`}
                      className="px-4 py-1.5 bg-white/3 hover:bg-white/5 border border-white/5 text-slate-300 text-[10px] font-bold rounded-lg transition-colors uppercase tracking-widest"
                    >
                      Manage Teams
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
