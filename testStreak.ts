const mockStorage: Record<string, string> = {};
global.localStorage = {
  getItem: (key: string) => mockStorage[key] || null,
  setItem: (key: string, val: string) => { mockStorage[key] = val; },
  removeItem: () => {},
  clear: () => {},
  length: 0,
  key: () => null
} as Storage;

import { getUserStats, logDailyObjective } from "./src/lib/userStats";

async function test() {
  const userId = "test-user";
  mockStorage["mem_stats_test-user"] = JSON.stringify({
    currentStreak: 2,
    longestStreak: 2,
    totalWorkouts: 0,
    perfectNutritionDays: 0,
    badges: [],
    lastObjectiveDate: "2026-07-05"
  });

  let stats = await getUserStats(userId);
  console.log("Initial (from 2 days ago):", stats);
  stats = await logDailyObjective(userId);
  console.log("After gap day:", stats);
}

test();
