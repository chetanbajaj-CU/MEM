import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { googleSignIn } from "../lib/firebase";
import { 
  Shield, 
  User as UserIcon, 
  Loader2, 
  CheckCircle2, 
  Sparkles,
  Info,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Login() {
  const { loginAsGuest } = useAuth();
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  const formatAuthError = (err: any) => {
    const code = err?.code;
    if (code === "auth/popup-closed-by-user") {
      return "";
    }
    if (code === "auth/popup-blocked") {
      return "The Google sign-in popup was blocked by your browser. Please allow popups for this site.";
    }
    if (code === "auth/network-request-failed") {
      return "Network connection issue. Please check your internet connection.";
    }
    if (code === "auth/cancelled-popup-request") {
      return "";
    }
    return err?.message || "An authentication error occurred. Please try again.";
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await googleSignIn();
    } catch (err: any) {
      const formatted = formatAuthError(err);
      if (formatted) setError(formatted);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError("");
    setGuestLoading(true);
    try {
      await loginAsGuest();
    } catch (err: any) {
      setError(formatAuthError(err));
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 lg:p-8 font-sans">
      <div className="w-full max-w-4xl flex rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-2xl relative">
        
        {/* Left Side: Visual / Motivational Branding */}
        <div className="hidden lg:flex w-1/2 relative p-12 flex-col justify-between overflow-hidden bg-zinc-950 border-r border-white/10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#CCFF00]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#CCFF00] rounded-xl flex items-center justify-center shadow-lg shadow-[#CCFF00]/20">
                <Shield className="w-6 h-6 text-black" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tighter uppercase text-white">Project <span className="text-[#CCFF00]">MEM</span></span>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Mind • Energy • Motion</span>
              </div>
            </div>
            
            <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-4">
              Your Daily System <br/><span className="text-[#CCFF00]">For Peak Performance</span>
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              Track nutrition with AI macro scans, follow clinical recovery protocols, execute periodized training, and conquer mental focus drills.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-xs text-zinc-300">
                <div className="w-5 h-5 rounded-full bg-[#CCFF00]/15 flex items-center justify-center text-[#CCFF00]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>Fast 1-click access with Google or Guest mode</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-300">
                <div className="w-5 h-5 rounded-full bg-[#CCFF00]/15 flex items-center justify-center text-[#CCFF00]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>Persistent workout streak & health tools access</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-300">
                <div className="w-5 h-5 rounded-full bg-[#CCFF00]/15 flex items-center justify-center text-[#CCFF00]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>Interactive Aarogya yoga guidance & MEM AI Coach</span>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 pt-8 border-t border-white/10">
            <div className="p-5 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-sm">
              <p className="text-zinc-300 text-sm italic mb-3">"We are what we repeatedly do. Excellence, then, is not an act, but a habit."</p>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#CCFF00] flex items-center justify-center">
                  <UserIcon className="w-3.5 h-3.5 text-black" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">Will Durant</p>
                  <p className="text-[10px] text-zinc-500">Athletic Philosophy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Sign In Interface */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-12 relative flex flex-col justify-center">
          
          {/* Mobile Brand Header */}
          <div className="mb-6 lg:hidden flex items-center gap-3">
            <div className="w-10 h-10 bg-[#CCFF00] rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="text-xl font-black uppercase tracking-tighter text-white">Project <span className="text-[#CCFF00]">MEM</span></span>
              <span className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500">Mind • Energy • Motion</span>
            </div>
          </div>

          <div className="w-full max-w-md mx-auto">
            
            {/* Header Titles */}
            <div className="mb-6 text-left">
              <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">
                Sign In to MEM
              </h1>
              <p className="text-xs text-zinc-400">
                Unlock daily workout programs, clinical diets, and high-performance recovery tools.
              </p>
            </div>

            {/* MANDATORY REMINDER INSTRUCTION LINE */}
            <div className="mb-6 p-4 rounded-2xl bg-zinc-900/90 border border-[#CCFF00]/40 shadow-[0_0_20px_rgba(204,255,0,0.1)] relative overflow-hidden">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-[#CCFF00]/15 text-[#CCFF00] shrink-0 mt-0.5">
                  <Info className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-black uppercase tracking-wider text-[#CCFF00] flex items-center gap-1.5">
                    <span>Sign-In Notice</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse"></span>
                  </div>
                  <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                    For now, please sign in only with <strong className="text-white font-bold underline decoration-[#CCFF00]">Continue as Guest</strong> or <strong className="text-white font-bold underline decoration-[#CCFF00]">Google</strong>. Email and Phone number sign-in are disabled at this time.
                  </p>
                </div>
              </div>
            </div>

            {/* Status Feedback / Errors */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -6 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -6 }}
                  className="bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-xl text-xs mb-5 flex items-start gap-2.5"
                >
                  <div className="mt-0.5 shrink-0"><Shield className="w-4 h-4 text-red-400" /></div>
                  <div className="space-y-1">
                    <p className="font-semibold">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* PRIMARY AUTH OPTIONS */}
            <div className="space-y-3.5">
              
              {/* Option 1: Continue with Google */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading || guestLoading}
                className="w-full bg-white hover:bg-zinc-100 text-black rounded-2xl py-3.5 px-4 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-200 disabled:opacity-50 shadow-lg shadow-white/5 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="py-2 flex items-center justify-center space-x-3">
                <span className="h-px flex-1 bg-white/10"></span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Or Instant Access</span>
                <span className="h-px flex-1 bg-white/10"></span>
              </div>

              {/* Option 2: Continue as Guest */}
              <button 
                type="button"
                onClick={handleGuestLogin}
                disabled={loading || guestLoading}
                className="w-full bg-zinc-900 hover:bg-zinc-800 border border-white/15 hover:border-[#CCFF00]/50 text-white rounded-2xl py-3.5 px-4 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-200 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-md group"
              >
                {guestLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#CCFF00]" />
                ) : (
                  <>
                    <UserIcon className="w-4 h-4 text-[#CCFF00] group-hover:scale-110 transition-transform" />
                    <span>Continue as Guest</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors ml-1" />
                  </>
                )}
              </button>
            </div>

            {/* Quick feature highlights */}
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-3 text-left">
              <div className="p-3 rounded-xl bg-zinc-950 border border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#CCFF00] block mb-0.5">Google Sign-In</span>
                <span className="text-[11px] text-zinc-400">Syncs your workouts across devices securely</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white block mb-0.5">Guest Mode</span>
                <span className="text-[11px] text-zinc-400">Instant access without entering credentials</span>
              </div>
            </div>

            {/* Privacy footnote */}
            <div className="mt-8 text-center text-[10px] text-zinc-600">
              By proceeding, you agree to Project MEM terms and athletic privacy standards.
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
