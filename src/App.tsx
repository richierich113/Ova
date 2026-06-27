import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Info,
  Plus,
  Trash2,
  Heart,
  Smile,
  RefreshCw,
  Sliders,
  Settings,
  AlertCircle,
  Check,
  TrendingUp,
  BookOpen,
  Sparkles,
  Flame,
  Moon,
  Activity,
  Grape,
  Compass,
  Zap,
  Apple,
  Users,
  Dumbbell,
  Soup,
  CheckSquare
} from 'lucide-react';
import { CycleConfig, CyclePhaseType, SymptomLog, WellnessAdvice } from './types';
import { PHASE_DETAILS, WELLNESS_ADVICE_BY_PHASE, INITIAL_SYMPTOM_LOGS } from './data';

// Custom render helper for dynamic wellbeing icons
const IconRenderer = ({ name, className }: { name: string; className?: string }) => {
  switch (name) {
    case 'Sparkles': return <Sparkles className={className} />;
    case 'Flame': return <Flame className={className} />;
    case 'Moon': return <Moon className={className} />;
    case 'Activity': return <Activity className={className} />;
    case 'Grape': return <Grape className={className} />;
    case 'Compass': return <Compass className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'Apple': return <Apple className={className} />;
    case 'Users': return <Users className={className} />;
    case 'Dumbbell': return <Dumbbell className={className} />;
    case 'Soup': return <Soup className={className} />;
    case 'CheckSquare': return <CheckSquare className={className} />;
    default: return <Sparkles className={className} />;
  }
};

