import { Link, useLocation } from "react-router-dom";
import { Home, Dumbbell, Utensils, Brain, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";

interface MobileBottomNavProps {
  onOpenHub: () => void;
}

export function MobileBottomNav({ onOpenHub }: MobileBottomNavProps) {
  const location = useLocation();
  const { user } = useAuth();
  const path = location.pathname;

  const isHome = path === "/";
  const isWorkouts = path.startsWith("/gym-schedule") || path.startsWith("/programs");
  const isNutrition = path.startsWith("/nutrition") || path.startsWith("/medical-nutrition");
  const isMind = path.startsWith("/mental-game");
  const isProfile = path.startsWith("/profile");

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="md:hidden sticky bottom-0 inset-x-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-white/10 px-2 pt-1.5 pb-2 shadow-[0_-8px_25px_rgba(0,0,0,0.8)] mt-auto"
    >
      <div className="w-full max-w-md mx-auto grid grid-cols-5 items-center justify-around">
        {/* 1. Home Tab */}
        <Link
          to="/"
          className={cn(
            "flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 active:scale-95 group relative",
            isHome ? "text-[#CCFF00]" : "text-zinc-400 hover:text-white"
          )}
        >
          {isHome && (
            <span className="absolute -top-1.5 w-6 h-0.5 bg-[#CCFF00] rounded-full shadow-[0_0_8px_#CCFF00]" />
          )}
          <Home className={cn("w-5 h-5 transition-transform duration-200", isHome && "scale-110")} />
          <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Home</span>
        </Link>

        {/* 2. Workouts Tab */}
        <Link
          to="/gym-schedule"
          className={cn(
            "flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 active:scale-95 group relative",
            isWorkouts ? "text-[#CCFF00]" : "text-zinc-400 hover:text-white"
          )}
        >
          {isWorkouts && (
            <span className="absolute -top-1.5 w-6 h-0.5 bg-[#CCFF00] rounded-full shadow-[0_0_8px_#CCFF00]" />
          )}
          <Dumbbell className={cn("w-5 h-5 transition-transform duration-200", isWorkouts && "scale-110")} />
          <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Gym</span>
        </Link>

        {/* 3. Nutrition Tab */}
        <Link
          to="/nutrition"
          className={cn(
            "flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 active:scale-95 group relative",
            isNutrition ? "text-[#CCFF00]" : "text-zinc-400 hover:text-white"
          )}
        >
          {isNutrition && (
            <span className="absolute -top-1.5 w-6 h-0.5 bg-[#CCFF00] rounded-full shadow-[0_0_8px_#CCFF00]" />
          )}
          <Utensils className={cn("w-5 h-5 transition-transform duration-200", isNutrition && "scale-110")} />
          <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Diet</span>
        </Link>

        {/* 4. Mental / Mind Chess Tab */}
        <Link
          to="/mental-game"
          className={cn(
            "flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 active:scale-95 group relative",
            isMind ? "text-[#CCFF00]" : "text-zinc-400 hover:text-white"
          )}
        >
          {isMind && (
            <span className="absolute -top-1.5 w-6 h-0.5 bg-[#CCFF00] rounded-full shadow-[0_0_8px_#CCFF00]" />
          )}
          <Brain className={cn("w-5 h-5 transition-transform duration-200", isMind && "scale-110")} />
          <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Mind</span>
        </Link>

        {/* 5. Profile / More Hub */}
        <button
          onClick={onOpenHub}
          className={cn(
            "flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 active:scale-95 group relative",
            isProfile ? "text-[#CCFF00]" : "text-zinc-400 hover:text-white"
          )}
        >
          {isProfile && (
            <span className="absolute -top-1.5 w-6 h-0.5 bg-[#CCFF00] rounded-full shadow-[0_0_8px_#CCFF00]" />
          )}
          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[9px] font-black border border-white/20 overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
            ) : (
              <User className="w-3.5 h-3.5" />
            )}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Menu</span>
        </button>
      </div>
    </nav>
  );
}
