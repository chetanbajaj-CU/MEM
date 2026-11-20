import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Eye, Sparkles, Activity, Play, Pause, Waves, Sun, CheckCircle, Square, Clock, RotateCcw } from "lucide-react";

export const VisualFocusExercise: React.FC = () => {
  const [sessionState, setSessionState] = useState<"start" | "active" | "ended">("start");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<"alpha" | "theta" | "gamma">("alpha");
  const [focusSeconds, setFocusSeconds] = useState<number>(0);

  const FREQ_MAP = {
    alpha: { name: "10 Hz Alpha State", label: "Calm Alertness & Focus", color: "#9D4EDD", speed: 6 },
    theta: { name: "6 Hz Theta State", label: "Deep Meditation & Trance", color: "#3BB1FF", speed: 10 },
    gamma: { name: "40 Hz Gamma State", label: "Peak Cognitive Synchrony", color: "#CCFF00", speed: 3 },
  };

  const current = FREQ_MAP[frequency];

  // Timer loop when active
  useEffect(() => {
    if (sessionState !== "active" || !isActive) return;
    const interval = setInterval(() => {
      setFocusSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionState, isActive]);

  const handleStart = () => {
    setFocusSeconds(0);
    setIsActive(true);
    setSessionState("active");
  };

  const handleEnd = () => {
    setIsActive(false);
    setSessionState("ended");
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // ==========================================
  // 1. START SESSION SCREEN
  // ==========================================
  if (sessionState === "start") {
    return (
      <div className="w-full bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden shadow-2xl space-y-8">
        {/* Background Glow */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none blur-3xl"
          style={{ background: `radial-gradient(circle, ${current.color}44 0%, transparent 70%)` }}
        />

        {/* Header */}
        <div className="relative z-10 max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#9D4EDD] text-[10px] font-mono font-bold uppercase tracking-widest">
            <Eye className="w-3.5 h-3.5 text-[#9D4EDD]" />
            Photonic Optical Resonator
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Visual Focus & Neural Entrainment
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 font-medium">
            Lock gaze onto the pulsing center to suppress peripheral optical distractions and quiet the default mode network (DMN).
          </p>
        </div>

        {/* Pulsing Visual Preview */}
        <div className="relative z-10 flex items-center justify-center py-2">
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: current.speed * 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-dashed"
              style={{ borderColor: current.color }}
            />
            <motion.div
              animate={{ scale: [0.9, 1.2, 0.9] }}
              transition={{ duration: current.speed, repeat: Infinity, ease: "easeInOut" }}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full flex flex-col items-center justify-center border shadow-2xl relative"
              style={{
                borderColor: `${current.color}88`,
                backgroundColor: `${current.color}15`,
                boxShadow: `0 0 35px ${current.color}40`,
              }}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-[0_0_15px_#FFFFFF]" />
              <span className="text-[9px] font-mono font-bold uppercase text-white mt-2">
                {current.name.split(" ")[0]} {current.name.split(" ")[1]}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Frequency selector buttons */}
        <div className="relative z-10 max-w-md mx-auto">
          <div className="text-[10px] font-mono font-bold uppercase text-zinc-400 mb-2">
            Target Brainwave State:
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(["alpha", "theta", "gamma"] as const).map((f) => {
              const item = FREQ_MAP[f];
              const isSelected = frequency === f;
              return (
                <button
                  key={f}
                  onClick={() => setFrequency(f)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? "bg-zinc-900 border-[#9D4EDD] ring-1 ring-[#9D4EDD] shadow-[0_0_15px_rgba(157,78,221,0.3)] text-white"
                      : "bg-black/50 border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  <div className="text-[11px] font-black uppercase" style={{ color: isSelected ? item.color : "#FFFFFF" }}>
                    {f}
                  </div>
                  <div className="text-[8px] font-mono text-zinc-400 mt-0.5">{item.name.split(" ")[0]} {item.name.split(" ")[1]}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Big Prominent START Button */}
        <div className="relative z-10 pt-2 flex justify-center">
          <button
            onClick={handleStart}
            className="px-8 py-4 bg-gradient-to-r from-[#9D4EDD] via-[#3BB1FF] to-[#CCFF00] hover:opacity-95 text-black font-black text-sm uppercase tracking-wider rounded-2xl shadow-[0_0_30px_rgba(157,78,221,0.45)] hover:shadow-[0_0_45px_rgba(157,78,221,0.7)] active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-black/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 fill-black text-black ml-0.5" />
            </div>
            <span>Start Focus Session</span>
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. END SESSION SCREEN
  // ==========================================
  if (sessionState === "ended") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full flex flex-col items-center justify-center min-h-[420px] bg-zinc-950 border border-white/10 p-8 sm:p-12 text-center rounded-3xl relative overflow-hidden shadow-2xl space-y-6"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="w-20 h-20 rounded-full bg-[#9D4EDD]/20 border border-[#9D4EDD]/40 flex items-center justify-center text-[#9D4EDD] shadow-[0_0_30px_rgba(157,78,221,0.4)]"
        >
          <CheckCircle className="w-10 h-10 text-[#9D4EDD]" />
        </motion.div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Focus Session Complete
          </h2>
          <p className="text-zinc-300 font-medium max-w-md text-xs sm:text-sm mt-1">
            Visual fixation sustained. Default mode network suppressed for elevated decision clarity.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-md">
          <div className="bg-black/60 border border-white/10 p-3 rounded-2xl text-center">
            <div className="text-[9px] font-mono uppercase text-zinc-400">Duration</div>
            <div className="text-lg font-mono font-black text-[#CCFF00]">{formatTime(focusSeconds)}</div>
          </div>
          <div className="bg-black/60 border border-white/10 p-3 rounded-2xl text-center">
            <div className="text-[9px] font-mono uppercase text-zinc-400">Frequency</div>
            <div className="text-lg font-mono font-black text-[#9D4EDD]">{frequency.toUpperCase()}</div>
          </div>
          <div className="bg-black/60 border border-white/10 p-3 rounded-2xl text-center col-span-2 sm:col-span-1">
            <div className="text-[9px] font-mono uppercase text-zinc-400">Neural Sync</div>
            <div className="text-lg font-mono font-black text-[#3BB1FF]">98%</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleStart}
            className="px-6 py-3 bg-[#9D4EDD] hover:bg-[#863ec0] text-white text-xs font-black uppercase tracking-wider rounded-xl active:scale-95 transition-all shadow-[0_0_20px_rgba(157,78,221,0.4)] flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
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
    <div className="bg-zinc-950 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden space-y-6">
      {/* Background Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.45, 0.2],
        }}
        transition={{ duration: current.speed, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none blur-3xl"
        style={{
          background: `radial-gradient(circle, ${current.color}40 0%, transparent 70%)`,
        }}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: current.color }} />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#9D4EDD]">
              Photonic Optical Resonator
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black uppercase text-white tracking-tight flex items-center gap-2 mt-0.5">
            <Eye className="w-5 h-5 text-[#9D4EDD]" />
            Visual Focus & Neural Entrainment
          </h2>
          <p className="text-xs text-zinc-400 font-medium">
            Lock gaze onto the pulsing center to suppress peripheral optical distractions and quiet default mode network.
          </p>
        </div>

        {/* Live Timer, Frequency & END SESSION Button */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#3BB1FF]" />
            <div className="text-left">
              <div className="text-[9px] font-mono uppercase text-zinc-400 leading-none">Focus Time</div>
              <div className="text-xs font-mono font-bold text-white">{formatTime(focusSeconds)}</div>
            </div>
          </div>

          {/* Brainwave selection */}
          <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-white/10 shrink-0">
            {(["alpha", "theta", "gamma"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFrequency(f)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-mono font-bold uppercase transition active:scale-95 cursor-pointer ${
                  frequency === f
                    ? "bg-[#9D4EDD] text-white shadow-md"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* End Session Button */}
          <button
            onClick={handleEnd}
            className="px-3.5 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-400 hover:text-red-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 active:scale-95 transition cursor-pointer shadow-sm"
            title="End Focus Session"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            End Focus
          </button>
        </div>
      </div>

      {/* Dynamic Animated Sacred Geometry Vortex */}
      <div className="relative z-10 bg-black/90 rounded-2xl border border-white/10 p-6 flex flex-col items-center justify-center overflow-hidden min-h-[360px] shadow-inner">
        {/* Hypnotic Sacred Geometry SVG */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
          {/* Layer 1: Outermost oscillating torus */}
          <motion.div
            animate={{
              rotate: isActive ? 360 : 0,
              scale: isActive ? [1, 1.1, 1] : 1,
            }}
            transition={{
              rotate: { duration: current.speed * 4, repeat: Infinity, ease: "linear" },
              scale: { duration: current.speed, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute inset-0 rounded-full border border-dashed opacity-40"
            style={{ borderColor: current.color }}
          />

          {/* Layer 2: Counter-rotating geometric polygon */}
          <motion.div
            animate={{
              rotate: isActive ? -360 : 0,
              scale: isActive ? [1.05, 0.95, 1.05] : 1,
            }}
            transition={{
              rotate: { duration: current.speed * 3, repeat: Infinity, ease: "linear" },
              scale: { duration: current.speed * 1.5, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute inset-6 rounded-full border-2 opacity-60"
            style={{
              borderColor: current.color,
              boxShadow: `0 0 25px ${current.color}44`,
            }}
          />

          {/* Layer 3: Concentric optical spirals */}
          <motion.div
            animate={{
              rotate: isActive ? 360 : 0,
            }}
            transition={{
              duration: current.speed * 2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-14 rounded-full border-4 border-dotted opacity-70"
            style={{ borderColor: current.color }}
          />

          {/* Layer 4: High-contrast central target singularity */}
          <motion.div
            animate={{
              scale: isActive ? [0.85, 1.35, 0.85] : 1,
              boxShadow: isActive
                ? [`0 0 20px ${current.color}`, `0 0 50px ${current.color}`, `0 0 20px ${current.color}`]
                : `0 0 20px ${current.color}`,
            }}
            transition={{
              duration: current.speed,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative z-20 w-16 h-16 rounded-full flex items-center justify-center border-2 border-white shadow-2xl"
            style={{ backgroundColor: current.color }}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_10px_#FFFFFF]" />
          </motion.div>

          {/* Concentric light ripple rings escaping center */}
          {isActive && (
            <motion.div
              animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
              transition={{ duration: current.speed / 2, repeat: Infinity, ease: "easeOut" }}
              className="absolute w-14 h-14 rounded-full border-2 pointer-events-none"
              style={{ borderColor: current.color }}
            />
          )}
        </div>

        {/* Telemetry info */}
        <div className="mt-4 text-center space-y-1">
          <div className="text-xs font-mono font-bold uppercase text-white flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5" style={{ color: current.color }} />
            {current.name} • {current.label}
          </div>
          <p className="text-[10px] text-zinc-400">
            Keep your eye centered on the white pupil. Soften your gaze.
          </p>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-black/60 p-3 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 active:scale-95 transition cursor-pointer ${
              isActive
                ? "bg-[#9D4EDD] text-white shadow-[0_0_15px_rgba(157,78,221,0.4)]"
                : "bg-white text-black"
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4 fill-white" /> Pause Focus
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-black" /> Resume Focus
              </>
            )}
          </button>
        </div>

        <button
          onClick={handleEnd}
          className="px-4 py-2 bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-400 hover:text-red-300 font-mono text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 active:scale-95 transition cursor-pointer"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
          End Session
        </button>
      </div>
    </div>
  );
};
