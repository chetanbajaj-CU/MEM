const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldPrompt = `You are an elite AI personal trainer. Based on the user's prompt, generate a custom workout program.
Respond ONLY with a JSON object containing the exact values.
Format: {
  "name": "string (Program Name)",
  "level": "string (e.g. Beginner, Intermediate, Advanced)",
  "freq": "string (e.g. 3 Days/Week)",
  "desc": "string (Short description)",
  "extendedDesc": "string (Detailed description)",
  "category": "string (e.g. Strength, Hypertrophy, Cardio)"
}`;

const newPrompt = `You are an elite AI personal trainer. Based on the user's prompt, generate a custom, realistic, and unique workout program.
Respond ONLY with a JSON object containing the exact values. Provide intelligent AI reasoning in extendedDesc.
Format: {
  "name": "string (Program Name)",
  "level": "string (e.g. Beginner, Intermediate, Advanced)",
  "freq": "string (e.g. 3 Days/Week)",
  "desc": "string (Short description)",
  "extendedDesc": "string (Detailed description including your AI reasoning for this specific approach)",
  "category": "string (e.g. Strength, Hypertrophy, Cardio)",
  "days": [
    {
      "day": number,
      "title": "string (e.g. Upper Body Focus)",
      "exercises": ["string (e.g. Barbell Bench Press 4x8)", "string"]
    }
  ]
}`;

code = code.replace(oldPrompt, newPrompt);
fs.writeFileSync('server.ts', code);
