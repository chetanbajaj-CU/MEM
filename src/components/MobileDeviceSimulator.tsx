import React, { useState, useEffect } from "react";
import { Smartphone, Monitor, Check } from "lucide-react";

interface MobileDeviceSimulatorProps {
  children: React.ReactNode;
}

export type DevicePreset = "desktop" | "iphone-16-pro" | "pixel-9" | "compact-se" | "frameless";

interface DeviceSpec {
  name: string;
  sub: string;
  width: number | string;
  height: string; // CSS height or max-height
  radius: string;
  bezel: string;
  notchType: "dynamic-island" | "punch-hole" | "minimal" | "none";
}

const DEVICE_SPECS: Record<DevicePreset, DeviceSpec> = {
  "desktop": {
    name: "Full Desktop View",
    sub: "Responsive Fullscreen",
    width: "100%",
    height: "100%",
    radius: "rounded-none",
    bezel: "p-0",
    notchType: "none",
  },
  "iphone-16-pro": {
    name: "iPhone 16 Pro",
    sub: "393 × 852 px",
    width: 393,
    height: "min(844px, calc(100vh - 4.5rem))",
    radius: "rounded-[46px]",
    bezel: "p-[10px]",
    notchType: "dynamic-island",
  },
  "pixel-9": {
    name: "Pixel 9",
    sub: "412 × 890 px",
    width: 412,
    height: "min(850px, calc(100vh - 4.5rem))",
    radius: "rounded-[42px]",
    bezel: "p-[9px]",
    notchType: "punch-hole",
  },
  "compact-se": {
    name: "Compact Phone",
    sub: "375 × 780 px",
    width: 375,
    height: "min(780px, calc(100vh - 4.5rem))",
    radius: "rounded-[38px]",
    bezel: "p-[8px]",
    notchType: "minimal",
  },
  "frameless": {
    name: "Frameless Mobile",
    sub: "Fluid Mobile App",
    width: 420,
    height: "min(860px, calc(100vh - 4rem))",
    radius: "rounded-[28px]",
    bezel: "p-0",
    notchType: "minimal",
  },
};

