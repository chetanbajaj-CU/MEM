const fs = require('fs');

let nut = fs.readFileSync('src/pages/Nutrition.tsx', 'utf8');

if (!nut.includes('import { useAuth }')) {
  nut = nut.replace(
    'import { useState } from "react";',
    'import { useState } from "react";\nimport { useAuth } from "../context/AuthContext";\nimport { logPerfectNutrition } from "../lib/userStats";\nimport { useNavigate } from "react-router-dom";'
  );
}

nut = nut.replace(
  'const targetCals = 2200;',
  `const targetCals = 2200;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFinishing, setIsFinishing] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  
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
  };`
);

nut = nut.replace(
  '          <p className="text-sm font-bold tracking-widest uppercase text-white/40 mt-2">Track calories, macros, and plan your meals.</p>\n        </div>',
  `          <p className="text-sm font-bold tracking-widest uppercase text-white/40 mt-2">Track calories, macros, and plan your meals.</p>
        </div>
        <button 
          onClick={handleSaveProgress}
          disabled={isFinishing || hasSaved}
          className="bg-[#CCFF00] text-black px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-[#b3e600] transition disabled:opacity-50 flex items-center gap-2 mt-4 md:mt-0"
        >
          {hasSaved ? <><Check className="w-4 h-4"/> Saved</> : (isFinishing ? "Saving..." : "Log Perfect Day")}
        </button>`
);

fs.writeFileSync('src/pages/Nutrition.tsx', nut);
