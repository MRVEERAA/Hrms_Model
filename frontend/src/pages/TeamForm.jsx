import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Layers,
  ChevronLeft,
  Plus,
  Edit3,
  AlignLeft,
  Save,
  Loader2,
} from "lucide-react";
import API from "../api/api";

const TeamForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!isEditing) return;

    const loadTeam = async () => {
      setFetching(true);
      try {
        const res = await API.get(`/teams/${id}`);
        setForm({
          name: res.data.team.name || "",
          description: res.data.team.description || "",
        });
      } catch (err) {
        console.error("❌ Team fetch error:", err);
      } finally {
        setFetching(false);
      }
    };

    loadTeam();
  }, [id, isEditing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        await API.put(`/teams/${id}`, form);
      } else {
        await API.post("/teams", form);
      }
      navigate("/teams");
    } catch (err) {
      console.error("❌ Error saving team:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans p-6 lg:p-12">
      {/* HEADER NAVIGATION */}
      <div className="max-w-2xl mx-auto mb-8">
        <button
          onClick={() => navigate("/teams")}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-colors group"
        >
          <ChevronLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Infrastructure
        </button>
      </div>

      <div className="max-w-2xl mx-auto bg-[#090e1a]/40 border border-white/5 rounded-[2.5rem] p-8 lg:p-12 backdrop-blur-md relative overflow-hidden">
        {/* DECORATIVE GRADIENT BLUR */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full" />

        <header className="relative z-10 mb-10">
          <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 border border-indigo-500/20">
            {isEditing ? <Edit3 size={24} /> : <Plus size={24} />}
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {isEditing ? "Modify Cluster" : "Initialize Cluster"}
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            {isEditing
              ? `Updating configurations for NODE_${id.padStart(3, "0")}`
              : "Define the parameters for a new organizational unit."}
          </p>
        </header>

        {fetching ? (
          <div className="py-20 flex flex-col items-center justify-center opacity-50">
            <Loader2 className="animate-spin text-indigo-500 mb-4" size={32} />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em]">
              Syncing Node...
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* TEAM NAME */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                Cluster Designation
              </label>
              <div className="relative">
                <Layers
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  size={16}
                />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Engineering, Marketing..."
                  className="w-full bg-white/2 border border-white/8 rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-200 placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all"
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                Operational Brief
              </label>
              <div className="relative">
                <AlignLeft
                  className="absolute left-4 top-4 text-slate-600"
                  size={16}
                />
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe the purpose of this cluster..."
                  className="w-full bg-white/2 border border-white/8 rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-200 placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all resize-none"
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Save size={18} />
                    {isEditing ? "Save Configurations" : "Deploy Cluster"}
                  </>
                )}
              </button>

              <Link
                to="/teams"
                className="block text-center mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 hover:text-slate-400 transition-colors"
              >
                Discard Changes
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TeamForm;
