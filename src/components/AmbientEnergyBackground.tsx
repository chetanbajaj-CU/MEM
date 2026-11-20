import React, { useEffect, useRef, useState } from "react";
import { Zap, Waves, Flame, Sparkles, Moon, Sun, SlidersHorizontal } from "lucide-react";
import { cn } from "../lib/utils";

export type EnergyStateId = "auto" | "peak" | "flow" | "fire" | "zen" | "awakening";

export interface EnergyStateConfig {
  id: EnergyStateId;
  label: string;
  tagline: string;
  color: string;
  secondaryColor: string;
  accentColor: string;
  particleSpeed: number;
  particleCount: number;
  waveFrequency: number;
  waveAmplitude: number;
  pulseSpeed: number;
  icon: React.ElementType;
}

export const ENERGY_STATES: Record<string, EnergyStateConfig> = {
  peak: {
    id: "peak",
    label: "Peak Output",
    tagline: "Hyper-drive kinetic output & high neuromuscular tension",
    color: "rgba(204, 255, 0, 0.22)", // Neon Lime
    secondaryColor: "rgba(0, 229, 255, 0.18)", // Cyan
    accentColor: "#CCFF00",
    particleSpeed: 1.4,
    particleCount: 42,
    waveFrequency: 0.024,
    waveAmplitude: 28,
    pulseSpeed: 0.035,
    icon: Zap,
  },
  flow: {
    id: "flow",
    label: "Kinetic Flow",
    tagline: "Sustained momentum, rhythmic breath & deep cardiovascular flow",
    color: "rgba(59, 177, 255, 0.20)", // Azure Blue
    secondaryColor: "rgba(204, 255, 0, 0.14)", // Soft Lime
    accentColor: "#3BB1FF",
    particleSpeed: 0.85,
    particleCount: 32,
    waveFrequency: 0.016,
    waveAmplitude: 22,
    pulseSpeed: 0.02,
    icon: Waves,
  },
  fire: {
    id: "fire",
    label: "Metabolic Fire",
    tagline: "Active thermogenesis, caloric burn & high metabolic drive",
    color: "rgba(255, 122, 0, 0.22)", // Flame Orange
    secondaryColor: "rgba(255, 187, 0, 0.16)", // Warm Gold
    accentColor: "#FF7A00",
    particleSpeed: 1.1,
    particleCount: 36,
    waveFrequency: 0.02,
    waveAmplitude: 25,
    pulseSpeed: 0.028,
    icon: Flame,
  },
  zen: {
    id: "zen",
    label: "Restorative Zen",
    tagline: "Parasympathetic recovery, alpha wave coherence & mind stillness",
    color: "rgba(157, 78, 221, 0.22)", // Cosmic Purple
    secondaryColor: "rgba(99, 102, 241, 0.16)", // Indigo
    accentColor: "#9D4EDD",
    particleSpeed: 0.45,
    particleCount: 24,
    waveFrequency: 0.008,
    waveAmplitude: 14,
    pulseSpeed: 0.012,
    icon: Moon,
  },
  awakening: {
    id: "awakening",
    label: "Awakening",
    tagline: "Baseline morning readiness, clean hydration & sensory focus",
    color: "rgba(0, 230, 118, 0.18)", // Mint Emerald
    secondaryColor: "rgba(59, 177, 255, 0.14)", // Soft Cyan
    accentColor: "#00E676",
    particleSpeed: 0.6,
    particleCount: 26,
    waveFrequency: 0.012,
    waveAmplitude: 18,
    pulseSpeed: 0.015,
    icon: Sun,
  },
};

interface AmbientEnergyBackgroundProps {
  completedHabitsCount: number;
  totalHabitsCount?: number;
  selectedEnergyState: EnergyStateId;
  onEnergyStateChange?: (state: EnergyStateId) => void;
  showControlPill?: boolean;
}

