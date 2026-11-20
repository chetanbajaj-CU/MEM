const fs = require('fs');
let code = fs.readFileSync('src/pages/Programs.tsx', 'utf8');

const importsToReplace = `import { useState } from "react";`;
const importsNew = `import { useState, useEffect } from "react";`;
code = code.replace(importsToReplace, importsNew);

const stateInit = `
  const [activeProgram, setActiveProgram] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrograms, setAiPrograms] = useState<any[]>([]);
  const [aiError, setAiError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("mem_ai_programs");
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((p: any) => ({...p, icon: Sparkles}));
        setAiPrograms(parsed);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);
`;
code = code.replace(/  const \[activeProgram, setActiveProgram\] = useState<string \| null>\(null\);\n.*const navigate = useNavigate\(\);/s, stateInit);

const newProgramCreation = `
      const newProgram = {
        id: "ai-" + Math.random().toString(36).substring(7),
        level: data.level,
        name: data.name,
        freq: data.freq,
        desc: data.desc,
        extendedDesc: data.extendedDesc,
        ageGroup: "Custom AI",
        category: data.category,
        color: "bg-[#CCFF00]",
        textColor: "text-[#CCFF00]",
        icon: Sparkles,
        isAi: true,
        days: data.days || []
      };
      
      const updatedAi = [newProgram, ...aiPrograms];
      setAiPrograms(updatedAi);
      localStorage.setItem("mem_ai_programs", JSON.stringify(updatedAi.map(p => ({...p, icon: undefined}))));
      setAiPrompt("");
`;

code = code.replace(/      const newProgram = \{.*?\};\n      \n      setAiPrograms\(\[newProgram, \.\.\.aiPrograms\]\);\n      setAiPrompt\(""\);/s, newProgramCreation);

fs.writeFileSync('src/pages/Programs.tsx', code);
