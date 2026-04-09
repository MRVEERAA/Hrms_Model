import { motion } from "framer-motion";

function StatCard({ label, value, change, color = "text-white" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      className="p-6 rounded-3xl bg-[#090e1a] border border-white/5"
    >
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
        {label}
      </p>
      <div className="flex items-end justify-between">
        <h4 className={`text-4xl font-bold ${color}`}>{value}</h4>
        <span className="text-[10px] font-medium text-slate-500 bg-white/5 px-2 py-1 rounded-md">
          {change}
        </span>
      </div>
    </motion.div>
  );
}

export default StatCard;
