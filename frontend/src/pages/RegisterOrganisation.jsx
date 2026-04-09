import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Building2,
  UserCircle,
  Mail,
  Lock,
} from "lucide-react";
import API from "../api/api";

export default function RegisterOrganisation() {
  const [form, setForm] = useState({
    orgName: "",
    adminName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Registration failed. Try a different email.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 antialiased font-sans relative overflow-hidden flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 blur-[120px] rounded-full" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 blur-[100px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-xl bg-[#090e1a]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden p-8 lg:p-12"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            className="inline-flex h-12 w-12 bg-indigo-600 rounded-xl items-center justify-center shadow-lg shadow-indigo-500/20 mb-6"
          >
            <Building2 size={24} className="text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Create your pulse
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            Deploy your organization's central command
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-3"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors">
              <Building2 size={18} />
            </div>
            <input
              name="orgName"
              placeholder="Organisation Name"
              value={form.orgName}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white/3 border border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-sm"
            />
          </div>

          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors">
              <UserCircle size={18} />
            </div>
            <input
              name="adminName"
              placeholder="Your Full Name"
              value={form.adminName}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white/3 border border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-sm"
            />
          </div>

          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors">
              <Mail size={18} />
            </div>
            <input
              name="email"
              type="email"
              placeholder="Work Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white/3 border border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-sm"
            />
          </div>

          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors">
              <Lock size={18} />
            </div>
            <input
              name="password"
              type="password"
              placeholder="Secure Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white/3 border border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-sm"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 group mt-6"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Register Organisation
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs text-center sm:text-left">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-white hover:text-indigo-400 transition-colors font-medium"
            >
              Sign in
            </Link>
          </p>
          <div className="flex items-center gap-2 text-[10px] text-slate-600 font-mono tracking-tighter">
            <ShieldCheck size={12} className="text-indigo-500/50" />
            SECURE_ENROLLMENT_V2
          </div>
        </div>
      </motion.div>
    </div>
  );
}
