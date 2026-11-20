const fs = require('fs');
let home = fs.readFileSync('src/pages/Home.tsx', 'utf8');

home = home.replace('to={user ? "/programs" : "/signin"}', 'to="/programs"');

fs.writeFileSync('src/pages/Home.tsx', home);
