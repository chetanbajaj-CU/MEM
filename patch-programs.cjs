const fs = require('fs');
let code = fs.readFileSync('src/pages/Programs.tsx', 'utf8');

const importsToAdd = `
import { Sparkles, Loader2 } from "lucide-react";
`;
code = code.replace('import { useState } from "react";', `import { useState } from "react";${importsToAdd}`);

const aiSection = `
      <div className="bg-gradient-to-r from-[#CCFF00]/10 to-transparent border border-[#CCFF00]/20 p-6 sm:p-8 mb-12">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-black uppercase text-white flex items-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-[#CCFF00]" /> AI Program Generator
            </h2>
            <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-6">
              Describe your specific goals, limitations, and available equipment, and our AI will generate a custom program for you.
            </p>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="e.g. I only have dumbbells and 3 days a week to train for fat loss"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && generateProgram()}
                className="flex-1 bg-[#0A0A0A] border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00] transition"
              />
              <button
                onClick={generateProgram}
                disabled={isGenerating || !aiPrompt.trim()}
                className="bg-[#CCFF00] text-black px-6 font-black uppercase tracking-widest text-[11px] hover:bg-[#b3e600] transition disabled:opacity-50 flex items-center justify-center min-w-[120px] shrink-0"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate"}
              </button>
            </div>
          </div>
        </div>
        
        {aiError && (
          <div className="mt-4 text-xs font-bold uppercase tracking-widest text-red-500">
            {aiError}
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
`;

code = code.replace('<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">', aiSection);

const stateAndFuncs = `
  const [activeProgram, setActiveProgram] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrograms, setAiPrograms] = useState<any[]>([]);
  const [aiError, setAiError] = useState("");
  const navigate = useNavigate();

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
      
      const newProgram = {
        id: "ai-" + Math.random().toString(36).substring(7),
        level: data.level,
        name: data.name,
        freq: data.freq,
        desc: data.desc,
        extendedDesc: data.extendedDesc,
        ageGroup: "Custom",
        category: data.category,
        color: "bg-[#CCFF00]",
        textColor: "text-[#CCFF00]",
        icon: Sparkles,
        isAi: true
      };
      
      setAiPrograms([newProgram, ...aiPrograms]);
      setAiPrompt("");
    } catch (err) {
      setAiError("Failed to generate program. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
`;

code = code.replace(
  '  const [activeProgram, setActiveProgram] = useState<string | null>(null);\n  const [expandedId, setExpandedId] = useState<string | null>(null);\n  const navigate = useNavigate();',
  stateAndFuncs
);

code = code.replace(
  '{GYM_PROGRAMS.map((program) => (',
  '{[...aiPrograms, ...GYM_PROGRAMS].map((program) => ('
);

fs.writeFileSync('src/pages/Programs.tsx', code);
