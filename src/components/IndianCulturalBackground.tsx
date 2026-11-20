import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Sparkles, Flame, Volume2, Shield, Eye, EyeOff, Sliders, Moon, Check } from "lucide-react";
import { APP_IMAGES } from "../lib/appImages";
import { playSingingBowlChime } from "../lib/aarogyaYogaData";

export type IndianBgTheme = "sri-yantra" | "temple-deepam" | "padma-dawn" | "kundalini-agni";
export type BgIntensity = "subtle" | "balanced" | "sanctum";

interface IndianCulturalBackgroundProps {
  currentTheme?: IndianBgTheme;
  intensity?: BgIntensity;
  showDiyas?: boolean;
  showLattice?: boolean;
  showShlokas?: boolean;
  onThemeChange?: (theme: IndianBgTheme) => void;
  onIntensityChange?: (intensity: BgIntensity) => void;
  onToggleDiyas?: () => void;
  onToggleLattice?: () => void;
}

export function IndianCulturalBackground({
  currentTheme = "sri-yantra",
  intensity = "balanced",
  showDiyas = true,
  showLattice = true,
  showShlokas = true,
}: IndianCulturalBackgroundProps) {
  // Map theme to asset
  const getThemeImage = () => {
    switch (currentTheme) {
      case "temple-deepam":
        return APP_IMAGES.indianSacredTempleBg;
      case "padma-dawn":
        return APP_IMAGES.aarogyaPadmasanaLotusArt;
      case "kundalini-agni":
        return APP_IMAGES.aarogyaKundaliniEnergyArt;
      case "sri-yantra":
      default:
        return APP_IMAGES.sriYantraMandalaBg;
    }
  };

  const getOpacityClass = () => {
    switch (intensity) {
      case "subtle":
        return "opacity-25";
      case "sanctum":
        return "opacity-75";
      case "balanced":
      default:
        return "opacity-45";
    }
  };

  return (
    <div 
      aria-hidden="true" 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* 1. Deep Base Atmosphere: Temple Basalt & Sacred Warm Sandalwood Vignette */}
      <div className="absolute inset-0 bg-[#080604] bg-radial-[ellipse_at_top,_var(--tw-gradient-stops)] from-[#1a0f05] via-[#0b0805] to-[#040302]" />

      {/* 2. Primary High-Res Indian Sacred Backdrop Artwork */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTheme}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className={`absolute inset-0 ${getOpacityClass()} transition-opacity duration-500`}
        >
          <img
            src={getThemeImage()}
            alt="Indian Cultural Sacred Background"
            className="w-full h-full object-cover object-center filter saturate-[1.15] contrast-[1.05]"
            referrerPolicy="no-referrer"
          />
          {/* Gradients to keep content completely legible (WCAG AA compliant) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#080604]/75 via-[#080604]/85 to-[#080604]/95" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_30%,_#080604_90%)]" />
        </motion.div>
      </AnimatePresence>

      {/* 3. Central Sacred Sri Yantra & Mandala Geometry (Golden SVG Vector Overlay) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[700px] sm:h-[900px] opacity-[0.14] pointer-events-none">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full text-[#FFD700] animate-[spin_180s_linear_infinite]"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
        >
          {/* Outer Bhupura (Citadel with 4 Gates) */}
          <rect x="20" y="20" width="360" height="360" stroke="#FF9933" strokeWidth="1.2" strokeDasharray="300 20 20 20" />
          <rect x="30" y="30" width="340" height="340" stroke="#FFD700" strokeWidth="0.8" />
          <rect x="40" y="40" width="320" height="320" stroke="#FF9933" strokeWidth="0.6" />

          {/* Gate steps (T-shaped portals) */}
          <path d="M 180 20 L 180 10 L 220 10 L 220 20" stroke="#FFD700" strokeWidth="1.5" />
          <path d="M 180 380 L 180 390 L 220 390 L 220 380" stroke="#FFD700" strokeWidth="1.5" />
          <path d="M 20 180 L 10 180 L 10 220 L 20 220" stroke="#FFD700" strokeWidth="1.5" />
          <path d="M 380 180 L 390 180 L 390 220 L 380 220" stroke="#FFD700" strokeWidth="1.5" />

          {/* Outer concentric rings */}
          <circle cx="200" cy="200" r="145" stroke="#FFD700" strokeWidth="1" />
          <circle cx="200" cy="200" r="135" stroke="#FF9933" strokeWidth="0.8" strokeDasharray="4 4" />
          <circle cx="200" cy="200" r="125" stroke="#FFD700" strokeWidth="0.8" />

          {/* 16 Petals of Lotus */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 360) / 16;
            return (
              <g key={`p16-${i}`} transform={`rotate(${angle} 200 200)`}>
                <path
                  d="M 200 75 Q 212 95 200 115 Q 188 95 200 75 Z"
                  stroke="#FFD700"
                  strokeWidth="0.8"
                  fill="#FFD700"
                  fillOpacity="0.04"
                />
              </g>
            );
          })}

          {/* 8 Petals of Lotus */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 360) / 8 + 22.5;
            return (
              <g key={`p8-${i}`} transform={`rotate(${angle} 200 200)`}>
                <path
                  d="M 200 95 Q 216 115 200 135 Q 184 115 200 95 Z"
                  stroke="#FF9933"
                  strokeWidth="1"
                  fill="#FF9933"
                  fillOpacity="0.06"
                />
              </g>
            );
          })}

          {/* Innermost circle housing the 9 Interlocking Triangles */}
          <circle cx="200" cy="200" r="85" stroke="#FFD700" strokeWidth="1.2" />

          {/* The 9 Interlocking Triangles (Shri Yantra Navayoni) */}
          {/* 4 Upward Triangles (Shiva / Divine Consciousness) */}
          <polygon points="200,118 135,248 265,248" stroke="#FFD700" strokeWidth="1.2" />
          <polygon points="200,132 142,238 258,238" stroke="#FF9933" strokeWidth="1" />
          <polygon points="200,146 150,226 250,226" stroke="#FFD700" strokeWidth="0.9" />
          <polygon points="200,158 160,216 240,216" stroke="#FF9933" strokeWidth="0.8" />

          {/* 5 Downward Triangles (Shakti / Creative Energy) */}
          <polygon points="200,282 135,152 265,152" stroke="#FFD700" strokeWidth="1.2" />
          <polygon points="200,268 142,162 258,162" stroke="#FF9933" strokeWidth="1" />
          <polygon points="200,254 150,174 250,174" stroke="#FFD700" strokeWidth="0.9" />
          <polygon points="200,242 160,184 240,184" stroke="#FF9933" strokeWidth="0.8" />
          <polygon points="200,228 170,192 230,192" stroke="#FFD700" strokeWidth="0.7" />

          {/* Central Bindu (The Supreme Focal Point) */}
          <circle cx="200" cy="200" r="3.5" fill="#FFD700" />
          <circle cx="200" cy="200" r="6" stroke="#FF9933" strokeWidth="0.7" />
        </svg>
      </div>

      {/* 4. Traditional Indian Kolam & Jali Filigree Repeating Lattice */}
      {showLattice && (
        <div 
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFD700' fill-opacity='0.6' fill-rule='evenodd'%3E%3Cpath d='M30 30L45 15L30 0L15 15zM30 30L45 45L30 60L15 45zM0 30L15 15L0 0L-15 15zM60 30L75 15L60 0L45 15zM0 30L15 45L0 60L-15 45zM60 30L75 45L60 60L45 45z'/%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3Ccircle cx='0' cy='30' r='2'/%3E%3Ccircle cx='60' cy='30' r='2'/%3E%3Ccircle cx='30' cy='0' r='2'/%3E%3Ccircle cx='30' cy='60' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat"
          }}
        />
      )}

      {/* 5. Traditional Indian Temple Toran (Border Garland with Mango leaves & Marigolds) */}
      <div className="absolute top-0 left-0 right-0 h-10 pointer-events-none flex items-center justify-center overflow-hidden opacity-35">
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="w-full h-full text-[#FF9933]">
          <path
            d="M 0,0 
               Q 50,28 100,0 Q 150,28 200,0 Q 250,28 300,0 Q 350,28 400,0
               Q 450,28 500,0 Q 550,28 600,0 Q 650,28 700,0 Q 750,28 800,0
               Q 850,28 900,0 Q 950,28 1000,0 Q 1050,28 1100,0 Q 1150,28 1200,0"
            fill="none"
            stroke="#FF9933"
            strokeWidth="1.8"
          />
          {/* Marigold flower accents at each crest */}
          {Array.from({ length: 13 }).map((_, i) => (
            <circle
              key={`marigold-${i}`}
              cx={i * 100}
              cy={3}
              r={4}
              fill="#FFD700"
              stroke="#E65100"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      {/* 6. Sacred Sanskrit Shloka Watermark Ribbons in Devanagari */}
      {showShlokas && (
        <>
          {/* Left vertical ribbon: Sarve Bhavantu Sukhinah */}
          <div className="hidden xl:block absolute left-4 top-48 bottom-48 w-12 pointer-events-none opacity-[0.09] overflow-hidden select-none">
            <div className="[writing-mode:vertical-rl] text-lg font-serif tracking-[0.3em] text-[#FFD700] whitespace-nowrap">
              ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः । सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत् ॥
            </div>
          </div>

          {/* Right vertical ribbon: Aarogyam Paramam Bhagyam */}
          <div className="hidden xl:block absolute right-4 top-48 bottom-48 w-12 pointer-events-none opacity-[0.09] overflow-hidden select-none">
            <div className="[writing-mode:vertical-rl] text-lg font-serif tracking-[0.3em] text-[#FF9933] whitespace-nowrap">
              आरोग्यं परमं भाग्यं स्वास्थ्यं सर्वार्थसाधनम् । शरीरमाद्यं खलु धर्मसाधनम् ॥
            </div>
          </div>

          {/* Subtle horizontal watermark across upper hero: Asato Ma Sadgamaya */}
          <div className="absolute top-28 left-1/2 -translate-x-1/2 pointer-events-none opacity-[0.05] whitespace-nowrap font-serif text-2xl sm:text-3xl lg:text-4xl text-[#FFD700] select-none tracking-widest">
            ॐ असतो मा सद्गमय तमसो मा ज्योतिर्गमय मृत्योर्मा अमृतं गमय
          </div>
        </>
      )}

      {/* 7. Traditional Indian Brass Diya (Deepam) Ambient Light Glows in Corners */}
      {showDiyas && (
        <>
          {/* Top-Left Diya Aura */}
          <div className="absolute top-10 left-6 sm:left-12 pointer-events-none flex flex-col items-center opacity-70">
            {/* Soft Warm Flame Flicker Animation */}
            <div className="w-24 sm:w-36 h-24 sm:h-36 rounded-full bg-[#FF9933]/20 blur-3xl animate-pulse" />
            <div className="absolute top-6 w-3 h-4 bg-gradient-to-t from-[#FF6F00] via-[#FFD700] to-white rounded-full blur-[1px] shadow-[0_0_12px_#FFD700]" />
            <svg width="28" height="14" viewBox="0 0 28 14" className="absolute top-9 text-[#B8860B]">
              <path d="M 2 4 Q 14 16 26 4 Q 14 6 2 4 Z" fill="#B8860B" stroke="#FFD700" strokeWidth="0.8" />
            </svg>
          </div>

          {/* Top-Right Diya Aura */}
          <div className="absolute top-10 right-6 sm:right-12 pointer-events-none flex flex-col items-center opacity-70">
            <div className="w-24 sm:w-36 h-24 sm:h-36 rounded-full bg-[#FF9933]/20 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute top-6 w-3 h-4 bg-gradient-to-t from-[#FF6F00] via-[#FFD700] to-white rounded-full blur-[1px] shadow-[0_0_12px_#FFD700]" />
            <svg width="28" height="14" viewBox="0 0 28 14" className="absolute top-9 text-[#B8860B]">
              <path d="M 2 4 Q 14 16 26 4 Q 14 6 2 4 Z" fill="#B8860B" stroke="#FFD700" strokeWidth="0.8" />
            </svg>
          </div>

          {/* Bottom-Center Sacred Kund Havan Warm Glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-t from-[#FF9933]/15 via-[#FFD700]/5 to-transparent blur-3xl pointer-events-none" />
        </>
      )}
    </div>
  );
}

// Interactive Indian Cultural Ambiance Controller Bar (for user customization)
export function IndianAmbianceController({
  currentTheme,
  intensity,
  showDiyas,
  showLattice,
  onThemeChange,
  onIntensityChange,
  onToggleDiyas,
  onToggleLattice,
}: {
  currentTheme: IndianBgTheme;
  intensity: BgIntensity;
  showDiyas: boolean;
  showLattice: boolean;
  onThemeChange: (theme: IndianBgTheme) => void;
  onIntensityChange: (intensity: BgIntensity) => void;
  onToggleDiyas: () => void;
  onToggleLattice: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const THEMES: { id: IndianBgTheme; label: string; deva: string; icon: string }[] = [
    { id: "sri-yantra", label: "Sri Yantra", deva: "श्री यन्त्र", icon: "🕉️" },
    { id: "temple-deepam", label: "Temple Sanctum", deva: "दीप मन्दिर", icon: "🛕" },
    { id: "padma-dawn", label: "Padma Dawn", deva: "कमल प्रभात", icon: "🪷" },
    { id: "kundalini-agni", label: "Kundalini Agni", deva: "कुण्डलिनी अग्नि", icon: "🔥" },
  ];

  const playTempleBell = () => {
    playSingingBowlChime(432, 3.5);
  };

  return (
    <div className="bg-zinc-950/80 border border-[#FF9933]/30 rounded-2xl p-3 sm:p-4 shadow-xl backdrop-blur-md relative overflow-hidden">
      {/* Decorative Traditional Indian Jali Border Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF9933] to-transparent opacity-60" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Header Title with Traditional Devanagari Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FF9933]/15 border border-[#FF9933]/40 text-[#FF9933] flex items-center justify-center font-serif text-sm">
            ॐ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-white tracking-wider">
                Vedic Ambiance
              </span>
              <span className="text-[10px] font-serif text-[#FFD700]">
                भारतीय सांस्कृतिक पृष्ठभूमि
              </span>
            </div>
            <p className="text-[10px] text-zinc-400">
              Authentic Indian sacred geometry, temple rangoli & diya ambiance
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          <button
            onClick={playTempleBell}
            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-[#FF9933]/30 text-[11px] font-bold text-[#FFD700] flex items-center gap-1.5 transition active:scale-95"
            title="Sound Temple Bell Chime"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#FFD700]" />
            <span>Temple Bell</span>
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider border flex items-center gap-1.5 transition ${
              isOpen
                ? "bg-[#FF9933] text-black border-[#FF9933]"
                : "bg-zinc-900 text-zinc-300 border-white/10 hover:text-white hover:border-[#FF9933]/40"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isOpen ? "Close Options" : "Customize Ambiance"}</span>
          </button>
        </div>
      </div>

      {/* Expandable Ambiance Customizer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="pt-4 mt-3 border-t border-white/10 space-y-4"
          >
            {/* Theme Selector */}
            <div>
              <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 font-mono">
                Sacred Backdrop Theme • मन्दिर वातावरण
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {THEMES.map((t) => {
                  const isActive = currentTheme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => onThemeChange(t.id)}
                      className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                        isActive
                          ? "bg-[#FF9933]/15 border-[#FF9933] shadow-[0_0_15px_rgba(255,153,51,0.2)]"
                          : "bg-zinc-900/60 border-white/10 hover:border-white/20 hover:bg-zinc-800/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{t.icon}</span>
                        <div>
                          <div className={`text-xs font-bold ${isActive ? "text-[#FF9933]" : "text-white"}`}>
                            {t.label}
                          </div>
                          <div className="text-[10px] font-serif text-zinc-400">
                            {t.deva}
                          </div>
                        </div>
                      </div>
                      {isActive && <Check className="w-4 h-4 text-[#FF9933]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Atmosphere Controls: Intensity & Toggles */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-white/5">
              {/* Intensity */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold shrink-0">
                  Depth:
                </span>
                <div className="flex items-center bg-zinc-900 border border-white/10 rounded-lg p-0.5">
                  {(["subtle", "balanced", "sanctum"] as BgIntensity[]).map((level) => {
                    const isSelected = intensity === level;
                    const labels: Record<BgIntensity, { en: string; deva: string }> = {
                      subtle: { en: "Subtle", deva: "शांत" },
                      balanced: { en: "Balanced", deva: "संतुलित" },
                      sanctum: { en: "Sanctum", deva: "गहन" },
                    };
                    return (
                      <button
                        key={level}
                        onClick={() => onIntensityChange(level)}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition flex items-center gap-1 ${
                          isSelected
                            ? "bg-[#FF9933] text-black"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        <span>{labels[level].en}</span>
                        <span className="text-[9px] opacity-75 hidden sm:inline">({labels[level].deva})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-3">
                <button
                  onClick={onToggleDiyas}
                  className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg border transition flex items-center gap-1.5 ${
                    showDiyas
                      ? "bg-[#FF9933]/15 text-[#FFD700] border-[#FF9933]/40"
                      : "bg-zinc-900 text-zinc-500 border-white/10"
                  }`}
                  title="Toggle sacred corner diya lamps"
                >
                  <Flame className="w-3.5 h-3.5 text-[#FF9933]" />
                  <span>Diyas {showDiyas ? "On" : "Off"}</span>
                </button>

                <button
                  onClick={onToggleLattice}
                  className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg border transition flex items-center gap-1.5 ${
                    showLattice
                      ? "bg-[#FF9933]/15 text-[#FFD700] border-[#FF9933]/40"
                      : "bg-zinc-900 text-zinc-500 border-white/10"
                  }`}
                  title="Toggle Indian rangoli lattice overlay"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
                  <span>Rangoli Grid {showLattice ? "On" : "Off"}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
