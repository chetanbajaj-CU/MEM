import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, Sparkles, Play, RotateCcw, Volume2, VolumeX, Eye, Activity, Ear, Wind, Heart, Square } from "lucide-react";
import { cn } from "../lib/utils";

const PHASES = [
  {
    count: 5,
    sense: "Sight",
    prompt: "Find & pop 5 floating visual spheres — notice 5 distinct objects around you",
    color: "from-blue-500 to-cyan-400",
    shadow: "shadow-cyan-500/50",
    accent: "#3BB1FF",
  },
  {
    count: 4,
    sense: "Touch",
    prompt: "Find & pop 4 sensory spheres — feel 4 physical contact points in your body",
    color: "from-emerald-500 to-green-400",
    shadow: "shadow-green-500/50",
    accent: "#00E676",
  },
  {
    count: 3,
    sense: "Hearing",
    prompt: "Find & pop 3 resonance spheres — listen for 3 distant or subtle sounds",
    color: "from-amber-500 to-yellow-400",
    shadow: "shadow-yellow-500/50",
    accent: "#FFD600",
  },
  {
    count: 2,
    sense: "Scent",
    prompt: "Find & pop 2 aroma spheres — inhale and notice 2 subtle aromas in the air",
    color: "from-purple-500 to-fuchsia-400",
    shadow: "shadow-fuchsia-500/50",
    accent: "#9D4EDD",
  },
  {
    count: 1,
    sense: "Taste",
    prompt: "Find & pop 1 grounding sphere — acknowledge 1 taste or sensation of breath",
    color: "from-rose-500 to-pink-400",
    shadow: "shadow-pink-500/50",
    accent: "#FF4081",
  },
];

