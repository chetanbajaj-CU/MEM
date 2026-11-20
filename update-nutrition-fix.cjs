const fs = require('fs');

const content = `import { Apple, Plus, Search, ChevronRight, ChevronDown, X, Check, Trash2 } from "lucide-react";
import { useState } from "react";

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
      setMeals(prev => ({
        ...prev,
        [mealType]: {
          cals: prev[mealType].cals + foodCals,
          items: [...prev[mealType].items, { name: foodName, cals: foodCals }]
        }
      }));
      setNewItem("");
      setNewCals("");
      setIsAdding(null);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleRemoveItem = (mealType: string, itemIdx: number) => {
    setMeals(prev => {
      const meal = prev[mealType];
      const itemToRemove = meal.items[itemIdx];
      const newItems = meal.items.filter((_, idx) => idx !== itemIdx);
      return {
        ...prev,
        [mealType]: {
          cals: meal.cals - itemToRemove.cals,
          items: newItems
        }
      };
    });
  };

  const toggleExpand = (mealType: string) => {
    setExpandedMeal(prev => prev === mealType ? null : mealType);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase">Nutrition & Meal Planner</h1>
          <p className="text-sm font-bold tracking-widest uppercase text-white/40 mt-2">Track calories, macros, and plan your meals.</p>
        </div>
        <div className="relative w-full md:w-64 group z-20">
          <input 
            type="text" 
            placeholder="Search Food Database..." 
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-white/20 pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-[#CCFF00] transition"
          />
          <Search className="absolute left-3 top-3 w-4 h-4 text-white/40 group-focus-within:text-[#CCFF00] transition-colors" />
          
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
                          title={\`Add to \${isAdding}\`}
                        >
                          <Plus className="w-3 h-3" />
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
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Today\'s Meals</h2>
          <div className="space-y-4">
            {Object.entries(meals).map(([mealType, data]) => (
              <div key={mealType} className="bg-white/5 border border-white/10 p-6 transition-colors hover:bg-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-white/5 flex items-center justify-center text-[#CCFF00]">
                      <Apple className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase text-white leading-none mb-1">{mealType}</h3>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-[#CCFF00]">{data.cals} kcal</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsAdding(mealType)}
                    className="text-white/40 p-2 hover:text-white transition bg-white/5 hover:bg-white/10"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                
                {isAdding === mealType ? (
                  <div className="pl-14 mb-4 flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Food name" 
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      className="bg-[#0A0A0A] border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-[#CCFF00] flex-1"
                    />
                    <input 
                      type="number" 
                      placeholder="Kcal" 
                      value={newCals}
                      onChange={(e) => setNewCals(e.target.value)}
                      className="bg-[#0A0A0A] border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-[#CCFF00] w-20"
                    />
                    <button onClick={() => handleAddMeal(mealType)} className="bg-[#CCFF00] text-black px-3 py-2 hover:bg-[#b3ff00] transition">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setIsAdding(null)} className="bg-white/5 text-white/60 px-3 py-2 hover:text-white transition">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : null}

                <div className="pl-14">
                  {expandedMeal === mealType ? (
                    <div className="space-y-2 mb-4">
                      {data.items.length === 0 ? (
                        <p className="text-xs text-white/40">No items logged yet.</p>
                      ) : (
                        data.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-[#0A0A0A] border border-white/5 p-3">
                            <span className="text-xs font-bold text-white">{item.name}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-[10px] font-bold text-[#CCFF00]">{item.cals} kcal</span>
                              <button 
                                onClick={() => handleRemoveItem(mealType, idx)}
                                className="text-white/40 hover:text-[#FF3366] transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    <p className="text-[11px] font-bold uppercase tracking-widest text-white/60 mb-3">
                      {data.items.map(item => item.name).join(" • ")}
                    </p>
                  )}
                  
                  <button onClick={() => toggleExpand(mealType)} className="text-[10px] font-bold uppercase tracking-widest text-[#CCFF00] flex items-center gap-1 hover:gap-2 transition-all">
                    {expandedMeal === mealType ? (
                      <>Hide full meal details <ChevronDown className="w-4 h-4" /></>
                    ) : (
                      <>View full meal details <ChevronRight className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Daily Summary</h2>
          <div className="bg-gradient-to-br from-[#0a0a0a] to-[#121212] border border-white/10 p-8 space-y-8 relative overflow-hidden">
            <div className="absolute right-[-10%] bottom-[-5%] text-[100px] font-black text-white/5 uppercase select-none pointer-events-none">MACROS</div>
            
            <div className="text-center relative z-10">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle className="text-white/10" strokeWidth="12" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80" />
                  <circle 
                    className="text-[#CCFF00]" 
                    strokeWidth="12" 
                    strokeDasharray={440} 
                    strokeDashoffset={440 - (440 * percentage) / 100} 
                    strokeLinecap="round" 
                    stroke="currentColor" 
                    fill="transparent" 
                    r="70" 
                    cx="80" 
                    cy="80" 
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-black text-white leading-none">{totalCals}</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 mt-1">Kcal Eaten</span>
                </div>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#CCFF00] mt-4">{Math.max(targetCals - totalCals, 0)} kcal remaining</p>
            </div>

            <div className="space-y-4 relative z-10">
              {[
                { name: "Protein", current: Math.round((totalCals / targetCals) * 150), target: 150, color: "bg-[#CCFF00]" },
                { name: "Carbs", current: Math.round((totalCals / targetCals) * 250), target: 250, color: "bg-[#3BB1FF]" },
                { name: "Fats", current: Math.round((totalCals / targetCals) * 70), target: 70, color: "bg-[#9D4EDD]" },
              ].map((macro) => (
                <div key={macro.name} className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-white">
                    <span>{macro.name}</span>
                    <span className="text-white/40">{macro.current}g / {macro.target}g</span>
                  </div>
                  <div className="h-1 w-full bg-white/10">
                    <div 
                      className={\`h-full \${macro.color} transition-all duration-500 ease-out\`} 
                      style={{ width: \`\${Math.min((macro.current / macro.target) * 100, 100)}%\` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`

fs.writeFileSync('src/pages/Nutrition.tsx', content);
