import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wind, Eye, CheckCircle, Sparkles, Heart, Quote, Smile, Swords, Activity, Zap, Play, RotateCcw } from "lucide-react";
import { MindChess } from "../components/MindChess";
import { BreathingExercise } from "../components/BreathingExercise";
import { VisualFocusExercise } from "../components/VisualFocusExercise";
import { APP_IMAGES } from "../lib/appImages";
import { KineticFigure } from "../components/KineticFigure";

export function MentalGame() {
  const [activeTab, setActiveTab] = useState<"breathing" | "chess" | "visual" | "affirmations" | "mood">("breathing");

  // Affirmations State
  const affirmations = [
    "My body is getting stronger, and my mind is finding peace.",
    "I am in control of my choices, habits, and focus.",
    "Every day, in every rep, I build enduring discipline.",
    "I release what I cannot control and focus on execution.",
    "I am capable of achieving my fitness and mental goals.",
    "Challenges are opportunities for me to grow sharper.",
    "I prioritize my recovery, sleep, and inner calm.",
    "My potential expands as my consistency grows."
  ];
  const [currentAffirmation, setCurrentAffirmation] = useState(affirmations[0]);
  const [affirmationAnimKey, setAffirmationAnimKey] = useState(0);

  const showRandomAffirmation = () => {
    const next = affirmations[Math.floor(Math.random() * affirmations.length)];
    setCurrentAffirmation(next);
    setAffirmationAnimKey(k => k + 1);
  };

  // Mood Tracker State
  const [mood, setMood] = useState<number | null>(null);
  const [moodSubmitted, setMoodSubmitted] = useState(false);

  const getGameLabel = (tab: string) => {
    switch (tab) {
      case "breathing": return "Breathing Pacer";
      case "chess": return "Mind Chess Game";
      case "visual": return "Visual Focus";
      case "affirmations": return "Affirmations";
      case "mood": return "Mood Check-In";
      default: return "Relief Game";
    }
  };



  return (
    <div className="space-y-4 pb-12 select-auto">
      {/* Mobile Title Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h1 className="text-xl font-black tracking-tight text-white uppercase">
            Mental Game
          </h1>
          <p className="text-xs text-white/50 font-bold uppercase tracking-wider">
            Neuro-Conditioning & Stress Relief
          </p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-[#9D4EDD]/10 border border-[#9D4EDD]/30 flex items-center justify-center text-[#9D4EDD]">
          <Wind className="w-4 h-4" />
        </div>
      </div>

      {/* High Definition Mental Wellness Hero Banner with Dynamic Synchronized Animation & Start Button */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black aspect-[21/9] sm:aspect-[24/9] shadow-xl group">
        <img
          src={APP_IMAGES.mentalFocusZen}
          alt="Mental Focus and Mind Flow"
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent" />
        <div className="absolute inset-0 p-4 sm:p-6 flex items-center justify-between">
          <div className="max-w-md space-y-1.5 sm:space-y-2 z-10">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#9D4EDD] bg-[#9D4EDD]/15 px-2.5 py-0.5 rounded border border-[#9D4EDD]/30 inline-flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> Cognitive Stamina & Flow
            </span>
            <h2 className="text-base sm:text-2xl font-black uppercase text-white tracking-tight leading-tight">
              Mind Chess, Box Breathing & Visual Focus
            </h2>
            <p className="text-[10px] sm:text-xs text-zinc-300 line-clamp-2">
              Train mental resilience, lower cortisol levels, and sharpen decision-making speed between intense physical sessions.
            </p>

            <div className="pt-1 flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase text-white/80 bg-white/10 px-3 py-1 rounded-full border border-white/10 inline-flex items-center gap-1.5 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
                Select any practice below to start session
              </span>
            </div>
          </div>

          {/* Dynamic Synchronized Animated Relief Showcase in Hero */}
          <div className="flex shrink-0 p-1.5 sm:p-2 bg-black/75 backdrop-blur-md rounded-2xl border border-white/15 items-center justify-center relative overflow-hidden group shadow-2xl">
            {activeTab === "breathing" && (
              <div className="relative flex items-center justify-center w-20 h-20 sm:w-28 sm:h-28">
                <motion.div
                  animate={{ scale: [0.85, 1.25, 0.85], opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full border-2 border-[#3BB1FF]"
                />
                <motion.div
                  animate={{ scale: [0.95, 1.15, 0.95] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-16 h-16 sm:w-22 sm:h-22 rounded-full bg-[#3BB1FF]/10 flex flex-col items-center justify-center border border-[#3BB1FF]/40 text-center p-1"
                >
                  <Wind className="w-5 h-5 sm:w-7 sm:h-7 text-[#3BB1FF]" />
                  <span className="text-[7px] sm:text-[8px] font-mono font-black text-[#CCFF00] uppercase mt-0.5">
                    PACER LIVE
                  </span>
                </motion.div>
              </div>
            )}

            {activeTab === "chess" && (
              <div className="relative flex items-center justify-center w-20 h-20 sm:w-28 sm:h-28">
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.9, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-2xl border border-[#CCFF00]/40"
                />
                <div className="w-16 h-16 sm:w-22 sm:h-22 rounded-xl bg-[#CCFF00]/10 flex flex-col items-center justify-center border border-[#CCFF00]/30 text-center p-1">
                  <Swords className="w-5 h-5 sm:w-7 sm:h-7 text-[#CCFF00]" />
                  <span className="text-[7px] sm:text-[8px] font-mono font-black text-[#CCFF00] uppercase mt-0.5">
                    TACTICS
                  </span>
                </div>
              </div>
            )}

            {activeTab === "visual" && (
              <div className="relative flex items-center justify-center w-20 h-20 sm:w-28 sm:h-28">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-1 rounded-full border border-dashed border-[#9D4EDD]"
                />
                <motion.div
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-16 h-16 sm:w-22 sm:h-22 rounded-full bg-[#9D4EDD]/15 flex flex-col items-center justify-center border border-[#9D4EDD]/40 text-center p-1"
                >
                  <Eye className="w-5 h-5 sm:w-7 sm:h-7 text-[#9D4EDD]" />
                  <span className="text-[7px] sm:text-[8px] font-mono font-black text-[#9D4EDD] uppercase mt-0.5">
                    10 Hz ALPHA
                  </span>
                </motion.div>
              </div>
            )}

            {activeTab === "affirmations" && (
              <div className="relative flex items-center justify-center w-20 h-20 sm:w-28 sm:h-28">
                <motion.div
                  animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.85, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full border border-[#FF4081]/50"
                />
                <div className="w-16 h-16 sm:w-22 sm:h-22 rounded-full bg-[#FF4081]/15 flex flex-col items-center justify-center border border-[#FF4081]/40 text-center p-1">
                  <Heart className="w-5 h-5 sm:w-7 sm:h-7 text-[#FF4081]" />
                  <span className="text-[7px] sm:text-[8px] font-mono font-black text-[#FF4081] uppercase mt-0.5">
                    COHERENCE
                  </span>
                </div>
              </div>
            )}

            {activeTab === "mood" && (
              <div className="relative flex items-center justify-center w-20 h-20 sm:w-28 sm:h-28">
                <motion.div
                  animate={{ scale: [0.9, 1.2, 0.9], rotate: [0, 90, 180, 270, 360] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-2xl border border-[#00E676]/40"
                />
                <div className="w-16 h-16 sm:w-22 sm:h-22 rounded-xl bg-[#00E676]/10 flex flex-col items-center justify-center border border-[#00E676]/30 text-center p-1">
                  <Smile className="w-5 h-5 sm:w-7 sm:h-7 text-[#00E676]" />
                  <span className="text-[7px] sm:text-[8px] font-mono font-black text-[#00E676] uppercase mt-0.5">
                    TELEMETRY
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs - Native Horizontal Scroll Strip */}
      <div id="active-relief-game" className="flex overflow-x-auto no-scrollbar gap-1.5 pb-1">
        <button 
          onClick={() => setActiveTab("breathing")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition shrink-0 text-[10px] font-black uppercase tracking-wider active:scale-95 border ${
            activeTab === "breathing" 
              ? "bg-[#CCFF00] text-black border-[#CCFF00] shadow-sm" 
              : "bg-zinc-900 text-zinc-400 border-white/10 hover:text-white"
          }`}
        >
          <Wind className="w-3.5 h-3.5" />
          <span>Breathing</span>
        </button>
        <button 
          onClick={() => setActiveTab("chess")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition shrink-0 text-[10px] font-black uppercase tracking-wider active:scale-95 border ${
            activeTab === "chess" 
              ? "bg-[#CCFF00] text-black border-[#CCFF00] shadow-sm" 
              : "bg-zinc-900 text-zinc-400 border-white/10 hover:text-white"
          }`}
        >
          <Swords className="w-3.5 h-3.5" />
          <span>Mind Chess</span>
        </button>
        <button 
          onClick={() => setActiveTab("visual")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition shrink-0 text-[10px] font-black uppercase tracking-wider active:scale-95 border ${
            activeTab === "visual" 
              ? "bg-[#CCFF00] text-black border-[#CCFF00] shadow-sm" 
              : "bg-zinc-900 text-zinc-400 border-white/10 hover:text-white"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Visual</span>
        </button>
        <button 
          onClick={() => setActiveTab("affirmations")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition shrink-0 text-[10px] font-black uppercase tracking-wider active:scale-95 border ${
            activeTab === "affirmations" 
              ? "bg-[#CCFF00] text-black border-[#CCFF00] shadow-sm" 
              : "bg-zinc-900 text-zinc-400 border-white/10 hover:text-white"
          }`}
        >
          <Quote className="w-3.5 h-3.5" />
          <span>Affirm</span>
        </button>
        <button 
          onClick={() => setActiveTab("mood")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition shrink-0 text-[10px] font-black uppercase tracking-wider active:scale-95 border ${
            activeTab === "mood" 
              ? "bg-[#CCFF00] text-black border-[#CCFF00] shadow-sm" 
              : "bg-zinc-900 text-zinc-400 border-white/10 hover:text-white"
          }`}
        >
          <Smile className="w-3.5 h-3.5" />
          <span>Mood</span>
        </button>
      </div>

      {/* Target Container for active mental relief game */}
      <div id="active-relief-game" className="scroll-mt-4">
        {/* 1. Box Breathing - ANIMATED IMMEDIATELY UPON SELECTION */}
        {activeTab === "breathing" && (
          <BreathingExercise />
        )}

        {/* 2. Mind Chess */}
        {activeTab === "chess" && (
          <MindChess />
        )}

        {/* 3. Visual Meditation - ANIMATED IMMEDIATELY UPON SELECTION */}
        {activeTab === "visual" && (
          <VisualFocusExercise />
        )}

        {/* 5. Affirmations */}
        {activeTab === "affirmations" && (
          <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 text-center shadow-2xl space-y-6 relative overflow-hidden">
            {/* Animated Heart Coherence Background Waves */}
            <motion.div
              animate={{ scale: [1, 1.35, 1], opacity: [0.15, 0.45, 0.15] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(255, 64, 129, 0.35) 0%, transparent 70%)",
              }}
            />

            <div className="relative z-10 flex flex-col items-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="w-14 h-14 rounded-2xl bg-[#FF4081]/15 border border-[#FF4081]/30 flex items-center justify-center text-[#FF4081] mb-2 shadow-[0_0_20px_rgba(255,64,129,0.3)]"
              >
                <Heart className="w-7 h-7 fill-[#FF4081]/20 text-[#FF4081]" />
              </motion.div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF4081]">
                Heart-Rate Coherence Anchor
              </span>
            </div>

            <div className="bg-black/90 border border-white/15 p-6 sm:p-8 rounded-2xl relative overflow-hidden z-10 shadow-inner">
              <Quote className="w-6 h-6 text-white/10 absolute top-4 left-4" />
              <AnimatePresence mode="wait">
                <motion.p
                  key={affirmationAnimKey}
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.96 }}
                  transition={{ duration: 0.35 }}
                  className="text-base sm:text-lg font-black uppercase tracking-tight text-white relative z-10 leading-relaxed"
                >
                  "{currentAffirmation}"
                </motion.p>
              </AnimatePresence>

              {/* Sparkle micro-animations */}
              <motion.div
                animate={{ opacity: [0.2, 1, 0.2], rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-8 -right-8 w-24 h-24 border border-dashed border-[#FF4081]/20 rounded-full pointer-events-none"
              />
            </div>

            <button 
              onClick={showRandomAffirmation}
              className="w-full bg-[#FF4081] hover:bg-[#ff2671] text-white py-3 text-xs font-black uppercase tracking-wider rounded-xl active:scale-95 transition-all shadow-[0_0_20px_rgba(255,64,129,0.3)] relative z-10 flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              Draw Next Affirmation
            </button>
          </div>
        )}

        {/* 6. Mood Tracker */}
        {activeTab === "mood" && (
          <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 text-center shadow-2xl space-y-6 relative overflow-hidden">
            {/* Animated Biometric Pulse Ripple Background */}
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(0, 230, 118, 0.3) 0%, transparent 70%)",
              }}
            />

            <div className="relative z-10 flex flex-col items-center">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-14 h-14 rounded-2xl bg-[#00E676]/15 border border-[#00E676]/30 flex items-center justify-center text-[#00E676] mb-2 shadow-[0_0_20px_rgba(0,230,118,0.3)]"
              >
                <Smile className="w-7 h-7 text-[#00E676]" />
              </motion.div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#00E676]">
                Real-time Affective Telemetry
              </span>
            </div>

            {!moodSubmitted ? (
              <div className="space-y-6 relative z-10">
                <p className="text-sm text-zinc-300 font-medium">
                  How is your psychological readiness before/after training?
                </p>

                <div className="flex justify-center gap-2 sm:gap-4">
                  {[
                    { val: 1, emoji: "😫", label: "Depleted" },
                    { val: 2, emoji: "😕", label: "Tense" },
                    { val: 3, emoji: "😐", label: "Neutral" },
                    { val: 4, emoji: "🙂", label: "Focused" },
                    { val: 5, emoji: "⚡", label: "Flow State" }
                  ].map((m) => (
                    <button
                      key={m.val}
                      onClick={() => setMood(m.val)}
                      className={`flex flex-col items-center p-3 rounded-2xl border transition-all active:scale-95 ${
                        mood === m.val
                          ? "bg-[#00E676]/20 border-[#00E676] scale-105 shadow-[0_0_15px_rgba(0,230,118,0.3)]"
                          : "bg-black/50 border-white/10 hover:border-white/30"
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl mb-1">{m.emoji}</span>
                      <span className="text-[9px] font-black uppercase text-zinc-400">{m.label}</span>
                    </button>
                  ))}
                </div>

                <button
                  disabled={mood === null}
                  onClick={() => setMoodSubmitted(true)}
                  className="w-full bg-[#00E676] disabled:opacity-40 hover:bg-[#00c853] text-black py-3 text-xs font-black uppercase tracking-wider rounded-xl active:scale-95 transition-all shadow-[0_0_20px_rgba(0,230,118,0.3)] flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  Log Readiness State
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4 py-4 relative z-10"
              >
                <div className="w-12 h-12 rounded-full bg-[#00E676]/20 border border-[#00E676]/40 flex items-center justify-center text-[#00E676] mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black uppercase text-white tracking-tight">
                  State Telemetry Logged
                </h3>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  Cortisol baseline recorded. Session adjusted for optimal neural adaptation and neuromuscular recovery.
                </p>
                <button
                  onClick={() => {
                    setMoodSubmitted(false);
                    setMood(null);
                  }}
                  className="px-4 py-2 bg-zinc-900 border border-white/15 text-zinc-300 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition"
                >
                  Log Another Entry
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
