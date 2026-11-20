import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Sun, 
  Wind, 
  Moon, 
  Volume2, 
  Play, 
  Pause, 
  RotateCcw, 
  Flame, 
  CheckCircle, 
  ChevronRight, 
  Layers, 
  BookOpen, 
  Bookmark, 
  Trash2, 
  Loader2,
  Image as ImageIcon,
  Eye,
  Maximize2,
  Compass,
  Heart,
  ShieldCheck,
  X,
  Camera
} from "lucide-react";
import { YogaVisionAI } from "../components/YogaVisionAI";
import { useAuth } from "../context/AuthContext";
import { 
  AAROGYA_DISCIPLINES, 
  CLASSICAL_ASANAS, 
  PRANAYAMA_PRACTICES, 
  CHAKRA_SYSTEM, 
  SURYA_NAMASKAR_STEPS, 
  VEDIC_PHILOSOPHY_QUOTES,
  YOGA_ARTS_COLLECTION,
  getYogaArtThemeImage,
  playSingingBowlChime,
  AsanaItem,
  PranayamaPractice,
  ChakraNode,
  YogaArtPiece,
  YogaDiscipline
} from "../lib/aarogyaYogaData";
import { APP_IMAGES } from "../lib/appImages";
import { 
  IndianCulturalBackground, 
  IndianAmbianceController, 
  IndianBgTheme, 
  BgIntensity 
} from "../components/IndianCulturalBackground";