export function AmbientEnergyBackground({
  completedHabitsCount,
  totalHabitsCount = 4,
  selectedEnergyState,
  onEnergyStateChange,
  showControlPill = false,
}: AmbientEnergyBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Determine active effective energy state
  const effectiveStateKey: keyof typeof ENERGY_STATES = React.useMemo(() => {
    if (selectedEnergyState !== "auto" && ENERGY_STATES[selectedEnergyState]) {
      return selectedEnergyState;
    }
    // Auto sync with daily habits progress
    const ratio = completedHabitsCount / Math.max(1, totalHabitsCount);
    if (ratio >= 1.0) return "peak";
    if (ratio >= 0.75) return "flow";
    if (ratio >= 0.5) return "fire";
    if (ratio >= 0.25) return "awakening";
    return "zen";
  }, [selectedEnergyState, completedHabitsCount, totalHabitsCount]);

  const currentConfig = ENERGY_STATES[effectiveStateKey];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Particle definition
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      pulseOffset: number;
      hueShift: number;
    }

    const particles: Particle[] = [];
    const maxParticles = 48;

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: 1.5 + Math.random() * 2.5,
        alpha: 0.15 + Math.random() * 0.5,
        pulseOffset: Math.random() * Math.PI * 2,
        hueShift: Math.random() * 20 - 10,
      });
    }

    // Color transition state (LERP)
    let currentR = 204;
    let currentG = 255;
    let currentB = 0;
    let targetR = 204;
    let targetG = 255;
    let targetB = 0;

    // Aurora blob coordinates
    const blobs = [
      { xRatio: 0.2, yRatio: 0.25, radiusRatio: 0.35, angle: 0, speed: 0.0008 },
      { xRatio: 0.8, yRatio: 0.35, radiusRatio: 0.4, angle: 2, speed: 0.0011 },
      { xRatio: 0.5, yRatio: 0.75, radiusRatio: 0.45, angle: 4, speed: 0.0007 },
      { xRatio: 0.15, yRatio: 0.85, radiusRatio: 0.3, angle: 1, speed: 0.0013 },
    ];

    let time = 0;

    const render = () => {
      // Check for user-preferred reduced motion
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Extract target color from currentConfig.accentColor
      if (currentConfig.accentColor === "#CCFF00") {
        targetR = 204; targetG = 255; targetB = 0;
      } else if (currentConfig.accentColor === "#3BB1FF") {
        targetR = 59; targetG = 177; targetB = 255;
      } else if (currentConfig.accentColor === "#FF7A00") {
        targetR = 255; targetG = 122; targetB = 0;
      } else if (currentConfig.accentColor === "#9D4EDD") {
        targetR = 157; targetG = 78; targetB = 221;
      } else if (currentConfig.accentColor === "#00E676") {
        targetR = 0; targetG = 230; targetB = 118;
      }

      // Smooth color interpolation
      currentR += (targetR - currentR) * 0.05;
      currentG += (targetG - currentG) * 0.05;
      currentB += (targetB - currentB) * 0.05;

      ctx.clearRect(0, 0, width, height);

      time += prefersReducedMotion ? 0.003 : 0.016;

      // 1. Render Subtle Ambient Bioluminescent Nebulae / Auroras
      blobs.forEach((blob, idx) => {
        blob.angle += blob.speed * (prefersReducedMotion ? 0.3 : 1) * currentConfig.particleSpeed;
        const bx = (blob.xRatio + Math.cos(blob.angle) * 0.08) * width;
        const by = (blob.yRatio + Math.sin(blob.angle) * 0.08) * height;
        const br = blob.radiusRatio * Math.min(width, height);

        const gradient = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        
        // Alternate secondary tint on alternate blobs
        const isAlt = idx % 2 === 1;
        const r = isAlt ? Math.round(currentR * 0.7 + 30) : Math.round(currentR);
        const g = isAlt ? Math.round(currentG * 0.8 + 40) : Math.round(currentG);
        const b = isAlt ? Math.round(currentB * 0.9 + 50) : Math.round(currentB);

        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.09)`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.035)`);
        gradient.addColorStop(1, "rgba(10, 10, 10, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Render Harmonic Generative Waveform Ribbon
      ctx.beginPath();
      const waveY = height * 0.65;
      ctx.moveTo(0, waveY);

      for (let x = 0; x <= width; x += 15) {
        const amp = currentConfig.waveAmplitude;
        const freq = currentConfig.waveFrequency;
        const y = waveY + 
          Math.sin(x * freq + time * 1.5) * amp * 0.6 + 
          Math.cos(x * freq * 0.5 - time * 0.8) * amp * 0.4;
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = `rgba(${Math.round(currentR)}, ${Math.round(currentG)}, ${Math.round(currentB)}, 0.07)`;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Second harmonic wave
      ctx.beginPath();
      ctx.moveTo(0, waveY + 40);
      for (let x = 0; x <= width; x += 15) {
        const amp = currentConfig.waveAmplitude * 0.7;
        const freq = currentConfig.waveFrequency * 1.3;
        const y = (waveY + 40) + Math.cos(x * freq - time * 1.2) * amp;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${Math.round(currentR)}, ${Math.round(currentG)}, ${Math.round(currentB)}, 0.04)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 3. Render Generative Kinetic Particles & Constellations
      const activeCount = Math.min(particles.length, currentConfig.particleCount);

      for (let i = 0; i < activeCount; i++) {
        const p = particles[i];

        // Motion update
        if (!prefersReducedMotion) {
          p.x += p.vx * currentConfig.particleSpeed;
          p.y += p.vy * currentConfig.particleSpeed;

          // Slight upward draft if in metabolic fire
          if (effectiveStateKey === "fire") {
            p.y -= 0.35 * currentConfig.particleSpeed;
          }

          // Screen wrap-around
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        // Particle pulse
        const pulse = Math.sin(time * 2 + p.pulseOffset);
        const dynamicAlpha = Math.max(0.08, p.alpha + pulse * 0.15);

        ctx.fillStyle = `rgba(${Math.round(currentR)}, ${Math.round(currentG)}, ${Math.round(currentB)}, ${dynamicAlpha * 0.55})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles with subtle filament lines
        for (let j = i + 1; j < activeCount; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const maxDist = effectiveStateKey === "peak" ? 140 : 100;
          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.06;
            ctx.strokeStyle = `rgba(${Math.round(currentR)}, ${Math.round(currentG)}, ${Math.round(currentB)}, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentConfig, effectiveStateKey]);

  return (
    <>
      {/* Generative Ambient HTML5 Canvas - Subtle & Behind Content */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none -z-10 w-full h-full opacity-80"
        style={{ mixBlendMode: "screen" }}
        aria-hidden="true"
      />

      {/* Interactive Bio-Energy Ambient Telemetry Bar */}
      {showControlPill && (
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:px-4 sm:py-2.5 rounded-2xl bg-zinc-950/85 backdrop-blur-xl border border-white/10 shadow-xl transition-all">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-colors shadow-md"
              style={{
                backgroundColor: `${currentConfig.accentColor}18`,
                borderColor: `${currentConfig.accentColor}44`,
                color: currentConfig.accentColor,
              }}
            >
              <currentConfig.icon className="w-4 h-4 animate-pulse" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-black uppercase tracking-widest text-zinc-400">
                  Ambient Bio-Energy
                </span>
                <span
                  className="w-1.5 h-1.5 rounded-full animate-ping"
                  style={{ backgroundColor: currentConfig.accentColor }}
                />
                <span
                  className="text-[10px] font-mono font-black uppercase tracking-wider"
                  style={{ color: currentConfig.accentColor }}
                >
                  {currentConfig.label}
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 line-clamp-1">
                {selectedEnergyState === "auto"
                  ? `Habit-Synced (${completedHabitsCount}/${totalHabitsCount} Disciplines Locked) • ${currentConfig.tagline}`
                  : `User Overridden • ${currentConfig.tagline}`}
              </p>
            </div>
          </div>

          {/* Energy State Mode Switcher Tabs */}
          {onEnergyStateChange && (
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full sm:w-auto shrink-0 pb-0.5 sm:pb-0">
              <button
                onClick={() => onEnergyStateChange("auto")}
                className={cn(
                  "px-2.5 py-1 text-[9px] font-mono font-bold uppercase rounded-lg border transition-all active:scale-95 shrink-0",
                  selectedEnergyState === "auto"
                    ? "bg-white/15 border-white/40 text-white shadow-sm"
                    : "bg-black/40 border-white/10 text-zinc-400 hover:text-white"
                )}
                title="Automatically synchronize with daily habits progress"
              >
                Auto (Sync)
              </button>

              {(["peak", "flow", "fire", "zen", "awakening"] as const).map((key) => {
                const conf = ENERGY_STATES[key];
                const isSelected = selectedEnergyState === key;
                return (
                  <button
                    key={key}
                    onClick={() => onEnergyStateChange(key)}
                    className={cn(
                      "px-2.5 py-1 text-[9px] font-mono font-bold uppercase rounded-lg border transition-all active:scale-95 flex items-center gap-1 shrink-0",
                      isSelected
                        ? "text-black font-black shadow-md"
                        : "bg-black/40 border-white/10 text-zinc-400 hover:text-white"
                    )}
                    style={
                      isSelected
                        ? {
                            backgroundColor: conf.accentColor,
                            borderColor: conf.accentColor,
                            boxShadow: `0 0 12px ${conf.accentColor}66`,
                          }
                        : {}
                    }
                  >
                    <conf.icon className="w-3 h-3" />
                    <span>{conf.label.split(" ")[0]}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
}
