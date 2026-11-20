import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Dumbbell, Utensils, Activity, Home, Menu, X, Users, Calculator, Calendar, Brain, Shield, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { AIChat } from "./AIChat";
import { ReminderToast } from "./ReminderToast";
import { MemberInbox } from "./MemberInbox";
import { NotificationBar } from "./NotificationBar";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { name: "Home", path: "/", icon: Home },
  { name: "Programs", path: "/programs", icon: Calendar },
  { name: "Gym Chart", path: "/gym-schedule", icon: Dumbbell },
  { name: "Nutrition", path: "/nutrition", icon: Utensils },
  { name: "Clinical Diet", path: "/medical-nutrition", icon: Activity },
  { name: "Aarogya (Yoga)", path: "/aarogya", icon: Sun },
  { name: "Mental Relief", path: "/mental-game", icon: Brain, requiresAuth: true },
];

export function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  const isNavItemVisible = (item: typeof NAV_ITEMS[0]) => {
    if (item.requiresAuth) return !!user;
    return true;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F4] font-sans flex flex-col">
      {/* Official MEM Fitness Notification Bar */}
      <NotificationBar />

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0A0A0A]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-1 shrink-0">
            <div className="w-8 h-8 bg-[#CCFF00] rounded-sm flex items-center justify-center">
              <div className="w-4 h-4 bg-black rotate-45"></div>
            </div>
            <span className="text-2xl font-black tracking-tighter ml-2 uppercase text-white">MEM</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 xl:gap-10 text-[11px] font-bold uppercase tracking-widest text-white/60">
            {NAV_ITEMS.filter(isNavItemVisible).map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 transition-colors hover:text-[#CCFF00]",
                    isActive ? "text-white" : "",
                    index === 0 ? "ml-6 lg:ml-8" : ""
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest">
            {user ? (
              <div className="flex items-center gap-3">
                <MemberInbox />
                <Link to="/profile" className="text-[#CCFF00] hover:text-[#b3e600] transition-colors flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#CCFF00]/10 flex items-center justify-center text-[10px] font-black uppercase text-[#CCFF00] border border-[#CCFF00]/30 overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      user.displayName?.charAt(0) || "U"
                    )}
                  </div>
                  {(user.displayName || user.phoneNumber || user.email?.split("@")[0] || "Athlete")}
                </Link>
              </div>
            ) : null}
          </div>

          {/* Mobile Menu Toggle & Inbox */}
          <div className="md:hidden flex items-center gap-2">
            {user && <MemberInbox />}
            <button
              className="p-2 text-white/60"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#0A0A0A] px-4 py-4 space-y-4 absolute w-full z-50">
            {NAV_ITEMS.filter(isNavItemVisible).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-xs font-bold uppercase tracking-widest",
                  location.pathname === item.path
                    ? "text-[#CCFF00]"
                    : "text-white/60 hover:text-white"
                )}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-xs font-bold uppercase tracking-widest text-[#CCFF00]"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#CCFF00]/10 flex items-center justify-center text-[8px] font-black uppercase text-[#CCFF00] border border-[#CCFF00]/30 overflow-hidden">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        user.displayName?.charAt(0) || "U"
                      )}
                    </div>
                    {(user.displayName || user.phoneNumber || user.email?.split("@")[0] || "Athlete")}
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      <AIChat />
      <ReminderToast />

      {/* Footer */}
      <footer className="h-16 w-full border-t border-white/10 bg-black flex items-center justify-between px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest mx-auto max-w-7xl w-full flex justify-between">
          <span>&copy; {new Date().getFullYear()} MEM WELLNESS SYSTEMS. ALL RIGHTS RESERVED.</span>
          <div className="hidden sm:flex gap-6 text-[9px] font-bold text-white/40 uppercase tracking-widest">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
