const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Remove import
app = app.replace('import { ProtectedRoute } from "./components/ProtectedRoute";', '');

// Unwrap the routes
app = app.replace('<Route element={<ProtectedRoute />}>', '');
app = app.replace('</Route>\n        </Route>', '</Route>'); // One level removed

fs.writeFileSync('src/App.tsx', app);
