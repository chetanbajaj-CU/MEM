import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Wind, 
  ShieldCheck, 
  HeartPulse, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Flame, 
  Zap,
  CheckCircle,
  Square,
  Clock,
  ChevronRight
} from "lucide-react";

export interface BreathPattern {
  id: string;
  name: string;
  tagline: string;
  description: string;
  inhale: number;
  holdIn: number;
  exhale: number;
  holdOut: number;
  color: string;
  glow: string;
}

const BREATH_PATTERNS: BreathPattern[] = [
  {
    id: "box",
    name: "4-4-4-4 Box Breathing",
    tagline: "Tactical Focus & Cortisol Drop",
    description: "Navy SEAL protocol to stabilize heart rate and eliminate acute cognitive anxiety.",
    inhale: 4,
    holdIn: 4,
    exhale: 4,
    holdOut: 4,
    color: "#3BB1FF",
    glow: "rgba(59, 177, 255, 0.4)",
  },
  {
    id: "478",
    name: "4-7-8 Vagus Nerve Reset",
    tagline: "Deep Relaxation & Sleep Prep",
    description: "Forces natural tranquilizer effect by maximizing CO2 blood saturation and vagal tone.",
    inhale: 4,
    holdIn: 7,
    exhale: 8,
    holdOut: 0,
    color: "#9D4EDD",
    glow: "rgba(157, 78, 221, 0.4)",
  },
  {
    id: "coherence",
    name: "5.5s Resonant Coherence",
    tagline: "HRV Synchronization (0.1 Hz)",
    description: "Aligns heart rate variability with respiratory sinus arrhythmia for peak autonomic balance.",
    inhale: 5.5,
    holdIn: 0,
    exhale: 5.5,
    holdOut: 0,
    color: "#CCFF00",
    glow: "rgba(204, 255, 0, 0.4)",
  },
  {
    id: "pranayama",
    name: "2-1-2 Awakening Breath",
    tagline: "Pre-Workout Oxygen Boost",
    description: "Rapid diaphragmatic oxygen flush to fire up sympathetic neural drive before training.",
    inhale: 2,
    holdIn: 1,
    exhale: 2,
    holdOut: 0,
    color: "#FF5500",
    glow: "rgba(255, 85, 0, 0.4)",
  },
];

type BreathPhase = "inhale" | "holdIn" | "exhale" | "holdOut";

