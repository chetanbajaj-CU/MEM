const fs = require('fs');
let content = fs.readFileSync('src/pages/Nutrition.tsx', 'utf8');

const updatedSearch = `{searchQuery.trim().length > 0 && (
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
          )}`;

content = content.replace(/\{searchResults\.length > 0 && \([\s\S]*?\)\}/, updatedSearch);
fs.writeFileSync('src/pages/Nutrition.tsx', content);
