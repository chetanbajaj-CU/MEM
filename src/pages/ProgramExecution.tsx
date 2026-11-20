import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logWorkout } from "../lib/userStats";
import { ArrowLeft, Play, Pause, CheckCircle, Clock, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { getContextualProgramImage } from "../lib/contextualProgramImages";

const PROGRAM_DATA: Record<string, any> = {
  "gp1": {
    name: "Full Body Foundation",
    days: [
      { day: 1, title: "Workout A: Lower Body & Push", exercises: ["Squats 3x10", "Push-ups 3x10", "Plank 3x30s"] },
      { day: 2, title: "Rest & Recovery", exercises: [] },
      { day: 3, title: "Workout B: Upper Body Pull & Core", exercises: ["Dumbbell Rows 3x10", "Bicep Curls 3x12", "Crunches 3x15"] },
    ]
  },
  "gp2": {
    name: "Active Aging Mobility",
    days: [
      { day: 1, title: "Joint Mobility", exercises: ["Neck Rotations 3x10", "Shoulder Circles 3x15", "Hip Hinges 3x12"] },
      { day: 2, title: "Light Resistance", exercises: ["Band Pull-aparts 3x15", "Bodyweight Squats 3x10"] },
      { day: 3, title: "Balance & Core", exercises: ["Single-leg Stands 3x30s", "Bird-Dogs 3x10"] },
    ]
  },
  "gp3": {
    name: "Hypertrophy PPL",
    days: [
      { day: 1, title: "Push (Chest, Shoulders, Triceps)", exercises: ["Bench Press 4x8-10", "Overhead Press 3x10", "Tricep Pushdowns 3x12-15"] },
      { day: 2, title: "Pull (Back, Biceps)", exercises: ["Barbell Rows 4x8", "Lat Pulldowns 3x10-12", "Hammer Curls 3x12"] },
      { day: 3, title: "Legs (Quads, Hams, Calves)", exercises: ["Squats 4x8", "Romanian Deadlifts 3x10", "Calf Raises 4x15"] },
      { day: 4, title: "Push (Chest, Shoulders, Triceps)", exercises: ["Incline Dumbbell Press 4x8", "Lateral Raises 4x15", "Overhead Tricep Ext 3x12"] },
      { day: 5, title: "Pull (Back, Biceps)", exercises: ["Pull-ups 4xMax", "Seated Cable Rows 3x10", "Preacher Curls 3x12"] },
      { day: 6, title: "Legs (Quads, Hams, Calves)", exercises: ["Leg Press 4x10", "Leg Curls 4x12", "Seated Calf Raises 4x15"] },
    ]
  },
  "gp4": {
    name: "Powerbuilding Elite",
    days: [
      { day: 1, title: "Heavy Lower", exercises: ["Back Squat 5x5", "Leg Press 3x10", "Calf Raises 4x15"] },
      { day: 2, title: "Heavy Upper", exercises: ["Bench Press 5x5", "Barbell Row 4x8", "Overhead Press 3x8"] },
      { day: 3, title: "Hypertrophy Lower", exercises: ["Front Squat 4x8", "Romanian Deadlift 3x10", "Leg Curls 3x12"] },
      { day: 4, title: "Hypertrophy Upper", exercises: ["Incline Bench 4x8", "Pull-ups 4x8", "Dumbbell Shoulder Press 3x10"] },
      { day: 5, title: "Arms & Weak Points", exercises: ["Barbell Curls 4x10", "Skull Crushers 4x10", "Face Pulls 3x15"] },
    ]
  },
  "gp5": {
    name: "HIIT Fat Burn",
    days: [
      { day: 1, title: "Sprint Intervals", exercises: ["Treadmill Sprints 10x30s", "Burpees 3x15", "Mountain Climbers 3x30s"] },
      { day: 2, title: "Active Recovery", exercises: ["Light Jog 20m", "Stretching"] },
      { day: 3, title: "Circuit Training", exercises: ["Kettlebell Swings 4x15", "Box Jumps 4x10", "Plank 4x45s"] },
      { day: 4, title: "Full Body Tabata", exercises: ["Jump Squats 8x20s", "Push-ups 8x20s", "High Knees 8x20s"] },
    ]
  },
  "gp6": {
    name: "Youth Athletic Base",
    days: [
      { day: 1, title: "Speed & Agility", exercises: ["Ladder Drills 5m", "Cone Drills 5m", "Box Jumps 3x8"] },
      { day: 2, title: "Bodyweight Strength", exercises: ["Push-ups 3x12", "Pull-ups 3x5", "Bodyweight Squats 3x15"] },
      { day: 3, title: "Core & Stability", exercises: ["Medicine Ball Throws 3x10", "Plank 3x30s", "Side Plank 3x20s"] },
    ]
  }
};


export function ProgramExecution() {
  const { programId } = useParams();
  const [program, setProgram] = useState<any>(null);
  
  const [activeTimer, setActiveTimer] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [customName, setCustomName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFinishing, setIsFinishing] = useState(false);


  const handleFinishWorkout = async () => {
    if (!user) return;
    setIsFinishing(true);
    try {
      await logWorkout(user.uid);
      navigate("/profile");
    } catch (e) {
      console.error(e);
      setIsFinishing(false);
    }
  };

  useEffect(() => {
    let p: any = null;
    if (programId && programId.startsWith("ai-") && user) {
      const stored = localStorage.getItem(`programs_${user.uid}_ai_programs`);
      if (stored) {
        const parsed = JSON.parse(stored);
        p = parsed.find((x: any) => x.id === programId);
        if (p) {
          setProgram(p);
          setCustomName(p.name);
        }
      } else if (!user.uid.startsWith("local-guest")) {
        import("firebase/firestore").then(({ doc, getDoc }) => {
          import("../lib/firebase").then(({ db }) => {
             getDoc(doc(db, "programs", `${user.uid}_ai_programs`)).then((snapshot) => {
               if (snapshot.exists()) {
                 const parsed = snapshot.data().programs;
                 p = parsed.find((x: any) => x.id === programId);
                 if (p) {
                   setProgram(p);
                   setCustomName(p.name);
                 }
               }
             }).catch(() => {});
          });
        });
      }
    }
    
    if (!programId || !programId.startsWith("ai-") || !user) {
      p = programId && PROGRAM_DATA[programId] ? PROGRAM_DATA[programId] : PROGRAM_DATA["gp1"];
      setProgram(p);
      setCustomName(p.name);
    }
  }, [programId, user]);

  useEffect(() => {

    let interval: any;
    if (timerRunning && activeTimer !== null && activeTimer > 0) {
      interval = setInterval(() => {
        setActiveTimer(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (activeTimer === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, activeTimer]);

  const startRest = (seconds: number) => {
    setActiveTimer(seconds);
    setTimerRunning(true);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const toggleExercise = (id: string) => {
    setCompletedExercises(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };


  if (!program) return <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]"><div className="w-8 h-8 border-4 border-[#CCFF00] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/programs" className="text-white/60 hover:text-white transition">
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
        </Link>
        {isEditingName ? (
          <input 
            type="text" 
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            onBlur={() => setIsEditingName(false)}
            onKeyDown={(e) => { if (e.key === 'Enter') setIsEditingName(false); }}
            autoFocus
            className="bg-transparent text-3xl font-black tracking-tighter text-white uppercase border-b border-white/40 focus:outline-none focus:border-[#CCFF00]"
          />
        ) : (
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase">{customName} - Active Execution</h1>
            <button 
              onClick={() => setIsEditingName(true)}
              className="text-white/40 hover:text-[#CCFF00] transition-colors"
              title="Change the name"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
            </button>
          </div>
        )}
      </div>

      {/* High-Definition Contextual Workout Environment Banner */}
      <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
        <img 
          src={program.hdImage || getContextualProgramImage(program)} 
          alt={program.name || "Workout Routine"} 
          className="w-full h-full object-cover" 
          referrerPolicy="no-referrer" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#CCFF00] bg-black/80 px-2 py-0.5 rounded border border-[#CCFF00]/30 inline-flex items-center gap-1 mb-1">
              <Sparkles className="w-2.5 h-2.5 text-[#CCFF00]" /> {program.customVisualBadge || "In-Context Routine Environment"}
            </span>
            <h2 className="text-lg sm:text-2xl font-black uppercase text-white tracking-tight">
              {program.name}
            </h2>
            {program.visualAtmosphere && (
              <p className="text-xs text-zinc-300 font-medium max-w-xl line-clamp-1">
                {program.visualAtmosphere}
              </p>
            )}
          </div>
          {program.primaryEquipment && (
            <div className="text-[10px] font-mono text-zinc-400 bg-black/80 px-2.5 py-1 rounded border border-white/10 shrink-0 self-start sm:self-end">
              Gear: <span className="text-white font-bold">{program.primaryEquipment}</span>
            </div>
          )}
        </div>
      </div>

      {activeTimer !== null && (
        <div className="bg-[#CCFF00] text-black p-6 flex flex-col items-center justify-center rounded-sm">
          <p className="text-xs font-bold uppercase tracking-widest mb-2">Rest Timer</p>
          <div className="text-6xl font-black">{formatTime(activeTimer)}</div>
          <div className="flex gap-4 mt-4">
            <button onClick={() => setTimerRunning(!timerRunning)} className="bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-black/80">
              {timerRunning ? <Pause className="w-4 h-4 md:w-5 md:h-5 inline" /> : <Play className="w-4 h-4 md:w-5 md:h-5 inline" />} {timerRunning ? "Pause" : "Resume"}
            </button>
            <button onClick={() => {setActiveTimer(null); setTimerRunning(false);}} className="border border-black px-4 py-2 text-xs font-bold uppercase tracking-widest">
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {program.days.map((day: any) => (
          <div key={day.day} className="bg-white/5 border border-white/10 p-6">
            <h3 className="text-xl font-black uppercase text-[#CCFF00] mb-4">Day {day.day}: {day.title}</h3>
            {day.exercises.length > 0 ? (
              <ul className="space-y-4">
                {day.exercises.map((ex: string, idx: number) => {
                  const exId = `${day.day}-${idx}`;
                  const isDone = completedExercises.has(exId);
                  
                  return (
                  <li key={idx} className={`flex justify-between items-center border-b border-white/10 pb-4 transition-all duration-300 ${isDone ? 'opacity-50' : ''}`}>
                    <span className={`text-sm font-bold text-white ${isDone ? 'line-through text-white/50' : ''}`}>{ex}</span>
                    <div className="flex gap-2">
                      <button onClick={() => startRest(90)} className="text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white border border-white/20 px-3 py-1 flex items-center gap-1 transition-colors">
                        <Clock className="w-3 h-3 md:w-4 md:h-4" /> Rest 90s
                      </button>
                      <button 
                        onClick={() => toggleExercise(exId)}
                        className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 flex items-center gap-1 transition-colors ${isDone ? 'bg-[#CCFF00] text-black hover:bg-[#b3e600]' : 'bg-white/10 text-white hover:bg-white/20'}`}
                      >
                        <CheckCircle className="w-3 h-3 md:w-4 md:h-4" /> {isDone ? 'Done' : 'Mark Done'}
                      </button>
                    </div>
                  </li>
                )})}
              </ul>
            ) : (
              <p className="text-sm text-white/40 font-bold uppercase tracking-widest">Rest day - focus on hydration and mobility.</p>
            )}
          </div>
        ))}
      </div>
      <div className="pt-8 border-t border-white/10 flex justify-end">
        <button 
          onClick={handleFinishWorkout}
          disabled={isFinishing || completedExercises.size === 0}
          className="bg-[#CCFF00] text-black px-8 py-4 text-sm font-black uppercase tracking-widest hover:bg-[#b3e600] transition disabled:opacity-50"
        >
          {isFinishing ? "Saving..." : "Finish Workout & Save"}
        </button>
      </div>
    </div>
  );
}
