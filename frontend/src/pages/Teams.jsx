import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Plus,
  Trash2,
  Edit3,
  ChevronLeft,
  Activity,
  Users,
  LayoutGrid,
  Search,
  X,
} from "lucide-react";
import API from "../api/api";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchTeams = async () => {
    try {
      const res = await API.get("/teams");
      setTeams(res.data.teams || []);
    } catch (err) {
      console.error("❌ Error fetching teams:", err);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteTeam = async (id) => {
    if (!window.confirm("Permanent Action: Decommission this team cluster?"))
      return;

    try {
      await API.delete(`/teams/${id}`);
      setTeams(teams.filter((t) => t.id !== id));
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      const name = team.name.toLowerCase();
      const desc = (team.description || "").toLowerCase();
      const search = searchTerm.toLowerCase();
      return name.includes(search) || desc.includes(search);
    });
  }, [teams, searchTerm]);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans selection:bg-indigo-500/30">
      <header className="h-16 border-b border-white/5 bg-[#030712]/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">
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
            <Layers size={16} className="text-indigo-400" />
            Infrastructure
          </h1>
        </div>

        <Link
          to="/teams/new"
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
        >
          <Plus size={14} />
          <span className="hidden sm:inline">Create Team</span>
        </Link>
      </header>

      <main className="max-w-7xl mx-auto p-8 lg:p-12">
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Team Clusters
            </h2>
            <p className="text-slate-500 text-sm">
              Operationalizing {filteredTeams.length} units.
            </p>
          </div>

          {/* SEARCH INPUT */}
          <div className="relative w-full md:w-80 group">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors"
            />
            <input
              type="text"
              placeholder="Filter by name or desc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/3 border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-xs font-medium text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all"
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
        </section>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-50">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Activity size={32} className="text-indigo-500" />
            </motion.div>
            <p className="mt-4 text-[10px] font-mono tracking-[0.2em] uppercase text-indigo-400">
              Fetching Network Data...
            </p>
          </div>
        ) : filteredTeams.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 border-2 border-dashed border-white/5 rounded-[2.5rem]"
          >
            <LayoutGrid size={48} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-500 font-medium">
              No team clusters match your query.
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 text-xs font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
              >
                Reset Search
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredTeams.map((team, index) => (
                <motion.div
                  key={team.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative bg-[#090e1a]/40 border border-white/5 hover:border-indigo-500/30 rounded-4xl p-6 transition-all duration-300"
                >
                  <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Link
                      to={`/teams/edit/${team.id}`}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                      <Edit3 size={14} />
                    </Link>
                    <button
                      onClick={() => deleteTeam(team.id)}
                      className="p-2 bg-white/5 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                      <Users size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight leading-none">
                        {team.name}
                      </h3>
                      <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mt-1">
                        NODE_{team.id.toString().padStart(3, "0")}
                      </p>
                    </div>
                  </div>

                  <div className="min-h-[60px]">
                    <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 italic">
                      {team.description ||
                        "No operational description provided."}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                        Active Node
                      </span>
                    </div>
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
