import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';

const RiskBadge = ({ level }) => {
  const configs = {
    HIGH: {
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      icon: <AlertTriangle className="w-4 h-4" />,
      pulse: true
    },
    MEDIUM: {
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      icon: <AlertCircle className="w-4 h-4" />,
      pulse: false
    },
    LOW: {
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      icon: <CheckCircle className="w-4 h-4" />,
      pulse: false
    }
  };

  const config = configs[level] || configs.LOW;

  return (
    <motion.div
      animate={config.pulse ? { scale: [1, 1.05, 1] } : {}}
      transition={{ repeat: Infinity, duration: 2 }}
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${config.bg} ${config.color} border ${config.border} backdrop-blur-md`}
    >
      {config.icon}
      {level} RISK
    </motion.div>
  );
};

export default RiskBadge;
