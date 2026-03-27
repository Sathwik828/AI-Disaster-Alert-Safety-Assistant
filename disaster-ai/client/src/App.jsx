import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, MapPin, Phone, ShieldCheck, 
  Info, Loader2, Mic, Volume2, Search,
  Navigation, Cloud, ShieldAlert, Bot
} from 'lucide-react';

// Import custom components
import GlassCard from './components/GlassCard';
import RiskBadge from './components/RiskBadge';
import ChatBubble from './components/ChatBubble';
import StatCard from './components/StatCard';

function App() {
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [voiceActive, setVoiceActive] = useState(false);
  const leafletMap = useRef(null);

  const checkRisk = async () => {
    if (!location) return;
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/disaster', { location });
      setResult(response.data);
      if (response.data.risk_level === 'HIGH') {
        playAlertSound();
        speak(`Warning: High risk disaster detected. ${response.data.alert_message}`);
      }
    } catch (err) {
      setError('Failed to fetch disaster data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const playAlertSound = () => {
    const audio = new Audio('https://www.soundjay.com/buttons/beep-01a.mp3');
    audio.play().catch(e => console.log('Audio blocked by browser'));
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.onstart = () => setVoiceActive(true);
    recognition.onend = () => setVoiceActive(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setLocation(transcript);
    };
    recognition.start();
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (result && window.L && !leafletMap.current) {
        leafletMap.current = window.L.map('map', { zoomControl: false }).setView([20, 0], 2);
        window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(leafletMap.current);
    }
    if (result && leafletMap.current) {
        // Simulated Geocoding (simplified for demo)
        const coords = [20, 78]; // Default to India center for demo
        leafletMap.current.setView(coords, 6);
        window.L.circle(coords, { 
          radius: 80000, 
          color: result.risk_level === 'HIGH' ? '#ef4444' : '#f59e0b',
          fillOpacity: 0.2,
          weight: 2
        }).addTo(leafletMap.current);
    }
  }, [result]);

  return (
    <div className="min-h-screen text-white font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Header Section */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center justify-center p-4 mb-6 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-xl glow-indigo">
              <ShieldAlert className="w-10 h-10 text-indigo-400" />
            </div>
            <button 
              onClick={playAlertSound}
              className="mb-4 text-xs font-bold text-slate-500 hover:text-indigo-400 transition-colors flex items-center gap-2 group"
            >
              <Volume2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
              TEST ALERT SOUND
            </button>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 bg-gradient-to-b from-white via-white to-slate-500 bg-clip-text text-transparent">
            AI DISASTER INTELLIGENCE
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
            Advanced real-time risk assessment and safety guidance powered by artificial intelligence.
          </p>
        </motion.header>

        {/* Input & Search Section */}
        <GlassCard className="mb-12 border-white/10" delay={0.2}>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkRisk()}
                placeholder="Analyze location (e.g. San Francisco, Mumbai)..."
                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-5 pl-14 pr-16 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-600 font-medium text-lg"
              />
              <button 
                onClick={startVoiceInput}
                className={`absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all ${
                  voiceActive 
                  ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Mic className="w-6 h-6" />
              </button>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={checkRisk}
              disabled={loading}
              className="bg-gradient-to-br from-indigo-600 to-violet-700 hover:from-indigo-500 hover:to-violet-600 disabled:opacity-50 text-white font-bold py-5 px-10 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center min-w-[200px] gap-3"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                  <span>ANALYZE RISK</span>
                  <Navigation className="w-5 h-5 opacity-70" />
                </>
              )}
            </motion.button>
          </div>
          <AnimatePresence>
            {error && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-400 mt-6 text-sm font-semibold flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" /> {error}
              </motion.p>
            )}
          </AnimatePresence>
        </GlassCard>

        {/* Dashboard Content */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Stat Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                  icon={MapPin} 
                  label="Target Location" 
                  value={result.location} 
                  delay={0.3} 
                />
                <StatCard 
                  icon={Cloud} 
                  label="Disaster Type" 
                  value={result.disaster_type} 
                  colorClass="text-amber-400"
                  delay={0.4} 
                />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <GlassCard className="p-4 flex items-center justify-between h-full">
                    <div>
                      <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Risk Level</p>
                      <RiskBadge level={result.risk_level} />
                    </div>
                    {result.risk_level === 'HIGH' && (
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse glow-danger" />
                    )}
                  </GlassCard>
                </motion.div>
              </div>

              {/* Intelligence Section */}
              <div className="grid lg:grid-cols-5 gap-8">
                {/* Left: Chat & Map */}
                <div className="lg:col-span-3 space-y-8">
                  <ChatBubble message={result.alert_message} delay={0.6} />
                  
                  <GlassCard className="p-2 overflow-hidden" delay={0.7}>
                    <div className="p-4 flex justify-between items-center border-b border-white/5 mb-2">
                       <h3 className="font-bold text-slate-300 flex items-center gap-2">
                         <Navigation className="w-4 h-4" /> Live Impact Zone
                       </h3>
                       <div className="flex gap-2">
                         <span className="w-2 h-2 rounded-full bg-indigo-500" />
                         <span className="w-2 h-2 rounded-full bg-slate-700" />
                       </div>
                    </div>
                    <div id="map" className="overflow-hidden"></div>
                  </GlassCard>
                </div>

                {/* Right: Safety & Emergency */}
                <div className="lg:col-span-2 space-y-6">
                  <GlassCard className="border-l-4 border-indigo-500" delay={0.8}>
                    <h3 className="flex items-center gap-3 text-xl font-black mb-6 text-white">
                      <ShieldCheck className="w-6 h-6 text-indigo-400" /> SAFETY PROTOCOLS
                    </h3>
                    <ul className="space-y-4">
                      {result.safety_steps.map((step, i) => (
                        <motion.li 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.9 + (i * 0.1) }}
                          key={i} 
                          className="flex items-start gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
                        >
                          <div className="mt-1 w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0 text-indigo-400 font-bold text-xs ring-1 ring-indigo-500/30">
                            {i + 1}
                          </div>
                          <span className="text-slate-300 text-sm md:text-base font-medium">{step}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </GlassCard>

                  <GlassCard className="border-l-4 border-rose-500" delay={1.0}>
                    <h3 className="flex items-center gap-3 text-xl font-black mb-6 text-white">
                      <Phone className="w-6 h-6 text-rose-400" /> EMERGENCY HOTLINES
                    </h3>
                    <div className="grid gap-4">
                      {result.emergency_contacts.map((contact, i) => (
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.1 + (i * 0.1) }}
                          key={i} 
                          className="flex justify-between items-center bg-rose-500/5 p-5 rounded-2xl border border-rose-500/10 hover:bg-rose-500/10 transition-all cursor-pointer group"
                        >
                          <span className="text-slate-400 text-sm font-bold uppercase tracking-widest group-hover:text-slate-200 transition-colors">
                            {contact.split('-')[1].trim()}
                          </span>
                          <span className="text-rose-400 font-mono text-xl font-black tracking-tighter group-hover:scale-110 transition-transform">
                            {contact.split('-')[0].trim()}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </GlassCard>
                </div>
              </div>
            </motion.div>
          )}

          {!result && !loading && (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              className="text-center py-32"
            >
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 backdrop-blur-md">
                <Info className="w-10 h-10 text-slate-500" />
              </div>
              <p className="text-slate-400 text-xl font-medium">System standby. Enter a location to initiate risk scanning.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer info removed */}
      </div>
    </div>
  );
}

export default App;
