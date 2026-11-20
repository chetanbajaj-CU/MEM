const fs = require('fs');

let profile = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

profile = profile.replace('  const { user } = useAuth();\n  const { user } = useAuth();', '  const { user } = useAuth();');
profile = profile.replace('}, [user]);\n  const { user } = useAuth();', '}, [user]);');

fs.writeFileSync('src/pages/Profile.tsx', profile);
