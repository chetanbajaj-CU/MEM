import { HeartPulse, Droplet, Activity, ShieldPlus, ArrowRight, Brain, AlertTriangle, Wind, Flame, Bone, Heart, Zap, Leaf, ShieldAlert, CheckCircle, ChevronDown, ChevronUp, Sparkles, Loader2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { APP_IMAGES } from "../lib/appImages";
import { KineticFigure } from "../components/KineticFigure";

const CLINICAL_DIETS = [
  {
    id: "diabetes-2",
    condition: "Diabetes (Type 2)",
    icon: Droplet,
    color: "text-[#3BB1FF]",
    bgColor: "bg-[#3BB1FF]/10",
    focus: "Blood Sugar Stabilization & Insulin Sensitivity",
    foodsToEat: ["Leafy Greens", "Fatty Fish", "Chia Seeds", "Greek Yogurt", "Nuts"],
    foodsToAvoid: ["Refined Carbs", "Sugary Beverages", "Trans Fats", "Processed Meats"],
    macroSplit: "Protein: 30% | Carbs: 30% (Low GI) | Fats: 40%"
  },
  {
    id: "hypertension",
    condition: "Hypertension (High BP)",
    icon: HeartPulse,
    color: "text-[#FF3366]",
    bgColor: "bg-[#FF3366]/10",
    focus: "Sodium Reduction (DASH Diet) & Heart Health",
    foodsToEat: ["Berries", "Bananas", "Beets", "Oats", "Garlic", "Pomegranates"],
    foodsToAvoid: ["High Sodium Foods", "Canned Soups", "Deli Meats", "Excess Alcohol"],
    macroSplit: "Protein: 25% | Carbs: 50% | Fats: 25%"
  },
  {
    id: "pcos",
    condition: "PCOS",
    icon: Activity,
    color: "text-[#9D4EDD]",
    bgColor: "bg-[#9D4EDD]/10",
    focus: "Hormone Balance & Anti-Inflammatory",
    foodsToEat: ["High Fiber Vegetables", "Lean Poultry", "Fatty Fish", "Turmeric", "Berries"],
    foodsToAvoid: ["Refined Sugar", "Dairy (if sensitive)", "Processed Soy", "Seed Oils"],
    macroSplit: "Protein: 35% | Carbs: 30% | Fats: 35%"
  },
  {
    id: "hypothyroidism",
    condition: "Thyroid (Hypothyroidism)",
    icon: ShieldPlus,
    color: "text-[#CCFF00]",
    bgColor: "bg-[#CCFF00]/10",
    focus: "Metabolism Support & Iodine Balance",
    foodsToEat: ["Seaweed", "Brazil Nuts (Selenium)", "Eggs", "Roasted Chicken", "Bone Broth"],
    foodsToAvoid: ["Raw Cruciferous Veggies (Goitrogens)", "Soy", "Gluten (often linked)"],
    macroSplit: "Protein: 30% | Carbs: 40% | Fats: 30%"
  },
  {
    id: "celiac",
    condition: "Celiac Disease",
    icon: ShieldAlert,
    color: "text-[#FF8C00]",
    bgColor: "bg-[#FF8C00]/10",
    focus: "Strict Gluten-Free & Gut Healing",
    foodsToEat: ["Quinoa", "Rice", "Lean Meats", "Fruits", "Vegetables", "Gluten-Free Oats"],
    foodsToAvoid: ["Wheat", "Barley", "Rye", "Malt", "Cross-contaminated Foods"],
    macroSplit: "Protein: 30% | Carbs: 40% | Fats: 30%"
  },
  {
    id: "ibs",
    condition: "Irritable Bowel Syndrome",
    icon: Wind,
    color: "text-[#3BB1FF]",
    bgColor: "bg-[#3BB1FF]/10",
    focus: "Low FODMAP & Symptom Management",
    foodsToEat: ["Bananas", "Blueberries", "Carrots", "Lactose-Free Dairy", "Lean Proteins"],
    foodsToAvoid: ["Garlic", "Onions", "Wheat", "Beans", "Apples", "High-FODMAP Foods"],
    macroSplit: "Protein: 30% | Carbs: 40% | Fats: 30%"
  },
  {
    id: "gerd",
    condition: "GERD (Acid Reflux)",
    icon: Flame,
    color: "text-[#FF3366]",
    bgColor: "bg-[#FF3366]/10",
    focus: "Acid Reduction & Soothing Digestion",
    foodsToEat: ["Oatmeal", "Non-citrus Fruits", "Lean Poultry", "Ginger", "Egg Whites"],
    foodsToAvoid: ["Citrus", "Tomatoes", "Spicy Foods", "Peppermint", "Coffee", "Chocolate"],
    macroSplit: "Protein: 30% | Carbs: 45% | Fats: 25%"
  },
  {
    id: "nafld",
    condition: "Fatty Liver Disease",
    icon: Leaf,
    color: "text-[#CCFF00]",
    bgColor: "bg-[#CCFF00]/10",
    focus: "Liver Fat Reduction & Antioxidants",
    foodsToEat: ["Coffee", "Greens", "Tofu", "Fatty Fish", "Walnuts", "Sunflower Seeds"],
    foodsToAvoid: ["Alcohol", "Added Sugar", "Fried Foods", "White Bread", "Red Meat"],
    macroSplit: "Protein: 30% | Carbs: 40% (Complex) | Fats: 30%"
  },
  {
    id: "osteoporosis",
    condition: "Osteoporosis",
    icon: Bone,
    color: "text-[#9D4EDD]",
    bgColor: "bg-[#9D4EDD]/10",
    focus: "Bone Mineral Density & Calcium/Vit D",
    foodsToEat: ["Dairy", "Fortified Plant Milks", "Sardines", "Leafy Greens", "Almonds"],
    foodsToAvoid: ["Excessive Salt", "Heavy Caffeine", "Excessive Alcohol", "Wheat Bran (inhibits calcium)"],
    macroSplit: "Protein: 25% | Carbs: 45% | Fats: 30%"
  },
  {
    id: "gout",
    condition: "Gout",
    icon: AlertTriangle,
    color: "text-[#FF8C00]",
    bgColor: "bg-[#FF8C00]/10",
    focus: "Low Purine & Uric Acid Reduction",
    foodsToEat: ["Cherries", "Water", "Low-Fat Dairy", "Complex Carbs", "Vitamin C Foods"],
    foodsToAvoid: ["Organ Meats", "Red Meat", "Shellfish", "Beer", "Sugary Drinks"],
    macroSplit: "Protein: 20% | Carbs: 55% | Fats: 25%"
  },
  {
    id: "anemia",
    condition: "Iron Deficiency Anemia",
    icon: Droplet,
    color: "text-[#FF3366]",
    bgColor: "bg-[#FF3366]/10",
    focus: "Iron Absorption & Red Blood Cell Support",
    foodsToEat: ["Red Meat", "Spinach", "Lentils", "Vitamin C Fruits (for absorption)"],
    foodsToAvoid: ["Coffee/Tea with Meals", "Excessive Dairy with Iron", "Calcium Supplements with Iron"],
    macroSplit: "Protein: 30% | Carbs: 45% | Fats: 25%"
  },
  {
    id: "ckd",
    condition: "Chronic Kidney Disease",
    icon: Activity,
    color: "text-[#3BB1FF]",
    bgColor: "bg-[#3BB1FF]/10",
    focus: "Low Phosphorus, Potassium & Protein Management",
    foodsToEat: ["Apples", "Cabbage", "Green Beans", "White Rice", "Egg Whites"],
    foodsToAvoid: ["Avocados", "Bananas", "Dairy", "Processed Meats", "Dark Colas"],
    macroSplit: "Protein: 15% | Carbs: 55% | Fats: 30%"
  },
  {
    id: "hyperthyroidism",
    condition: "Hyperthyroidism",
    icon: Zap,
    color: "text-[#CCFF00]",
    bgColor: "bg-[#CCFF00]/10",
    focus: "Weight Maintenance & Low Iodine",
    foodsToEat: ["Non-iodized Salt", "Egg Whites", "Fresh Fruit", "Oats", "Potatoes"],
    foodsToAvoid: ["Iodized Salt", "Seafood", "Seaweed", "Dairy", "Egg Yolks"],
    macroSplit: "Protein: 30% | Carbs: 45% | Fats: 25%"
  },
  {
    id: "rheumatoid-arthritis",
    condition: "Rheumatoid Arthritis",
    icon: Heart,
    color: "text-[#9D4EDD]",
    bgColor: "bg-[#9D4EDD]/10",
    focus: "Anti-Inflammatory (Mediterranean Style)",
    foodsToEat: ["Salmon", "Olive Oil", "Walnuts", "Berries", "Green Tea"],
    foodsToAvoid: ["Processed Foods", "Red Meat", "Excessive Sugar", "Refined Carbs"],
    macroSplit: "Protein: 25% | Carbs: 45% | Fats: 30%"
  },
  {
    id: "migraines",
    condition: "Migraines",
    icon: Brain,
    color: "text-[#FF8C00]",
    bgColor: "bg-[#FF8C00]/10",
    focus: "Trigger Avoidance & Magnesium Replenishment",
    foodsToEat: ["Spinach", "Pumpkin Seeds", "Almonds", "Water", "Fresh Meats"],
    foodsToAvoid: ["Aged Cheeses", "Cured Meats", "Chocolate", "Artificial Sweeteners", "Alcohol"],
    macroSplit: "Protein: 30% | Carbs: 40% | Fats: 30%"
  }
];

export function MedicalNutrition() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiDiets, setAiDiets] = useState<any[]>([]);
  const [aiError, setAiError] = useState("");
  const [mealPlanLoading, setMealPlanLoading] = useState<string | null>(null);
  const [mealPlans, setMealPlans] = useState<Record<string, any>>({});
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`programs_${user.uid}_ai_diets`);
      if (stored) {
        setAiDiets(JSON.parse(stored).map((d: any) => ({...d, icon: Sparkles})));
      } else if (!user.uid.startsWith("local-guest")) {
        import("firebase/firestore").then(({ doc, getDoc }) => {
          import("../lib/firebase").then(({ db }) => {
             getDoc(doc(db, "programs", `${user.uid}_ai_diets`)).then((snapshot) => {
               if (snapshot.exists()) {
                 const parsed = snapshot.data().diets.map((d: any) => ({...d, icon: Sparkles}));
                 setAiDiets(parsed);
                 localStorage.setItem(`programs_${user.uid}_ai_diets`, JSON.stringify(snapshot.data().diets));
               }
             }).catch(() => {});
          });
        });
      }
    }
  }, [user]);

  const saveAiDietsToFirestore = (updatedAi: any[]) => {
    if (user) {
      const payload = updatedAi.map(d => ({...d, icon: undefined}));
      localStorage.setItem(`programs_${user.uid}_ai_diets`, JSON.stringify(payload));
      if (!user.uid.startsWith("local-guest")) {
        import("firebase/firestore").then(({ doc, setDoc }) => {
          import("../lib/firebase").then(({ db }) => {
            setDoc(doc(db, "programs", `${user.uid}_ai_diets`), {
              userId: user.uid,
              diets: payload
            }, { merge: true }).catch(() => {});
          });
        });
      }
    }
  };

  const generateDiet = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setAiError("");
    try {
      const response = await fetch("/api/generate-diet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ condition: aiPrompt }),
      });
      if (!response.ok) throw new Error("Generation failed");
      const data = await response.json();
      
      const newDiet = {
        id: "ai-" + Math.random().toString(36).substring(7),
        condition: data.condition,
        focus: data.focus,
        foodsToEat: data.foodsToEat || [],
        foodsToAvoid: data.foodsToAvoid || [],
        macroSplit: data.macroSplit,
        color: "text-[#CCFF00]",
        bgColor: "bg-[#CCFF00]/10",
        icon: Sparkles,
        isAi: true
      };
      
      const updatedAi = [newDiet, ...aiDiets];
      setAiDiets(updatedAi);
      saveAiDietsToFirestore(updatedAi);
      setAiPrompt("");
    } catch (err) {
      setAiError("Failed to generate diet. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteAiDiet = (id: string) => {
    const updatedAi = aiDiets.filter(d => d.id !== id);
    setAiDiets(updatedAi);
    saveAiDietsToFirestore(updatedAi);
  };

  const generateMealPlan = async (condition: string) => {
    setMealPlanLoading(condition);
    try {
      const response = await fetch("/api/generate-meal-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ condition }),
      });
      if (!response.ok) throw new Error("Generation failed");
      const data = await response.json();
      setMealPlans(prev => ({ ...prev, [condition]: data }));
    } catch (err) {
      console.error(err);
    } finally {
      setMealPlanLoading(null);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 select-auto">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">Clinical Diets</h1>
          <p className="text-[10px] font-bold tracking-wider uppercase text-zinc-400">Condition-specific clinical protocols</p>
        </div>
      </div>

      <div className="bg-[#FF3366]/10 border border-[#FF3366]/20 p-3.5 sm:p-5 rounded-2xl flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#FF3366] text-white flex items-center justify-center shrink-0 shadow">
          <ShieldPlus className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-xs font-black uppercase text-white mb-0.5">Medical Guidance</h3>
          <p className="text-[10px] text-white/70 leading-relaxed font-medium">
            Clinical protocols for nutritional support. Always consult your physician or clinical dietitian before dietary modifications.
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-r from-zinc-950 via-black to-zinc-950 border border-[#CCFF00]/30 p-5 sm:p-7 rounded-2xl shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-full opacity-20 pointer-events-none overflow-hidden">
          <img 
            src={APP_IMAGES.macroCalculatorHd} 
            alt="Clinical Nutrition AI Background" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#CCFF00] animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#CCFF00]">
                Clinical Nutrition AI Engine
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black uppercase text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#CCFF00]" /> AI Clinical Diet Protocol Generator
            </h2>
            <p className="text-sm text-zinc-300 font-medium max-w-xl leading-relaxed">
              Enter any health condition to generate specialized micronutrient recommendations, forbidden triggers, and targeted macro splits.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <input
                type="text"
                placeholder="e.g. Endometriosis, Crohn's, High Cholesterol"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && generateDiet()}
                className="flex-1 bg-black/80 border border-white/20 px-4 py-3 text-xs text-white rounded-xl outline-none focus:border-[#CCFF00] transition placeholder:text-zinc-600"
              />
              <button
                onClick={generateDiet}
                disabled={isGenerating || !aiPrompt.trim()}
                className="bg-[#CCFF00] text-black px-6 py-3 font-black uppercase tracking-wider text-xs rounded-xl hover:bg-[#b3e600] transition disabled:opacity-50 flex items-center justify-center shrink-0 active:scale-95 shadow-lg shadow-[#CCFF00]/10"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate Protocol"}
              </button>
            </div>

            {/* Quick condition starters */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Quick clinical tags:</span>
              {[
                "High Cholesterol",
                "Non-Alcoholic Fatty Liver",
                "Migraine Sensitivity"
              ].map((template) => (
                <button
                  key={template}
                  type="button"
                  onClick={() => setAiPrompt(template)}
                  className="text-[10px] font-bold uppercase tracking-wider text-zinc-300 hover:text-[#CCFF00] bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded transition border border-white/10"
                >
                  + {template}
                </button>
              ))}
            </div>
          </div>

          {/* Biometric Scanner Kinetic Figure */}
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

      <div className="grid gap-3.5 grid-cols-1">
        {[...aiDiets, ...CLINICAL_DIETS].map((diet) => (
          <div key={diet.id} className="bg-white/5 border border-white/10 p-6 flex flex-col hover:bg-white/10 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 opacity-70 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: "currentColor", color: diet.color.replace("text-[", "").replace("]", "") }} />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${diet.bgColor} ${diet.color} flex items-center justify-center`}>
                  <diet.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase text-white leading-none">{diet.condition}</h3>
                  <p className={`text-xs sm:text-sm font-bold uppercase tracking-wider mt-1.5 ${diet.color}`}>{diet.focus}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {diet.isAi && (
                  <button
                    onClick={() => deleteAiDiet(diet.id)}
                    className="p-3 border border-white/10 text-white/40 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/50 transition-colors"
                    title="Delete AI Diet"
                  >
                    <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                )}
                <button 
                  onClick={() => setExpandedId(expandedId === diet.id ? null : diet.id)}
                  className="p-3 border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors"
                >
                  {expandedId === diet.id ? <ChevronUp className="w-4 h-4 md:w-5 md:h-5" /> : <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />}
                </button>
              </div>
            </div>

            {expandedId === diet.id && (
              <div className="mt-6 space-y-6 pt-6 border-t border-white/10">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-3 border-b border-white/10 pb-2">Recommended Foods</h4>
                  <ul className="flex flex-wrap gap-2">
                    {diet.foodsToEat.map((food) => (
                      <li key={food} className="bg-[#CCFF00]/10 text-[#CCFF00] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider">
                        + {food}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-3 border-b border-white/10 pb-2">Foods to Avoid</h4>
                  <ul className="flex flex-wrap gap-2">
                    {diet.foodsToAvoid.map((food) => (
                      <li key={food} className="bg-[#FF3366]/10 text-[#FF3366] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider">
                        - {food}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Ideal Macro Split</h4>
                  <div className="bg-[#0A0A0A] border border-white/10 p-3.5 text-sm font-bold text-white text-center">
                    {diet.macroSplit}
                  </div>
                </div>

                {mealPlans[diet.condition] ? (
                  <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                    <h4 className="text-[12px] font-black uppercase tracking-widest text-[#CCFF00] mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 md:w-5 md:h-5" /> 1-Day Custom Meal Plan
                    </h4>
                    
                    <div className="space-y-4">
                      {['breakfast', 'lunch', 'dinner', 'snacks'].map((mealTime) => (
                        <div key={mealTime} className="bg-[#0A0A0A] border border-white/10 p-4">
                          <h5 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">{mealTime}</h5>
                          <p className="text-sm font-medium text-white">{mealPlans[diet.condition][mealTime]}</p>
                        </div>
                      ))}
                      
                      <div className="bg-[#CCFF00]/10 border border-[#CCFF00]/20 p-4 flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#CCFF00]">Total Calories</span>
                        <span className="text-lg font-black text-[#CCFF00]">{mealPlans[diet.condition].totalCalories}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => generateMealPlan(diet.condition)}
                    disabled={mealPlanLoading === diet.condition}
                    className="mt-4 w-full flex justify-center items-center gap-2 bg-[#CCFF00] text-black px-4 py-4 text-[11px] font-black uppercase tracking-widest hover:bg-[#b3ff00] transition-colors disabled:opacity-50"
                  >
                    {mealPlanLoading === diet.condition ? (
                      <><Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> Generating Plan...</>
                    ) : (
                      <>Create Custom {diet.condition} Plan <ArrowRight className="w-4 h-4 md:w-5 md:h-5" /></>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
