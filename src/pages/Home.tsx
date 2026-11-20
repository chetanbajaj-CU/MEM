import { ArrowRight, Activity, Brain, Dumbbell, Droplet, Flame, CheckCircle, Circle, Sparkles, Zap, Hand, MoveHorizontal, RotateCw, MousePointerClick, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { cn } from "../lib/utils";
import { getLocalDateString } from "../lib/dateUtils";
import { getDailyData, saveDailyData } from "../lib/dailyData";
import { getUserStats, logDailyObjective, DEFAULT_STATS, UserStats } from "../lib/userStats";
import { KineticFigure } from "../components/KineticFigure";
import { APP_IMAGES } from "../lib/appImages";
import { AmbientEnergyBackground, EnergyStateId } from "../components/AmbientEnergyBackground";

const MANIFESTO_ITEMS = [
  "DISCIPLINE OUTLASTS MOTIVATION",
  "SUB-SECOND METABOLIC PRECISION",
  "NEUROMUSCULAR SYNERGY",
  "OWN EVERY SINGLE REP",
  "MIND GOVERNS MATTER",
  "COMPOUND CONSISTENCY OVER TIME",
  "KINETIC FLOW STATE",
  "REPUTATION WITH YOURSELF",
];

// Creative Athletic Toodles & Doodles (Handcrafted SVG Animations)
const DoodleSquiggle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 240 16" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <motion.path
      d="M3 10 Q 25 2, 50 10 T 100 10 T 150 10 T 200 10 T 237 9"
      stroke="#CCFF00"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0.2 }}
      animate={{ pathLength: [0.7, 1, 0.7] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
    <path
      d="M6 13 Q 28 5, 53 13 T 103 13 T 153 13 T 203 13 T 233 12"
      stroke="#CCFF00"
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity="0.5"
      fill="none"
    />
  </svg>
);

const DoodleArrow = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 50" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <motion.path
      d="M8 38 C 30 12, 60 12, 88 26"
      stroke="#CCFF00"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeDasharray="5 4"
      animate={{ strokeDashoffset: [0, -18] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
    />
    <motion.path
      d="M76 18 L 89 27 L 78 36"
      stroke="#CCFF00"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ x: [0, 3, 0], y: [0, 1.5, 0] }}
      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
    />
  </svg>
);

const DoodleSparkle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <motion.g
      animate={{ rotate: 360, scale: [0.85, 1.15, 0.85] }}
      transition={{ rotate: { duration: 10, repeat: Infinity, ease: "linear" }, scale: { duration: 2.2, repeat: Infinity, ease: "easeInOut" } }}
    >
      <path d="M16 2 V30 M2 16 H30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 6 L26 26 M26 6 L6 26" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      <circle cx="16" cy="16" r="3" fill="currentColor" />
    </motion.g>
  </svg>
);

