import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Loader2,
  Users,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Globe,
} from "lucide-react";
import API from "../api/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "", orgName: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard", { replace: true });
  }, [navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.error || "Invalid credentials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 antialiased font-sans relative overflow-hidden flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 blur-[120px] rounded-full" />

        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full" />

        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-[#090e1a]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        {/* LEFT SECTION: Branding & Visuals */}
        <div className="p-12 lg:p-16 flex flex-col justify-between bg-linear-to-b from-white/2 to-transparent border-r border-white/5">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 font-bold text-3xl tracking-tight text-white mb-10"
            >
              <div className="h-9 w-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Users size={20} className="text-white" />
              </div>
              <span>
                Pulse<span className="text-indigo-400">HR</span>
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-bold text-white leading-tight tracking-tight mb-8"
            >
              The unified <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-blue-400 to-purple-400">
                people platform.
              </span>
            </motion.h1>

            <p className="text-slate-400 text-sm max-w-[400px] mb-8 leading-relaxed">
              Managing your small team shouldn't be a puzzle. Centralize
              everything in one pulse.
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: <ShieldCheck size={18} />,
                  text: "Enterprise-grade security",
                },
                {
                  icon: <Globe size={18} />,
                  text: "Team-sync compliance",
                },
                {
                  icon: <Sparkles size={18} />,
                  text: "Crud Management",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-4 text-sm mb-4 font-medium text-slate-300"
                >
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-400">
                    {item.icon}
                  </div>
                  {item.text}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="max-w-sm pt-8 border-t border-white/5">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                </div>
                <span className="text-[9px] font-bold tracking-[0.2em] text-indigo-400/80 uppercase">
                  System Standby
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-lg font-semibold text-white tracking-tight">
                  The app is waiting for you.
                </p>
                <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[260px]">
                  Your workspace is fully synced. Sign in to begin your session.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <div className="h-1px w-6 bg-white/10"></div>
                <span className="font-mono text-[8px] text-slate-600 tracking-widest uppercase">
                  Node_Active // Ready
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* RIGHT SECTION: The Form */}
        <div className="p-12 lg:p-16 bg-white/1 border-l border-white/5 relative">
          <div className="max-w-sm mx-auto lg:ml-0">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Welcome back
              </h2>
              <p className="text-slate-500 mt-2">
                Access your secure workspace
              </p>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">
                  Organization
                </label>
                <input
                  type="text"
                  name="orgName"
                  placeholder="e.g. apple-inc"
                  value={form.orgName}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-white/3 border border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">
                  Work Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-white/3 border border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    Password
                  </label>
                  <Link
                    to="/forgot"
                    className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 rounded-2xl bg-white/3 border border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 group mt-4"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Sign in to Portal
                    <ChevronRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </motion.button>
            </form>

            <footer className="mt-10 text-center lg:text-left">
              <p className="text-slate-500 text-sm">
                Registering a new firm?{" "}
                <Link
                  to="/register"
                  className="text-white font-semibold hover:text-indigo-400 transition-colors underline underline-offset-8 decoration-indigo-500/30"
                >
                  Join PulseHR
                </Link>
              </p>
            </footer>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
