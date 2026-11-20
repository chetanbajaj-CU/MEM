const fs = require('fs');
let code = fs.readFileSync('src/pages/ProgramExecution.tsx', 'utf8');

const target = '  useEffect(() => {\n    let p = null;';
const injection = `
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
  };

  useEffect(() => {
    let p = null;`;

code = code.replace(target, injection);
fs.writeFileSync('src/pages/ProgramExecution.tsx', code);
