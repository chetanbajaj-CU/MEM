const fs = require('fs');
let code = fs.readFileSync('src/pages/ProgramExecution.tsx', 'utf8');

const replacement = `
export function ProgramExecution() {
  const { programId } = useParams();
  const [program, setProgram] = useState<any>(null);
  
  const [activeTimer, setActiveTimer] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [customName, setCustomName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    let p = null;
    if (programId && programId.startsWith("ai-")) {
      const saved = localStorage.getItem("mem_ai_programs");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          p = parsed.find((x: any) => x.id === programId);
        } catch (e) {
          console.error(e);
        }
      }
    }
    if (!p) {
      p = programId && PROGRAM_DATA[programId] ? PROGRAM_DATA[programId] : PROGRAM_DATA["gp1"];
    }
    setProgram(p);
    setCustomName(p.name);
  }, [programId]);

  useEffect(() => {
`;

code = code.replace(/export function ProgramExecution\(\) \{.*?useEffect\(\(\) => \{/s, replacement);

const returnCheck = `
  if (!program) return <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]"><div className="w-8 h-8 border-4 border-[#CCFF00] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
`;
code = code.replace(/  return \(\n    <div className="max-w-4xl mx-auto space-y-8">/, returnCheck + '    <div className="max-w-4xl mx-auto space-y-8">');

fs.writeFileSync('src/pages/ProgramExecution.tsx', code);