export function Aarogya() {
  const { user } = useAuth();
  // Authentic Indian Cultural Background & Ambiance Controls
  const [bgTheme, setBgTheme] = useState<IndianBgTheme>("sri-yantra");
  const [bgIntensity, setBgIntensity] = useState<BgIntensity>("balanced");
  const [showDiyas, setShowDiyas] = useState<boolean>(true);
  const [showLattice, setShowLattice] = useState<boolean>(true);

  const [activeTab, setActiveTab] = useState<"surya" | "asanas" | "pranayama" | "chakras" | "yogavision">("surya");
  const [selectedAsana, setSelectedAsana] = useState<AsanaItem | null>(null);
  const [selectedArtPiece, setSelectedArtPiece] = useState<YogaArtPiece | null>(null);
  const [isTratakaMode, setIsTratakaMode] = useState(false);
  const [activeSuryaStep, setActiveSuryaStep] = useState(0);
  const [activePranayama, setActivePranayama] = useState<PranayamaPractice>(PRANAYAMA_PRACTICES[0]);
  const [isPranayamaRunning, setIsPranayamaRunning] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"Inhale" | "Hold" | "Exhale" | "Hold Empty">("Inhale");
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);
  const [completedBreathCycles, setCompletedBreathCycles] = useState(0);
  const [selectedChakra, setSelectedChakra] = useState<ChakraNode>(CHAKRA_SYSTEM[3]);
  const [asanaDifficultyFilter, setAsanaDifficultyFilter] = useState<string>("all");

  // Pranayama Live Pacer Timer Engine
  useEffect(() => {
    let timer: any;
    if (isPranayamaRunning) {
      timer = setInterval(() => {
        setPhaseSecondsLeft(prev => {
          if (prev > 1) return prev - 1;

          // Transition to next breath phase based on ratio
          if (breathPhase === "Inhale") {
            if (activePranayama.holdSec > 0) {
              setBreathPhase("Hold");
              return activePranayama.holdSec;
            } else {
              setBreathPhase("Exhale");
              return activePranayama.exhaleSec;
            }
          } else if (breathPhase === "Hold") {
            setBreathPhase("Exhale");
            return activePranayama.exhaleSec;
          } else if (breathPhase === "Exhale") {
            if (activePranayama.holdEmptySec > 0) {
              setBreathPhase("Hold Empty");
              return activePranayama.holdEmptySec;
            } else {
              setCompletedBreathCycles(c => c + 1);
              setBreathPhase("Inhale");
              playSingingBowlChime(432, 2.0);
              return activePranayama.inhaleSec;
            }
          } else {
            // After Hold Empty
            setCompletedBreathCycles(c => c + 1);
            setBreathPhase("Inhale");
            playSingingBowlChime(432, 2.0);
            return activePranayama.inhaleSec;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPranayamaRunning, breathPhase, activePranayama]);

  const handleStartPranayama = (practice: PranayamaPractice) => {
    setActivePranayama(practice);
    setBreathPhase("Inhale");
    setPhaseSecondsLeft(practice.inhaleSec);
    setCompletedBreathCycles(0);
    setIsPranayamaRunning(true);
    playSingingBowlChime(432, 2.5);
  };

  const filteredAsanas = CLASSICAL_ASANAS.filter(a => {
    if (asanaDifficultyFilter === "all") return true;
    if (asanaDifficultyFilter === "beginner") return a.difficulty.includes("Beginner");
    if (asanaDifficultyFilter === "intermediate") return a.difficulty.includes("Intermediate");
    if (asanaDifficultyFilter === "advanced") return a.difficulty.includes("Advanced");
    return true;
  });

  return (
    <div className="relative min-h-screen pb-16 select-auto">
      {/* 1. Immersive Indian Cultural Sacred Background Layer */}
      <IndianCulturalBackground
        currentTheme={bgTheme}
        intensity={bgIntensity}
        showDiyas={showDiyas}
        showLattice={showLattice}
      />

      <div className="relative z-10 space-y-8">
        {/* 2. Indian Ambiance & Sacred Atmosphere Controller */}
        <IndianAmbianceController
          currentTheme={bgTheme}
          intensity={bgIntensity}
          showDiyas={showDiyas}
          showLattice={showLattice}
          onThemeChange={setBgTheme}
          onIntensityChange={setBgIntensity}
          onToggleDiyas={() => setShowDiyas(prev => !prev)}
          onToggleLattice={() => setShowLattice(prev => !prev)}
        />

        {/* 3. Sacred Indian Vedic Hero Header with Temple Arch & Saffron Aura */}
        <div className="relative overflow-hidden rounded-3xl border border-[#FF9933]/40 bg-gradient-to-br from-[#120a04]/90 via-black/95 to-[#1c0f06]/90 p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          {/* Traditional Temple Jali & Marigold Border along top edge */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-80" />
          
          {/* Subtle Rotating Sri Yantra in Hero Background */}
          <div className="absolute top-1/2 -right-16 -translate-y-1/2 w-96 h-96 opacity-15 pointer-events-none overflow-hidden">
            <img 
              src={APP_IMAGES.sriYantraMandalaBg} 
              alt="Sacred Sri Yantra" 
              className="w-full h-full object-cover filter blur-[0.5px]" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/80 to-[#120a04]" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF9933]/20 border border-[#FF9933]/50 text-[#FFD700] text-[10px] font-mono font-black uppercase tracking-widest shadow">
                  <Sun className="w-3.5 h-3.5 text-[#FF9933]" />
                  आरोग्य • Classical Indian Yoga & Dhyana
                </span>
                <span className="text-[10px] font-mono text-[#FF9933] border border-[#FF9933]/30 px-2 py-0.5 rounded-full bg-black/70">
                  ॐ धन्वन्तरये नमः • Patanjali Heritage
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white flex items-center gap-3">
                Aarogya <span className="text-[#FF9933] text-2xl sm:text-3xl font-serif">आरोग्य</span>
              </h1>

              <p className="text-sm text-zinc-300 font-medium leading-relaxed">
                Explore the profound science of Indian Yoga: sacred <span className="text-[#FF9933] font-bold">Surya Namaskar</span>, classical <span className="text-[#FF9933] font-bold">Asanas</span>, vital <span className="text-[#FF9933] font-bold">Pranayama</span> breathwork, <span className="text-[#FF9933] font-bold">7 Kundalini Chakras</span>, and authentic <span className="text-[#FF9933] font-bold">Vedic Sacred Art</span> for every posture.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => playSingingBowlChime(432, 4)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-[#FF9933]/40 text-xs font-mono font-bold text-[#FFD700] transition active:scale-95 shadow"
                  title="Play 432Hz Sacred Singing Bowl Chime"
                >
                  <Volume2 className="w-4 h-4 text-[#FFD700]" />
                  Temple Chime (432Hz)
                </button>
                <button
                  onClick={() => setActiveTab("yogavision")}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FF9933]/20 hover:bg-[#FF9933]/30 border border-[#FF9933]/50 text-xs font-mono font-black text-[#FFD700] transition active:scale-95 shadow"
                  title="Launch Aarogya YogaVision AI Live Camera Instructor"
                >
                  <Camera className="w-4 h-4 text-[#FF9933]" />
                  YogaVision AI Camera
                </button>
                <div className="text-[11px] font-serif italic text-zinc-400">
                  "योगश्चित्तवृत्तिनिरोधः" — Yoga is the intentional stilling of mental turbulence.
                </div>
              </div>
            </div>

            {/* Majestic Hero Yoga Artwork Frame with Indian Heritage Border */}
            <div 
              onClick={() => {
                setSelectedArtPiece(YOGA_ARTS_COLLECTION[0]);
              }}
              className="shrink-0 w-full sm:w-72 md:w-80 rounded-2xl overflow-hidden border-2 border-[#FF9933]/50 shadow-[0_0_35px_rgba(255,153,51,0.25)] relative aspect-[16/10] cursor-pointer group"
            >
              <img 
                src={APP_IMAGES.aarogyaSuryaNamaskarArt} 
                alt="Surya Namaskar Dawn Ganges Art" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-[#FF9933]/40 text-[9px] font-mono text-[#FFD700] flex items-center gap-1">
                <Maximize2 className="w-2.5 h-2.5" /> Enlarge Art
              </div>
              <div className="absolute bottom-2 left-3 right-3 text-left">
                <span className="text-[8px] font-mono text-[#FFD700] uppercase tracking-widest font-bold">Vedic Masterwork</span>
                <p className="text-xs font-black text-white uppercase tracking-tight">Dawn Ganga Surya Sadhana</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tradition Tabs with Indian Saffron Glow */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 border-b border-[#FF9933]/20 pb-2">
          {[
            { id: "surya", label: "Surya Namaskar (सूर्यनमस्कार)", icon: Sun },
            { id: "asanas", label: "Classical Asanas (आसन)", icon: Layers },
            { id: "pranayama", label: "Pranayama (प्राणायाम)", icon: Wind },
            { id: "chakras", label: "7 Chakras (कुण्डलिनी)", icon: Flame },
            { id: "yogavision", label: "YogaVision AI (कैमरा योग दर्शन)", icon: Camera },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all border ${
                  isActive 
                    ? "bg-[#FF9933] text-black border-[#FF9933] shadow-[0_0_20px_rgba(255,153,51,0.35)]" 
                    : "bg-zinc-950/80 text-zinc-300 hover:text-[#FFD700] hover:bg-zinc-900 border-[#FF9933]/20"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

      {/* ========================================================================= */}
      {/* TAB: YOGAVISION AI (REAL-TIME CAMERA VIRTUAL YOGA INSTRUCTOR)             */}
      {/* ========================================================================= */}
      {activeTab === "yogavision" && (
        <YogaVisionAI />
      )}

      {/* ========================================================================= */}
      {/* TAB 1: SURYA NAMASKAR (12 SUN SALUTATION STEPS WITH MANTRAS & CHAKRAS)    */}
      {/* ========================================================================= */}
      {activeTab === "surya" && (
        <div className="space-y-6">
          <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#FF9933] font-bold uppercase">
                  <span>Classical 12-Fold Sun Salutation</span>
                  <span>•</span>
                  <span>सूर्यनमस्कार मन्त्र साधना</span>
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                  Surya Namaskar: The Awakening of Solar Prana
                </h2>
                <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                  Each of the 12 sacred postures carries an ancient solar mantra honoring a cosmic facet of the Sun (Surya, Aditya, Mitra, Ravi, Savitr) with precise synchronization of respiratory breath and spinal articulation.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveSuryaStep(prev => (prev > 0 ? prev - 1 : SURYA_NAMASKAR_STEPS.length - 1))}
                  className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 hover:text-white"
                >
                  Previous
                </button>
                <span className="text-xs font-mono font-black text-[#FF9933]">
                  Step {activeSuryaStep + 1} of 12
                </span>
                <button
                  onClick={() => setActiveSuryaStep(prev => (prev < SURYA_NAMASKAR_STEPS.length - 1 ? prev + 1 : 0))}
                  className="px-4 py-2 rounded-xl bg-[#FF9933] text-black text-xs font-black uppercase hover:bg-[#ffaa4d]"
                >
                  Next Step
                </button>
              </div>
            </div>

            {/* Active Step Showcase Card with Exact Pose Artwork */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-black/60 border border-[#FF9933]/30 rounded-2xl p-5 sm:p-6 items-center">
              <div className="md:col-span-5 rounded-xl overflow-hidden aspect-[16/10] border border-white/10 relative">
                <img 
                  src={(SURYA_NAMASKAR_STEPS[activeSuryaStep] as any).artImage || getYogaArtThemeImage(SURYA_NAMASKAR_STEPS[activeSuryaStep].artTheme)} 
                  alt={SURYA_NAMASKAR_STEPS[activeSuryaStep].english} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-[#FF9933]/40 text-[9px] font-mono font-bold text-[#FF9933]">
                  STEP {SURYA_NAMASKAR_STEPS[activeSuryaStep].step}
                </div>
                <div className="absolute bottom-2 left-3 right-3">
                  <span className="text-[10px] font-mono text-[#FFD700] uppercase font-bold">Chakra Focus:</span>
                  <p className="text-xs font-bold text-white">{SURYA_NAMASKAR_STEPS[activeSuryaStep].chakra}</p>
                </div>
              </div>

              <div className="md:col-span-7 space-y-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF9933] font-bold">
                    Sacred Solar Mantra:
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-black text-[#FFD700] tracking-tight">
                    {SURYA_NAMASKAR_STEPS[activeSuryaStep].mantra}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[9px] font-mono uppercase text-zinc-400">Sanskrit Asana:</span>
                    <p className="text-sm font-black text-white">{SURYA_NAMASKAR_STEPS[activeSuryaStep].sanskrit}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[9px] font-mono uppercase text-zinc-400">English Equivalent:</span>
                    <p className="text-sm font-black text-zinc-200">{SURYA_NAMASKAR_STEPS[activeSuryaStep].english}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FF9933]/10 border border-[#FF9933]/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-[#FF9933]" />
                    <span className="text-xs font-mono font-bold text-white">Breath Instruction:</span>
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#FF9933]">
                    {SURYA_NAMASKAR_STEPS[activeSuryaStep].breath}
                  </span>
                </div>
              </div>
            </div>

            {/* 12 Steps Mini Rail with Exact Pose Thumbnails */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {SURYA_NAMASKAR_STEPS.map((s, idx) => (
                <button
                  key={s.step}
                  onClick={() => setActiveSuryaStep(idx)}
                  className={`p-2 rounded-xl text-left border transition-all flex items-center gap-2.5 ${
                    activeSuryaStep === idx 
                      ? "bg-[#FF9933]/20 border-[#FF9933] text-white shadow-md shadow-[#FF9933]/15" 
                      : "bg-black/50 border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-white/15 bg-black">
                    <img 
                      src={(s as any).artImage} 
                      alt={s.english} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[9px] font-mono font-bold text-[#FF9933]">#{s.step}</div>
                    <div className="text-[11px] font-bold truncate leading-tight">{s.english}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CLASSICAL ASANAS (DETAILED POSTURES WITH ART FOR EVERY ASANA)       */}
      {/* ========================================================================= */}
      {activeTab === "asanas" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                Classical Asana Sadhana (आसन साधना)
              </h2>
              <p className="text-xs font-mono text-zinc-400">
                Patanjali Yoga Sutra 2.46: "स्थिरसुखमासनम्" — Posture is unshakeably steady and comfortable.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-white/10">
              {[
                { id: "all", label: "All Levels" },
                { id: "beginner", label: "Beginner" },
                { id: "intermediate", label: "Intermediate" },
                { id: "advanced", label: "Advanced" }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setAsanaDifficultyFilter(f.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    asanaDifficultyFilter === f.id
                      ? "bg-[#FF9933] text-black"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAsanas.map(asana => (
              <div 
                key={asana.id}
                className="bg-zinc-950 border border-white/10 hover:border-[#FF9933]/50 rounded-2xl overflow-hidden flex flex-col justify-between transition-all group shadow-xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-black">
                  <img 
                    src={asana.artImage} 
                    alt={asana.englishName} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                  
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-[#FF9933]/40 text-[9px] font-mono font-bold text-[#FF9933]">
                      {asana.difficulty}
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-white/10 text-[9px] font-mono text-zinc-300">
                      {asana.duration}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[10px] font-serif font-black text-[#FFD700] tracking-wide block">
                      {asana.sanskritName}
                    </span>
                    <h3 className="text-base font-black text-white uppercase tracking-tight">
                      {asana.englishName}
                    </h3>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#FF9933]">
                      <Flame className="w-3 h-3" />
                      <span>Chakra: {asana.chakra}</span>
                    </div>

                    <p className="text-[11px] text-zinc-400 italic">
                      "{asana.artDescription}"
                    </p>

                    <div className="space-y-1 pt-1">
                      <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">Key Benefits:</span>
                      <ul className="space-y-1">
                        {asana.benefits.slice(0, 2).map((b, i) => (
                          <li key={i} className="text-xs text-zinc-300 flex items-start gap-1.5">
                            <span className="text-[#FF9933]">•</span> {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedAsana(asana)}
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-[#FF9933] hover:text-black border border-white/15 text-xs font-black uppercase tracking-wider text-zinc-200 transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    View Alignment Cues & Mantras <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Asana Modal */}
      <AnimatePresence>
        {selectedAsana && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950 border border-[#FF9933]/40 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl relative"
            >
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-white/10">
                <img 
                  src={selectedAsana.artImage} 
                  alt={selectedAsana.englishName} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-xs font-serif font-black text-[#FFD700] tracking-wide block">
                    {selectedAsana.sanskritName}
                  </span>
                  <h3 className="text-xl font-black uppercase text-white tracking-tight">
                    {selectedAsana.englishName}
                  </h3>
                </div>
              </div>

              {selectedAsana.mantra && (
                <div className="p-3 rounded-xl bg-[#FF9933]/10 border border-[#FF9933]/30 text-center">
                  <span className="text-[9px] font-mono uppercase text-[#FF9933] block mb-0.5">Sanskrit Invocation Mantra</span>
                  <p className="text-sm font-serif font-black text-[#FFD700]">{selectedAsana.mantra}</p>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase text-[#FF9933] mb-1.5">Mastery Alignment Cues:</h4>
                  <ul className="space-y-1.5">
                    {selectedAsana.cues.map((c, i) => (
                      <li key={i} className="text-xs text-zinc-300 flex items-start gap-2 bg-white/5 p-2 rounded-lg">
                        <CheckCircle className="w-3.5 h-3.5 text-[#FF9933] shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-mono font-bold uppercase text-[#FF9933] mb-1.5">Full Anatomical & Pranic Benefits:</h4>
                  <ul className="space-y-1">
                    {selectedAsana.benefits.map((b, i) => (
                      <li key={i} className="text-xs text-zinc-300 flex items-start gap-1.5">
                        <span className="text-[#FF9933] font-bold">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-xs text-red-300">
                  <span className="font-bold uppercase text-[9px] font-mono block">Contraindications:</span>
                  {selectedAsana.contraindications}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedAsana(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#FF9933] text-black font-black uppercase text-xs hover:bg-[#ffaa4d]"
                >
                  Close Sadhana Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* TAB 3: PRANAYAMA (INTERACTIVE LIFE-FORCE BREATH PACER)                    */}
      {/* ========================================================================= */}
      {activeTab === "pranayama" && (
        <div className="space-y-6">
          <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <div className="max-w-2xl space-y-2 mb-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF9933] font-bold">
                स्वर योग एवं प्राणायाम • Prana Life-Force Synchronization
              </span>
              <h2 className="text-2xl font-black uppercase text-white tracking-tight">
                Pranayama Breath Mastery Sanctuary
              </h2>
              <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                Hatha Yoga Pradipika 2.2: "चले वाते चलं चित्तं निश्चले निश्चलं भवेत्" — When the breath wavers, the mind wavers. Select an authentic Indian breath practice to engage the sacred visual pacer.
              </p>
            </div>

            {/* Active Pranayama Breathing Sphere Pacer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-black/60 border border-[#FF9933]/30 rounded-3xl p-6 sm:p-8">
              <div className="lg:col-span-5 flex flex-col items-center justify-center text-center space-y-5">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
                  {/* Outer Pulsing Glow Aura */}
                  <motion.div
                    animate={{
                      scale: breathPhase === "Inhale" ? [1, 1.4] : breathPhase === "Hold" ? 1.4 : breathPhase === "Exhale" ? [1.4, 1] : 1,
                      opacity: breathPhase === "Hold" ? [0.6, 0.9, 0.6] : 0.5
                    }}
                    transition={{
                      duration: breathPhase === "Inhale" ? activePranayama.inhaleSec : breathPhase === "Exhale" ? activePranayama.exhaleSec : 2,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF9933]/30 via-[#FFD700]/30 to-[#FF9933]/30 blur-2xl pointer-events-none"
                  />

                  {/* Inner Sacred Sphere */}
                  <motion.div
                    animate={{
                      scale: breathPhase === "Inhale" ? [1, 1.3] : breathPhase === "Hold" ? 1.3 : breathPhase === "Exhale" ? [1.3, 1] : 1,
                    }}
                    transition={{
                      duration: breathPhase === "Inhale" ? activePranayama.inhaleSec : breathPhase === "Exhale" ? activePranayama.exhaleSec : 1,
                      ease: "easeInOut"
                    }}
                    className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-[#FF9933] bg-gradient-to-b from-[#FF9933]/20 via-black to-[#FFD700]/10 flex flex-col items-center justify-center shadow-[0_0_35px_rgba(255,153,51,0.35)] relative overflow-hidden"
                  >
                    <Wind className="w-6 h-6 text-[#FF9933] mb-1 animate-pulse" />
                    <span className="text-sm font-black uppercase tracking-wider text-white">
                      {breathPhase}
                    </span>
                    <span className="text-2xl font-mono font-black text-[#FFD700]">
                      {phaseSecondsLeft}s
                    </span>
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono text-zinc-400">
                    Completed Cycles: <strong className="text-[#FF9933]">{completedBreathCycles}</strong>
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPranayamaRunning(!isPranayamaRunning)}
                      className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition active:scale-95 flex items-center gap-2 ${
                        isPranayamaRunning 
                          ? "bg-zinc-800 text-white border border-white/20" 
                          : "bg-[#FF9933] text-black shadow-[0_0_20px_rgba(255,153,51,0.3)]"
                      }`}
                    >
                      {isPranayamaRunning ? <><Pause className="w-4 h-4" /> Pause Pacer</> : <><Play className="w-4 h-4 fill-black" /> Begin Breathwork</>}
                    </button>
                    <button
                      onClick={() => {
                        setIsPranayamaRunning(false);
                        setCompletedBreathCycles(0);
                        setBreathPhase("Inhale");
                        setPhaseSecondsLeft(activePranayama.inhaleSec);
                      }}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white"
                      title="Reset Pacer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Practice Details */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono text-[#FF9933] uppercase font-bold tracking-widest">
                      Ratio (Inhale:Hold:Exhale:Hold Empty): {activePranayama.ratio}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                      {activePranayama.name}
                    </h3>
                    <p className="text-xs font-serif text-[#FFD700] mt-0.5">{activePranayama.sanskrit}</p>
                  </div>
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 shrink-0">
                    <img 
                      src={activePranayama.artImage} 
                      alt={activePranayama.name} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="font-mono text-[9px] uppercase text-zinc-400 font-bold block mb-1">Authentic Vedic Technique:</span>
                    <p className="text-zinc-200 leading-relaxed font-medium">{activePranayama.technique}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="font-mono text-[9px] uppercase text-zinc-400 font-bold block mb-1">Pranic & Autonomic Benefits:</span>
                    <p className="text-zinc-300 leading-relaxed font-medium">{activePranayama.benefits}</p>
                  </div>

                  <div className="flex items-center gap-2 text-zinc-400 text-[11px] font-mono pt-1">
                    <span className="text-[#FF9933] font-bold">Optimal Sadhana Time:</span> {activePranayama.bestTime}
                  </div>
                </div>
              </div>
            </div>

            {/* Pranayama Selection Cards */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PRANAYAMA_PRACTICES.map(p => (
                <div
                  key={p.id}
                  onClick={() => handleStartPranayama(p)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    activePranayama.id === p.id 
                      ? "bg-[#FF9933]/15 border-[#FF9933] shadow-[0_0_15px_rgba(255,153,51,0.2)]" 
                      : "bg-black/40 border-white/10 hover:border-white/20 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#FF9933]">{p.ratio}</span>
                      <h4 className="text-sm font-black text-white uppercase">{p.name}</h4>
                      <p className="text-[10px] font-serif text-zinc-400">{p.sanskrit}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10">
                      <img src={p.artImage} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2">{p.benefits}</p>
                  <button className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF9933] flex items-center gap-1">
                    Select & Tune Inhale <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: 7 CHAKRAS (KUNDALINI SUBTLE ENERGY ANATOMY)                         */}
      {/* ========================================================================= */}
      {activeTab === "chakras" && (
        <div className="space-y-6">
          <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <div className="max-w-2xl space-y-2 mb-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF9933] font-bold">
                सप्त चक्र एवं कुण्डलिनी • Subtle Spinal Energy Vortices
              </span>
              <h2 className="text-2xl font-black uppercase text-white tracking-tight">
                The 7 Sacred Chakras of Vedic Anatomy
              </h2>
              <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                The Sushumna central channel hosts seven cosmic vortex centers of spiritual prana. Harmonizing these chakras through Bija seed mantras and visualization elevates consciousness from earth survival to universal liberation (Moksha).
              </p>
            </div>

            {/* Chakra Spine Navigator */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Chakra Nodes List */}
              <div className="lg:col-span-5 space-y-2">
                {[...CHAKRA_SYSTEM].reverse().map(chakra => {
                  const isSelected = selectedChakra.number === chakra.number;
                  return (
                    <button
                      key={chakra.number}
                      onClick={() => {
                        setSelectedChakra(chakra);
                        playSingingBowlChime(260 + chakra.number * 45, 2.5);
                      }}
                      className={`w-full p-3.5 rounded-xl text-left border transition-all flex items-center justify-between gap-3 ${
                        isSelected 
                          ? "bg-white/10 border-[#FF9933] shadow-[0_0_15px_rgba(255,153,51,0.25)]" 
                          : "bg-black/50 border-white/10 hover:border-white/20 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span 
                          className="w-7 h-7 rounded-full flex items-center justify-center font-mono font-black text-xs text-white shadow-md"
                          style={{ backgroundColor: chakra.glowHex }}
                        >
                          {chakra.number}
                        </span>
                        <div>
                          <h4 className="text-xs font-black uppercase text-white tracking-wide">
                            {chakra.name}
                          </h4>
                          <span className="text-[10px] font-serif text-zinc-400">
                            {chakra.sanskrit} • Bija: <strong className="text-[#FFD700]">{chakra.seedMantra}</strong>
                          </span>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition ${isSelected ? "text-[#FF9933] translate-x-1" : "text-zinc-600"}`} />
                    </button>
                  );
                })}
              </div>

              {/* Selected Chakra Detail Showcase */}
              <div className="lg:col-span-7 bg-black/60 border border-white/10 rounded-2xl p-6 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span 
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-white uppercase"
                        style={{ backgroundColor: selectedChakra.glowHex }}
                      >
                        Chakra {selectedChakra.number} • {selectedChakra.petals} Petals
                      </span>
                      <span className="text-xs font-mono text-zinc-400">
                        Element: <strong className="text-white">{selectedChakra.element}</strong>
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mt-1">
                      {selectedChakra.name}
                    </h3>
                    <p className="text-xs font-serif text-[#FFD700]">{selectedChakra.sanskrit}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] font-mono uppercase text-zinc-400 block">Seed Mantra:</span>
                    <span className="text-lg font-serif font-black text-[#FFD700]">{selectedChakra.seedMantra}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[9px] font-mono uppercase text-zinc-400">Location:</span>
                    <p className="text-xs font-bold text-white mt-0.5">{selectedChakra.location}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[9px] font-mono uppercase text-zinc-400">Core Attribute:</span>
                    <p className="text-xs font-bold text-white mt-0.5">{selectedChakra.attribute}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-green-950/20 border border-green-500/30 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-green-400 font-bold block">
                    Balanced Resonance State:
                  </span>
                  <p className="text-xs text-zinc-200 leading-relaxed font-medium">
                    {selectedChakra.balanceBenefit}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                    Signs of Blockage or Imbalance:
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                    {selectedChakra.imbalanceSign}
                  </p>
                </div>

                <button
                  onClick={() => playSingingBowlChime(250 + selectedChakra.number * 40, 4)}
                  className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-black uppercase text-white transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-[#FFD700]" />
                  Chant Seed Mantra {selectedChakra.seedMantra} with Resonance Tone
                </button>
              </div>
            </div>
          </div>
        </div>
      )}





      {/* Selected Art Piece Modal / Trataka Meditation View */}
      <AnimatePresence>
        {selectedArtPiece && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`bg-zinc-950 border border-[#FF9933]/40 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 space-y-5 shadow-2xl relative ${
                isTratakaMode ? "ring-4 ring-[#FF9933]/40 shadow-[0_0_50px_rgba(255,153,51,0.3)]" : ""
              }`}
            >
              <button
                onClick={() => {
                  setSelectedArtPiece(null);
                  setIsTratakaMode(false);
                }}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/80 border border-white/20 text-zinc-400 hover:text-white cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                <img
                  src={selectedArtPiece.image}
                  alt={selectedArtPiece.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />

                {isTratakaMode && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border border-[#FFD700]/40 animate-ping opacity-30" />
                  </div>
                )}

                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-xs font-serif font-black text-[#FFD700] tracking-wide block">
                    {selectedArtPiece.sanskritTitle}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
                    {selectedArtPiece.title}
                  </h3>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-[#FF9933]/15 border border-[#FF9933]/40 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono uppercase text-[#FF9933] font-bold block">Sacred Mantra Resonance:</span>
                    <p className="text-sm font-serif font-black text-[#FFD700]">{selectedArtPiece.mantra}</p>
                  </div>
                  <button
                    onClick={() => playSingingBowlChime(432, 4)}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white flex items-center gap-1.5 transition active:scale-95"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-[#FFD700]" />
                    Chant (432Hz)
                  </button>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#FF9933] font-bold block">
                    Artistic & Spiritual Architecture:
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                    {selectedArtPiece.description}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
                    Inner Spiritual Significance:
                  </span>
                  <p className="text-xs text-zinc-300 italic leading-relaxed">
                    "{selectedArtPiece.spiritualSignificance}"
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setIsTratakaMode(!isTratakaMode)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition flex items-center gap-1.5 ${
                    isTratakaMode
                      ? "bg-[#FF9933] text-black"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  {isTratakaMode ? "Exit Trataka Focus" : "Enter Trataka Candle Meditation"}
                </button>

                <button
                  onClick={() => {
                    setSelectedArtPiece(null);
                    setIsTratakaMode(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold uppercase text-white"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}

