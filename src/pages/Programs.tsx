import { Calendar, Play, Clock, Info, ShieldAlert, CheckCircle, ChevronDown, ChevronUp, Activity, Dumbbell, TrendingUp, Zap, Flame, ShieldPlus, Trash2, Sparkles, Loader2, RotateCcw, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { APP_IMAGES } from "../lib/appImages";
import { KineticFigure } from "../components/KineticFigure";
import { getContextualProgramImage, CONTEXTUAL_THEMES } from "../lib/contextualProgramImages";

const GYM_PROGRAMS = [
  { 
    id: "gp1", 
    level: "Beginner", 
    name: "Full Body Foundation", 
    freq: "3 Days/Week", 
    desc: "Perfect for getting started. Build foundational strength using compound movements.", 
    extendedDesc: "This program introduces you to fundamental movement patterns: squat, hinge, push, and pull. You will train full-body 3 days a week, ensuring adequate recovery. Expect steady strength gains and improved muscular endurance.",
    ageGroup: "All Ages", 
    category: "Strength",
    color: "bg-[#3BB1FF]",
    textColor: "text-[#3BB1FF]",
    icon: Dumbbell,
    hdImage: APP_IMAGES.strengthFoundationHd,
    kineticType: "lifter" as const
  },
  { 
    id: "gp2", 
    level: "Beginner", 
    name: "Active Aging Mobility", 
    freq: "3 Days/Week", 
    desc: "Low-impact mobility and functional strength training designed for longevity and joint health.", 
    extendedDesc: "Focuses on maintaining independence and improving quality of life. Workouts emphasize balance, core stability, and gentle resistance to strengthen joints without excessive wear and tear.",
    ageGroup: "Age 50+", 
    category: "Mobility",
    color: "bg-[#9D4EDD]",
    textColor: "text-[#9D4EDD]",
    icon: Activity,
    hdImage: APP_IMAGES.mobilityAgingHd,
    kineticType: "mobility" as const
  },
  { 
    id: "gp3", 
    level: "Intermediate", 
    name: "Hypertrophy PPL", 
    freq: "6 Days/Week", 
    desc: "Classic Push-Pull-Legs split focusing on building muscle mass and definition.", 
    extendedDesc: "A 6-day split designed for maximum muscle growth (hypertrophy). By splitting body parts into push, pull, and legs, you can hit every muscle group twice a week with high volume and intensity.",
    ageGroup: "Age 18-40", 
    category: "Muscle Gain",
    color: "bg-[#CCFF00]",
    textColor: "text-[#CCFF00]",
    icon: TrendingUp,
    hdImage: APP_IMAGES.hypertrophyPplHd,
    kineticType: "lifter" as const
  },
  { 
    id: "gp4", 
    level: "Advanced", 
    name: "Powerbuilding Elite", 
    freq: "5 Days/Week", 
    desc: "Combine strength and size with heavy compound movements. Not for the faint of heart.", 
    extendedDesc: "Bridging the gap between powerlifting and bodybuilding. You will start sessions with heavy, low-rep compound lifts to build raw strength, followed by higher-rep accessory work for muscle size.",
    ageGroup: "Age 18-35", 
    category: "Power",
    color: "bg-[#FF3366]",
    textColor: "text-[#FF3366]",
    icon: Zap,
    hdImage: APP_IMAGES.powerbuildingEliteHd,
    kineticType: "lifter" as const
  },
  { 
    id: "gp5", 
    level: "Intermediate", 
    name: "HIIT Fat Burn", 
    freq: "4 Days/Week", 
    desc: "High-intensity intervals combined with light resistance to maximize caloric burn.", 
    extendedDesc: "Short, intense bursts of exercise followed by brief recovery periods. Designed to elevate your heart rate rapidly, boosting your metabolism and burning calories long after the workout ends.",
    ageGroup: "Age 18-45", 
    category: "Weight Loss",
    color: "bg-[#FF8C00]",
    textColor: "text-[#FF8C00]",
    icon: Flame,
    hdImage: APP_IMAGES.hiitBurstMotion,
    kineticType: "sprinter" as const
  },
  { 
    id: "gp6", 
    level: "Beginner", 
    name: "Youth Athletic Base", 
    freq: "3 Days/Week", 
    desc: "Safe, guided bodyweight and light resistance training for young athletes building coordination.", 
    extendedDesc: "Prioritizes form, agility, and fundamental body mechanics over heavy lifting. Builds a resilient athletic foundation for sports performance and injury prevention in growing bodies.",
    ageGroup: "Age 12-18", 
    category: "Athleticism",
    color: "bg-[#3BB1FF]",
    textColor: "text-[#3BB1FF]",
    icon: ShieldPlus,
    hdImage: APP_IMAGES.youthAthleticHd,
    kineticType: "agility" as const
  }
];

const getProgramAccent = (program: any) => {
  if (program.color?.includes("3BB1FF")) return "#3BB1FF";
  if (program.color?.includes("9D4EDD")) return "#9D4EDD";
  if (program.color?.includes("FF3366")) return "#FF3366";
  if (program.color?.includes("FF8C00")) return "#FF8C00";
  if (program.imageContext === "cardio") return "#FF8C00";
  if (program.imageContext === "calisthenics") return "#3BB1FF";
  if (program.imageContext === "mobility") return "#9D4EDD";
  return "#CCFF00";
};

const getKineticLabel = (type?: string) => {
  switch (type) {
    case "lifter": return "Iron Force";
    case "sprinter": return "Sprint Speed";
    case "agility": return "Decel & Plyo";
    case "mobility": return "Joint Mobility";
    case "zen": return "Neural Focus";
    case "scanner": return "Biometric Scan";
    default: return "Athletic Motion";
  }
};

export function Programs() {


  const [activeProgram, setActiveProgram] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrograms, setAiPrograms] = useState<any[]>([]);
  const [aiError, setAiError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`programs_${user.uid}_ai_programs`);
      if (stored) {
        setAiPrograms(JSON.parse(stored).map((p: any) => ({...p, icon: Sparkles})));
      } else if (!user.uid.startsWith("local-guest")) {
        import("firebase/firestore").then(({ doc, getDoc }) => {
          import("../lib/firebase").then(({ db }) => {
             getDoc(doc(db, "programs", `${user.uid}_ai_programs`)).then((snapshot) => {
               if (snapshot.exists()) {
                 const parsed = snapshot.data().programs.map((p: any) => ({...p, icon: Sparkles}));
                 setAiPrograms(parsed);
                 localStorage.setItem(`programs_${user.uid}_ai_programs`, JSON.stringify(snapshot.data().programs));
               }
             }).catch(() => {});
          });
        });
      }
    }
  }, [user]);

  const saveAiProgramsToFirestore = (updatedAi: any[]) => {
    if (user) {
      const payload = updatedAi.map(p => ({...p, icon: undefined}));
      localStorage.setItem(`programs_${user.uid}_ai_programs`, JSON.stringify(payload));
      if (!user.uid.startsWith("local-guest")) {
        import("firebase/firestore").then(({ doc, setDoc }) => {
          import("../lib/firebase").then(({ db }) => {
            setDoc(doc(db, "programs", `${user.uid}_ai_programs`), {
              userId: user.uid,
              programs: payload
            }).catch(() => {});
          });
        });
      }
    }
  };


  const generateProgram = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setAiError("");
    try {
      const response = await fetch("/api/generate-program", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      if (!response.ok) throw new Error("Generation failed");
      const data = await response.json();
      
      const contextualImage = getContextualProgramImage(data);

      const newProgram = {
        id: "ai-" + Math.random().toString(36).substring(7),
        level: data.level || "Intermediate",
        name: data.name,
        freq: data.freq,
        desc: data.desc,
        extendedDesc: data.extendedDesc,
        ageGroup: "Custom AI",
        category: data.category || "AI Custom",
        color: "bg-[#CCFF00]",
        textColor: "text-[#CCFF00]",
        icon: Sparkles,
        isAi: true,
        hdImage: contextualImage,
        imageContext: data.imageContext,
        visualAtmosphere: data.visualAtmosphere,
        primaryEquipment: data.primaryEquipment,
        targetMuscles: data.targetMuscles || [],
        kineticType: data.kineticType || "lifter",
        customVisualBadge: data.customVisualBadge || (data.primaryEquipment ? `${data.primaryEquipment} Context` : "In-Context AI Visual"),
        days: data.days || []
      };
      
      const updatedAi = [newProgram, ...aiPrograms];
      setAiPrograms(updatedAi);
      saveAiProgramsToFirestore(updatedAi);
      setAiPrompt("");

    } catch (err) {
      setAiError("Failed to generate program. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const cycleProgramVisual = (programId: string) => {
    const updatedAi = aiPrograms.map(p => {
      if (p.id !== programId) return p;
      const currentImg = p.hdImage || getContextualProgramImage(p);
      const currentIndex = CONTEXTUAL_THEMES.findIndex(t => t.image === currentImg);
      const nextIndex = (currentIndex + 1) % CONTEXTUAL_THEMES.length;
      const nextTheme = CONTEXTUAL_THEMES[nextIndex >= 0 ? nextIndex : 0];
      return {
        ...p,
        hdImage: nextTheme.image,
        imageContext: nextTheme.id,
        customVisualBadge: nextTheme.label,
        kineticType: nextTheme.kineticType,
        primaryEquipment: nextTheme.gearHint
      };
    });
    setAiPrograms(updatedAi);
    saveAiProgramsToFirestore(updatedAi);
  };

  const deleteAiProgram = (id: string) => {
    const updatedAi = aiPrograms.filter(p => p.id !== id);
    setAiPrograms(updatedAi);
    saveAiProgramsToFirestore(updatedAi);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 select-auto">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">Training Programs</h1>
          <p className="text-[10px] font-bold tracking-wider uppercase text-zinc-400">Targeted periodization routines</p>
        </div>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-r from-zinc-950 via-black to-zinc-950 border border-[#CCFF00]/30 p-5 sm:p-7 rounded-2xl shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-full opacity-20 pointer-events-none overflow-hidden">
          <img 
            src={APP_IMAGES.generatorHeroMotion} 
            alt="AI Generator Background" 
            className="w-full h-full object-cover" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#CCFF00] animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#CCFF00]">
                Kinetic Contextual Engine
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black uppercase text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#CCFF00]" /> AI Workout Protocol & Contextual Visual Generator
            </h2>
            <p className="text-xs text-zinc-400 font-medium max-w-xl leading-relaxed">
              Synthesize a tailored periodization routine built around your exact equipment, split, and goals. Automatically pairs with high-definition imagery contextual to the training environment.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <input
                type="text"
                placeholder="e.g. Kettlebell 30min, Dumbbell PPL, Calisthenics Rings, Barbell 5x5"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && generateProgram()}
                className="flex-1 bg-black/80 border border-white/20 px-4 py-3 text-xs text-white rounded-xl outline-none focus:border-[#CCFF00] transition placeholder:text-zinc-600"
              />
              <button
                onClick={generateProgram}
                disabled={isGenerating || !aiPrompt.trim()}
                className="bg-[#CCFF00] text-black px-6 py-3 font-black uppercase tracking-wider text-xs rounded-xl hover:bg-[#b3e600] transition disabled:opacity-50 flex items-center justify-center shrink-0 active:scale-95 shadow-lg shadow-[#CCFF00]/10"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate Protocol"}
              </button>
            </div>

            {/* Quick Prompt Starters */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[9px] font-mono text-zinc-500 uppercase">Context templates:</span>
              {[
                "Dumbbell PPL 4-Day",
                "Kettlebell Longevity 30min",
                "Barbell Heavy 5x5 Strength",
                "Calisthenics Ring Mastery",
                "Hybrid Cardio & Ergometer",
                "Joint Mobility & Restoration"
              ].map((template) => (
                <button
                  key={template}
                  type="button"
                  onClick={() => setAiPrompt(template)}
                  className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 hover:text-[#CCFF00] bg-white/5 hover:bg-white/10 px-2 py-1 rounded transition border border-white/5"
                >
                  + {template}
                </button>
              ))}
            </div>
          </div>

          {/* Dedicated Biometric Kinetic Moving Figure */}
          <div className="shrink-0 flex items-center justify-center p-3 bg-black/60 border border-white/10 rounded-2xl">
            <KineticFigure 
              type="scanner" 
              className="w-28 h-28 sm:w-32 sm:h-32" 
              glowColor="#CCFF00" 
            />
          </div>
        </div>
        
        {aiError && (
          <div className="mt-3 text-xs font-bold uppercase tracking-wider text-red-400">
            {aiError}
          </div>
        )}
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {[...aiPrograms, ...GYM_PROGRAMS].map((program) => {
          const displayImage = program.hdImage || getContextualProgramImage(program);
          const accentColor = getProgramAccent(program);
          return (
            <div key={program.id} className="bg-zinc-950 border border-white/10 rounded-2xl flex flex-col hover:border-white/30 transition-all group relative overflow-hidden shadow-xl">
              <div className={`absolute top-0 left-0 w-full h-1 ${program.color} opacity-90 z-20`} />
              
              {/* High Definition Contextual Program Banner with Kinetic Figure Accent */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                <img 
                  src={displayImage} 
                  alt={program.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-black/30" />
                
                {/* Floating Kinetic Figure Accent in Top-Right Corner */}
                <div 
                  className="absolute top-2.5 right-2.5 z-20 group/kinetic flex items-center gap-2 p-1.5 pl-2.5 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/20 hover:border-[#CCFF00]/60 transition-all duration-300 shadow-[0_8px_30px_rgb(0_0_0/0.7)] hover:shadow-[0_0_20px_rgba(204,255,0,0.25)] select-none"
                  style={{
                    borderColor: `${accentColor}35`,
                    boxShadow: `0 4px 20px -2px rgba(0,0,0,0.8), 0 0 14px -3px ${accentColor}25`
                  }}
                >
                  {/* Telemetry Micro Status */}
                  <div className="flex flex-col text-right leading-none pointer-events-none">
                    <div className="flex items-center justify-end gap-1">
                      <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: accentColor }} />
                      <span className="text-[8px] font-mono font-black uppercase tracking-wider text-white">
                        Kinetic
                      </span>
                    </div>
                    <span 
                      className="text-[7.5px] font-mono font-bold tracking-wider uppercase mt-0.5 truncate max-w-[80px]"
                      style={{ color: accentColor }}
                    >
                      {getKineticLabel(program.kineticType)}
                    </span>
                  </div>

                  {/* Biometric Holographic Moving Avatar */}
                  <div 
                    className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden border border-white/25 bg-black/90 shadow-inner group-hover/kinetic:scale-105 transition-transform duration-300"
                    style={{ borderColor: `${accentColor}50` }}
                  >
                    <KineticFigure 
                      type={program.kineticType || "sprinter"} 
                      className="w-full h-full" 
                      glowColor={accentColor} 
                      showBadge={false}
                    />
                  </div>
                </div>

                {/* Top Left: Contextual Visual Badge */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap max-w-[70%]">
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-white bg-black/85 backdrop-blur-md border border-[#CCFF00]/40 px-2 py-0.5 rounded shadow">
                    <Sparkles className="w-2.5 h-2.5 text-[#CCFF00]" /> 
                    {program.customVisualBadge || (program.isAi ? "In-Context AI Visual" : "Periodization Setting")}
                  </span>
                  {program.isAi && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        cycleProgramVisual(program.id);
                      }}
                      title="Switch visual gym atmosphere"
                      className="text-[9px] font-mono text-zinc-300 hover:text-[#CCFF00] bg-black/85 backdrop-blur-md border border-white/20 hover:border-[#CCFF00] px-2 py-0.5 rounded transition flex items-center gap-1 cursor-pointer active:scale-95"
                    >
                      <RotateCcw className="w-2.5 h-2.5" /> Switch Visual
                    </button>
                  )}
                </div>

                {/* Badges on Banner Bottom */}
                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className={`inline-block px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${program.color} text-black rounded`}>
                      {program.level}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-zinc-300 bg-black/80 backdrop-blur-md border border-white/20 px-2 py-0.5 rounded">
                      <ShieldAlert className="w-3 h-3 text-[#CCFF00]" /> {program.ageGroup}
                    </span>
                  </div>

                  {program.primaryEquipment && (
                    <span className="text-[9px] font-mono font-bold text-[#CCFF00] bg-black/85 backdrop-blur-md border border-[#CCFF00]/30 px-2 py-0.5 rounded truncate max-w-[200px]">
                      {program.primaryEquipment}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-mono uppercase tracking-widest ${program.textColor} font-bold`}>
                      {program.category}
                    </span>
                    {program.isAi && (
                      <button
                        onClick={() => deleteAiProgram(program.id)}
                        className="p-1 text-zinc-500 hover:text-red-400"
                        title="Delete Program"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-black uppercase text-white tracking-tight mb-2 group-hover:text-[#CCFF00] transition-colors">
                    {program.name}
                  </h3>
                  
                  <p className="text-sm text-zinc-300 leading-relaxed font-medium">
                    {program.desc}
                  </p>

                  {/* Contextual Visual Setting & Expanded AI Details */}
                  {expandedId === program.id && (
                    <div className="mt-3 p-3 rounded-xl bg-black/70 border border-white/10 space-y-2.5 text-xs animate-in fade-in duration-200">
                      {program.visualAtmosphere && (
                        <div className="flex items-start gap-1.5 text-zinc-300 border-b border-white/10 pb-2">
                          <span className="text-[10px] font-mono uppercase text-[#CCFF00] font-bold shrink-0">Visual Setting:</span>
                          <span className="text-[11px] text-zinc-400 leading-snug">{program.visualAtmosphere}</span>
                        </div>
                      )}
                      {program.targetMuscles && program.targetMuscles.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap border-b border-white/10 pb-2">
                          <span className="text-[10px] font-mono uppercase text-[#CCFF00] font-bold">Target Muscles:</span>
                          {program.targetMuscles.map((muscle: string, idx: number) => (
                            <span key={idx} className="text-[9px] font-bold text-zinc-300 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
                              {muscle}
                            </span>
                          ))}
                        </div>
                      )}
                      <div>
                        <div className="text-[10px] font-mono uppercase text-zinc-400 font-bold mb-1">AI Periodization Rationale:</div>
                        <p className="text-zinc-300 leading-relaxed text-xs">
                          {program.extendedDesc}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between border-t border-white/5 pt-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
                      <Calendar className="w-3.5 h-3.5 text-[#CCFF00]" /> Schedule Split
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-white">
                      {program.freq}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setExpandedId(expandedId === program.id ? null : program.id)}
                      className="flex justify-center items-center gap-1.5 border border-white/15 bg-black/40 px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-zinc-300 hover:text-white rounded-xl transition"
                    >
                      {expandedId === program.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />} Details
                    </button>
                    <button 
                      onClick={() => navigate(`/programs/${program.id}`)}
                      className="flex justify-center items-center gap-1.5 bg-[#CCFF00] px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-black rounded-xl active:scale-95 transition shadow hover:bg-[#b3ff00]"
                    >
                      <Play className="w-3.5 h-3.5 fill-black" /> Start Routine
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
