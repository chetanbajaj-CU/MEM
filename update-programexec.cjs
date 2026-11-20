const fs = require('fs');

let prog = fs.readFileSync('src/pages/ProgramExecution.tsx', 'utf8');

if (!prog.includes('import { useAuth }')) {
  prog = prog.replace(
    'import { useParams, Link } from "react-router-dom";',
    'import { useParams, Link, useNavigate } from "react-router-dom";\nimport { useAuth } from "../context/AuthContext";\nimport { logWorkout } from "../lib/userStats";'
  );
}

prog = prog.replace(
  'const [isEditingName, setIsEditingName] = useState(false);',
  `const [isEditingName, setIsEditingName] = useState(false);
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
  };`
);

prog = prog.replace(
  '      </div>\n    </div>\n  );\n}',
  `      </div>
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
}`
);

fs.writeFileSync('src/pages/ProgramExecution.tsx', prog);
