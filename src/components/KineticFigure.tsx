import React from "react";
import { motion } from "motion/react";
import { APP_IMAGES } from "../lib/appImages";

export type KineticMotionType = "sprinter" | "lifter" | "zen" | "scanner" | "agility" | "mobility" | "pulse";

interface KineticFigureProps {
  type?: KineticMotionType;
  className?: string;
  glowColor?: string;
  showBadge?: boolean;
}

interface BodyConfig {
  image: string;
  label: string;
  metric: string;
  accent: string;
  jointMarkers: { x: number; y: number; label: string }[];
}

const BODY_CONFIGS: Record<KineticMotionType, BodyConfig> = {
  sprinter: {
    image: APP_IMAGES.aiBodySprinter,
    label: "SPRINT PROPULSION",
    metric: "1.55 m/s • 98% NEURO",
    accent: "#CCFF00",
    jointMarkers: [
      { x: 68, y: 22, label: "HEAD" },
      { x: 58, y: 32, label: "SHOULDER" },
      { x: 65, y: 55, label: "KNEE DRIVE" },
      { x: 14, y: 79, label: "FOOT STRIKE" },
    ],
  },
  lifter: {
    image: APP_IMAGES.aiBodyLifter,
    label: "BARBELL KINETICS",
    metric: "95% 1RM • PEAK FORCE",
    accent: "#3BB1FF",
    jointMarkers: [
      { x: 50, y: 40, label: "BAR CENTER" },
      { x: 43, y: 68, label: "L-KNEE 90°" },
      { x: 67, y: 66, label: "R-KNEE 90°" },
      { x: 50, y: 56, label: "CORE AXIS" },
    ],
  },
  scanner: {
    image: APP_IMAGES.aiBodyScanner,
    label: "AI BIOMETRIC SCAN",
    metric: "HOLOGRAPHIC TELEMETRY",
    accent: "#CCFF00",
    jointMarkers: [
      { x: 62, y: 15, label: "CRANIAL" },
      { x: 56, y: 40, label: "CORE" },
      { x: 48, y: 60, label: "GLUTE" },
      { x: 63, y: 62, label: "PATELLA" },
    ],
  },
  agility: {
    image: APP_IMAGES.aiBodyAgility,
    label: "DECEL & PLYOMETRICS",
    metric: "0.18s GCT • FAST TWITCH",
    accent: "#3BB1FF",
    jointMarkers: [
      { x: 56, y: 16, label: "FOCUS" },
      { x: 60, y: 48, label: "HIGH KNEE" },
      { x: 22, y: 82, label: "IMPACT SPARK" },
    ],
  },
  mobility: {
    image: APP_IMAGES.mobilityAgingHd,
    label: "SYNOVIAL MOBILITY",
    metric: "HIP HINGE • LONGEVITY",
    accent: "#9D4EDD",
    jointMarkers: [
      { x: 50, y: 24, label: "SPINE" },
      { x: 45, y: 52, label: "PELVIS" },
      { x: 48, y: 78, label: "SYNOVIAL" },
    ],
  },
  zen: {
    image: APP_IMAGES.aiBodyZen,
    label: "ALPHA BRAINWAVE",
    metric: "10 Hz • FLOW STATE",
    accent: "#9D4EDD",
    jointMarkers: [
      { x: 50, y: 32, label: "THIRD EYE" },
      { x: 50, y: 54, label: "HEART COHERENCE" },
      { x: 26, y: 72, label: "MUDRA L" },
      { x: 74, y: 72, label: "MUDRA R" },
    ],
  },
  pulse: {
    image: APP_IMAGES.aiBodyScanner,
    label: "CARDIOVASCULAR INTEL",
    metric: "52 BPM REST • VO2 PEAK",
    accent: "#FF3366",
    jointMarkers: [
      { x: 50, y: 45, label: "MYOCARDIUM" },
      { x: 50, y: 25, label: "VAGUS NERVE" },
    ],
  },
};