const DoodleLightning = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <motion.path
      d="M14 2 L4 18 H13 L10 34 L20 16 H11 L14 2 Z"
      fill="#CCFF00"
      stroke="#000"
      strokeWidth="1.5"
      strokeLinejoin="round"
      animate={{ scale: [1, 1.1, 1], filter: ["drop-shadow(0 0 2px #CCFF00)", "drop-shadow(0 0 8px #CCFF00)", "drop-shadow(0 0 2px #CCFF00)"] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
    />
  </svg>
);

const DoodleHandGesture = ({ className }: { className?: string }) => (
  <motion.div
    animate={{ y: [0, -4, 0], rotate: [-4, 6, -4] }}
    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    className={cn("inline-flex items-center justify-center", className)}
  >
    <div className="relative">
      <motion.div
        animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="absolute inset-0 rounded-full bg-[#CCFF00]/40 -z-10"
      />
      <Hand className="w-4 h-4 text-[#CCFF00] drop-shadow-[0_0_8px_rgba(204,255,0,0.8)]" />
    </div>
  </motion.div>
);

export function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [activeMotionTab, setActiveMotionTab] = useState<"sprinter" | "lifter" | "scanner" | "agility" | "mobility" | "zen">("sprinter");
  const [energyState, setEnergyState] = useState<EnergyStateId>("auto");
  const [heroBgMode, setHeroBgMode] = useState<"velocity" | "lab">("velocity");

  const [habits, setHabits] = useState({
    workout: { completed: false, label: "Daily Workout", icon: Dumbbell, color: "text-[#CCFF00]" },
    hydration: { completed: false, label: "Drink 2L Water", icon: Droplet, color: "text-[#3BB1FF]" },
    nutrition: { completed: false, label: "Hit Calorie Goal", icon: Flame, color: "text-[#FF8C00]" },
    meditation: { completed: false, label: "10 Min Meditation", icon: Brain, color: "text-[#9D4EDD]" },
  });

  const [animateStreak, setAnimateStreak] = useState(false);
  const [objectivesLogged, setObjectivesLogged] = useState(false);

  const [reflection, setReflection] = useState("");
  const [reflectionSubmitted, setReflectionSubmitted] = useState(false);
  const [reflectionAccomplished, setReflectionAccomplished] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const [historyData, setHistoryData] = useState<{day: string, score: number}[]>([]);

  // Smooth motion cycle every 6 seconds to bring the hero alive subtly
  useEffect(() => {
    const cycle = ["sprinter", "lifter", "scanner", "agility", "mobility", "zen"] as const;
    const interval = setInterval(() => {
      setActiveMotionTab(curr => {
        const nextIdx = (cycle.indexOf(curr) + 1) % cycle.length;
        return cycle[nextIdx];
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadStats() {
      if (user) {
        try {
          const fetchedStats = await getUserStats(user.uid);
          setStats(fetchedStats);
          
          const today = getLocalDateString(new Date());
          
          if (fetchedStats.lastObjectiveDate === today) {
             setObjectivesLogged(true);
          }
          
          const storedData = await getDailyData(user.uid, today);
          if (storedData) {
            if (storedData.habits) {
              setHabits(prev => {
                const updated = { ...prev };
                for (const key in storedData.habits) {
                  if (updated[key as keyof typeof habits]) {
                    updated[key as keyof typeof habits].completed = storedData.habits[key];
                  }
                }
                return updated;
              });
            }
            if (storedData.reflection) {
              setReflection(storedData.reflection);
            }
            if (storedData.reflectionSubmitted) {
              setReflectionSubmitted(storedData.reflectionSubmitted);
            }
            if (storedData.reflectionAccomplished) {
              setReflectionAccomplished(storedData.reflectionAccomplished);
            }
          }
          
          // Load 7-day history
          const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          const newWeekData = [];
          for (let i = 6; i >= 1; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = getLocalDateString(d);
            const histData = await getDailyData(user.uid, dateStr);
            let score = 0;
            if (histData && histData.habits) {
              score = Object.values(histData.habits).filter(v => v === true).length as number;
            }
            newWeekData.push({ day: days[d.getDay()], score });
          }
          setHistoryData(newWeekData);

        } catch (error) {
          console.error("Failed to load stats", error);
        }
      }
    }
    loadStats();
  }, [user]);

  const saveDailyDataToLocal = async (newHabits: typeof habits, newReflection: string, newReflectionSubmitted: boolean, newReflectionAccomplished: boolean) => {
    if (!user) return;
    const today = getLocalDateString(new Date());
    const habitsData = Object.fromEntries(Object.entries(newHabits).map(([k, v]) => [k, v.completed]));
    await saveDailyData(user.uid, today, {
      date: today,
      habits: habitsData,
      reflection: newReflection,
      reflectionSubmitted: newReflectionSubmitted,
      reflectionAccomplished: newReflectionAccomplished
    });
  };

  const toggleHabit = async (key: keyof typeof habits) => {
    if (objectivesLogged) return;

    setHabits(prev => {
      const isCompleting = !prev[key].completed;
      if (isCompleting) {
        setAnimateStreak(true);
        setTimeout(() => setAnimateStreak(false), 400);
      }
      
      const newHabits = {
        ...prev,
        [key]: { ...prev[key], completed: isCompleting }
      };
      
      saveDailyDataToLocal(newHabits, reflection, reflectionSubmitted, reflectionAccomplished);
      return newHabits;
    });
  };

  const handleConfirmDay = async () => {
    if (user && !objectivesLogged) {
       setObjectivesLogged(true);
       const newStats = await logDailyObjective(user.uid);
       setStats(newStats);
       setShowCelebration(true);
       setTimeout(() => setShowCelebration(false), 4000);
    }
  };

  const handleReflectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReflectionSubmitted(true);
    saveDailyDataToLocal(habits, reflection, true, reflectionAccomplished);
  };

  const handleReflectionAccomplished = () => {
    setReflectionAccomplished(true);
    saveDailyDataToLocal(habits, reflection, reflectionSubmitted, true);
  };

  const completedCount = Object.values(habits).filter(h => h.completed).length;
  const totalCount = Object.values(habits).length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  useEffect(() => {
    if (progressPercentage === 100 && user && !objectivesLogged) {
      handleConfirmDay();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressPercentage, user, objectivesLogged]);

  const currentStreak = stats.currentStreak;

  const weekData = [
    ...historyData,
    { day: "Today", score: completedCount },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0A0A0A] border border-white/10 p-2 shadow-2xl rounded">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">{payload[0].payload.day}</p>
          <p className="text-xs font-black text-[#CCFF00]">{payload[0].value} / 4 Habits Done</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 relative">
      {/* Subtle Generative Ambient Background Animations that reflect user's energy state */}
      <AmbientEnergyBackground
        completedHabitsCount={completedCount}
        totalHabitsCount={totalCount}
        selectedEnergyState={energyState}
        onEnergyStateChange={setEnergyState}
        showControlPill={false}
      />

      {/* Celebration Modal Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md pointer-events-none"
          >
            <div className="text-center space-y-4 p-8 border border-[#CCFF00]/40 bg-zinc-950/90 rounded-3xl max-w-md shadow-2xl">
              <motion.div
                initial={{ scale: 0.5, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Flame className="w-20 h-20 text-[#CCFF00] mx-auto drop-shadow-[0_0_35px_rgba(204,255,0,0.6)]" />
              </motion.div>
              <h2 className="text-4xl font-black uppercase tracking-tight text-white">
                Day Conquered
              </h2>
              <p className="text-sm font-bold uppercase tracking-widest text-[#CCFF00]">
                Streak Solidified: {stats.currentStreak} Days
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section: Designer Athletic Editorial */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-950 via-[#0A0A0A] to-black shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)]">
        {/* High-Tech Futuristic Dynamic Motion Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroBgMode}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ 
                opacity: 0.85, 
                scale: [1.02, 1.08, 1.02],
                x: [0, -10, 0],
                y: [0, -6, 0]
              }}
              exit={{ opacity: 0, scale: 1.01 }}
              transition={{
                opacity: { duration: 0.7 },
                scale: { duration: 16, repeat: Infinity, ease: "easeInOut" },
                x: { duration: 18, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 14, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute inset-0 w-full h-full will-change-transform"
            >
              <img
                src={heroBgMode === "velocity" ? APP_IMAGES.athleticKineticMotion : APP_IMAGES.homeHeroBg}
                alt="Kinetic Motion Background"
                className="w-full h-full object-cover object-[center_30%] sm:object-center filter contrast-125 saturate-140 brightness-110 drop-shadow-[0_0_35px_rgba(204,255,0,0.3)]"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </AnimatePresence>

          {/* Sweeping Kinetic Laser Velocity Light Sheen */}
          <motion.div
            animate={{ x: ["-120%", "240%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.2 }}
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[#CCFF00]/25 to-transparent skew-x-12 blur-md pointer-events-none"
          />

          {/* Holographic Cyan Telemetry Scan Beam */}
          <motion.div
            animate={{ y: ["-10%", "110%"] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#00E5FF]/70 to-transparent pointer-events-none shadow-[0_0_20px_#00E5FF]"
          />

          {/* Concentric Sonic Shockwave Rings radiating from kinetic velocity blast */}
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <motion.div
              animate={{ scale: [0.7, 1.9], opacity: [0.55, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeOut" }}
              className="w-56 h-56 rounded-full border border-[#CCFF00]/50 shadow-[0_0_25px_rgba(204,255,0,0.4)]"
            />
            <motion.div
              animate={{ scale: [0.7, 2.4], opacity: [0.4, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeOut", delay: 1 }}
              className="absolute inset-0 w-56 h-56 rounded-full border border-[#00E5FF]/45 shadow-[0_0_25px_rgba(0,229,255,0.4)]"
            />
          </div>

          {/* Floating Kinetic Energy Sparks in Perspective */}
          {[
            { top: "25%", left: "20%", delay: 0, dur: 3.5, size: 3 },
            { top: "45%", left: "35%", delay: 1.2, dur: 4.2, size: 3.5 },
            { top: "65%", left: "25%", delay: 0.6, dur: 3.8, size: 2.5 },
            { top: "35%", left: "70%", delay: 1.8, dur: 4.5, size: 4 },
            { top: "55%", left: "80%", delay: 2.4, dur: 3.9, size: 3 },
          ].map((spark, idx) => (
            <motion.div
              key={idx}
              style={{ top: spark.top, left: spark.left, width: spark.size, height: spark.size }}
              animate={{
                y: [0, -35, -70],
                opacity: [0, 1, 0],
                scale: [0.8, 1.5, 0.8],
              }}
              transition={{
                duration: spark.dur,
                repeat: Infinity,
                delay: spark.delay,
                ease: "easeOut",
              }}
              className="absolute rounded-full bg-[#CCFF00] shadow-[0_0_12px_#CCFF00] pointer-events-none"
            />
          ))}

          {/* Open center vignettes: runner remains highly vivid while text stays legible */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-transparent to-black/65" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_35%,_rgba(0,0,0,0.7)_100%)]" />
        </div>
        
        {/* Subtle geometric precision grid */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[linear-gradient(to_right,#ffffff0f_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0f_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
        
        {/* Ambient Bioluminescent Color Bleeds */}
        <div className="absolute -top-10 left-1/4 w-80 h-40 bg-[#CCFF00]/25 blur-[120px] pointer-events-none" />
        <div className="absolute -top-10 right-1/4 w-80 h-40 bg-[#3BB1FF]/25 blur-[120px] pointer-events-none" />

        <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 lg:px-16 flex flex-col items-center text-center">
          
          {/* Floating Athletic Toodles & Kinetic Badges */}
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
            className="hidden md:inline-flex absolute top-6 left-6 lg:left-10 items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950/85 border border-[#CCFF00]/30 backdrop-blur-md shadow-lg shadow-[#CCFF00]/10 z-20 pointer-events-none"
          >
            <DoodleLightning className="w-3.5 h-3.5" />
            <span className="text-[9px] font-mono font-black uppercase text-[#CCFF00] tracking-widest">KINETIC BIO-ENGINE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-ping" />
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0], rotate: [2, -2, 2] }}
            transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
            className="hidden md:inline-flex absolute top-6 right-6 lg:right-10 items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950/85 border border-[#3BB1FF]/30 backdrop-blur-md shadow-lg shadow-[#3BB1FF]/10 z-20 pointer-events-none"
          >
            <DoodleHandGesture />
            <span className="text-[9px] font-mono font-black uppercase text-[#3BB1FF] tracking-widest">INTERACTIVE GESTURES</span>
            <span className="text-[8px] px-1.5 py-0.2 bg-[#3BB1FF]/20 text-[#3BB1FF] rounded font-bold">LIVE</span>
          </motion.div>

          {/* Status Kicker with high contrast */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/80 border border-[#CCFF00]/40 text-[#CCFF00] text-[10px] sm:text-[11px] font-black tracking-[0.28em] uppercase mb-6 backdrop-blur-xl shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse shadow-[0_0_10px_#CCFF00]" />
            <span className="font-black tracking-[0.28em] text-[#CCFF00]">MIND . ENERGY . MOTION</span>
          </div>

          <h1 className="max-w-4xl text-4xl sm:text-6xl md:text-7xl font-black leading-[0.92] tracking-tighter uppercase mb-6 text-white relative drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
            Elevate Your{" "}
            <span className="relative inline-block text-[#CCFF00] drop-shadow-[0_0_25px_rgba(204,255,0,0.5)]">
              Performance.
              {/* Kinetic Toodle Underline */}
              <DoodleSquiggle className="absolute -bottom-2 sm:-bottom-3.5 left-0 w-full text-[#CCFF00] drop-shadow-[0_0_12px_rgba(204,255,0,0.8)]" />
            </span>
            <br />
            <span className="drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">Own Every Single Rep.</span>
          </h1>

          <p className="max-w-xl text-xs sm:text-sm text-zinc-200 mb-6 leading-relaxed font-semibold uppercase tracking-wider bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 shadow-xl">
            Evidence-based periodization, sub-second macro food decomposition, and kinetic bio-feedback tailored for peak human output.
          </p>

          {/* Designer Kinetic Motion Console with Real AI-Generated Athletic Body */}
          <div className="w-full max-w-2xl mb-6 p-4 sm:p-5 bg-zinc-950/85 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-5 shadow-2xl relative">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 w-full justify-center sm:justify-start">
                <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-ping" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#CCFF00]">
                  AI Body Motion Engine • Live Biometrics
                </span>
              </div>
              <div className="text-base sm:text-lg font-black text-white uppercase tracking-tight truncate">
                {activeMotionTab === "sprinter" && <span className="text-[#CCFF00]">High-Velocity Sprint Vector</span>}
                {activeMotionTab === "lifter" && <span className="text-[#3BB1FF]">Compound Biomechanical Lift</span>}
                {activeMotionTab === "scanner" && <span className="text-[#CCFF00]">Biometric Metabolic Scan</span>}
                {activeMotionTab === "agility" && <span className="text-[#3BB1FF]">Plyometric Agility Ladder</span>}
                {activeMotionTab === "mobility" && <span className="text-[#9D4EDD]">Synovial Joint Longevity Arc</span>}
                {activeMotionTab === "zen" && <span className="text-[#9D4EDD]">Cognitive Flow Mindfulness</span>}
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 max-w-sm line-clamp-2">
                {activeMotionTab === "sprinter" && "Real athletic body in explosive mid-stride propulsion with telemetry tracking."}
                {activeMotionTab === "lifter" && "Deep power squat bar path trajectory optimizing tension and force transfer."}
                {activeMotionTab === "scanner" && "Sub-second holographic decomposition of macro and caloric densities."}
                {activeMotionTab === "agility" && "Rapid high-knee reactive coordination and ground contact mechanics."}
                {activeMotionTab === "mobility" && "Synovial joint lubrication and hip hinge longevity protocol."}
                {activeMotionTab === "zen" && "Parasympathetic seated meditation synchronizing heart rate with flow."}
              </p>

              {/* Minimalist Switcher Chips with Moving Gesture Accents */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mt-3.5">
                {[
                  { id: "sprinter" as const, label: "Sprint" },
                  { id: "lifter" as const, label: "Lift" },
                  { id: "scanner" as const, label: "Scan" },
                  { id: "agility" as const, label: "Agility" },
                  { id: "mobility" as const, label: "Mobility" },
                  { id: "zen" as const, label: "Flow" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveMotionTab(item.id)}
                    className={cn(
                      "px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-md transition-all flex items-center gap-1",
                      activeMotionTab === item.id 
                        ? "bg-[#CCFF00] text-black shadow-md font-black scale-105" 
                        : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 hover:scale-105"
                    )}
                  >
                    <span>{item.label}</span>
                    {activeMotionTab === item.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Real AI-Generated Athletic Body Motion Canvas with Interactive Gestures */}
            <div 
              className="shrink-0 relative overflow-visible flex items-center justify-center cursor-pointer group"
              onClick={() => {
                const cycle = ["sprinter", "lifter", "scanner", "agility", "mobility", "zen"] as const;
                const nextIdx = (cycle.indexOf(activeMotionTab) + 1) % cycle.length;
                setActiveMotionTab(cycle[nextIdx]);
              }}
              title="Click to morph AI body"
            >
              {/* Moving Gesture Indicator Pill */}
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute -top-3 z-30 px-2 py-0.5 rounded-full bg-black/95 border border-white/20 text-[7px] font-mono font-black text-[#CCFF00] uppercase tracking-widest flex items-center gap-1 shadow-lg pointer-events-none whitespace-nowrap"
              >
                <MoveHorizontal className="w-2.5 h-2.5 text-[#CCFF00] animate-pulse" />
                <span>TAP TO MORPH GESTURE</span>
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMotionTab}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.25 }}
                >
                  <KineticFigure 
                    type={activeMotionTab}
                    className="w-32 h-32 sm:w-36 sm:h-36" 
                    glowColor={
                      activeMotionTab === "sprinter" || activeMotionTab === "scanner"
                        ? "#CCFF00"
                        : activeMotionTab === "lifter" || activeMotionTab === "agility"
                        ? "#3BB1FF"
                        : "#9D4EDD"
                    }
                  />
                </motion.div>
              </AnimatePresence>

              {/* Bottom Micro Gesture Cue */}
              <div className="absolute -bottom-2 z-30 flex items-center gap-1 text-[7px] font-mono uppercase tracking-wider text-zinc-400 bg-black/90 px-2 py-0.5 rounded-full border border-white/10 pointer-events-none shadow-md">
                <motion.span animate={{ x: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 1.2 }}>👆</motion.span>
                <span>Tap Body</span>
              </div>
            </div>
          </div>

          {/* Interactive Gesture & Toodle Status Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-8 text-[10px] font-mono uppercase tracking-widest text-zinc-400">
            <div className="flex items-center gap-1.5">
              <DoodleSparkle className="w-3.5 h-3.5 text-[#CCFF00]" />
              <span>Sub-Second Telemetry</span>
            </div>
            <div className="hidden sm:inline text-white/20">•</div>
            <div className="flex items-center gap-1.5 text-[#CCFF00]">
              <Zap className="w-3 h-3 text-[#CCFF00]" />
              <span>Zero-Lag Morph</span>
            </div>
          </div>
          
          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              to="/programs"
              className="px-8 py-3.5 bg-[#CCFF00] text-black font-black uppercase text-xs tracking-widest hover:bg-[#b8e600] transition-all rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#CCFF00]/15"
            >
              Explore Training Programs <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/aarogya"
              className="px-8 py-3.5 border border-[#FF9933]/50 bg-[#FF9933]/15 text-[#FFD700] hover:bg-[#FF9933]/25 font-black uppercase text-xs tracking-widest transition-all rounded-xl flex items-center justify-center gap-2 backdrop-blur-sm shadow-[0_0_20px_rgba(255,153,51,0.2)]"
            >
              <Sun className="w-4 h-4 text-[#FF9933]" /> Aarogya (Vedic Yoga)
            </Link>
            <Link
              to="/health-tools"
              className="px-8 py-3.5 border border-white/20 bg-white/5 text-white font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all rounded-xl flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <Activity className="w-4 h-4 text-[#3BB1FF]" /> Health & Macro Intel
            </Link>
          </div>
        </div>
      </section>

      {/* Daily Performance Cockpit: Sleek Bento Layout (Decreased visual clutter, highly designer) */}
      <section className="bg-zinc-950/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
        {/* Subtle Ambient Corner Glows */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#CCFF00]/5 blur-[90px] pointer-events-none rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#3BB1FF]/5 blur-[90px] pointer-events-none rounded-full" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-white/10 pb-6 mb-8 relative z-10">
          <div>
            <div className="text-[#CCFF00] text-[10px] font-black uppercase tracking-[0.25em] mb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse shadow-[0_0_8px_#CCFF00]" />
              <Zap className="w-3.5 h-3.5 text-[#CCFF00]" /> Live Performance Telemetry
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight uppercase text-white">
              Daily Protocol & Disciplines
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-md">
              Lock in your 4 baseline pillars daily to sustain momentum and optimize neuromuscular recovery.
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            {/* Efficiency Telemetry Gauge: High Visibility & Designer HUD */}
            <div className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl border border-white/15 bg-gradient-to-br from-zinc-900/90 via-black to-zinc-950 shadow-lg relative overflow-hidden group hover:border-[#CCFF00]/40 transition-all">
              <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="19"
                    className="stroke-white/10"
                    strokeWidth="3.5"
                    fill="none"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="19"
                    className="stroke-[#CCFF00] transition-all duration-700 ease-out"
                    strokeWidth="3.5"
                    strokeDasharray={`${2 * Math.PI * 19}`}
                    strokeDashoffset={`${2 * Math.PI * 19 * (1 - progressPercentage / 100)}`}
                    strokeLinecap="round"
                    fill="none"
                    style={{
                      filter: progressPercentage > 0 ? 'drop-shadow(0 0 5px rgba(204,255,0,0.5))' : 'none'
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs font-black text-white tracking-tight leading-none">
                    {progressPercentage}%
                  </span>
                </div>
              </div>

              <div className="flex flex-col pr-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#CCFF00]">
                    Efficiency
                  </span>
                  <span className={cn(
                    "text-[8px] font-bold px-1.5 py-0.5 rounded font-mono uppercase tracking-wider",
                    progressPercentage === 100 
                      ? "bg-[#CCFF00]/20 text-[#CCFF00] border border-[#CCFF00]/30" 
                      : progressPercentage > 0
                        ? "bg-[#3BB1FF]/15 text-[#3BB1FF] border border-[#3BB1FF]/25"
                        : "bg-white/5 text-zinc-400 border border-white/10"
                  )}>
                    {progressPercentage === 100 ? "OPTIMAL" : progressPercentage > 0 ? "ACTIVE" : "PENDING"}
                  </span>
                </div>
                <div className="text-sm font-black text-white tracking-tight flex items-baseline gap-1">
                  <span>{completedCount} of 4</span>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Completed</span>
                </div>
              </div>
            </div>

            {/* Day Streak badge */}
            <div className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-2xl border bg-black/80 transition-all shadow-md",
              animateStreak ? "border-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.3)]" : "border-white/10"
            )}>
              <div className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                animateStreak ? "bg-[#CCFF00]/20 text-[#CCFF00]" : "bg-orange-500/10 text-[#FF8C00]"
              )}>
                <Flame className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-white leading-tight">{currentStreak} Days</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Current Streak</span>
              </div>
            </div>

            {objectivesLogged && (
              <div className="text-[10px] font-black uppercase tracking-widest text-[#CCFF00] bg-[#CCFF00]/10 border border-[#CCFF00]/30 px-3.5 py-2.5 rounded-2xl flex items-center gap-2 shadow-md">
                <CheckCircle className="w-4 h-4 text-[#CCFF00]" />
                <span>Day Locked</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Column 1: Habit Disciplines (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 block mb-2">
              4 Non-Negotiable Pillars
            </span>
            {Object.entries(habits).map(([key, habit]) => (
              <button
                key={key}
                onClick={() => toggleHabit(key as keyof typeof habits)}
                className={cn(
                  "w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left",
                  habit.completed 
                    ? "bg-white/5 border-white/20 shadow-sm" 
                    : "bg-black/60 border-white/5 hover:border-white/20"
                )}
              >
                <div className="flex items-center gap-3.5">
                  <div className={cn("p-2 rounded-lg bg-white/5", habit.color)}>
                    <habit.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className={cn(
                    "font-bold uppercase tracking-wider text-xs sm:text-sm",
                    habit.completed ? "text-zinc-400 line-through" : "text-white"
                  )}>
                    {habit.label}
                  </span>
                </div>
                {habit.completed ? (
                  <CheckCircle className={cn("w-5 h-5", habit.color)} />
                ) : (
                  <Circle className="w-5 h-5 text-white/20" />
                )}
              </button>
            ))}

            {/* Complete Day CTA */}
            <div className="pt-2">
              {!objectivesLogged ? (
                <button
                  onClick={handleConfirmDay}
                  disabled={progressPercentage < 100}
                  className="w-full py-3 bg-[#CCFF00] text-black font-black uppercase text-xs tracking-widest rounded-xl hover:bg-[#b8e600] transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-[#CCFF00]/10"
                >
                  {progressPercentage < 100 ? `Complete All Habits (${completedCount}/4)` : "Lock In Day & Advance Streak"}
                </button>
              ) : (
                <div className="p-3 text-center bg-black/60 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-[#CCFF00]">
                  Protocol Confirmed for Today
                </div>
              )}
            </div>
          </div>

          {/* Column 2: 7-Day History Sparkline (5 cols) */}
          <div className="lg:col-span-5 p-5 bg-black/50 border border-white/5 rounded-2xl flex flex-col justify-between h-full min-h-[220px]">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400">7-Day Consistency</span>
                <span className="text-[9px] font-mono text-[#CCFF00] font-bold">Goal: 4/4</span>
              </div>
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }} barCategoryGap="25%">
                    <XAxis 
                      dataKey="day" 
                      tick={{ fill: 'rgba(255, 255, 255, 0.4)', fontSize: 9, fontWeight: 700 }} 
                      axisLine={false} 
                      tickLine={false} 
                      dy={6} 
                    />
                    <YAxis 
                      hide={true} 
                      domain={[0, 4]} 
                    />
                    <Tooltip 
                      content={<CustomTooltip />} 
                      cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
                    />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={24}>
                      {weekData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === weekData.length - 1 ? '#CCFF00' : 'rgba(255, 255, 255, 0.2)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="text-[10px] text-zinc-400 font-medium text-center pt-2 border-t border-white/5">
              Daily habit adherence drives cumulative adaptation.
            </div>
          </div>
        </div>

        {/* Integrated Daily Mental Reflection */}
        {progressPercentage === 100 && (
          <div className="mt-8 pt-6 border-t border-white/10 animate-in fade-in duration-300">
            <div className="bg-black/60 border border-white/10 p-5 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <Brain className="w-5 h-5 text-[#9D4EDD]" />
                  <div>
                    <h3 className="text-sm font-black uppercase text-white tracking-wider">Daily Mental Focus</h3>
                    <p className="text-[11px] text-zinc-400">Anchor your day with an intentional mental health objective.</p>
                  </div>
                </div>
                {reflectionAccomplished && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9D4EDD] bg-[#9D4EDD]/10 px-3 py-1 rounded-lg border border-[#9D4EDD]/30 flex items-center gap-1.5 self-start sm:self-auto">
                    <CheckCircle className="w-3.5 h-3.5" /> Completed
                  </span>
                )}
              </div>

              {!reflectionSubmitted ? (
                <form onSubmit={handleReflectionSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text"
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="e.g. Practice non-reactive breathing during intense sets..."
                    className="flex-1 bg-zinc-950 border border-white/10 px-4 py-2.5 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-[#9D4EDD]"
                    required
                  />
                  <button type="submit" className="px-6 py-2.5 bg-[#9D4EDD] text-white font-black uppercase text-xs tracking-wider rounded-xl hover:bg-[#8d3ecd] transition-colors whitespace-nowrap">
                    Save Focus
                  </button>
                </form>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 p-4 rounded-xl border border-white/5">
                  <div className="italic text-xs text-white/90">
                    "{reflection}"
                  </div>
                  {!reflectionAccomplished && (
                    <button 
                      onClick={handleReflectionAccomplished}
                      className="px-4 py-2 border border-[#9D4EDD] text-[#9D4EDD] hover:bg-[#9D4EDD] hover:text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
                    >
                      Mark Done
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Artistic Kinetic Manifesto Marquee */}
      <div className="relative overflow-hidden py-4 border-y border-white/10 bg-black/50 backdrop-blur-md rounded-2xl">
        <div className="absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
        
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-8 whitespace-nowrap will-change-transform"
        >
          {[...MANIFESTO_ITEMS, ...MANIFESTO_ITEMS, ...MANIFESTO_ITEMS].map((phrase, i) => (
            <div key={i} className="flex items-center gap-8">
              <span className="text-xs sm:text-sm font-black tracking-[0.25em] uppercase text-zinc-400 hover:text-white transition-colors">
                {phrase}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] shadow-[0_0_8px_#CCFF00]" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
