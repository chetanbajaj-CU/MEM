import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getLocalDateString } from "../lib/dateUtils";
import { Bell, X } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

export function ReminderToast() {
  const { user } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!user) return;

    const checkReminder = () => {
      const now = new Date();
      if (now.getHours() >= 20) { // 8 PM
        const today = getLocalDateString(now);
        const dismissed = localStorage.getItem(`dismissed_reminder_${user.uid}_${today}`);
        if (dismissed) {
          setShow(false);
          return;
        }

        const storedDataStr = localStorage.getItem(`daily_data_${user.uid}_${today}`);
        let completed = false;
        
        if (storedDataStr) {
          try {
            const storedData = JSON.parse(storedDataStr);
            if (storedData.habits) {
              const allCompleted = Object.values(storedData.habits).every(v => v === true);
              if (allCompleted) {
                completed = true;
              }
            }
          } catch (e) {
            console.error("Failed to parse daily data", e);
          }
        }

        if (!completed) {
          setShow(true);
        } else {
          setShow(false);
        }
      } else {
        setShow(false);
      }
    };

    checkReminder();
    const interval = setInterval(checkReminder, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [user]);

  const handleDismiss = () => {
    if (!user) return;
    const today = getLocalDateString(new Date());
    localStorage.setItem(`dismissed_reminder_${user.uid}_${today}`, "true");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-24 right-6 w-80 bg-[#0A0A0A] border border-[#CCFF00]/50 shadow-[0_0_20px_rgba(204,255,0,0.2)] p-4 rounded-sm z-[60] flex items-start gap-4"
        >
          <div className="bg-[#CCFF00]/10 p-2 rounded-full flex-shrink-0 text-[#CCFF00]">
            <Bell className="w-5 h-5 animate-[ping_2s_ease-in-out_infinite]" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-black uppercase text-white mb-1">Evening Reminder</h4>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-3 leading-relaxed">You haven't completed your daily objectives yet.</p>
            <Link 
              to="/" 
              onClick={() => setShow(false)}
              className="inline-block bg-[#CCFF00] text-black px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-[#b3ff00] transition-colors"
            >
              Complete Now
            </Link>
          </div>
          <button onClick={handleDismiss} className="text-white/40 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
