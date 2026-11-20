import { Link, useNavigate } from "react-router-dom";
import { 
  X, 
  Home, 
  Dumbbell, 
  Calendar, 
  Utensils, 
  Activity, 
  Brain, 
  Shield, 
  Sun,
  User, 
  Calculator, 
  LogOut, 
  Flame, 
  ChevronRight, 
  Sparkles,
  ExternalLink,
  Bell
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";

interface MobileHubDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChat: () => void;
}

export function MobileHubDrawer({ isOpen, onClose, onOpenChat }: MobileHubDrawerProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    onClose();
    await logout();
    navigate("/");
  };

  const navLinks = [
    { name: "Home Dashboard", path: "/", icon: Home, badge: null, desc: "Daily streak & habits" },
    { name: "Aarogya (Indian Yoga)", path: "/aarogya", icon: Sun, badge: "Vedic", desc: "Classical asanas, pranayama, chakras & yoga art" },
    { name: "Gym Schedule & Chart", path: "/gym-schedule", icon: Dumbbell, badge: "Age Splits", desc: "18-35, 36-50, 50+ splits" },
    { name: "Workout Programs", path: "/programs", icon: Calendar, badge: "AI Custom", desc: "Periodized splits & routines" },
    { name: "Nutrition & Meals", path: "/nutrition", icon: Utensils, badge: "Macros", desc: "Calorie & food tracker" },
    { name: "Clinical Diets", path: "/medical-nutrition", icon: Activity, badge: "Medical", desc: "Condition-specific nutrition" },
    { name: "Mental Relief & Chess", path: "/mental-game", icon: Brain, badge: "Mind", desc: "Mind Chess & breathwork" },
    { name: "Health Analytics & Tools", path: "/health-tools", icon: Calculator, badge: null, desc: "BMI, BMR, Calorie targets" },
    { name: "Athlete Profile", path: "/profile", icon: User, badge: null, desc: "Account info & history" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="relative z-10 w-full max-w-lg mx-auto bg-[#0E0E10] border-t border-white/15 rounded-t-3xl shadow-2xl overflow-hidden max-h-[88vh] flex flex-col"
          >
            {/* Top Pull Handle */}
            <div className="pt-3 pb-1 flex justify-center items-center cursor-pointer" onClick={onClose}>
              <div className="w-12 h-1.5 rounded-full bg-white/20 hover:bg-white/40 transition-colors" />
            </div>

            {/* Header */}
            <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/30 flex items-center justify-center text-[#CCFF00] font-black text-sm uppercase overflow-hidden">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    (user?.displayName?.charAt(0) || user?.phoneNumber?.charAt(0) || user?.email?.charAt(0) || "A").toUpperCase()
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase text-white tracking-tight leading-tight">
                    {user?.displayName || user?.phoneNumber || user?.email?.split("@")[0] || "Athlete"}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {user?.phoneNumber || user?.email || "Signed in"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Assistant Quick Banner */}
            <div className="px-5 pt-3">
              <button
                onClick={() => {
                  onClose();
                  onOpenChat();
                }}
                className="w-full p-3 rounded-2xl bg-gradient-to-r from-[#CCFF00]/15 to-[#CCFF00]/5 border border-[#CCFF00]/30 flex items-center justify-between text-left group active:scale-98 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#CCFF00] text-black flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-white block">
                      Chat with MEM AI
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      Workout plans, diet check-ins & advice
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#CCFF00] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Navigation Modules List */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1.5 no-scrollbar">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2 px-1">
                App Modules & Features
              </span>
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-white/15 transition active:scale-98 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-[#CCFF00] group-hover:border-[#CCFF00]/30 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black uppercase tracking-wider text-white">
                            {item.name}
                          </span>
                          {item.badge && (
                            <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.2 rounded bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/20">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-zinc-500 block">
                          {item.desc}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 transition" />
                  </Link>
                );
              })}
            </div>

            {/* Footer with Sign Out */}
            <div className="p-4 border-t border-white/10 bg-zinc-950 flex items-center justify-between pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                MEM FITNESS v2.4 (MOBILE)
              </div>
              {user && (
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition active:scale-95"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