export default function App() {
  // ----------------------------------------------------
  // 1. Initial State & Setup
  // ----------------------------------------------------
  
  // Set default start date to 4 days ago to instantly land in a realistic cycle day on startup
  const getInitialStartDate = (): string => {
    const d = new Date();
    d.setDate(d.getDate() - 3); // 3 days ago -> Day 4 (Menstrual Phase)
    return d.toISOString().split('T')[0];
  };

  const [config, setConfig] = useState<CycleConfig>(() => {
    const saved = localStorage.getItem('ova_cycle_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      lastPeriodStart: getInitialStartDate(),
      cycleLength: 28,
      periodLength: 5
    };
  });

  const [logs, setLogs] = useState<SymptomLog[]>(() => {
    const saved = localStorage.getItem('ova_symptom_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return INITIAL_SYMPTOM_LOGS;
  });

  // Settings Panel expanded state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Quick-adjust feedback state
  const [successFeedback, setSuccessFeedback] = useState<string | null>(null);

  // Active viewing/previewing cycle day
  const [selectedDay, setSelectedDay] = useState<number>(1);

  // Today's actual calculated cycle day
  const todayCycleDay = useMemo(() => {
    if (!config.lastPeriodStart) return 1;
    const start = new Date(config.lastPeriodStart + 'T00:00:00');
    const today = new Date();
    
    start.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffMs = today.getTime() - start.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (isNaN(diffDays)) return 1;
    
    // Support negative days or cycle repeats
    const cycleDay = ((diffDays % config.cycleLength) + config.cycleLength) % config.cycleLength + 1;
    return cycleDay;
  }, [config.lastPeriodStart, config.cycleLength]);

  // Sync selected day to today on initial load or config change
  useEffect(() => {
    setSelectedDay(todayCycleDay);
  }, [todayCycleDay]);

  // Page title setup
  useEffect(() => {
    document.title = 'Ova | Period & Cycle-Syncing Tracker';
  }, []);

  // Save states to local storage
  useEffect(() => {
    localStorage.setItem('ova_cycle_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('ova_symptom_logs', JSON.stringify(logs));
  }, [logs]);

  // ----------------------------------------------------
  // 2. Dynamic Phase Calculations
  // ----------------------------------------------------
  
  // Calculate phases dynamically based on cycleLength and periodLength
  const phaseRanges = useMemo(() => {
    const cLen = config.cycleLength;
    const pLen = config.periodLength;
    
    // Ovulation is roughly 14 days before the end of the cycle
    const ovulationDay = Math.max(pLen + 3, cLen - 14);
    
    const menstrualEnd = pLen;
    const follicularEnd = ovulationDay - 3;
    const ovulatoryEnd = ovulationDay + 2;
    
    return {
      Menstrual: { start: 1, end: menstrualEnd },
      Follicular: { start: menstrualEnd + 1, end: follicularEnd },
      Ovulatory: { start: follicularEnd + 1, end: ovulatoryEnd },
      Luteal: { start: ovulatoryEnd + 1, end: cLen }
    };
  }, [config.cycleLength, config.periodLength]);

  const getPhaseForDay = (day: number): CyclePhaseType => {
    const { Menstrual, Follicular, Ovulatory } = phaseRanges;
    if (day <= Menstrual.end) return 'Menstrual';
    if (day <= Follicular.end) return 'Follicular';
    if (day <= Ovulatory.end) return 'Ovulatory';
    return 'Luteal';
  };

  // Phase of the selected day
  const activePhase = useMemo(() => {
    return getPhaseForDay(selectedDay);
  }, [selectedDay, phaseRanges]);

  // Phase of actual "today"
  const todayPhase = useMemo(() => {
    return getPhaseForDay(todayCycleDay);
  }, [todayCycleDay, phaseRanges]);

  // Active theme details
  const activeTheme = useMemo(() => {
    return PHASE_DETAILS[activePhase];
  }, [activePhase]);

  // Countdown calculations
  const countdownText = useMemo(() => {
    const day = selectedDay;
    const { Menstrual, Follicular, Ovulatory, Luteal } = phaseRanges;
    const currentPhase = getPhaseForDay(day);
    
    if (currentPhase === 'Menstrual') {
      const daysLeft = (Menstrual.end - day) + 1;
      return {
        text: `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left in Period`,
        next: 'Follicular Phase starts next'
      };
    } else if (currentPhase === 'Follicular') {
      const daysLeft = (Follicular.end - day) + 1;
      return {
        text: `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left in Follicular`,
        next: 'Ovulatory Phase (Peak Energy) next'
      };
    } else if (currentPhase === 'Ovulatory') {
      const daysLeft = (Ovulatory.end - day) + 1;
      return {
        text: `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left in Ovulatory`,
        next: 'Luteal Phase (Wind Down) next'
      };
    } else {
      const daysLeft = (config.cycleLength - day) + 1;
      return {
        text: `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} until Menstruation`,
        next: 'A new cycle starts soon'
      };
    }
  }, [selectedDay, phaseRanges, config.cycleLength]);

  // Selected Day Advice
  const activeAdvice = useMemo(() => {
    return WELLNESS_ADVICE_BY_PHASE[activePhase];
  }, [activePhase]);

  // ----------------------------------------------------
  // 3. Symptom Logger State
  // ----------------------------------------------------
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedPhysical, setSelectedPhysical] = useState<string[]>([]);
  const [logNotes, setLogNotes] = useState('');
  const [energyLevel, setEnergyLevel] = useState(3);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pre-fill selections if a log already exists for "Today"
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayLog = useMemo(() => {
    return logs.find(l => l.date === todayDateStr);
  }, [logs, todayDateStr]);

  const handleToggleMood = (mood: string) => {
    setSelectedMoods(prev => 
      prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]
    );
  };

  const handleTogglePhysical = (symptom: string) => {
    if (symptom === 'None') {
      setSelectedPhysical(['None']);
    } else {
      setSelectedPhysical(prev => {
        const filtered = prev.filter(s => s !== 'None');
        return filtered.includes(symptom) 
          ? filtered.filter(s => s !== symptom) 
          : [...filtered, symptom];
      });
    }
  };

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newLog: SymptomLog = {
      id: todayLog?.id || Date.now().toString(),
      date: todayDateStr,
      cycleDay: todayCycleDay,
      phase: todayPhase,
      moods: selectedMoods.length > 0 ? selectedMoods : ['🧘 Calm'],
      physical: selectedPhysical.length > 0 ? selectedPhysical : ['None'],
      notes: logNotes.trim() || undefined
    };

    setLogs(prev => {
      const filtered = prev.filter(l => l.date !== todayDateStr);
      return [newLog, ...filtered];
    });

    // Reset logger inputs
    setSelectedMoods([]);
    setSelectedPhysical([]);
    setLogNotes('');
    setEnergyLevel(3);

    // Dynamic phase-based toast message
    setToastMessage(`Daily log saved successfully for Day ${todayCycleDay}!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDeleteLog = (id: string) => {
    if (window.confirm('Are you sure you want to delete this log entry?')) {
      setLogs(prev => prev.filter(l => l.id !== id));
    }
  };

  // ----------------------------------------------------
  // 4. Presets and Setup Helpers
  // ----------------------------------------------------
  const applyPreset = (cycleLen: number, periodLen: number, label: string) => {
    setConfig(prev => ({
      ...prev,
      cycleLength: cycleLen,
      periodLength: periodLen
    }));
    setSuccessFeedback(`Applied ${label} preset!`);
    setTimeout(() => setSuccessFeedback(null), 3000);
  };

  // Historical Analytics Calculated on current logs list
  const analytics = useMemo(() => {
    const totalLogs = logs.length;
    if (totalLogs === 0) return { commonMood: 'None', commonPhysical: 'None', totalLogs };

    const moodCounts: Record<string, number> = {};
    const physicalCounts: Record<string, number> = {};

    logs.forEach(log => {
      log.moods.forEach(mood => {
        moodCounts[mood] = (moodCounts[mood] || 0) + 1;
      });
      log.physical.forEach(sym => {
        if (sym !== 'None') {
          physicalCounts[sym] = (physicalCounts[sym] || 0) + 1;
        }
      });
    });

    const commonMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '🧘 Calm';
    const commonPhysical = Object.entries(physicalCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

    return {
      commonMood,
      commonPhysical,
      totalLogs
    };
  }, [logs]);

  // ----------------------------------------------------
  // 5. Dial Coordinates Helper
  // ----------------------------------------------------
  // Renders dots absolutely on a circle representing days in the cycle
  const getDotPosition = (dayIndex: number) => {
    const totalDays = config.cycleLength;
    // -90 degrees puts Day 1 at the absolute top center of the circular dial
    const angle = ((dayIndex - 1) / totalDays) * 2 * Math.PI - Math.PI / 2;
    const radius = 41; // Percent from center of absolute relative box
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    return { x, y };
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-rose-500/30 selection:text-rose-200 antialiased pb-20">
      
      {/* ----------------- GORGEOUS HEADER BAR ----------------- */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${activeTheme.bgGradient} border border-zinc-800 flex items-center justify-center shadow-lg transition-all duration-700`}>
              <Heart className={`w-5 h-5 ${activeTheme.colorClass} fill-current/10 animate-pulse`} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-lg tracking-tight text-white font-mono">ova</span>
                <span className={`text-[10px] font-medium uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 ${activeTheme.colorClass} transition-colors duration-700`}>
                  Syncing
                </span>
              </div>
              <p className="text-xs text-zinc-400">Cycle-Syncing Wellness Assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="settings-toggle-btn"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all duration-300 ${
                isSettingsOpen 
                  ? `${activeTheme.borderColor} ${activeTheme.colorClass} bg-zinc-900`
                  : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800 text-zinc-300'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Configure Cycle</span>
              {isSettingsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </header>

      {/* ----------------- MAIN WRAPPER ----------------- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* ----------------- 1. CONFIGURATION DRAWER / SETUP BANNER ----------------- */}
        <AnimatePresence>
          {isSettingsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-zinc-800/80"
            >
              <div className="p-6 md:p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
                  <div>
                    <h3 className="text-base font-semibold text-white flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-zinc-400" />
                      Cycle Mathematics & Baseline Parameters
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Customize Ova to your biological baseline. Calculations scale phase durations dynamically based on your inputs.
                    </p>
                  </div>
                  
                  {/* Preset Buttons */}
                  <div className="flex flex-wrap items-center gap-2 bg-zinc-950/60 p-1.5 rounded-xl border border-zinc-800/60">
                    <span className="text-[10px] text-zinc-500 font-medium px-2 uppercase tracking-wider">Presets:</span>
                    <button
                      type="button"
                      onClick={() => applyPreset(28, 5, 'Standard 28-Day')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        config.cycleLength === 28 && config.periodLength === 5
                          ? 'bg-zinc-800 text-white border border-zinc-700/50'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                      }`}
                    >
                      Standard (28d / 5d)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset(24, 4, 'Short 24-Day')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        config.cycleLength === 24 && config.periodLength === 4
                          ? 'bg-zinc-800 text-white border border-zinc-700/50'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                      }`}
                    >
                      Short (24d / 4d)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset(32, 6, 'Long 32-Day')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        config.cycleLength === 32 && config.periodLength === 6
                          ? 'bg-zinc-800 text-white border border-zinc-700/50'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                      }`}
                    >
                      Long (32d / 6d)
                    </button>
                  </div>
                </div>

                {/* Form Inputs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  
                  {/* Last Period Start Date */}
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-zinc-300">
                      Last Period Start Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                      <input
                        type="date"
                        value={config.lastPeriodStart}
                        max={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setConfig(prev => ({ ...prev, lastPeriodStart: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 outline-none text-sm text-zinc-100 font-mono transition-all"
                      />
                    </div>
                    <p className="text-[10px] text-zinc-500">Day 1 of your menstrual cycle.</p>
                  </div>

                  {/* Average Cycle Length */}
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-zinc-300">
                      Average Cycle Length (Days)
                    </label>
                    <select
                      value={config.cycleLength}
                      onChange={(e) => setConfig(prev => ({ ...prev, cycleLength: parseInt(e.target.value) }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 outline-none text-sm text-zinc-100 font-mono transition-all"
                    >
                      {Array.from({ length: 20 }, (_, i) => i + 21).map(day => (
                        <option key={day} value={day}>{day} Days</option>
                      ))}
                    </select>
                    <p className="text-[10px] text-zinc-500">Typical range: 21 to 40 days.</p>
                  </div>

                  {/* Average Period Length */}
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-zinc-300">
                      Average Period Duration (Days)
                    </label>
                    <select
                      value={config.periodLength}
                      onChange={(e) => setConfig(prev => ({ ...prev, periodLength: parseInt(e.target.value) }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 outline-none text-sm text-zinc-100 font-mono transition-all"
                    >
                      {Array.from({ length: 8 }, (_, i) => i + 3).map(day => (
                        <option key={day} value={day}>{day} Days</option>
                      ))}
                    </select>
                    <p className="text-[10px] text-zinc-500">Duration of the Menstrual phase.</p>
                  </div>
                </div>

                {/* Feedback Toast */}
                <AnimatePresence>
                  {successFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-xs text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2.5 rounded-xl"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{successFeedback}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ----------------- 2. HERO WIDGET SECTION & MINI INSIGHTS ----------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: Massive Interactive Circular Tracker (Lg: Col-span-7) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-zinc-900/35 border border-zinc-900/80 p-6 sm:p-8 rounded-3xl relative overflow-hidden group">
            
            {/* Ambient Background Glow matching active phase */}
            <div className={`absolute -right-24 -top-24 w-80 h-80 rounded-full bg-gradient-to-br ${activeTheme.bgGradient} blur-[120px] pointer-events-none transition-all duration-1000 opacity-60`} />
            <div className={`absolute -left-24 -bottom-24 w-80 h-80 rounded-full bg-gradient-to-tr ${activeTheme.bgGradient} blur-[120px] pointer-events-none transition-all duration-1000 opacity-30`} />
            
            <div className="w-full flex items-center justify-between mb-6 z-10">
              <div className="space-y-0.5">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest font-mono">Dynamic Dial View</span>
                <h2 className="text-sm font-semibold text-white">Interactive Cycle Path</h2>
              </div>
              
              {/* Reset to Today Action Badge if Previewing */}
              <AnimatePresence>
                {selectedDay !== todayCycleDay && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => setSelectedDay(todayCycleDay)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium border bg-zinc-950 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-all cursor-pointer`}
                  >
                    <RefreshCw className="w-2.5 h-2.5 animate-spin-slow" />
                    <span>Back to Today (Day {todayCycleDay})</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Circular Path Tracker Assembly */}
            <div className="relative w-76 h-76 sm:w-84 sm:h-84 flex items-center justify-center select-none z-10 my-4">
              
              {/* Outer clickable Dial Dots */}
              {Array.from({ length: config.cycleLength }).map((_, idx) => {
                const d = idx + 1;
                const { x, y } = getDotPosition(d);
                const dotPhase = getPhaseForDay(d);
                const isSelected = selectedDay === d;
                const isToday = todayCycleDay === d;

                // Color mapping for active dot state
                let colorBase = 'bg-zinc-800 hover:bg-zinc-700';
                if (dotPhase === 'Menstrual') colorBase = isSelected ? 'bg-rose-500 scale-125 ring-4 ring-rose-500/20' : 'bg-rose-500/40 hover:bg-rose-500/80';
                else if (dotPhase === 'Follicular') colorBase = isSelected ? 'bg-teal-400 scale-125 ring-4 ring-teal-400/20' : 'bg-teal-400/40 hover:bg-teal-400/80';
                else if (dotPhase === 'Ovulatory') colorBase = isSelected ? 'bg-orange-500 scale-125 ring-4 ring-orange-500/20' : 'bg-orange-500/40 hover:bg-orange-500/80';
                else if (dotPhase === 'Luteal') colorBase = isSelected ? 'bg-indigo-500 scale-125 ring-4 ring-indigo-500/20' : 'bg-indigo-500/40 hover:bg-indigo-500/80';

                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDay(d)}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer z-20 ${colorBase}`}
                    title={`Day ${d} (${dotPhase} Phase)`}
                  >
                    {isToday && !isSelected && (
                      <span className="absolute w-1.5 h-1.5 bg-white rounded-full" />
                    )}
                    {isSelected && (
                      <span className="text-[8px] font-mono font-bold text-zinc-950">{d}</span>
                    )}
                  </button>
                );
              })}

              {/* Inner Circle Information Board */}
              <div className={`w-52 h-52 sm:w-58 sm:h-58 rounded-full bg-zinc-950 border-2 ${activeTheme.borderColor} flex flex-col items-center justify-center p-6 text-center shadow-2xl relative transition-all duration-700 ${activeTheme.glowClass} shadow-xl`}>
                
                {/* SVG Progress Arc */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 p-1 pointer-events-none">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="47%"
                    fill="none"
                    stroke="#18181b"
                    strokeWidth="3"
                  />
                  <motion.circle
                    cx="50%"
                    cy="50%"
                    r="47%"
                    fill="none"
                    stroke={
                      activePhase === 'Menstrual' ? '#f43f5e' : 
                      activePhase === 'Follicular' ? '#2dd4bf' : 
                      activePhase === 'Ovulatory' ? '#f97316' : '#6366f1'
                    }
                    strokeWidth="4"
                    strokeDasharray="295"
                    initial={{ strokeDashoffset: 295 }}
                    animate={{ strokeDashoffset: 295 - (295 * (selectedDay / config.cycleLength)) }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </svg>

                {/* Phase Icon */}
                <div className={`w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800/80 flex items-center justify-center mb-2.5 shadow-md ${activeTheme.colorClass} transition-colors duration-700`}>
                  {activePhase === 'Menstrual' && <Flame className="w-5 h-5" />}
                  {activePhase === 'Follicular' && <Sparkles className="w-5 h-5" />}
                  {activePhase === 'Ovulatory' && <Zap className="w-5 h-5" />}
                  {activePhase === 'Luteal' && <Moon className="w-5 h-5" />}
                </div>

                <p className={`text-[11px] font-semibold tracking-widest uppercase font-mono ${activeTheme.colorClass} transition-colors duration-700`}>
                  {activeTheme.displayName}
                </p>

                <div className="flex items-baseline gap-0.5 my-1">
                  <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-mono">
                    {selectedDay}
                  </span>
                  <span className="text-xs text-zinc-500 font-medium font-mono">
                    /{config.cycleLength}
                  </span>
                </div>

                <p className="text-xs font-semibold text-zinc-300 px-3 truncate max-w-full">
                  {countdownText.text}
                </p>

                <p className="text-[10px] text-zinc-500 mt-1 max-w-[140px] leading-tight text-center">
                  {countdownText.next}
                </p>
              </div>
            </div>

            {/* Cycle Stage Timeline visual indicator */}
            <div className="w-full mt-4 bg-zinc-950 border border-zinc-900 rounded-xl p-3 z-10">
              <div className="grid grid-cols-4 text-center text-[10px] font-mono font-medium text-zinc-500 pb-1.5">
                <span className={activePhase === 'Menstrual' ? 'text-rose-400 font-bold' : ''}>Menstrual</span>
                <span className={activePhase === 'Follicular' ? 'text-teal-400 font-bold' : ''}>Follicular</span>
                <span className={activePhase === 'Ovulatory' ? 'text-orange-400 font-bold' : ''}>Ovulatory</span>
                <span className={activePhase === 'Luteal' ? 'text-indigo-400 font-bold' : ''}>Luteal</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full flex overflow-hidden">
                <div 
                  className={`h-full bg-rose-500 transition-all`} 
                  style={{ width: `${(phaseRanges.Menstrual.end / config.cycleLength) * 100}%` }} 
                />
                <div 
                  className={`h-full bg-teal-400 transition-all`} 
                  style={{ width: `${((phaseRanges.Follicular.end - phaseRanges.Menstrual.end) / config.cycleLength) * 100}%` }} 
                />
                <div 
                  className={`h-full bg-orange-500 transition-all`} 
                  style={{ width: `${((phaseRanges.Ovulatory.end - phaseRanges.Follicular.end) / config.cycleLength) * 100}%` }} 
                />
                <div 
                  className={`h-full bg-indigo-500 transition-all`} 
                  style={{ width: `${((config.cycleLength - phaseRanges.Ovulatory.end) / config.cycleLength) * 100}%` }} 
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Quick Symptom Logs & Fast Stats (Lg: Col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Phase Explanation / Scientific Insight */}
            <div className="bg-zinc-900/40 border border-zinc-900 p-6 rounded-3xl relative overflow-hidden flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl bg-zinc-950 border border-zinc-800 ${activeTheme.colorClass}`}>
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 font-mono">Phase Spotlight</h3>
                    <h2 className={`text-base font-bold text-white transition-all`}>
                      Understanding your {activePhase} Phase
                    </h2>
                  </div>
                </div>
                
                <p className="text-sm leading-relaxed text-zinc-300">
                  {activeTheme.description}
                </p>

                <div className="bg-zinc-950/50 rounded-2xl p-4 border border-zinc-900 space-y-2.5">
                  <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <TrendingUp className={`w-3.5 h-3.5 ${activeTheme.colorClass}`} />
                    Hormonal Fingerprint
                  </h4>
                  <ul className="text-xs text-zinc-400 space-y-2 font-sans">
                    {activePhase === 'Menstrual' && (
                      <>
                        <li className="flex items-start gap-1.5">
                          <span className="text-rose-400 mt-0.5">•</span>
                          <span><strong>Estrogen & Progesterone:</strong> Drop to their lowest baseline, triggering menstruation.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-rose-400 mt-0.5">•</span>
                          <span><strong>Energy Profile:</strong> Introspective, physical resting, high clarity of mind.</span>
                        </li>
                      </>
                    )}
                    {activePhase === 'Follicular' && (
                      <>
                        <li className="flex items-start gap-1.5">
                          <span className="text-teal-400 mt-0.5">•</span>
                          <span><strong>Estrogen:</strong> Steadily climbing, rebuilding the uterine lining and promoting follicle growth.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-teal-400 mt-0.5">•</span>
                          <span><strong>Energy Profile:</strong> Physical optimism, brain fog dissolves, high creativity.</span>
                        </li>
                      </>
                    )}
                    {activePhase === 'Ovulatory' && (
                      <>
                        <li className="flex items-start gap-1.5">
                          <span className="text-orange-400 mt-0.5">•</span>
                          <span><strong>Estrogen:</strong> Surges to its maximum peak, triggering a spike in Luteinizing Hormone (LH).</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-orange-400 mt-0.5">•</span>
                          <span><strong>Energy Profile:</strong> Peak physical strength, hyper-social confidence, high sex drive.</span>
                        </li>
                      </>
                    )}
                    {activePhase === 'Luteal' && (
                      <>
                        <li className="flex items-start gap-1.5">
                          <span className="text-indigo-400 mt-0.5">•</span>
                          <span><strong>Progesterone:</strong> Becomes the dominant hormone to nurture the uterine lining.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-indigo-400 mt-0.5">•</span>
                          <span><strong>Energy Profile:</strong> Organization-oriented focus, metabolic acceleration, nesting desires.</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              {/* Day Metrics */}
              <div className="grid grid-cols-2 gap-3.5 mt-5">
                <div className="bg-zinc-950/60 rounded-xl p-3.5 border border-zinc-900">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-0.5">Start Day</span>
                  <span className="text-sm font-semibold text-zinc-200">
                    Day {activePhase === 'Menstrual' ? phaseRanges.Menstrual.start : activePhase === 'Follicular' ? phaseRanges.Follicular.start : activePhase === 'Ovulatory' ? phaseRanges.Ovulatory.start : phaseRanges.Luteal.start}
                  </span>
                </div>
                <div className="bg-zinc-950/60 rounded-xl p-3.5 border border-zinc-900">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-0.5">End Day</span>
                  <span className="text-sm font-semibold text-zinc-200">
                    Day {activePhase === 'Menstrual' ? phaseRanges.Menstrual.end : activePhase === 'Follicular' ? phaseRanges.Follicular.end : activePhase === 'Ovulatory' ? phaseRanges.Ovulatory.end : phaseRanges.Luteal.end}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Analytics Card */}
            <div className="bg-zinc-900/35 border border-zinc-900 p-6 rounded-3xl relative overflow-hidden">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 font-mono mb-4">Analytics Dashboard</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500 block leading-tight">Total Filed Logs</span>
                  <p className="text-xl font-bold text-white font-mono">{analytics.totalLogs}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500 block leading-tight">Most Common Mood</span>
                  <p className="text-xs font-bold text-zinc-300 truncate">{analytics.commonMood}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500 block leading-tight">Primary Physical</span>
                  <p className="text-xs font-bold text-zinc-300 truncate">{analytics.commonPhysical}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ----------------- 3. WELLBEING SYNC CARDS ----------------- */}
        <section className="space-y-6">
          <div className="border-l-2 pl-3.5 transition-colors duration-700" style={{ borderColor: activePhase === 'Menstrual' ? '#f43f5e' : activePhase === 'Follicular' ? '#2dd4bf' : activePhase === 'Ovulatory' ? '#f97316' : '#6366f1' }}>
            <h2 className="text-lg font-bold text-white">Daily Wellbeing Sync</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Scientifically curated syncing hacks for Day {selectedDay} ({activePhase} Phase).</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Movement & Workouts */}
            <div className={`bg-zinc-900/40 border border-zinc-900 rounded-3xl p-6 relative overflow-hidden transition-all hover:bg-zinc-900/60 duration-300 flex flex-col justify-between group`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-semibold uppercase tracking-widest font-mono ${activeTheme.colorClass}`}>Movement</span>
                  <div className={`p-2 rounded-xl bg-zinc-950 border border-zinc-850 ${activeTheme.colorClass}`}>
                    <IconRenderer name={activeAdvice.movement.iconName} className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">{activeAdvice.movement.title}</h3>
                  <p className="text-xs text-zinc-400 mt-1">{activeAdvice.movement.description}</p>
                </div>
                <div className="border-t border-zinc-900 pt-4 space-y-2.5">
                  {activeAdvice.movement.tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${activeTheme.accentBg} mt-1.5 shrink-0`} />
                      <p className="text-xs leading-relaxed text-zinc-300">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: Nutrition & Fuel */}
            <div className={`bg-zinc-900/40 border border-zinc-900 rounded-3xl p-6 relative overflow-hidden transition-all hover:bg-zinc-900/60 duration-300 flex flex-col justify-between group`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-semibold uppercase tracking-widest font-mono ${activeTheme.colorClass}`}>Nutrition & Fuel</span>
                  <div className={`p-2 rounded-xl bg-zinc-950 border border-zinc-850 ${activeTheme.colorClass}`}>
                    <IconRenderer name={activeAdvice.nutrition.iconName} className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">{activeAdvice.nutrition.title}</h3>
                  <p className="text-xs text-zinc-400 mt-1">{activeAdvice.nutrition.description}</p>
                </div>
                <div className="border-t border-zinc-900 pt-4 space-y-2.5">
                  {activeAdvice.nutrition.tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${activeTheme.accentBg} mt-1.5 shrink-0`} />
                      <p className="text-xs leading-relaxed text-zinc-300">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3: Mindset & Energy */}
            <div className={`bg-zinc-900/40 border border-zinc-900 rounded-3xl p-6 relative overflow-hidden transition-all hover:bg-zinc-900/60 duration-300 flex flex-col justify-between group`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-semibold uppercase tracking-widest font-mono ${activeTheme.colorClass}`}>Mindset & Energy</span>
                  <div className={`p-2 rounded-xl bg-zinc-950 border border-zinc-850 ${activeTheme.colorClass}`}>
                    <IconRenderer name={activeAdvice.mindset.iconName} className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">{activeAdvice.mindset.title}</h3>
                  <p className="text-xs text-zinc-400 mt-1">{activeAdvice.mindset.description}</p>
                </div>
                <div className="border-t border-zinc-900 pt-4 space-y-2.5">
                  {activeAdvice.mindset.tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${activeTheme.accentBg} mt-1.5 shrink-0`} />
                      <p className="text-xs leading-relaxed text-zinc-300">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ----------------- 4. SYMPTOM LOGGER & HISTORY ----------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LOGGER: Col-span-5 */}
          <div className="lg:col-span-5 bg-zinc-900/40 border border-zinc-900 p-6 sm:p-8 rounded-3xl relative overflow-hidden">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-rose-400">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 font-mono">Logger</h3>
                <h2 className="text-base font-bold text-white">Log Today's Well-being</h2>
              </div>
            </div>

            <form onSubmit={handleSaveLog} className="space-y-6">
              
              {/* Mood chips */}
              <div className="space-y-2.5">
                <label className="block text-xs font-medium text-zinc-400">
                  How is your emotional/mental energy?
                </label>
                <div className="flex flex-wrap gap-2">
                  {['😊 Active', '😴 Fatigued', '😔 Anxious', '⚡ Focused', '🧘 Calm', '🍫 Cravings'].map(mood => {
                    const isSelected = selectedMoods.includes(mood);
                    return (
                      <button
                        key={mood}
                        type="button"
                        onClick={() => handleToggleMood(mood)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          isSelected 
                            ? 'bg-rose-500/20 border border-rose-500/50 text-rose-300' 
                            : 'bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400'
                        }`}
                      >
                        {mood}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Physical Symptoms chips */}
              <div className="space-y-2.5">
                <label className="block text-xs font-medium text-zinc-400">
                  Are you experiencing physical symptoms?
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Cramps', 'Bloating', 'Headache', 'Tender Breasts', 'Acne', 'None'].map(sym => {
                    const isSelected = selectedPhysical.includes(sym);
                    return (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => handleTogglePhysical(sym)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          isSelected 
                            ? 'bg-rose-500/20 border border-rose-500/50 text-rose-300' 
                            : 'bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400'
                        }`}
                      >
                        {sym === 'None' ? '✨ None' : sym}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Energy Slider */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-zinc-400">Overall Vitality Score</span>
                  <span className="font-semibold text-rose-400 font-mono">{energyLevel} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer h-1.5 bg-zinc-950 rounded-lg outline-none"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>1 - Exhausted</span>
                  <span>5 - Vibrant</span>
                </div>
              </div>

              {/* Journal Notes */}
              <div className="space-y-2.5">
                <label className="block text-xs font-medium text-zinc-400">
                  Journal thoughts or symptoms (Optional)
                </label>
                <textarea
                  placeholder="Note pelvic sensitivity, skin flareups, sleep disruptions..."
                  rows={3}
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 outline-none text-xs text-zinc-300 placeholder:text-zinc-600 transition-all resize-none"
                />
              </div>

              {/* Glowing submit */}
              <button
                type="submit"
                className={`w-full py-3 rounded-xl text-xs font-semibold text-zinc-950 bg-white hover:bg-zinc-100 transition-all shadow-lg hover:shadow-white/5 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2`}
              >
                <Check className="w-4 h-4" />
                <span>Log Today</span>
              </button>

              {/* Toast response feedback */}
              <AnimatePresence>
                {toastMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-xs text-rose-400 flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 px-3.5 py-2.5 rounded-xl justify-center text-center"
                  >
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    <span>{toastMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* RECENT INSIGHTS TIMELINE: Col-span-7 */}
          <div className="lg:col-span-7 bg-zinc-900/40 border border-zinc-900 p-6 sm:p-8 rounded-3xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-teal-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 font-mono font-bold">Insights</h3>
                  <h2 className="text-base font-bold text-white">Biological Log History</h2>
                </div>
              </div>

              <div className="text-[10px] text-zinc-500 font-mono">
                Showing {logs.length} entries
              </div>
            </div>

            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
              {logs.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-zinc-800 rounded-2xl p-6">
                  <p className="text-sm text-zinc-400 font-medium">No bio-logs available</p>
                  <p className="text-xs text-zinc-600 mt-1">Start recording symptoms to populate your analytics pipeline.</p>
                </div>
              ) : (
                logs.map((log) => {
                  const phaseStyle = PHASE_DETAILS[log.phase] || PHASE_DETAILS.Luteal;
                  
                  // Format dates gracefully
                  const dateObj = new Date(log.date + 'T00:00:00');
                  const formattedDate = dateObj.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  return (
                    <div 
                      key={log.id} 
                      className="bg-zinc-950/60 rounded-2xl p-4.5 border border-zinc-900 hover:border-zinc-850 transition-colors flex flex-col justify-between gap-3 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">{formattedDate}</span>
                          <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 font-bold ${phaseStyle.colorClass}`}>
                            Day {log.cycleDay} • {log.phase}
                          </span>
                        </div>
                        
                        {/* Delete entry */}
                        <button
                          type="button"
                          onClick={() => handleDeleteLog(log.id)}
                          className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all p-1 rounded hover:bg-zinc-900 cursor-pointer"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Display Chips recorded */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        {log.moods.map((m, idx) => (
                          <span key={idx} className="text-[10px] bg-zinc-900 border border-zinc-850 text-zinc-300 px-2 py-1 rounded-lg">
                            {m}
                          </span>
                        ))}
                        {log.physical.map((p, idx) => (
                          <span key={idx} className={`text-[10px] bg-zinc-900 border border-zinc-850 text-zinc-400 px-2 py-1 rounded-lg ${p !== 'None' ? 'text-rose-300 border-rose-950/40' : ''}`}>
                            {p === 'None' ? '✨ No Symptoms' : p}
                          </span>
                        ))}
                      </div>

                      {log.notes && (
                        <p className="text-xs text-zinc-400 leading-relaxed border-l-2 border-zinc-800 pl-2.5 mt-0.5 italic">
                          "{log.notes}"
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* ----------------- 5. SCIENCE FOOTER DECLARATION ----------------- */}
        <footer className="text-center pt-10 text-[10px] text-zinc-600 space-y-2 border-t border-zinc-900/40 max-w-2xl mx-auto">
          <p>
            Ova calculates luteal and follicular lengths dynamically utilizing standardized gynaecological cycle math.
          </p>
          <p>
            Designed exclusively with a medical emphasis on hormone rhythm optimization. This does not constitute professional medical diagnostic advice.
          </p>
        </footer>

      </main>
    </div>
  );
}