export function MobileDeviceSimulator({ children }: MobileDeviceSimulatorProps) {
  const [devicePreset, setDevicePreset] = useState<DevicePreset>(() => {
    const saved = localStorage.getItem("mem_mobile_preset") as DevicePreset;
    if (saved && DEVICE_SPECS[saved]) return saved;
    return "desktop";
  });

  const [currentTime, setCurrentTime] = useState("");
  const [isPhysicalMobile, setIsPhysicalMobile] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkIsMobile = () => {
      // Screen width <= 640px
      setIsPhysicalMobile(window.innerWidth <= 640);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const handleSelectPreset = (preset: DevicePreset) => {
    setDevicePreset(preset);
    localStorage.setItem("mem_mobile_preset", preset);
  };

  const currentSpec = DEVICE_SPECS[devicePreset];

  // If on actual mobile screen (<= 640px) or user selected "desktop" view:
  if (isPhysicalMobile || devicePreset === "desktop") {
    return (
      <div className="w-full min-h-screen bg-[#0A0A0A] text-[#F5F5F4] flex flex-col overflow-x-hidden relative">
        {/* Floating Desktop / Mobile Simulator Mode Switcher in top corner for desktop users */}
        {!isPhysicalMobile && (
          <div className="fixed top-3 right-4 z-50 flex items-center gap-1.5 bg-zinc-950/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full shadow-2xl">
            <button
              onClick={() => handleSelectPreset("desktop")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition ${
                devicePreset === "desktop"
                  ? "bg-[#CCFF00] text-black shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop View</span>
            </button>
            <button
              onClick={() => handleSelectPreset("iphone-16-pro")}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Phone Sim</span>
            </button>
          </div>
        )}
        <div id="mobile-viewport-container" className="flex-1 w-full flex flex-col">
          {children}
        </div>
      </div>
    );
  }

  // Simulated Mobile Phone Chassis View (iPhone, Pixel, Compact, Frameless)
  return (
    <div className="h-screen w-full bg-[#050505] text-[#F5F5F4] flex flex-col items-center justify-center p-2 sm:p-3 overflow-hidden">
      {/* Top Mobile Phone Format & View Switcher Bar */}
      <header className="w-full max-w-lg mb-2 bg-zinc-950/90 backdrop-blur border border-white/10 rounded-xl px-3 py-1.5 flex items-center justify-between shadow-lg shrink-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#CCFF00] flex items-center justify-center text-black font-black text-xs shadow-[0_0_10px_rgba(204,255,0,0.4)]">
            <Smartphone className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-tight">
              <span className="text-[11px] font-black uppercase tracking-wider text-white">
                MEM Viewport
              </span>
              <span className="text-[8px] font-mono font-bold bg-[#CCFF00]/15 text-[#CCFF00] px-1 py-0.2 rounded border border-[#CCFF00]/30">
                SIM
              </span>
            </div>
            <p className="text-[9px] text-zinc-400 font-mono leading-none">
              {currentSpec.name} ({typeof currentSpec.width === "number" ? `${currentSpec.width}px` : currentSpec.width})
            </p>
          </div>
        </div>

        {/* View Switcher: Desktop + Mobile Models */}
        <div className="flex items-center gap-1 bg-zinc-900/90 p-0.5 rounded-lg border border-white/10">
          <button
            onClick={() => handleSelectPreset("desktop")}
            className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 text-zinc-400 hover:text-white hover:bg-white/5 transition"
            title="Switch to full desktop widescreen view"
          >
            <Monitor className="w-3 h-3" />
            <span>Desktop</span>
          </button>
          {(
            [
              { id: "iphone-16-pro", label: "iPhone" },
              { id: "pixel-9", label: "Pixel" },
              { id: "compact-se", label: "Compact" },
              { id: "frameless", label: "Frameless" },
            ] as const
          ).map((item) => {
            const isSelected = devicePreset === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectPreset(item.id)}
                className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition ${
                  isSelected
                    ? "bg-[#CCFF00] text-black shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Smartphone Chassis Frame */}
      <div 
        className={`relative transition-all duration-300 flex flex-col shrink ${
          devicePreset === "frameless"
            ? "shadow-[0_20px_50px_rgba(0,0,0,0.9)] border border-white/10 rounded-[28px] overflow-hidden"
            : `shadow-[0_20px_50px_-10px_rgba(0,0,0,0.95),0_0_25px_rgba(204,255,0,0.08)] ${currentSpec.radius} ${currentSpec.bezel} bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 border-2 border-zinc-600/80`
        }`}
        style={{
          width: currentSpec.width,
          height: currentSpec.height,
          maxHeight: "calc(100vh - 4.5rem)",
        }}
      >
        {/* Smartphone Screen Inner Container */}
        <div 
          className={`relative bg-[#0A0A0A] overflow-hidden flex flex-col border border-white/10 flex-1 select-auto ${
            devicePreset === "frameless" ? "rounded-[28px]" : "rounded-[38px]"
          }`}
          style={{ 
            transform: "translateZ(0)"
          }}
        >
          {/* Native Mobile Status Bar (iOS / Android Style) */}
          <div className="sticky top-0 z-50 w-full bg-[#0A0A0A]/95 backdrop-blur-md px-5 pt-2.5 pb-1 flex items-center justify-between text-white text-[11px] font-semibold tracking-tight select-none border-b border-white/5 shrink-0">
            {/* Time */}
            <span className="font-semibold tracking-tight text-[11px] font-mono text-white/90">
              {currentTime || "09:41"}
            </span>

            {/* Notch / Dynamic Island */}
            {currentSpec.notchType === "punch-hole" ? (
              <div className="w-3 h-3 bg-black rounded-full border border-white/15 flex items-center justify-center shadow-inner">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
              </div>
            ) : currentSpec.notchType === "dynamic-island" ? (
              <div className="w-22 h-4.5 bg-black rounded-full flex items-center justify-between px-2 gap-1 border border-white/10 shadow-inner">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                <div className="flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-[#CCFF00] animate-pulse" />
                  <span className="text-[8px] font-mono font-bold text-[#CCFF00]">MEM</span>
                </div>
              </div>
            ) : (
              <div className="w-12 h-1 bg-zinc-800 rounded-full" />
            )}

            {/* Signal & Battery */}
            <div className="flex items-center gap-1 text-zinc-300">
              <span className="text-[8px] font-mono font-bold text-zinc-400">5G</span>
              <div className="w-2 h-2 rounded-full bg-[#CCFF00]" />
              <span className="text-[9px] font-mono font-bold text-[#CCFF00]">100%</span>
            </div>
          </div>

          {/* Phone Screen Scrollable Content Body */}
          <div 
            id="mobile-viewport-container"
            className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col bg-[#0A0A0A] overscroll-contain"
          >
            {children}
          </div>

          {/* Simulated iOS Home Indicator Bar */}
          <div className="shrink-0 h-3 flex justify-center items-center pointer-events-none bg-[#0A0A0A] z-40 border-t border-white/5">
            <div className="w-28 h-1 bg-white/30 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
