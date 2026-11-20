import { Link, useLocation } from "react-router-dom";
import { Dumbbell, Shield, MessageSquare, Menu, Bell, Sparkles, User, Calendar, Utensils, Activity, Brain } from "lucide-react";
import { MemberInbox } from "./MemberInbox";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";

interface MobileHeaderProps {
  onOpenHub: () => void;
  onOpenChat: () => void;
}

export function MobileHeader({ onOpenHub, onOpenChat }: MobileHeaderProps) {
  const location = useLocation();
  const { user } = useAuth();
  const path = location.pathname;

  // Dynamic clean title based on current route
  const getPageTitle = (p: string) => {
    if (p === "/") return "MEM FITNESS";
    if (p.startsWith("/programs")) return "PROGRAMS";
    if (p.startsWith("/gym-schedule")) return "GYM CHART";
    if (p.startsWith("/nutrition")) return "NUTRITION";
    if (p.startsWith("/medical-nutrition")) return "CLINICAL DIET";
    if (p.startsWith("/mental-game")) return "MENTAL RELIEF";
    if (p.startsWith("/health-tools")) return "HEALTH TOOLS";
    if (p.startsWith("/admin")) return "ADMIN CONSOLE";
    if (p.startsWith("/profile")) return "ATHLETE PROFILE";
    return "MEM";
  };

  const title = getPageTitle(path);

  const desktopNavLinks = [
    { name: "Dashboard", path: "/" },
    { name: "Gym Splits", path: "/gym-schedule" },
    { name: "Programs", path: "/programs" },
    { name: "Diet & Macros", path: "/nutrition" },
    { name: "Clinical Diet", path: "/medical-nutrition" },
    { name: "Mind & Relief", path: "/mental-game" },
    { name: "Health Tools", path: "/health-tools" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-2.5 transition-all">
      <div className="flex items-center justify-between h-12 max-w-7xl mx-auto">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group active:scale-95 transition-transform">
            <div className="w-8 h-8 bg-[#CCFF00] rounded flex items-center justify-center shadow-[0_0_12px_rgba(204,255,0,0.3)]">
              <div className="w-4 h-4 bg-black rotate-45 transform group-hover:rotate-90 transition-transform"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tighter uppercase leading-none text-white">MEM</span>
              <span className="text-[8px] font-bold tracking-[0.2em] uppercase text-[#CCFF00] leading-none mt-0.5">FITNESS</span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Visible on desktop screens >= 768px) */}
          <nav className="hidden md:flex items-center gap-1">
            {desktopNavLinks.map((item) => {
              const isActive = item.path === "/" ? path === "/" : path.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                    isActive
                      ? "text-[#CCFF00] bg-white/5 border border-[#CCFF00]/30 shadow-sm"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Center: Dynamic Current Context (Mobile only badge) */}
        <div className="md:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 max-w-[140px] sm:max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse shrink-0" />
          <span className="text-[10px] font-black uppercase tracking-wider text-white/90 truncate">
            {title}
          </span>
        </div>

        {/* Right Actions: AI Trainer, Inbox, Profile & Menu */}
        <div className="flex items-center gap-2">
          {/* Quick AI Trigger button */}
          <button
            onClick={onOpenChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-[#CCFF00] hover:text-black text-white/80 transition-all border border-white/10 active:scale-95 text-xs font-bold uppercase tracking-wider"
            title="Open AI Trainer"
            aria-label="Open AI Trainer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#CCFF00] group-hover:text-black" />
            <span className="hidden sm:inline">AI Trainer</span>
          </button>

          {/* Member Inbox Notifications */}
          {user && (
            <div className="relative">
              <MemberInbox />
            </div>
          )}

          {/* Profile Shortcut on Desktop */}
          <Link
            to="/profile"
            className="hidden md:flex items-center gap-2 p-1.5 rounded-full hover:bg-white/5 transition border border-transparent hover:border-white/10"
            title="Athlete Profile"
          >
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-black border border-white/20 overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-zinc-300" />
              )}
            </div>
          </Link>

          {/* Hub Drawer Trigger */}
          <button
            onClick={onOpenHub}
            className="p-2 text-white/80 hover:text-white active:scale-90 transition rounded-full hover:bg-white/10 flex items-center justify-center border border-white/10"
            title="Open Hub Menu"
            aria-label="Open Navigation Hub"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </header>
  );
}
