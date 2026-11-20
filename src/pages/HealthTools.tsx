import { useState } from "react";
import { Calculator, Moon, Brain, Scan, Loader2, Apple, Activity, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { APP_IMAGES } from "../lib/appImages";
import { KineticFigure } from "../components/KineticFigure";

export function HealthTools() {
  const [weight, setWeight] = useState<string>("70");
  const [height, setHeight] = useState<string>("175");
  const [age, setAge] = useState<string>("25");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activityMultiplier, setActivityMultiplier] = useState<number>(1.2);
  const [sleepHours, setSleepHours] = useState<string>("7");
  const [goal, setGoal] = useState<string>("Maintain Weight");

  const [mealInput, setMealInput] = useState<string>("");
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [mealResult, setMealResult] = useState<{calories: number, protein: number, carbs: number, fats: number, confidence: string} | null>(null);

  const [calculatingMacros, setCalculatingMacros] = useState<boolean>(false);
  const [macroResult, setMacroResult] = useState<{calories: number, protein: number, carbs: number, fats: number, explanation: string} | null>(null);

  const calculatePreciseMacros = async () => {
    setCalculatingMacros(true);
    try {
      const res = await fetch("/api/calculate-macros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          gender, age, weight, height, activityLevel: activityMultiplier, goal 
        })
      });
      if (res.ok) {
        const data = await res.json();
        setMacroResult(data);
      } else {
        console.error("Failed to calculate macros");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCalculatingMacros(false);
    }
  };

  const analyzeMeal = async () => {
    if (!mealInput.trim()) return;
    setAnalyzing(true);
    try {
      const res = await fetch("/api/analyze-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meal: mealInput })
      });
      if (res.ok) {
        const data = await res.json();
        setMealResult(data);
      } else {
        console.error("Failed to analyze meal");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  // BMI Calculation
  const w = parseFloat(weight) || 0;
  const h = (parseFloat(height) || 0) / 100;
  const bmi = h > 0 ? (w / (h * h)).toFixed(1) : "0";
  
  let bmiCategory = "";
  if (Number(bmi) < 18.5) bmiCategory = "Underweight";
  else if (Number(bmi) < 25) bmiCategory = "Normal";
  else if (Number(bmi) < 30) bmiCategory = "Overweight";
  else bmiCategory = "Obese";

  // BMR Calculation (Mifflin-St Jeor)
  const a = parseFloat(age) || 0;
  let bmr = 0;
  if (gender === "male") {
    bmr = 10 * w + 6.25 * (h * 100) - 5 * a + 5;
  } else {
    bmr = 10 * w + 6.25 * (h * 100) - 5 * a - 161;
  }

  // Sleep evaluation
  const sHours = parseFloat(sleepHours) || 0;
  let sleepStatus = "";
  if (sHours < 6) sleepStatus = "Insufficient";
  else if (sHours > 9) sleepStatus = "Excessive";
  else sleepStatus = "Optimal";

  return (
    <div className="space-y-4 pb-12 select-auto">
      {/* Mobile Title */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h1 className="text-xl font-black tracking-tight text-white uppercase">
            Health Analytics
          </h1>
          <p className="text-[10px] font-bold tracking-wider uppercase text-zinc-400">
            Vitals, BMI, BMR & AI Macro Calculator
          </p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-[#3BB1FF]/10 border border-[#3BB1FF]/30 flex items-center justify-center text-[#3BB1FF]">
          <Activity className="w-4 h-4" />
        </div>
      </div>

      {/* High Definition Generator Hero Banner with Moving Figure */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black aspect-[21/9] sm:aspect-[24/9] shadow-xl group">
        <img
          src={APP_IMAGES.aiMacroScanner}
          alt="Biometric Macro AI Scanner"
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 p-4 sm:p-6 flex items-center justify-between">
          <div className="max-w-md space-y-1 sm:space-y-2 z-10">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#CCFF00] bg-[#CCFF00]/10 px-2.5 py-0.5 rounded border border-[#CCFF00]/30 inline-flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> Biometric AI Vision
            </span>
            <h2 className="text-base sm:text-2xl font-black uppercase text-white tracking-tight leading-tight">
              AI Precision Macro & Metabolic Engine
            </h2>
            <p className="text-[10px] sm:text-xs text-zinc-300 line-clamp-2">
              Advanced metabolic equations combined with natural language food decomposition for pinpoint caloric discipline.
            </p>
          </div>
          <div className="hidden sm:flex shrink-0 p-2 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10">
            <KineticFigure type="scanner" className="w-24 h-24" glowColor="#CCFF00" />
          </div>
        </div>
      </div>

      {/* 1. Quick Vitals Summary (3 compact mobile tiles) */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-zinc-950 border border-white/10 p-2.5 rounded-2xl text-center shadow-sm">
          <span className="text-[8px] font-mono uppercase text-zinc-400 block">BMI</span>
          <div className="text-lg font-black text-white">{bmi}</div>
          <span className={`inline-block px-1.5 py-0.2 rounded text-[8px] font-bold uppercase ${
            bmiCategory === "Normal" ? "bg-[#CCFF00]/15 text-[#CCFF00]" : "bg-[#FF3366]/15 text-[#FF3366]"
          }`}>
            {bmiCategory}
          </span>
        </div>

        <div className="bg-zinc-950 border border-white/10 p-2.5 rounded-2xl text-center shadow-sm">
          <span className="text-[8px] font-mono uppercase text-zinc-400 block">BMR</span>
          <div className="text-lg font-black text-white">{Math.round(bmr)}</div>
          <span className="text-[8px] font-mono text-zinc-400">kcal / rest</span>
        </div>

        <div className="bg-zinc-950 border border-white/10 p-2.5 rounded-2xl text-center shadow-sm">
          <span className="text-[8px] font-mono uppercase text-zinc-400 block">Sleep</span>
          <div className="text-lg font-black text-white">{sHours}h</div>
          <span className={`inline-block px-1.5 py-0.2 rounded text-[8px] font-bold uppercase ${
            sleepStatus === "Optimal" ? "bg-[#CCFF00]/15 text-[#CCFF00]" : "bg-[#FF3366]/15 text-[#FF3366]"
          }`}>
            {sleepStatus}
          </span>
        </div>
      </div>

      {/* 2. Body Parameters Input Card with High Definition Visual Context */}
      <div className="bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="relative aspect-[21/6] w-full overflow-hidden bg-black">
          <img 
            src={APP_IMAGES.macroCalculatorHd} 
            alt="Macro Calculator Preparation" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
          <div className="absolute bottom-2 left-4 flex items-center justify-between w-[calc(100%-2rem)]">
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-[#CCFF00]" />
              Precision Macro Calculator & TDEE
            </h2>
            <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">Mifflin-St Jeor</span>
          </div>
        </div>

        <div className="p-3.5 space-y-3">
        
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Gender</label>
            <select 
              value={gender}
              onChange={(e) => setGender(e.target.value as "male" | "female")}
              className="w-full bg-black border border-white/10 px-2.5 py-1.5 text-xs text-white rounded-xl outline-none focus:border-[#CCFF00]"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Age</label>
            <input 
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full bg-black border border-white/10 px-2.5 py-1.5 text-xs text-white rounded-xl outline-none focus:border-[#CCFF00]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Weight (kg)</label>
            <input 
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-black border border-white/10 px-2.5 py-1.5 text-xs text-white rounded-xl outline-none focus:border-[#CCFF00]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Height (cm)</label>
            <input 
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full bg-black border border-white/10 px-2.5 py-1.5 text-xs text-white rounded-xl outline-none focus:border-[#CCFF00]"
            />
          </div>

          <div className="col-span-2 space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Activity Level</label>
            <select 
              value={activityMultiplier}
              onChange={(e) => setActivityMultiplier(Number(e.target.value))}
              className="w-full bg-black border border-white/10 px-2.5 py-1.5 text-xs text-white rounded-xl outline-none focus:border-[#CCFF00]"
            >
              <option value={1.2}>Sedentary (Desk job, no exercise)</option>
              <option value={1.375}>Light (1-3 workouts / week)</option>
              <option value={1.55}>Moderate (3-5 workouts / week)</option>
              <option value={1.725}>Very Active (6-7 workouts / week)</option>
            </select>
          </div>

          <div className="col-span-2 space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Goal</label>
            <select 
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-black border border-white/10 px-2.5 py-1.5 text-xs text-white rounded-xl outline-none focus:border-[#CCFF00]"
            >
              <option value="Lose Weight (Aggressive Cut)">Lose Weight (Aggressive Cut)</option>
              <option value="Lose Weight (Moderate Cut)">Lose Weight (Moderate Cut)</option>
              <option value="Maintain Weight">Maintain Weight</option>
              <option value="Build Muscle (Lean Bulk)">Build Muscle (Lean Bulk)</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={calculatePreciseMacros}
          disabled={calculatingMacros}
          className="w-full bg-[#CCFF00] text-black py-2.5 font-black uppercase tracking-wider text-[10px] rounded-xl active:scale-95 transition-all shadow disabled:opacity-50 flex items-center justify-center gap-1.5"
        >
          {calculatingMacros ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Scan className="w-3.5 h-3.5" />}
          {calculatingMacros ? "Calculating..." : "Compute AI Target Macros"}
        </button>
        </div>
      </div>

      {/* 3. AI Macro Target Result */}
      {macroResult && (
        <div className="bg-zinc-950 border border-[#CCFF00]/30 p-3.5 rounded-2xl space-y-2.5 animate-in fade-in duration-300 shadow">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono uppercase text-[#CCFF00] font-black">AI Target Breakdown</span>
            <span className="text-xs font-black text-white">{macroResult.calories} kcal/day</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-black p-2 rounded-xl border border-white/10 text-center">
              <span className="text-xs font-black text-[#CCFF00]">{macroResult.protein}g</span>
              <span className="text-[8px] font-mono uppercase text-zinc-400 block">Protein</span>
            </div>
            <div className="bg-black p-2 rounded-xl border border-white/10 text-center">
              <span className="text-xs font-black text-[#3BB1FF]">{macroResult.carbs}g</span>
              <span className="text-[8px] font-mono uppercase text-zinc-400 block">Carbs</span>
            </div>
            <div className="bg-black p-2 rounded-xl border border-white/10 text-center">
              <span className="text-xs font-black text-[#9D4EDD]">{macroResult.fats}g</span>
              <span className="text-[8px] font-mono uppercase text-zinc-400 block">Fats</span>
            </div>
          </div>
          <p className="text-[10px] text-zinc-300 italic bg-black/40 p-2 rounded-lg border border-white/5">
            "{macroResult.explanation}"
          </p>
        </div>
      )}

      {/* 4. AI Meal Analyzer */}
      <div className="bg-zinc-950 border border-white/10 p-3.5 rounded-2xl space-y-2.5 shadow-sm">
        <h3 className="text-xs font-black uppercase text-white flex items-center gap-1.5">
          <Apple className="w-3.5 h-3.5 text-[#CCFF00]" />
          Instant Meal Analyzer
        </h3>
        <p className="text-[9px] text-zinc-400">Describe what you ate for instant macro breakdown</p>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="e.g. 2 eggs, 1 toast, 1 apple..."
            value={mealInput}
            onChange={(e) => setMealInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && analyzeMeal()}
            className="flex-1 bg-black border border-white/10 px-3 py-2 text-xs text-white rounded-xl outline-none focus:border-[#CCFF00]"
          />
          <button
            onClick={analyzeMeal}
            disabled={analyzing || !mealInput.trim()}
            className="bg-[#CCFF00] text-black px-4 py-2 font-black uppercase text-[10px] tracking-wider rounded-xl hover:bg-[#b3e600] active:scale-95 transition disabled:opacity-50 flex items-center justify-center shrink-0"
          >
            {analyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Analyze"}
          </button>
        </div>

        {mealResult && (
          <div className="pt-2 border-t border-white/5 space-y-1.5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold text-white">Estimated Nutrition</span>
              <span className="text-[#CCFF00] font-mono text-[9px]">{mealResult.confidence}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-center">
              <div className="bg-black p-1.5 rounded-lg border border-white/10">
                <span className="text-xs font-black text-white">{mealResult.calories}</span>
                <span className="text-[7px] font-mono text-zinc-400 block">KCAL</span>
              </div>
              <div className="bg-black p-1.5 rounded-lg border border-white/10">
                <span className="text-xs font-black text-white">{mealResult.protein}g</span>
                <span className="text-[7px] font-mono text-zinc-400 block">PRO</span>
              </div>
              <div className="bg-black p-1.5 rounded-lg border border-white/10">
                <span className="text-xs font-black text-[#3BB1FF]">{mealResult.carbs}g</span>
                <span className="text-[7px] font-mono text-zinc-400 block">CARB</span>
              </div>
              <div className="bg-black p-1.5 rounded-lg border border-white/10">
                <span className="text-xs font-black text-[#9D4EDD]">{mealResult.fats}g</span>
                <span className="text-[7px] font-mono text-zinc-400 block">FAT</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Circadian Sleep Recovery Biometrics Card */}
      <div className="bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="relative aspect-[21/6] w-full overflow-hidden bg-black">
          <img 
            src={APP_IMAGES.sleepRecoveryHd} 
            alt="Sleep and Recovery Biometrics" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
          <div className="absolute bottom-2 left-4 flex items-center justify-between w-[calc(100%-2rem)]">
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-[#3BB1FF]" />
              Circadian Sleep & Recovery Engine
            </h2>
            <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">Delta Wave Biometrics</span>
          </div>
        </div>

        <div className="p-3.5 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-black text-white uppercase tracking-tight">
              Optimal Recovery: {sleepStatus} ({sHours}h logged)
            </div>
            <p className="text-[10px] text-zinc-400 max-w-sm">
              Deep restorative sleep regulates growth hormone and cortisol. Aim for 7-9 hours to maximize neuromuscular synthesis.
            </p>
          </div>
          <div className="shrink-0 p-1.5 bg-black/60 rounded-xl border border-white/10">
            <KineticFigure type="zen" className="w-14 h-14" glowColor="#3BB1FF" />
          </div>
        </div>
      </div>

      {/* 6. Link to Mental Wellness */}
      <Link
        to="/mental-game"
        className="w-full p-3 rounded-2xl bg-gradient-to-r from-zinc-900 to-black border border-[#9D4EDD]/30 flex items-center justify-between active:scale-95 transition group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#9D4EDD]/20 text-[#9D4EDD] flex items-center justify-center">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase text-white group-hover:text-[#9D4EDD] transition-colors">
              Mental Game & Stress Relief
            </h4>
            <p className="text-[9px] text-zinc-400">Mind chess, box breathing & grounding</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white" />
      </Link>
    </div>
  );
}
