import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  LayoutDashboard,
  LogOut,
  Layers,
  Briefcase,
  Settings,
  Bell,
  Search,
} from "lucide-react";
import NavItem from "../components/NavItem";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user] = useState(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#030712] text-slate-200 flex"
    >
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/5 bg-[#090e1a]/50 backdrop-blur-xl hidden md:flex flex-col p-6">
        <div className="flex items-center gap-3 font-bold text-xl text-white mb-10 px-2">
          <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Users size={18} />
          </div>
          <span>
            Pulse<span className="text-indigo-400">HR</span>
          </span>
        </div>

        <nav className="space-y-2 flex-1">
          <NavItem
            icon={<LayoutDashboard size={18} />}
            label="Overview"
            active
          />
          <NavItem
            icon={<Users size={18} />}
            label="Employees"
            to="/employees"
          />
          <NavItem icon={<Layers size={18} />} label="Teams" to="/teams" />
          <NavItem icon={<Briefcase size={18} />} label="Projects" />
          <NavItem icon={<Settings size={18} />} label="Settings" />
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all mt-auto"
        >
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col">
        {/* TOP NAV */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#030712]/50 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/5 w-96">
            <Search size={16} className="text-slate-500" />
            <input
              type="text"
              placeholder="Search team or projects..."
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-600"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-indigo-500 rounded-full border-2 border-[#030712]"></span>
            </button>

            <div className="h-10 w-10 rounded-full bg-linear-to-tr from-indigo-600 to-purple-600 p-0.5">
              <div className="h-full w-full rounded-full bg-[#090e1a] flex items-center justify-center text-xs font-bold">
                {user?.name?.charAt(0) || "U"}
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <div className="p-8 space-y-8 overflow-y-auto">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Welcome back, {user ? user.name : "Admin"}
            </h1>
            <p className="text-slate-500 mt-1">
              Here is what's happening with your teams today.
            </p>
          </div>

          {/* QUICK STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Total Staff" value="08" change="+1 this month" />
            <StatCard label="Active Teams" value="03" change="Stable" />
            <StatCard
              label="System Health"
              value="99.9%"
              change="Optimal"
              color="text-emerald-400"
            />
          </div>

          {/* MAIN ACTIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Link to="/employees" className="group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="p-8 rounded-4xl bg-indigo-600/5 border border-indigo-500/10 hover:border-indigo-500/30 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 text-indigo-500/10 group-hover:text-indigo-500/20 transition-colors">
                  <Users size={120} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Employees
                </h3>
                <p className="text-slate-400 max-w-[200px]">
                  Access profiles, documents, and directory.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                  Manage Directory <Briefcase size={16} />
                </div>
              </motion.div>
            </Link>

            <Link to="/teams" className="group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="p-8 rounded-4xl bg-purple-600/5 border border-purple-500/10 hover:border-purple-500/30 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 text-purple-500/10 group-hover:text-purple-500/20 transition-colors">
                  <Layers size={120} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Teams</h3>
                <p className="text-slate-400 max-w-[200px]">
                  Oversee project groups and assignments.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-purple-400 font-semibold text-sm">
                  View Hierarchy <Layers size={16} />
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
