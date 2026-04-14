import { motion } from "framer-motion";

const StatsCard = ({ icon: Icon, label, value, accent = "text-brand-yellow" }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-3xl border border-white/10 bg-zinc-950/80 p-5 shadow-panel"
  >
    <div className="mb-3 flex items-center justify-between">
      <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">{label}</p>
      <div className={`rounded-2xl bg-white/5 p-3 ${accent}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
    <p className="font-display text-5xl uppercase leading-none text-white">{value}</p>
  </motion.div>
);

export default StatsCard;