export const BreathingExercise: React.FC = () => {
  const [selectedPatternId, setSelectedPatternId] = useState<string>("box");
  const pattern = BREATH_PATTERNS.find(p => p.id === selectedPatternId) || BREATH_PATTERNS[0];

  // Game/Session lifecycle: "start" | "active" | "ended"
  const [sessionState, setSessionState] = useState<"start" | "active" | "ended">("start");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentPhase, setCurrentPhase] = useState<BreathPhase>("inhale");
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState<number>(pattern.inhale);
  const [cycleCount, setCycleCount] = useState<number>(0);
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);

  // Audio tone helper
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playBreathChime = (freq: number) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Audio fallback silent
    }
  };

  // Phase duration lookup
  const getPhaseDuration = (phase: BreathPhase, pat: BreathPattern) => {
    switch (phase) {
      case "inhale": return pat.inhale;
      case "holdIn": return pat.holdIn;
      case "exhale": return pat.exhale;
      case "holdOut": return pat.holdOut;
    }
  };

  // Next phase determination
  const getNextPhase = (phase: BreathPhase, pat: BreathPattern): { nextPhase: BreathPhase; completedCycle: boolean } => {
    if (phase === "inhale") {
      if (pat.holdIn > 0) return { nextPhase: "holdIn", completedCycle: false };
      return { nextPhase: "exhale", completedCycle: false };
    }
    if (phase === "holdIn") {
      return { nextPhase: "exhale", completedCycle: false };
    }
    if (phase === "exhale") {
      if (pat.holdOut > 0) return { nextPhase: "holdOut", completedCycle: false };
      return { nextPhase: "inhale", completedCycle: true };
    }
    if (phase === "holdOut") {
      return { nextPhase: "inhale", completedCycle: true };
    }
    return { nextPhase: "inhale", completedCycle: true };
  };

  // Pattern switch handler
  const handleSelectPattern = (id: string) => {
    setSelectedPatternId(id);
    const newPat = BREATH_PATTERNS.find(p => p.id === id) || BREATH_PATTERNS[0];
    setCurrentPhase("inhale");
    setPhaseSecondsLeft(newPat.inhale);
  };

  // Start Session handler
  const handleStartSession = () => {
    setCurrentPhase("inhale");
    setPhaseSecondsLeft(pattern.inhale);
    setCycleCount(0);
    setSessionSeconds(0);
    setIsPlaying(true);
    setSessionState("active");
    playBreathChime(440);
  };

  // End Session handler
  const handleEndSession = () => {
    setIsPlaying(false);
    setSessionState("ended");
    playBreathChime(523.25);
  };

  // Session timer
  useEffect(() => {
    if (sessionState !== "active" || !isPlaying) return;
    const timer = setInterval(() => {
      setSessionSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionState, isPlaying]);

  // Breathing pacer loop
  useEffect(() => {
    if (sessionState !== "active" || !isPlaying) return;

    const intervalMs = 100 / speedMultiplier;
    const step = 0.1;

    const interval = setInterval(() => {
      setPhaseSecondsLeft((prev) => {
        if (prev <= 0.1) {
          const { nextPhase, completedCycle } = getNextPhase(currentPhase, pattern);
          setCurrentPhase(nextPhase);
          if (completedCycle) {
            setCycleCount((c) => c + 1);
            playBreathChime(587.33);
          } else {
            playBreathChime(440);
          }
          return getPhaseDuration(nextPhase, pattern);
        }
        return Math.max(0, parseFloat((prev - step).toFixed(2)));
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [sessionState, isPlaying, currentPhase, pattern, speedMultiplier]);

  // Phase Progress fraction (0 to 1)
  const currentDuration = getPhaseDuration(currentPhase, pattern) || 1;
  const phaseProgress = Math.max(0, Math.min(1, 1 - (phaseSecondsLeft / currentDuration)));

  // Lung expansion scale calculation
  let lungScale = 1;
  let diaphragmTranslateY = 0;
  if (currentPhase === "inhale") {
    lungScale = 0.85 + (0.35 * phaseProgress);
    diaphragmTranslateY = 12 * phaseProgress;
  } else if (currentPhase === "holdIn") {
    lungScale = 1.2;
    diaphragmTranslateY = 12;
  } else if (currentPhase === "exhale") {
    lungScale = 1.2 - (0.35 * phaseProgress);
    diaphragmTranslateY = 12 * (1 - phaseProgress);
  } else {
    lungScale = 0.85;
    diaphragmTranslateY = 0;
  }

  // Phase theme colors
  const phaseTheme = {
    inhale: {
      label: "INHALE",
      instruction: "Deep breath in through your nose, expanding diaphragm",
      color: "#3BB1FF",
      glow: "rgba(59, 177, 255, 0.5)",
      bgGradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    },
    holdIn: {
      label: "HOLD",
      instruction: "Hold still, lock oxygen in your chest and brain",
      color: "#9D4EDD",
      glow: "rgba(157, 78, 221, 0.5)",
      bgGradient: "from-purple-500/20 via-indigo-500/10 to-transparent",
    },
    exhale: {
      label: "EXHALE",
      instruction: "Slow, controlled release through mouth or nose",
      color: "#00E676",
      glow: "rgba(0, 230, 118, 0.5)",
      bgGradient: "from-emerald-500/20 via-green-500/10 to-transparent",
    },
    holdOut: {
      label: "HOLD EMPTY",
      instruction: "Lungs fully empty, settle into still awareness",
      color: "#FFD600",
      glow: "rgba(255, 214, 0, 0.5)",
      bgGradient: "from-amber-500/20 via-yellow-500/10 to-transparent",
    },
  }[currentPhase];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // ==========================================
  // 1. START SESSION SCREEN (When not yet started)
  // ==========================================
  if (sessionState === "start") {
    return (
      <div className="w-full bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden shadow-2xl space-y-8">
        {/* Ambient Glow */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ background: `radial-gradient(circle, ${pattern.color}40 0%, transparent 70%)` }}
        />

        {/* Top Header */}
        <div className="relative z-10 max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#3BB1FF] text-[10px] font-mono font-bold uppercase tracking-widest">
            <Wind className="w-3.5 h-3.5 text-[#3BB1FF]" />
            Coherent Respiratory Pacer
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Synchronized Box Breathing
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 font-medium">
            Reset sympathetic drive, lower circulating cortisol, and balance your heart rate variability in minutes.
          </p>
        </div>

        {/* Interactive Animated Preview Sphere */}
        <div className="relative z-10 flex items-center justify-center py-2">
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
            <motion.div
              animate={{ scale: [0.9, 1.35, 0.9], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full border border-dashed"
              style={{ borderColor: pattern.color }}
            />
            <motion.div
              animate={{ scale: [0.95, 1.2, 0.95] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-36 h-36 sm:w-44 sm:h-44 rounded-full flex flex-col items-center justify-center border-2 shadow-2xl relative"
              style={{
                borderColor: pattern.color,
                backgroundColor: `${pattern.color}15`,
                boxShadow: `0 0 35px ${pattern.glow}`,
              }}
            >
              <Wind className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-md" style={{ color: pattern.color }} />
              <span className="text-[10px] font-mono font-black uppercase text-white mt-1">
                {pattern.inhale}s Inhale • {pattern.exhale}s Exhale
              </span>
            </motion.div>
          </div>
        </div>

        {/* Pattern Selection Cards */}
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="text-[10px] font-mono font-bold uppercase text-zinc-400 mb-2">
            Choose Breathing Protocol:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {BREATH_PATTERNS.map((p) => {
              const isSelected = p.id === selectedPatternId;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectPattern(p.id)}
                  className={`p-3 rounded-2xl text-left border transition-all active:scale-95 flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? "bg-zinc-900 border-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.25)] ring-1 ring-[#CCFF00]"
                      : "bg-black/50 border-white/10 hover:border-white/20 text-zinc-400 hover:text-white"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-black uppercase" style={{ color: isSelected ? "#CCFF00" : "#FFFFFF" }}>
                        {p.name.split(" ")[0]}
                      </span>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                    </div>
                    <div className="text-[9px] text-zinc-400 line-clamp-1">{p.tagline}</div>
                  </div>
                  <div className="mt-2 text-[9px] font-mono text-zinc-500 font-bold">
                    {p.inhale}s • {p.holdIn > 0 ? `${p.holdIn}s • ` : ""}{p.exhale}s
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Big Prominent START Button */}
        <div className="relative z-10 pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleStartSession}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#CCFF00] via-[#00E676] to-[#3BB1FF] hover:opacity-95 text-black font-black text-sm uppercase tracking-wider rounded-2xl shadow-[0_0_30px_rgba(204,255,0,0.45)] hover:shadow-[0_0_45px_rgba(204,255,0,0.7)] active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-black/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 fill-black text-black ml-0.5" />
            </div>
            <span>Start Breathing Session</span>
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. END SESSION SCREEN (When concluded)
  // ==========================================
  if (sessionState === "ended") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full flex flex-col items-center justify-center min-h-[440px] bg-zinc-950 border border-white/10 p-8 sm:p-12 text-center rounded-3xl relative overflow-hidden shadow-2xl space-y-6"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="w-20 h-20 rounded-full bg-[#00E676]/20 border border-[#00E676]/40 flex items-center justify-center text-[#00E676] shadow-[0_0_30px_rgba(0,230,118,0.4)]"
        >
          <CheckCircle className="w-10 h-10 text-[#00E676]" />
        </motion.div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Breathing Session Complete
          </h2>
          <p className="text-zinc-300 font-medium max-w-md text-xs sm:text-sm mt-1">
            Parasympathetic tone engaged. Your heart rate variability and breathing rhythm have been harmonized.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-lg">
          <div className="bg-black/60 border border-white/10 p-3 rounded-2xl text-center">
            <div className="text-[9px] font-mono uppercase text-zinc-400">Cycles</div>
            <div className="text-lg font-mono font-black text-[#CCFF00]">{cycleCount}</div>
          </div>
          <div className="bg-black/60 border border-white/10 p-3 rounded-2xl text-center">
            <div className="text-[9px] font-mono uppercase text-zinc-400">Duration</div>
            <div className="text-lg font-mono font-black text-[#3BB1FF]">{formatTime(sessionSeconds)}</div>
          </div>
          <div className="bg-black/60 border border-white/10 p-3 rounded-2xl text-center">
            <div className="text-[9px] font-mono uppercase text-zinc-400">Cortisol</div>
            <div className="text-lg font-mono font-black text-[#00E676]">-28%</div>
          </div>
          <div className="bg-black/60 border border-white/10 p-3 rounded-2xl text-center">
            <div className="text-[9px] font-mono uppercase text-zinc-400">Vagal Tone</div>
            <div className="text-lg font-mono font-black text-[#9D4EDD]">High</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleStartSession}
            className="px-6 py-3 bg-[#CCFF00] hover:bg-[#b8e600] text-black text-xs font-black uppercase tracking-wider rounded-xl active:scale-95 transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-black" />
            Start Session Again
          </button>
          <button
            onClick={() => setSessionState("start")}
            className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white text-xs font-black uppercase tracking-wider rounded-xl active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Back to Start Screen
          </button>
        </div>
      </motion.div>
    );
  }

  // ==========================================
  // 3. ACTIVE PLAYING SESSION SCREEN
  // ==========================================
  return (
    <div className="bg-zinc-950 border border-white/10 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden space-y-6">
      {/* Background Animated Ambient Light */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.25, 0.5, 0.25],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none blur-3xl"
        style={{
          background: `radial-gradient(circle, ${phaseTheme.color}33 0%, transparent 70%)`,
        }}
      />

      {/* Header bar with Mode info, live timer, and END SESSION button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CCFF00] animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#CCFF00]">
              Active Bio-Rhythm Engine
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black uppercase text-white tracking-tight flex items-center gap-2 mt-0.5">
            <Wind className="w-5 h-5 text-[#3BB1FF]" />
            {pattern.name}
          </h2>
          <p className="text-xs text-zinc-400 font-medium">{pattern.description}</p>
        </div>

        {/* Live Metrics Pills, Timer & END SESSION Button */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#3BB1FF]" />
            <div className="text-left">
              <div className="text-[9px] font-mono uppercase text-zinc-400 leading-none">Time</div>
              <div className="text-xs font-mono font-bold text-white">{formatTime(sessionSeconds)}</div>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-[#CCFF00]" />
            <div className="text-left">
              <div className="text-[9px] font-mono uppercase text-zinc-400 leading-none">Cycles</div>
              <div className="text-xs font-mono font-bold text-white">{cycleCount}</div>
            </div>
          </div>

          {/* End Session Button in Header */}
          <button
            onClick={handleEndSession}
            className="px-3.5 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-400 hover:text-red-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 active:scale-95 transition cursor-pointer shadow-sm"
            title="End Breathing Session"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            End Session
          </button>
        </div>
      </div>

      {/* Protocol Selection Horizontal Strip */}
      <div className="relative z-10">
        <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2 block">
          Select Breathing Technique
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {BREATH_PATTERNS.map((p) => {
            const isSelected = p.id === selectedPatternId;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPattern(p.id)}
                className={`p-2.5 rounded-xl text-left border transition-all active:scale-95 flex flex-col justify-between ${
                  isSelected
                    ? "bg-zinc-900 border-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.2)]"
                    : "bg-black/50 border-white/10 hover:border-white/20 text-zinc-400 hover:text-white"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-[10px] font-black uppercase tracking-tight"
                      style={{ color: isSelected ? "#CCFF00" : "#FFFFFF" }}
                    >
                      {p.name.split(" ")[0]}
                    </span>
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                  </div>
                  <div className="text-[9px] font-medium text-zinc-400 line-clamp-1 leading-tight">
                    {p.tagline}
                  </div>
                </div>
                <div className="mt-2 text-[9px] font-mono text-zinc-500">
                  {p.inhale}s • {p.holdIn > 0 ? `${p.holdIn}s • ` : ""}{p.exhale}s
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN ANIMATED VISUALIZATION: ORGANIC EXPANDING LUNGS & RESONANCE AURA */}
      <div className="relative z-10 bg-black/80 rounded-2xl border border-white/10 p-6 flex flex-col items-center justify-center overflow-hidden min-h-[380px] shadow-inner">
        {/* Subtle Biometric Background Grid */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

        {/* Dynamic Multi-Ring Concentric Pulse Radiator */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            animate={{
              scale: currentPhase === "inhale" ? [1, 1.45] : currentPhase === "exhale" ? [1.45, 1] : 1.25,
              opacity: [0.15, 0.45, 0.15],
            }}
            transition={{
              duration: currentDuration,
              ease: "easeInOut",
              repeat: isPlaying ? Infinity : 0,
            }}
            className="w-80 h-80 rounded-full border border-dashed"
            style={{ borderColor: phaseTheme.color }}
          />

          <motion.div
            animate={{
              scale: currentPhase === "inhale" ? [0.9, 1.3] : currentPhase === "exhale" ? [1.3, 0.9] : 1.15,
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: currentDuration,
              ease: "easeInOut",
              repeat: isPlaying ? Infinity : 0,
            }}
            className="w-64 h-64 rounded-full border-2"
            style={{
              borderColor: `${phaseTheme.color}66`,
              boxShadow: `0 0 35px ${phaseTheme.glow}`,
            }}
          />

          <motion.div
            animate={{
              scale: [0.95, 1.05, 0.95],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-52 h-52 rounded-full blur-xl"
            style={{
              background: `radial-gradient(circle, ${phaseTheme.color}40 0%, transparent 70%)`,
            }}
          />
        </div>

        {/* Center Stage: Organic Anatomical Lungs & Trachea Vector Model */}
        <div className="relative w-72 h-72 flex items-center justify-center">
          <motion.svg
            viewBox="0 0 200 200"
            className="w-64 h-64 overflow-visible drop-shadow-[0_0_25px_rgba(59,177,255,0.4)]"
            style={{ filter: `drop-shadow(0 0 20px ${phaseTheme.color}88)` }}
          >
            <defs>
              <linearGradient id="lungLeftGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={phaseTheme.color} stopOpacity="0.8" />
                <stop offset="100%" stopColor="#1E293B" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="lungRightGradient" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={phaseTheme.color} stopOpacity="0.8" />
                <stop offset="100%" stopColor="#1E293B" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="airwayGradient" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="100%" stopColor={phaseTheme.color} stopOpacity="0.7" />
              </linearGradient>
            </defs>

            {/* Trachea Airway */}
            <motion.path
              d="M 100 25 L 100 80 M 100 80 Q 85 95 65 105 M 100 80 Q 115 95 135 105"
              stroke="url(#airwayGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              animate={{
                strokeDashoffset: currentPhase === "inhale" ? [20, 0] : [0, -20],
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />

            {/* Left Lung Lobe */}
            <motion.path
              d="M 95 85 C 80 85 55 100 50 130 C 45 155 60 175 80 175 C 92 175 96 160 96 145 Z"
              fill="url(#lungLeftGradient)"
              stroke={phaseTheme.color}
              strokeWidth="2.5"
              animate={{
                scale: lungScale,
                originX: "85px",
                originY: "130px",
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />

            {/* Right Lung Lobe */}
            <motion.path
              d="M 105 85 C 120 85 145 100 150 130 C 155 155 140 175 120 175 C 108 175 104 160 104 145 Z"
              fill="url(#lungRightGradient)"
              stroke={phaseTheme.color}
              strokeWidth="2.5"
              animate={{
                scale: lungScale,
                originX: "115px",
                originY: "130px",
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />

            {/* Diaphragm Muscle Curve */}
            <motion.path
              d="M 40 185 Q 100 165 160 185"
              stroke={phaseTheme.color}
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              animate={{
                y: diaphragmTranslateY,
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          </motion.svg>

          {/* Central Countdown Number Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.div
              key={currentPhase}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div
                className="text-5xl sm:text-6xl font-mono font-black tracking-tighter drop-shadow-lg"
                style={{ color: phaseTheme.color }}
              >
                {Math.ceil(phaseSecondsLeft)}s
              </div>
              <div className="text-xs sm:text-sm font-black uppercase tracking-widest text-white mt-1">
                {phaseTheme.label}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Dynamic Instructional Banner */}
        <div className="relative z-10 mt-4 text-center max-w-md">
          <p className="text-sm font-bold text-white transition-all duration-300">
            {phaseTheme.instruction}
          </p>

          {/* Micro Progress Bar */}
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden relative mt-3">
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${phaseProgress * 100}%`,
                backgroundColor: phaseTheme.color,
                boxShadow: `0 0 10px ${phaseTheme.color}`,
              }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>
        </div>
      </div>

      {/* Control Bar: Play / Pause, Reset, Speed Multiplier, Sound, and END SESSION */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-black/60 p-3 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 active:scale-95 transition-all shadow-lg cursor-pointer ${
              isPlaying
                ? "bg-[#CCFF00] text-black hover:bg-[#b8e600] shadow-[0_0_15px_rgba(204,255,0,0.3)]"
                : "bg-white text-black hover:bg-zinc-200"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-black" /> Pause Pacer
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-black" /> Resume Pacer
              </>
            )}
          </button>

          <button
            onClick={() => {
              setCurrentPhase("inhale");
              setPhaseSecondsLeft(pattern.inhale);
              setCycleCount(0);
            }}
            className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white active:scale-95 transition cursor-pointer"
            title="Reset Counter"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white active:scale-95 transition cursor-pointer"
            title={soundEnabled ? "Mute audio" : "Enable sound chimes"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#CCFF00]" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
          </button>
        </div>

        {/* Speed Multipliers */}
        <div className="flex items-center gap-1.5 bg-zinc-900/90 border border-white/10 p-1 rounded-xl">
          <span className="text-[9px] font-mono text-zinc-400 px-2 uppercase font-bold">Speed:</span>
          {[0.8, 1.0, 1.2].map((spd) => (
            <button
              key={spd}
              onClick={() => setSpeedMultiplier(spd)}
              className={`px-2 py-1 rounded-lg text-[9px] font-mono font-bold transition cursor-pointer ${
                speedMultiplier === spd
                  ? "bg-[#CCFF00] text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {spd === 0.8 ? "0.8x" : spd === 1.0 ? "1.0x" : "1.2x"}
            </button>
          ))}
        </div>

        {/* Explicit END SESSION Button */}
        <button
          onClick={handleEndSession}
          className="px-4 py-2.5 bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-400 hover:text-red-300 font-mono text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 active:scale-95 transition cursor-pointer"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
          End Session
        </button>
      </div>
    </div>
  );
};
