const fs = require('fs');

let profile = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

profile = profile.replace(
  'import { useAuth } from "../context/AuthContext";',
  'import { useAuth } from "../context/AuthContext";\nimport { useEffect, useState } from "react";\nimport { getUserStats, UserStats, DEFAULT_STATS } from "../lib/userStats";'
);

profile = profile.replace(
  'export function Profile() {',
  `export function Profile() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      if (user) {
        setLoading(true);
        try {
          const fetchedStats = await getUserStats(user.uid);
          setStats(fetchedStats);
        } catch (error) {
          console.error("Failed to load stats", error);
        } finally {
          setLoading(false);
        }
      }
    }
    loadStats();
  }, [user]);`
);

profile = profile.replace(
  `  // Dummy data for streaks and badges
  const stats = {
    currentStreak: 12,
    longestStreak: 45,
    totalWorkouts: 128,
    perfectNutritionDays: 34,
  };`,
  ""
);

profile = profile.replace(
  `  const badges = [
    { id: 1, name: "First Step", description: "Completed your first workout", icon: Target, earned: true, color: "text-[#3BB1FF]" },
    { id: 2, name: "7-Day Streak", description: "Worked out for 7 days in a row", icon: Flame, earned: true, color: "text-[#FF8C00]" },
    { id: 3, name: "Iron Will", description: "Completed 50 workouts", icon: Dumbbell, earned: true, color: "text-[#CCFF00]" },
    { id: 4, name: "Nutrition Pro", description: "Hit macro goals 10 days straight", icon: Apple, earned: false, color: "text-white/20" },
    { id: 5, name: "Early Bird", description: "5 morning workouts", icon: Clock, earned: true, color: "text-[#9D4EDD]" },
    { id: 6, name: "Consistency King", description: "30-Day streak", icon: Zap, earned: false, color: "text-white/20" },
  ];`,
  `  const badgeDefinitions = [
    { id: 1, name: "First Step", description: "Completed your first workout", icon: Target, color: "text-[#3BB1FF]" },
    { id: 2, name: "7-Day Streak", description: "Worked out for 7 days in a row", icon: Flame, color: "text-[#FF8C00]" },
    { id: 3, name: "Iron Will", description: "Completed 50 workouts", icon: Dumbbell, color: "text-[#CCFF00]" },
    { id: 4, name: "Nutrition Pro", description: "Hit macro goals 10 days straight", icon: Apple, color: "text-white/20" },
    { id: 5, name: "Early Bird", description: "5 morning workouts", icon: Clock, color: "text-[#9D4EDD]" },
    { id: 6, name: "Consistency King", description: "30-Day streak", icon: Zap, color: "text-white/20" },
  ];
  
  const badges = badgeDefinitions.map(b => ({
    ...b,
    earned: (stats.badges || []).includes(b.id)
  }));`
);

fs.writeFileSync('src/pages/Profile.tsx', profile);
