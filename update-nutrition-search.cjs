const fs = require('fs');
let content = fs.readFileSync('src/pages/Nutrition.tsx', 'utf8');

const expandedDb = `  const MOCK_FOOD_DB = [
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
  ];`;

content = content.replace(/const MOCK_FOOD_DB = \[[\s\S]*?\];/, expandedDb);

const searchResultsCode = `{searchResults.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-2 bg-[#0A0A0A] border border-white/20 shadow-xl max-h-80 overflow-y-auto">
              {searchResults.map((food, idx) => (
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
              ))}
            </div>
          )}`;

content = content.replace(/\{searchResults\.length > 0 && \([\s\S]*?\)\}/, searchResultsCode);

fs.writeFileSync('src/pages/Nutrition.tsx', content);
