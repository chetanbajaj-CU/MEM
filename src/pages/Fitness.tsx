import { getLocalDateString } from "../lib/dateUtils";
import { Activity, Dumbbell, Play, Plus, Clock, Target, PlusCircle, MinusCircle, Flame, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { StopwatchTimer } from "../components/StopwatchTimer";
import { logWorkout } from "../lib/userStats";

const PROGRAMS = [
  { id: "p1", level: "Beginner", name: "Full Body Foundation", freq: "3 Days/Wk", desc: "Build foundational strength, squat and press form.", recommendedFor: "All ages" },
  { id: "p2", level: "Active Senior", name: "Mobility & Joint Care", freq: "3 Days/Wk", desc: "Low-impact balance, joint stability, and core.", recommendedFor: "Age 50+" },
  { id: "p3", level: "Intermediate", name: "Push Pull Legs Split", freq: "5-6 Days/Wk", desc: "Classic hypertrophy split focusing on target muscle groups.", recommendedFor: "Age 18-45" },
  { id: "p4", level: "Advanced", name: "Powerbuilding Elite", freq: "5 Days/Wk", desc: "Combine heavy compound lifts with hypertrophy volume.", recommendedFor: "Athletes" },
];

const DEFAULT_HABITS = [
  { id: "h1", name: "Drink 3L Water", current: 0, target: 3, unit: "L", step: 0.5, color: "bg-[#3BB1FF]" },
  { id: "h2", name: "Sleep 8 Hours", current: 0, target: 8, unit: "hrs", step: 1, color: "bg-[#9D4EDD]" },
  { id: "h3", name: "10,000 Steps", current: 0, target: 10000, unit: "steps", step: 1000, color: "bg-[#CCFF00]" },
];

export function Fitness() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"workouts" | "habits">("workouts");
  const [habits, setHabits] = useState(DEFAULT_HABITS);
  const [loggedMsg, setLoggedMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const today = getLocalDateString(new Date());
      const stored = localStorage.getItem(`fitness_habits_${user.uid}_${today}`);
      if (stored) {
        setHabits(JSON.parse(stored));
      } else if (!user.uid.startsWith("local-")) {
        // Fetch from Firestore
        import("firebase/firestore").then(({ doc, getDoc }) => {
          import("../lib/firebase").then(({ db }) => {
            getDoc(doc(db, "habits", `${user.uid}_${today}`)).then((snapshot) => {
              if (snapshot.exists()) {
                setHabits(snapshot.data().habits);
              }
            }).catch(() => {});
          });
        });
      }
    }
  }, [user]);

  const updateHabit = (id: string, increment: boolean) => {
    setHabits(prev => {
      const newHabits = prev.map(h => {
        if (h.id === id) {
          let newValue = increment ? h.current + h.step : h.current - h.step;
          newValue = Math.max(0, newValue);
          return { ...h, current: newValue };
        }
        return h;
      });
      if (user) {
        const today = getLocalDateString(new Date());
        localStorage.setItem(`fitness_habits_${user.uid}_${today}`, JSON.stringify(newHabits));
        if (!user.uid.startsWith("local-")) {
          import("firebase/firestore").then(({ doc, setDoc }) => {
            import("../lib/firebase").then(({ db }) => {
              setDoc(doc(db, "habits", `${user.uid}_${today}`), {
                userId: user.uid,
                date: today,
                habits: newHabits
              }).catch(() => {});
            });
          });
        }
      }
      return newHabits;
    });
  };

  const handleStartProgram = async (programName: string) => {
    if (user) {
      await logWorkout(user.uid);
      setLoggedMsg(`Started ${programName}! Logged to athlete streak.`);
      setTimeout(() => setLoggedMsg(null), 3000);
    }
  };

  return (
    <div className="space-y-4 pb-12 select-auto">
      {/* Mobile Title */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h1 className="text-xl font-black tracking-tight text-white uppercase">
            Fitness Hub
          </h1>
          <p className="text-[10px] font-bold tracking-wider uppercase text-zinc-400">
            Programs & Workout Tracking
          </p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-[#CCFF00]/10 border border-[#CCFF00]/30 flex items-center justify-center text-[#CCFF00]">
          <Dumbbell className="w-4 h-4" />
        </div>
      </div>

      {loggedMsg && (
        <div className="p-2.5 bg-[#CCFF00]/15 border border-[#CCFF00]/30 rounded-xl text-xs font-bold text-[#CCFF00] flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{loggedMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-900 border border-white/10 rounded-xl">
        <button
          onClick={() => setActiveTab("workouts")}
          className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition text-center ${
            activeTab === "workouts"
              ? "bg-[#CCFF00] text-black shadow"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Workout Programs
        </button>
        <button
          onClick={() => setActiveTab("habits")}
          className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition text-center ${
            activeTab === "habits"
              ? "bg-[#CCFF00] text-black shadow"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Daily Habit Tracker
        </button>
      </div>

      {activeTab === "workouts" && (
        <div className="space-y-3">
          {/* Programs List */}
          <div className="space-y-2.5">
            {PROGRAMS.map((program) => (
              <div 
                key={program.id} 
                className="bg-zinc-950 border border-white/10 p-3.5 rounded-2xl flex flex-col hover:border-white/20 transition-all shadow-sm"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="inline-flex items-center bg-[#CCFF00]/10 border border-[#CCFF00]/30 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider text-[#CCFF00]">
                    {program.level}
                  </span>
                  <span className="flex items-center gap-1 text-[9px] font-bold text-zinc-400">
                    <Clock className="w-3 h-3 text-zinc-500" /> {program.freq}
                  </span>
                </div>

                <h3 className="text-sm font-black uppercase text-white mb-0.5">{program.name}</h3>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#CCFF00] mb-1">{program.recommendedFor}</p>
                <p className="text-[10px] text-zinc-400 mb-3 leading-relaxed font-medium">{program.desc}</p>

                <button 
                  onClick={() => handleStartProgram(program.name)}
                  className="w-full flex items-center justify-center gap-1.5 bg-white hover:bg-[#CCFF00] px-3 py-2 text-[10px] font-black uppercase tracking-wider text-black rounded-xl active:scale-95 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-black" /> Start Routine
                </button>
              </div>
            ))}
          </div>

          {/* Stopwatch Timer Component */}
          <StopwatchTimer />
        </div>
      )}

      {activeTab === "habits" && (
        <div className="space-y-3">
          <div className="bg-zinc-950 border border-white/10 p-3.5 rounded-2xl space-y-3 shadow-sm">
            <h2 className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Today's Metric Targets</h2>
            <div className="space-y-3">
              {habits.map((habit) => {
                const percentage = Math.min((habit.current / habit.target) * 100, 100);
                const barColor = habit.color;
                return (
                  <div key={habit.id} className="space-y-1.5 bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-white">
                      <span>{habit.name}</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateHabit(habit.id, false)} 
                          className="hover:text-white/60 p-1 active:scale-90 transition-transform"
                        >
                          <MinusCircle className="w-4 h-4 text-zinc-400" />
                        </button>
                        <span className="text-zinc-300 font-mono text-[10px] min-w-[65px] text-center">
                          {habit.current} / {habit.target} <span className="text-zinc-500">{habit.unit}</span>
                        </span>
                        <button 
                          onClick={() => updateHabit(habit.id, true)} 
                          className="hover:text-white/60 p-1 active:scale-90 transition-transform"
                        >
                          <PlusCircle className="w-4 h-4 text-[#CCFF00]" />
                        </button>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${barColor} transition-all duration-300 rounded-full`} 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="bg-zinc-950 border border-white/10 p-3.5 rounded-2xl space-y-2">
            <h2 className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Suggested Daily Habits</h2>
            <div className="grid grid-cols-2 gap-2">
              {["Breathwork", "Daily Walk", "Joint Mobility", "Sleep 8h"].map((item) => (
                <div key={item} className="flex items-center gap-2 p-2.5 border border-white/10 bg-black/40 rounded-xl">
                  <Target className="w-3.5 h-3.5 text-[#CCFF00] shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white truncate">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
