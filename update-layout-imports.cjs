const fs = require('fs');
let layout = fs.readFileSync('src/components/Layout.tsx', 'utf8');

layout = layout.replace(', LogOut', '');

fs.writeFileSync('src/components/Layout.tsx', layout);
