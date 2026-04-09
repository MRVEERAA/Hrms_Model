import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  ChevronLeft,
  Save,
  Loader2,
  UserPlus,
  Edit,
} from "lucide-react";
import API from "../api/api";

export default function EmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (id) {
      setFetching(true);
      API.get(`/employees/${id}`)
        .then((res) => setForm(res.data.employee))
        .catch((err) => console.error(err))
        .finally(() => setFetching(false));
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await API.put(`/employees/${id}`, form);
      } else {
        await API.post("/employees", form);
      }
      navigate("/employees");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans p-6 lg:p-12">
      {/* HEADER NAVIGATION */}
      <div className="max-w-2xl mx-auto mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate("/employees")}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-colors group"
        >
          <ChevronLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Directory
        </button>
      </div>

      <div className="max-w-2xl mx-auto bg-[#090e1a]/40 border border-white/5] rounded-[2.5rem] p-8 lg:p-12 backdrop-blur-md relative overflow-hidden">
        {/* DECORATIVE GRADIENT BLUR */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full" />

        <header className="relative z-10 mb-10">
          <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 border border-indigo-500/20">
            {id ? <Edit size={24} /> : <UserPlus size={24} />}
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {id ? "Update Profile" : "Register Member"}
          </h1>
          <p className="text-slate-500 mt-2 text-sm italic">
            {id
              ? `Modifying records for ID_${id.padStart(4, "0")}`
              : "Enter the personal details for the new team member."}
          </p>
        </header>

        {fetching ? (
          <div className="py-20 flex flex-col items-center justify-center opacity-50">
            <Loader2 className="animate-spin text-indigo-500 mb-4" size={32} />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em]">
              Loading Record...
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* FIRST NAME */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                  First Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                    size={16}
                  />
                  <input
                    type="text"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    required
                    placeholder="John"
                    className="w-full bg-white/2 border border-white/8 rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-200 placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all"
                  />
                </div>
              </div>

              {/* LAST NAME */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                  Last Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                    size={16}
                  />
                  <input
                    type="text"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    required
                    placeholder="Doe"
                    className="w-full bg-white/2 border border-white/8 rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-200 placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                Professional Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  size={16}
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="j.doe@company.com"
                  className="w-full bg-white/2 border border-white/8 rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-200 placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all"
                />
              </div>
            </div>

            {/* PHONE */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  size={16}
                />
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-white/2 border border-white/8 rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-200 placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all"
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
                    {id ? "Sync Changes" : "Create Profile"}
                  </>
                )}
              </button>

              <Link
                to="/employees"
                className="block text-center mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 hover:text-slate-400 transition-colors"
              >
                Cancel Process
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
