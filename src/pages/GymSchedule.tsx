import { useState } from "react";
import { Dumbbell, Apple, ChevronRight, CheckCircle2, Flame, Calendar, Trophy, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { logWorkout } from "../lib/userStats";

const PROGRESSION_CHART = [
  { level: "Beginner", duration: "0-6 Mo", focus: "Form, Base Strength", frequency: "3 Days/Wk" },
  { level: "Intermediate", duration: "6-24 Mo", focus: "Hypertrophy Overload", frequency: "4-5 Days/Wk" },
  { level: "Advanced", duration: "2-5 Yrs", focus: "Weakpoint Periodization", frequency: "5-6 Days/Wk" },
  { level: "Elite", duration: "5+ Yrs", focus: "Peak Micro-cycling", frequency: "6 Days/Wk" }
];

const SCHEDULES = {
  "18-35": [
    { day: "Monday", short: "Mon", type: "Heavy Push (Chest, Shoulders, Triceps)", exercises: ["Barbell Bench Press 4×8", "Overhead Press 3×10", "Incline DB Flyes 3×12", "Tricep Pushdowns 3×12"], nutrition: "High Carb • Oats, Rice, Lean Chicken Breast" },
    { day: "Tuesday", short: "Tue", type: "Heavy Pull (Back, Biceps, Rear Delts)", exercises: ["Barbell Bent Rows 4×8", "Weighted Pull-ups 3×Max", "Face Pulls 4×15", "Barbell Curls 3×12"], nutrition: "High Carb • Sweet Potatoes, Salmon, Greens" },
    { day: "Wednesday", short: "Wed", type: "Active Recovery & Mobility", exercises: ["30min Zone 2 Cardio", "Thoracic Spine Mobility", "Hip Opener Flow"], nutrition: "Low Carb, High Protein & Fats • Eggs, Avocado" },
    { day: "Thursday", short: "Thu", type: "Legs & Core Power", exercises: ["Barbell Squats 4×8", "Romanian Deadlifts 3×10", "Bulgarian Split Squats 3×10/leg", "Hanging Leg Raises 3×15"], nutrition: "Highest Carb • Pasta, Lean Beef, Spinach" },
    { day: "Friday", short: "Fri", type: "Hypertrophy Upper Body", exercises: ["Incline Dumbbell Press 3×12", "Lat Pulldowns 3×12", "Lateral Raises 4×15", "Hammer Curls 3×12"], nutrition: "Moderate Carb • Quinoa, Turkey Breast" },
    { day: "Saturday", short: "Sat", type: "Hypertrophy Lower Body & Calves", exercises: ["Leg Press 3×12", "Hamstring Curls 3×15", "Seated Calf Raises 4×20", "Plank Hold 3×60s"], nutrition: "Moderate Carb • Rice Cakes, Whey Shake" },
    { day: "Sunday", short: "Sun", type: "Complete Recovery & Rest", exercises: ["Rest, Light 20min Walk", "Hydration Focus 3-4L", "Mental Re-center"], nutrition: "Maintenance Macros • Balanced Protein & Micronutrients" }
  ],
  "36-50": [
    { day: "Monday", short: "Mon", type: "Upper Body Strength & Joint Prep", exercises: ["Dumbbell Press 3×10", "Seated Cable Rows 3×10", "Rotator Cuff External Rotations 3×15"], nutrition: "Moderate Carb, High Omega-3 • Salmon, Jasmine Rice" },
    { day: "Tuesday", short: "Tue", type: "Lower Body Strength & Mobility", exercises: ["Goblet Squats 3×12", "Glute Bridges 3×15", "Hip Flexor Mobilization"], nutrition: "Moderate Carb • Sweet Potato, Chicken" },
    { day: "Wednesday", short: "Wed", type: "Yoga / Active Recovery", exercises: ["45min Vinyasa Flow or Mat Pilates", "Breathwork"], nutrition: "Low Carb • Anti-inflammatory Salads, Extra Virgin Olive Oil" },
    { day: "Thursday", short: "Thu", type: "Upper Body Hypertrophy", exercises: ["Push-ups 3×Max", "Chest Supported DB Rows 3×12", "Cable Tricep Extensions 3×15"], nutrition: "Moderate Carb • Quinoa, Grass-fed Beef" },
    { day: "Friday", short: "Fri", type: "Lower Body & Core Stability", exercises: ["Walking Lunges 3×12/leg", "Step-ups 3×10/leg", "Deadbugs 3×20"], nutrition: "High Carb • Whole Grain Pasta, Chicken" },
    { day: "Saturday", short: "Sat", type: "LISS Cardio & Outdoor Walk", exercises: ["45-60min Hiking or Cycling", "Hydration Focus"], nutrition: "Balanced Macros • Greek Yogurt, Berries" },
    { day: "Sunday", short: "Sun", type: "Complete Rest & Mindfulness", exercises: ["Rest, Guided Meditation, Light Stretch"], nutrition: "High Protein • Anti-inflammatory Foods, Green Tea" }
  ],
  "50+": [
    { day: "Monday", short: "Mon", type: "Full Body Machine Circuit", exercises: ["Chest Press Machine 3×12", "Seated Cable Row 3×12", "Leg Press Machine 3×12"], nutrition: "High Protein, Calcium-rich • Greek Yogurt, Bone Broth" },
    { day: "Tuesday", short: "Tue", type: "Light Cardio & Full Body Stretch", exercises: ["20min Stationary Bike (Zone 2)", "Full Body Static Stretching"], nutrition: "Balanced • Oats, Wild Berries, Eggs" },
    { day: "Wednesday", short: "Wed", type: "Core & Balance Training", exercises: ["Bird-Dogs 3×10/side", "Single-leg Stork Balance 3×30s", "Modified Forearm Planks"], nutrition: "Low GI Carbs • Lentils, Steamed Chicken" },
    { day: "Thursday", short: "Thu", type: "Resistance Band & DB Circuit", exercises: ["Band Chest Press 3×15", "Band Row 3×15", "DB Goblet Squat 3×10"], nutrition: "High Protein • Turkey Breast, Quinoa, Broccoli" },
    { day: "Friday", short: "Fri", type: "Low-Impact Swimming / Aerobics", exercises: ["30min Low-Impact Swimming or Pool Walking"], nutrition: "Moderate Carb • Roasted Sweet Potato, Salmon" },
    { day: "Saturday", short: "Sat", type: "Active Recovery Walk", exercises: ["30-45min Brisk Nature Walk in Sun"], nutrition: "Anti-inflammatory • Walnuts, Spinach, Olive Oil" },
    { day: "Sunday", short: "Sun", type: "Joint Restoration & Rest", exercises: ["Neck, Shoulder & Hip Joint Rotations", "Rest"], nutrition: "Maintenance Calories • High Fiber & Hydration" }
  ]
};

export function GymSchedule() {
  const [ageGroup, setAgeGroup] = useState<"18-35" | "36-50" | "50+">("18-35");
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [viewMode, setViewMode] = useState<"focused" | "all">("focused");
  const [completedDays, setCompletedDays] = useState<Record<string, boolean>>({});
  const [loggedNotice, setLoggedNotice] = useState<string | null>(null);
  const { user } = useAuth();

  const currentSchedule = SCHEDULES[ageGroup];
  const activeDay = currentSchedule[selectedDayIdx];

  const handleToggleComplete = async (dayKey: string) => {
    const isNowDone = !completedDays[dayKey];
    setCompletedDays(prev => ({ ...prev, [dayKey]: isNowDone }));
    
    if (isNowDone && user) {
      await logWorkout(user.uid);
      setLoggedNotice(`Workout for ${dayKey} logged to your athlete streak!`);
      setTimeout(() => setLoggedNotice(null), 3000);
    }
  };

  return (
    <div className="space-y-5 pb-12 select-auto">
      {/* Mobile Title Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h1 className="text-xl font-black tracking-tight text-white uppercase">
            Gym Routine Chart
          </h1>
          <p className="text-[10px] font-bold tracking-wider uppercase text-zinc-400">
            Age-Paired Workout & Nutrition
          </p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-[#CCFF00]/10 border border-[#CCFF00]/30 flex items-center justify-center text-[#CCFF00]">
          <Dumbbell className="w-4 h-4" />
        </div>
      </div>

      {/* Age Group Switcher */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
          Target Age Demographic
        </span>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-900 border border-white/10 rounded-xl">
          {(["18-35", "36-50", "50+"] as const).map((age) => (
            <button
              key={age}
              onClick={() => setAgeGroup(age)}
              className={`py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition text-center ${
                ageGroup === age
                  ? "bg-[#CCFF00] text-black shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Age {age}
            </button>
          ))}
        </div>
      </div>

      {/* 7-Day Mobile Carousel Navigation */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Select Training Day
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === "focused" ? "all" : "focused")}
              className="text-[9px] font-bold uppercase tracking-wider text-[#CCFF00] hover:underline"
            >
              {viewMode === "focused" ? "Show All 7 Days" : "Show Day Focus"}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {currentSchedule.map((plan, i) => {
            const isSelected = selectedDayIdx === i;
            const isDone = completedDays[`${ageGroup}-${plan.day}`];
            return (
              <button
                key={plan.day}
                onClick={() => {
                  setSelectedDayIdx(i);
                  setViewMode("focused");
                }}
                className={`flex-1 min-w-[44px] py-2 px-1 rounded-xl flex flex-col items-center justify-center transition border ${
                  isSelected
                    ? "bg-[#CCFF00] text-black border-[#CCFF00] shadow-[0_0_12px_rgba(204,255,0,0.3)] font-black"
                    : isDone
                    ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-400 font-bold"
                    : "bg-zinc-900 border-white/10 text-zinc-400 hover:text-white font-bold"
                }`}
              >
                <span className="text-[10px] uppercase">{plan.short}</span>
                <span className="text-[8px] opacity-75">D{i + 1}</span>
                {isDone && <CheckCircle2 className="w-2.5 h-2.5 mt-0.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Success Notification */}
      {loggedNotice && (
        <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{loggedNotice}</span>
        </div>
      )}

      {/* Focused Day Card (Native Mobile Card View) */}
      {viewMode === "focused" ? (
        <div className="bg-zinc-950 border border-white/15 rounded-2xl p-4 space-y-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#CCFF00]/5 rounded-full blur-2xl pointer-events-none" />

          {/* Card Header */}
          <div className="flex items-start justify-between border-b border-white/10 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black uppercase text-white tracking-tight">
                  {activeDay.day}
                </span>
                <span className="text-[9px] font-mono font-bold bg-[#CCFF00]/15 text-[#CCFF00] px-2 py-0.5 rounded">
                  Day {selectedDayIdx + 1} of 7
                </span>
              </div>
              <p className="text-xs font-black uppercase text-[#CCFF00] mt-0.5">
                {activeDay.type}
              </p>
            </div>

            <button
              onClick={() => handleToggleComplete(`${ageGroup}-${activeDay.day}`)}
              className={`p-2 rounded-xl border transition flex items-center gap-1.5 text-xs font-bold uppercase ${
                completedDays[`${ageGroup}-${activeDay.day}`]
                  ? "bg-emerald-500 text-black border-emerald-500"
                  : "bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-[10px]">
                {completedDays[`${ageGroup}-${activeDay.day}`] ? "Done" : "Mark Done"}
              </span>
            </button>
          </div>

          {/* Exercises Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              <Dumbbell className="w-3.5 h-3.5 text-[#CCFF00]" />
              <span>Target Exercise Protocol</span>
            </div>
            <div className="bg-zinc-900/90 border border-white/10 rounded-xl p-3 space-y-1.5">
              {Array.isArray(activeDay.exercises) ? (
                activeDay.exercises.map((ex, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-white/90">
                    <span className="w-4 h-4 rounded-full bg-white/10 text-white/60 flex items-center justify-center text-[9px] font-mono">
                      {idx + 1}
                    </span>
                    <span>{ex}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-white/90">{activeDay.exercises}</p>
              )}
            </div>
          </div>

          {/* Nutrition Protocol Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              <Apple className="w-3.5 h-3.5 text-[#3BB1FF]" />
              <span>Paired Nutrition Strategy</span>
            </div>
            <div className="bg-zinc-900/90 border border-white/10 rounded-xl p-3 text-xs text-zinc-200">
              {activeDay.nutrition}
            </div>
          </div>

          {/* Navigation between days */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <button
              onClick={() => setSelectedDayIdx((selectedDayIdx - 1 + 7) % 7)}
              className="text-xs text-zinc-400 hover:text-white font-bold uppercase tracking-wider"
            >
              &larr; Previous Day
            </button>
            <button
              onClick={() => setSelectedDayIdx((selectedDayIdx + 1) % 7)}
              className="text-xs text-[#CCFF00] hover:underline font-bold uppercase tracking-wider"
            >
              Next Day &rarr;
            </button>
          </div>
        </div>
      ) : (
        /* All 7 Days Expanded List */
        <div className="space-y-2.5">
          {currentSchedule.map((plan, i) => (
            <div
              key={plan.day}
              className="bg-zinc-950 border border-white/10 rounded-xl p-3 space-y-2 hover:border-white/20 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black uppercase text-white">
                    {plan.day} <span className="text-[10px] text-zinc-500 font-mono">Day {i + 1}</span>
                  </h4>
                  <p className="text-[11px] font-bold text-[#CCFF00] uppercase">
                    {plan.type}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedDayIdx(i);
                    setViewMode("focused");
                  }}
                  className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-bold uppercase text-white hover:bg-white/10"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Progression Roadmap: Compact 2x2 Grid for Mobile */}
      <div className="space-y-2 pt-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
          Progression Levels (Beginner to Elite)
        </span>
        <div className="grid grid-cols-2 gap-2">
          {PROGRESSION_CHART.map((stage, i) => (
            <div
              key={stage.level}
              className="bg-zinc-950 border border-white/10 p-3 rounded-xl relative overflow-hidden"
            >
              <span className="text-[8px] font-mono text-[#CCFF00] font-bold block mb-0.5">
                STAGE 0{i + 1} • {stage.duration}
              </span>
              <h3 className="text-xs font-black uppercase text-white">{stage.level}</h3>
              <p className="text-[10px] text-zinc-400 mt-1 leading-snug">{stage.focus}</p>
              <span className="text-[9px] text-[#CCFF00] font-bold block mt-1.5">
                {stage.frequency}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
