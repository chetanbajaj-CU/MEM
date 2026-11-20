const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(/<Route path="signin" element={<SignIn \/>} \/>/g, '');

fs.writeFileSync('src/App.tsx', app);
