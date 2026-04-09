import { Link } from "react-router-dom";

function NavItem({ icon, label, to = "#", active = false }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
        active
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
          : "text-slate-400 hover:text-white hover:bg-white/5"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

export default NavItem;