export const KineticFigure: React.FC<KineticFigureProps> = ({
  type = "sprinter",
  className = "w-36 h-36",
  glowColor,
  showBadge = true,
}) => {
  const config = BODY_CONFIGS[type] || BODY_CONFIGS.sprinter;
  const activeColor = glowColor || config.accent;
  const isCompact = !showBadge || className.includes("w-10") || className.includes("w-11") || className.includes("w-12") || className.includes("w-14") || className.includes("w-16") || className.includes("w-20") || className.includes("w-full");

  return (
    <div
      className={`relative rounded-xl overflow-hidden border border-white/15 bg-black select-none flex items-center justify-center group shadow-2xl ${className}`}
      style={{
        boxShadow: `0 0 24px -4px ${activeColor}33`,
      }}
    >
      {/* Background Ambient Radial Glow */}
      <motion.div
        animate={{
          scale: [0.95, 1.15, 0.95],
          opacity: [0.25, 0.5, 0.25],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none rounded-2xl blur-xl"
        style={{
          background: `radial-gradient(circle at center, ${activeColor}40 0%, transparent 75%)`,
        }}
      />

      {/* Subtle Biomechanical Grid Backing */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:1rem_1rem]" />

      {/* Real AI Generated Body Figure with dynamic micro-motion */}
      <motion.div
        key={type}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
      >
        <motion.img
          src={config.image}
          alt={config.label}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter contrast-110 brightness-95"
          animate={{
            scale: [1, 1.03, 1],
            y: type === "sprinter" || type === "agility" ? [-1.5, 1.5, -1.5] : [0, -1, 0],
          }}
          transition={{
            duration: type === "sprinter" ? 1.2 : 2.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Soft Vignette Overlay to blend seamlessly with dark HUD */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/60 pointer-events-none" />

        {/* Dynamic Sweeping Laser Scanner Line */}
        <motion.div
          animate={{
            top: ["0%", "100%", "0%"],
            opacity: [0.3, 0.85, 0.3],
          }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-0 right-0 h-[2px] pointer-events-none z-20"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${activeColor} 50%, transparent 100%)`,
            boxShadow: `0 0 10px ${activeColor}, 0 0 4px #FFFFFF`,
          }}
        />

        {/* Dynamic Biomechanical Joint Telemetry Markers */}
        {config.jointMarkers.map((marker, idx) => (
          <div
            key={idx}
            className="absolute pointer-events-none z-20 flex items-center gap-1"
            style={{
              left: `${marker.x}%`,
              top: `${marker.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Target Reticle Crosshair */}
            <div className="relative w-3.5 h-3.5 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-dashed border-white/60"
              />
              <motion.div
                animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.6, 1, 0.6] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: idx * 0.25,
                  ease: "easeInOut",
                }}
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: activeColor,
                  boxShadow: `0 0 6px ${activeColor}`,
                }}
              />
            </div>
            {/* Minimalist Micro-Label */}
            {!isCompact && (
              <span className="hidden sm:inline-block px-1 py-0.2 bg-black/80 border border-white/20 text-[7px] font-mono font-bold text-white uppercase tracking-tighter rounded backdrop-blur-sm">
                {marker.label}
              </span>
            )}
          </div>
        ))}

        {/* Vector Motion Accents based on motion type */}
        {type === "sprinter" && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible" fill="none">
            {/* Ground speed track vector */}
            <motion.line
              x1="0"
              y1="90%"
              x2="100%"
              y2="90%"
              stroke={activeColor}
              strokeWidth="1.5"
              strokeDasharray="8 8"
              animate={{ strokeDashoffset: [0, -32] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        )}

        {type === "lifter" && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible" fill="none">
            {/* Vertical barbell trajectory guide */}
            <motion.line
              x1="50%"
              y1="25%"
              x2="50%"
              y2="80%"
              stroke={activeColor}
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.6"
            />
          </svg>
        )}

        {type === "zen" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            {/* Concentric Breathing Aura Rings */}
            <motion.div
              animate={{
                scale: [0.85, 1.45, 0.85],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-24 h-24 rounded-full border border-purple-400/50 blur-[1px]"
            />
          </div>
        )}

        {/* Corner HUD Framing Accents */}
        <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t-2 border-l-2 pointer-events-none z-20" style={{ borderColor: activeColor }} />
        <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t-2 border-r-2 pointer-events-none z-20" style={{ borderColor: activeColor }} />
        <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b-2 border-l-2 pointer-events-none z-20" style={{ borderColor: activeColor }} />
        <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b-2 border-r-2 pointer-events-none z-20" style={{ borderColor: activeColor }} />

        {/* Bottom Real-Time Telemetry Bar */}
        {showBadge && !isCompact && (
          <div className="absolute bottom-1.5 inset-x-2 z-20 flex items-center justify-between px-2 py-1 rounded bg-black/85 backdrop-blur-md border border-white/10 text-[8px] font-mono">
            <span className="flex items-center gap-1 font-black text-white uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: activeColor }} />
              AI BODY
            </span>
            <span className="font-bold truncate" style={{ color: activeColor }}>
              {config.label}
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
};
