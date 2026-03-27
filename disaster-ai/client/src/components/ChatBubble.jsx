import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

const ChatBubble = ({ message, sender = 'AI', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, x: -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex items-start gap-4 mb-6"
    >
      <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/10">
        <Bot className="w-6 h-6 text-indigo-400" />
      </div>
      <div className="glass-morphism p-4 rounded-tl-none border-white/5 max-w-[85%]">
        <p className="text-slate-300 leading-relaxed text-sm md:text-base">
          {message}
        </p>
      </div>
    </motion.div>
  );
};

export default ChatBubble;
