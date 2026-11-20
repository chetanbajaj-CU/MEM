const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');

const newEndpoint = `
  app.post("/api/generate-program", async (req, res) => {
    try {
      const { prompt } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not set" });
      }
      
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = \`You are an elite AI personal trainer. Based on the user's prompt, generate a custom workout program.
Respond ONLY with a JSON object containing the exact values.
Format: {
  "name": "string (Program Name)",
  "level": "string (e.g. Beginner, Intermediate, Advanced)",
  "freq": "string (e.g. 3 Days/Week)",
  "desc": "string (Short description)",
  "extendedDesc": "string (Detailed description)",
  "category": "string (e.g. Strength, Hypertrophy, Cardio)"
}\`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: \`User request: \${prompt}\`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        }
      });
      
      const resultText = response.text;
      if (!resultText) throw new Error("Empty response");
      
      const data = JSON.parse(resultText);
      res.json(data);
    } catch (error) {
      console.error("Generate Program Error:", error);
      res.status(500).json({ error: "Failed to generate program" });
    }
  });
`;

server = server.replace('// Vite middleware for development', newEndpoint + '\n  // Vite middleware for development');
fs.writeFileSync('server.ts', server);