export function GroundingGame({ autoStart = false }: { autoStart?: boolean }) {
  const [isStarted, setIsStarted] = useState<boolean>(autoStart);
  const [phase, setPhase] = useState(0);
  const [orbs, setOrbs] = useState<{ id: string; x: number; y: number; collected: boolean; delay: number }[]>([]);
  const [collectedCount, setCollectedCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play pleasant chime on orb pop
  const playPopTone = (pitch: number) => {
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
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 1.5, ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch {
      // Audio fallback silent
    }
  };

  const startGame = () => {
    setIsStarted(true);
    setPhase(0);
    setCollectedCount(0);
    playPopTone(520);
  };

  useEffect(() => {
    if (isStarted && phase < 5) {
      const targetCount = PHASES[phase].count;
      const newOrbs = Array.from({ length: targetCount }).map((_, i) => ({
        id: `${phase}-${i}`,
        x: 18 + Math.random() * 64, // Keep away from borders
        y: 18 + Math.random() * 64,
        collected: false,
        delay: Math.random() * 1.5,
      }));
      setOrbs(newOrbs);
      setCollectedCount(0);
    }
  }, [isStarted, phase]);

  const handleOrbClick = (id: string) => {
    const baseFreqs = [440, 523.25, 659.25, 783.99, 880];
    const pitch = baseFreqs[phase % baseFreqs.length] + collectedCount * 45;
    playPopTone(pitch);

    setOrbs((prev) =>
      prev.map((o) => (o.id === id ? { ...o, collected: true } : o))
    );
    setCollectedCount((prev) => {
      const next = prev + 1;
      if (next === PHASES[phase].count) {
        setTimeout(() => setPhase((p) => p + 1), 1200);
      }
      return next;
    });
  };

  const restart = () => {
    setPhase(0);
    setCollectedCount(0);
    setIsStarted(true);
    playPopTone(440);
  };

  // --- 1. START GAME SCREEN (When not yet started) ---
  if (!isStarted) {
    return (
      <div className="w-full bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden shadow-2xl space-y-8">
        {/* Ambient Glow */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(0, 230, 118, 0.35) 0%, rgba(59, 177, 255, 0.2) 50%, transparent 70%)",
          }}
        />

        {/* Sensory Preview Icons */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative flex items-center justify-center w-24 h-24 mb-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-[#00E676]/40"
            />
            <motion.div
              animate={{ scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-18 h-18 rounded-full bg-gradient-to-tr from-[#00E676]/20 to-[#3BB1FF]/20 border border-[#00E676]/50 flex items-center justify-center text-[#CCFF00] shadow-[0_0_25px_rgba(0,230,118,0.3)]"
            >
              <Sparkles className="w-8 h-8 text-[#CCFF00]" />
            </motion.div>
          </div>

          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#00E676] bg-[#00E676]/10 px-3 py-1 rounded-full border border-[#00E676]/30 mb-2">
            Neuro-Somatic Calming Game
          </span>
          <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-white max-w-xl leading-tight">
            5-Senses Sensory Grounding Game
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 font-medium max-w-lg mt-2 leading-relaxed">
            Anchor your nervous system using clinical 5-4-3-2-1 neuro-somatics. Pop sensory focus spheres as they float across the canvas to pull your mind out of stress and into the present.
          </p>
        </div>

        {/* 5-Step Sensory Preview Strip */}
        <div className="relative z-10 grid grid-cols-5 gap-2 max-w-xl mx-auto">
          {[
            { num: 5, label: "See", icon: Eye, color: "text-[#3BB1FF] border-[#3BB1FF]/30 bg-[#3BB1FF]/10" },
            { num: 4, label: "Feel", icon: Activity, color: "text-[#00E676] border-[#00E676]/30 bg-[#00E676]/10" },
            { num: 3, label: "Hear", icon: Ear, color: "text-[#FFD600] border-[#FFD600]/30 bg-[#FFD600]/10" },
            { num: 2, label: "Smell", icon: Wind, color: "text-[#9D4EDD] border-[#9D4EDD]/30 bg-[#9D4EDD]/10" },
            { num: 1, label: "Taste", icon: Heart, color: "text-[#FF4081] border-[#FF4081]/30 bg-[#FF4081]/10" },
          ].map((s) => (
            <div key={s.num} className={cn("p-2 sm:p-2.5 rounded-xl border flex flex-col items-center justify-center text-center", s.color)}>
              <span className="text-base sm:text-lg font-black font-mono leading-none">{s.num}</span>
              <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider mt-0.5">{s.label}</span>
            </div>
          ))}
        </div>

        {/* PRIMARY START BUTTON */}
        <div className="relative z-10 flex flex-col items-center gap-3 pt-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="group relative inline-flex items-center gap-3 px-8 sm:px-12 py-4 bg-gradient-to-r from-[#CCFF00] via-[#00E676] to-[#3BB1FF] text-black font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-[0_0_35px_rgba(204,255,0,0.45)] hover:shadow-[0_0_50px_rgba(204,255,0,0.7)] transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 fill-black text-black ml-0.5" />
            </div>
            <span>START GROUNDING GAME</span>
          </motion.button>
          <span className="text-[10px] font-mono text-zinc-400">
            Takes ~60 seconds • Clinically proven cortisol drop
          </span>
        </div>
      </div>
    );
  }

  // --- 2. GAME COMPLETE SCREEN ---
  if (phase >= 5) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full flex flex-col items-center justify-center min-h-[420px] bg-zinc-950 border border-white/10 p-8 sm:p-12 text-center rounded-3xl relative overflow-hidden shadow-2xl"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="w-20 h-20 rounded-full bg-[#00E676]/20 border border-[#00E676]/40 flex items-center justify-center text-[#00E676] mb-4 shadow-[0_0_30px_rgba(0,230,118,0.4)]"
        >
          <CheckCircle className="w-10 h-10 text-[#00E676]" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-2">
          You Are Centered & Grounded
        </h2>
        <p className="text-zinc-300 font-medium mb-6 max-w-md text-xs sm:text-sm">
          All 5 physical senses have been synchronized into the present moment. Your sympathetic stress activation is neutralized.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={restart}
            className="px-6 py-3 bg-[#CCFF00] hover:bg-[#b8e600] text-black text-xs font-black uppercase tracking-wider rounded-xl active:scale-95 transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-black" />
            Start Game Again
          </button>
          <button
            onClick={() => {
              setIsStarted(false);
              setPhase(0);
            }}
            className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white text-xs font-black uppercase tracking-wider rounded-xl active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Back to Start Screen
          </button>
        </div>
      </motion.div>
    );
  }

  // --- 3. ACTIVE GAME PLAYING SCREEN ---
  const currentPhase = PHASES[phase];

  return (
    <div className="w-full flex flex-col items-center bg-zinc-950 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl relative">
      {/* Active Game HUD Header */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border font-mono font-black text-sm"
            style={{
              borderColor: `${currentPhase.accent}60`,
              backgroundColor: `${currentPhase.accent}15`,
              color: currentPhase.accent,
            }}
          >
            {phase + 1}/5
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: currentPhase.accent }}>
                Step {phase + 1}: {currentPhase.sense}
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/10 text-zinc-300">
                {currentPhase.count - collectedCount} remaining
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-white max-w-md line-clamp-1">
              {currentPhase.prompt}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition"
            title={soundEnabled ? "Mute audio" : "Unmute audio"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#CCFF00]" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
          </button>
          <button
            onClick={restart}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white text-[10px] font-mono font-bold uppercase flex items-center gap-1.5 transition active:scale-95"
            title="Restart from Step 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restart
          </button>
          <button
            onClick={() => setPhase(5)}
            className="px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-400 hover:text-red-300 text-[10px] font-mono font-bold uppercase flex items-center gap-1.5 transition active:scale-95"
            title="End Game Session"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            End Game
          </button>
        </div>
      </div>

      {/* Target Countdown Banner */}
      <div className="text-center mb-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-center gap-3"
          >
            <span
              className="text-4xl sm:text-5xl font-mono font-black tracking-tight"
              style={{ color: currentPhase.accent }}
            >
              {currentPhase.count - collectedCount}
            </span>
            <div className="text-left">
              <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 block">
                Spheres to Collect
              </span>
              <span className="text-xs font-bold text-white uppercase">
                Tap each floating node
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Game Interactive Canvas */}
      <div className="relative w-full max-w-2xl aspect-[16/10] sm:aspect-video bg-[#050505] rounded-2xl border border-white/15 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent pointer-events-none" />

        <AnimatePresence>
          {orbs.map((orb) => (
            !orb.collected && (
              <motion.button
                key={orb.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: [0, Math.random() * 30 - 15, Math.random() * 30 - 15, 0],
                  y: [0, Math.random() * 30 - 15, Math.random() * 30 - 15, 0],
                }}
                exit={{ opacity: 0, scale: 2.2, filter: "blur(12px)" }}
                transition={{
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.4 },
                  x: { repeat: Infinity, duration: 6 + Math.random() * 4, ease: "easeInOut", delay: orb.delay },
                  y: { repeat: Infinity, duration: 6 + Math.random() * 4, ease: "easeInOut", delay: orb.delay },
                }}
                onClick={() => handleOrbClick(orb.id)}
                className="absolute w-12 h-12 sm:w-16 sm:h-16 -ml-6 -mt-6 sm:-ml-8 sm:-mt-8 rounded-full flex items-center justify-center cursor-pointer focus:outline-none group active:scale-90 transition-transform"
                style={{ left: `${orb.x}%`, top: `${orb.y}%` }}
              >
                <div
                  className={cn(
                    "absolute inset-0 rounded-full bg-gradient-to-br opacity-85 group-hover:opacity-100 animate-pulse transition-opacity",
                    currentPhase.color
                  )}
                  style={{ boxShadow: `0 0 25px ${currentPhase.accent}` }}
                />
                <div className="relative z-10 w-1/2 h-1/2 bg-white/60 rounded-full blur-[1px] group-hover:scale-125 transition-transform" />
              </motion.button>
            )
          ))}
        </AnimatePresence>

        {/* Phase completion flash */}
        <AnimatePresence>
          {collectedCount === currentPhase.count && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 2.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div
                className="w-36 h-36 rounded-full blur-2xl opacity-60"
                style={{ backgroundColor: currentPhase.accent }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Dots */}
      <div className="mt-5 flex items-center gap-2.5">
        {PHASES.map((p, i) => (
          <div
            key={i}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              i < phase
                ? "bg-white/80 scale-100"
                : i === phase
                ? "scale-125 ring-2 ring-white/50"
                : "bg-white/20 scale-100"
            )}
            style={{
              backgroundColor: i === phase ? p.accent : undefined,
            }}
            title={`Phase ${i + 1}: ${p.sense}`}
          />
        ))}
      </div>
    </div>
  );
}
