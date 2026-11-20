import { Apple, Plus, Search, ChevronRight, ChevronDown, X, Check, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { logPerfectNutrition } from "../lib/userStats";
import { getLocalDateString } from "../lib/dateUtils";
import { useNavigate } from "react-router-dom";

type MealItem = {
  name: string;
  cals: number;
};

type MealData = {
  cals: number;
  items: MealItem[];
};

const INITIAL_MEALS: Record<string, MealData> = {
  Breakfast: { cals: 420, items: [{ name: "Oats", cals: 158 }, { name: "Fruits", cals: 162 }, { name: "Greek Yogurt", cals: 100 }] },
  Lunch: { cals: 650, items: [{ name: "Chicken Breast", cals: 165 }, { name: "Brown Rice", cals: 216 }, { name: "Salad Bowl", cals: 269 }] },
  Dinner: { cals: 550, items: [{ name: "Lean Salmon", cals: 350 }, { name: "Roasted Vegetables", cals: 200 }] },
  Snacks: { cals: 200, items: [{ name: "Almonds", cals: 164 }, { name: "Protein Shake", cals: 36 }] }
};

export function Nutrition() {
  const [meals, setMeals] = useState<Record<string, MealData>>(INITIAL_MEALS);
  const [isAdding, setIsAdding] = useState<string | null>(null);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [newItem, setNewItem] = useState("");
  const [newCals, setNewCals] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{name: string, cals: number}[]>([]);

  const totalCals = Object.values(meals).reduce((sum, meal) => sum + meal.cals, 0);
  const targetCals = 2200;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFinishing, setIsFinishing] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    if (user) {
      const today = getLocalDateString(new Date());
      const stored = localStorage.getItem(`nutrition_${user.uid}_${today}`);
      if (stored) {
        setMeals(JSON.parse(stored));
      } else if (!user.uid.startsWith("local-")) {
        import("firebase/firestore").then(({ doc, getDoc }) => {
          import("../lib/firebase").then(({ db }) => {
             getDoc(doc(db, "nutrition", `${user.uid}_${today}`)).then((snapshot) => {
               if (snapshot.exists()) {
                 setMeals(snapshot.data().meals);
                 localStorage.setItem(`nutrition_${user.uid}_${today}`, JSON.stringify(snapshot.data().meals));
               }
             }).catch(() => {});
          });
        });
      }
    }
  }, [user]);

  const saveMealsToFirestore = (newMeals: Record<string, MealData>) => {
    if (user) {
      const today = getLocalDateString(new Date());
      localStorage.setItem(`nutrition_${user.uid}_${today}`, JSON.stringify(newMeals));
      if (!user.uid.startsWith("local-")) {
        import("firebase/firestore").then(({ doc, setDoc }) => {
          import("../lib/firebase").then(({ db }) => {
            setDoc(doc(db, "nutrition", `${user.uid}_${today}`), {
              userId: user.uid,
              date: today,
              meals: newMeals
            }).catch(() => {});
          });
        });
      }
    }
  };
  
  const handleSaveProgress = async () => {
    if (!user) return;
    setIsFinishing(true);
    try {
      await logPerfectNutrition(user.uid);
      setHasSaved(true);
      setTimeout(() => navigate("/profile"), 1500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsFinishing(false);
    }
  };
  const percentage = Math.min((totalCals / targetCals) * 100, 100);

  const MOCK_FOOD_DB = [
    { name: "Banana (Medium)", cals: 105 },
    { name: "Chicken Breast (100g)", cals: 165 },
    { name: "Brown Rice (1 cup)", cals: 216 },
    { name: "Greek Yogurt (1 cup)", cals: 100 },
    { name: "Avocado (1/2)", cals: 160 },
    { name: "Eggs (2 large)", cals: 140 },
    { name: "Almonds (1 oz)", cals: 164 },
    { name: "Oatmeal (1 cup)", cals: 158 },
    { name: "Whey Protein (1 scoop)", cals: 120 },
    { name: "Apple (Medium)", cals: 95 },
    { name: "Sweet Potato (1 medium)", cals: 112 },
    { name: "Broccoli (1 cup)", cals: 55 },
    { name: "Lean Ground Beef (100g)", cals: 250 },
    { name: "Salmon (100g)", cals: 208 },
    { name: "Tuna (1 can)", cals: 130 },
    { name: "Pasta (1 cup cooked)", cals: 220 },
    { name: "Peanut Butter (2 tbsp)", cals: 190 },
    { name: "Whole Wheat Bread (1 slice)", cals: 69 },
    { name: "Cottage Cheese (1/2 cup)", cals: 115 },
    { name: "Olive Oil (1 tbsp)", cals: 119 },
    { name: "Milk (1 cup, whole)", cals: 150 },
    { name: "Cheese (1 slice)", cals: 113 },
    { name: "Protein Bar", cals: 220 },
    { name: "Blueberries (1 cup)", cals: 84 },
    { name: "Strawberries (1 cup)", cals: 49 },
    { name: "Carrots (1 cup)", cals: 50 }
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const results = MOCK_FOOD_DB.filter(food => 
      food.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleAddMeal = (mealType: string, name?: string, cals?: number) => {
    const foodName = name || newItem;
    const foodCals = cals || parseInt(newCals);
    
    if (foodName && !isNaN(foodCals)) {
      const newMeals = {
        ...meals,
        [mealType]: {
          cals: meals[mealType].cals + foodCals,
          items: [...meals[mealType].items, { name: foodName, cals: foodCals }]
        }
      };
      setMeals(newMeals);
      saveMealsToFirestore(newMeals);
      setNewItem("");
      setNewCals("");
      setIsAdding(null);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleRemoveItem = (mealType: string, itemIdx: number) => {
    const meal = meals[mealType];
    const itemToRemove = meal.items[itemIdx];
    const newItems = meal.items.filter((_, idx) => idx !== itemIdx);
    const newMeals = {
      ...meals,
      [mealType]: {
        cals: meal.cals - itemToRemove.cals,
        items: newItems
      }
    };
    setMeals(newMeals);
    saveMealsToFirestore(newMeals);
  };

  const toggleExpand = (mealType: string) => {
    setExpandedMeal(prev => prev === mealType ? null : mealType);
  };

  return (
    <div className="space-y-5 pb-12 select-auto">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">Nutrition & Meals</h1>
          <p className="text-[10px] font-bold tracking-wider uppercase text-zinc-400">Calories, macros & meal logging</p>
        </div>
        <button 
          onClick={handleSaveProgress}
          disabled={isFinishing || hasSaved}
          className="bg-[#CCFF00] text-black px-3.5 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl hover:bg-[#b3e600] transition disabled:opacity-50 flex items-center gap-1.5 shrink-0 active:scale-95 shadow"
        >
          {hasSaved ? <><Check className="w-3.5 h-3.5"/> Saved</> : (isFinishing ? "Saving..." : "Log Day")}
        </button>
      </div>

      <div className="relative w-full group z-20">
        <input 
          type="text" 
          placeholder="Search 1,000+ foods database..." 
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full bg-zinc-900 border border-white/15 pl-10 pr-4 py-2.5 text-xs text-white rounded-xl outline-none focus:border-[#CCFF00] transition"
        />
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400 group-focus-within:text-[#CCFF00] transition-colors" />
          
          {searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 w-full mt-2 bg-[#0A0A0A] border border-white/20 shadow-xl max-h-80 overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map((food, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 border-b border-white/10 hover:bg-white/10 transition">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">{food.name}</span>
                      <span className="text-[10px] font-bold text-[#CCFF00]">{food.cals} kcal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isAdding ? (
                        <button 
                          onClick={() => handleAddMeal(isAdding, food.name, food.cals)}
                          className="bg-white/10 p-2 hover:bg-[#CCFF00] hover:text-black transition flex items-center justify-center rounded-sm"
                          title={`Add to ${isAdding}`}
                        >
                          <Plus className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                      ) : (
                        <select 
                          onChange={(e) => {
                            if (e.target.value) handleAddMeal(e.target.value, food.name, food.cals);
                          }}
                          className="bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest outline-none p-1 border border-white/20 cursor-pointer focus:border-[#CCFF00]"
                          value=""
                        >
                          <option value="" disabled>ADD TO...</option>
                          {Object.keys(meals).map(meal => (
                            <option key={meal} value={meal} className="bg-[#0A0A0A] text-white">
                              {meal}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center">
                  <p className="text-xs font-bold text-white/40 mb-2">"{searchQuery}" not found in database.</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/20">Add custom food directly within a meal section.</p>
                </div>
              )}
            </div>
          )}
        </div>

      {/* Daily Macro & Calorie Overview Card */}
      <div className="bg-zinc-950 border border-white/10 p-4 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
            Daily Macro Target
          </span>
          <span className="text-[10px] font-mono text-[#CCFF00]">
            {Math.max(targetCals - totalCals, 0)} kcal left
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Calorie Ring */}
          <div className="relative inline-flex items-center justify-center shrink-0">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle className="text-white/10" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48" />
              <circle 
                className="text-[#CCFF00]" 
                strokeWidth="8" 
                strokeDasharray={251} 
                strokeDashoffset={251 - (251 * percentage) / 100} 
                strokeLinecap="round" 
                stroke="currentColor" 
                fill="transparent" 
                r="40" 
                cx="48" 
                cy="48" 
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-lg font-black text-white leading-none">{totalCals}</span>
              <span className="text-[8px] font-mono text-zinc-400">/ {targetCals}</span>
            </div>
          </div>

          {/* Macro Bars */}
          <div className="flex-1 space-y-2">
            {[
              { name: "Protein", current: Math.round((totalCals / targetCals) * 150), target: 150, color: "bg-[#CCFF00]" },
              { name: "Carbs", current: Math.round((totalCals / targetCals) * 250), target: 250, color: "bg-[#3BB1FF]" },
              { name: "Fats", current: Math.round((totalCals / targetCals) * 70), target: 70, color: "bg-[#9D4EDD]" },
            ].map((macro) => (
              <div key={macro.name} className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-white">
                  <span>{macro.name}</span>
                  <span className="text-zinc-400 font-mono text-[9px]">{macro.current}g / {macro.target}g</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${macro.color} transition-all duration-500 rounded-full`} 
                    style={{ width: `${Math.min((macro.current / macro.target) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Meals Section */}
      <div className="space-y-2.5">
        <h2 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 px-1">Today's Meals</h2>
        <div className="space-y-2.5">
          {Object.entries(meals).map(([mealType, data]) => (
            <div key={mealType} className="bg-zinc-950 border border-white/10 p-3.5 rounded-2xl transition-colors shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#CCFF00]">
                    <Apple className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase text-white leading-none">{mealType}</h3>
                    <p className="text-[10px] font-mono text-[#CCFF00] mt-0.5">{data.cals} kcal</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAdding(mealType)}
                  className="p-1.5 text-zinc-400 hover:text-white transition bg-white/5 hover:bg-white/10 rounded-lg active:scale-95"
                  title="Add food to meal"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              {isAdding === mealType && (
                <div className="mt-2 mb-2 p-2 bg-black border border-white/10 rounded-xl flex gap-1.5 items-center">
                  <input 
                    type="text" 
                    placeholder="Food name" 
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    className="bg-transparent px-2 py-1 text-xs text-white outline-none flex-1 min-w-0"
                  />
                  <input 
                    type="number" 
                    placeholder="Kcal" 
                    value={newCals}
                    onChange={(e) => setNewCals(e.target.value)}
                    className="bg-zinc-900 border border-white/10 px-2 py-1 text-xs text-white outline-none rounded w-16"
                  />
                  <button onClick={() => handleAddMeal(mealType)} className="bg-[#CCFF00] text-black p-1.5 rounded active:scale-95">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setIsAdding(null)} className="bg-zinc-800 text-zinc-400 p-1.5 rounded active:scale-95">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div>
                {expandedMeal === mealType ? (
                  <div className="space-y-1.5 my-2 border-t border-white/5 pt-2">
                    {data.items.length === 0 ? (
                      <p className="text-xs text-zinc-500 italic">No food items added yet.</p>
                    ) : (
                      data.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs bg-black/40 px-2.5 py-1.5 rounded-lg border border-white/5">
                          <span className="text-zinc-200">{item.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-[#CCFF00]">{item.cals} kcal</span>
                            <button 
                              onClick={() => handleRemoveItem(mealType, idx)}
                              className="text-zinc-500 hover:text-red-400 p-0.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <p className="text-[10px] text-zinc-400 mb-2 truncate">
                    {data.items.length > 0 ? data.items.map(item => item.name).join(" • ") : "No items logged yet"}
                  </p>
                )}
                
                <button onClick={() => toggleExpand(mealType)} className="text-[9px] font-bold uppercase tracking-wider text-[#CCFF00] flex items-center gap-1 hover:underline">
                  {expandedMeal === mealType ? (
                    <>Hide items <ChevronDown className="w-3 h-3" /></>
                  ) : (
                    <>View all items ({data.items.length}) <ChevronRight className="w-3 h-3" /></>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
