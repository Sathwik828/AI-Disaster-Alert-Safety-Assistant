import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, colorClass = 'text-indigo-400', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-morphism p-4 flex items-center gap-4 hover:bg-white/10 transition-colors"
    >
      <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{label}</p>
        <p className="text-white font-bold text-lg">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
