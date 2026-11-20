import { getLocalDateString } from "./dateUtils";
import { db, auth } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
  perfectNutritionDays: number;
  lastWorkoutDate?: string;
  lastObjectiveDate?: string;
  badges?: number[];
}

export const DEFAULT_STATS: UserStats = {
  currentStreak: 0,
  longestStreak: 0,
  totalWorkouts: 0,
  perfectNutritionDays: 0,
  badges: []
};

function getStorageKey(userId: string) {
  return `mem_stats_${userId}`;
}

export async function getUserStats(userId: string): Promise<UserStats> {
  let stats = DEFAULT_STATS;

  const isLocalSession = !userId || userId.startsWith("local-") || !auth.currentUser;

  if (isLocalSession) {
    const stored = localStorage.getItem(getStorageKey(userId));
    if (stored) {
      try {
        stats = JSON.parse(stored) as UserStats;
      } catch (e) {
        console.error("Failed to parse local user stats", e);
      }
    }
  } else {
    try {
      const docRef = doc(db, "userStats", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        stats = docSnap.data() as UserStats;
      } else {
        // Fallback to local storage if document does not exist yet
        const stored = localStorage.getItem(getStorageKey(userId));
        if (stored) {
          try {
            stats = JSON.parse(stored) as UserStats;
          } catch (e) {}
        }
      }
    } catch (e: any) {
      // Gracefully handle missing/insufficient permissions or offline state
      const stored = localStorage.getItem(getStorageKey(userId));
      if (stored) {
        try {
          stats = JSON.parse(stored) as UserStats;
        } catch (e2) {}
      }
    }
  }

  const today = getLocalDateString(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);
  
  let needsUpdate = false;
  
  if (stats.lastObjectiveDate && stats.lastObjectiveDate !== today && stats.lastObjectiveDate !== yesterdayStr) {
    stats.currentStreak = 0;
    needsUpdate = true;
  }
  
  if (needsUpdate) {
    await saveUserStats(userId, stats);
  }

  return stats;
}

export async function saveUserStats(userId: string, stats: UserStats): Promise<void> {
  const isLocalSession = !userId || userId.startsWith("local-") || !auth.currentUser;

  // Always save to local storage as instant local cache
  localStorage.setItem(getStorageKey(userId), JSON.stringify(stats));

  if (!isLocalSession) {
    try {
      const docRef = doc(db, "userStats", userId);
      await setDoc(docRef, stats, { merge: true });
    } catch (e) {
      console.warn("Could not sync user stats to Firestore (using local storage fallback):", e);
    }
  }
}

export async function logWorkout(userId: string): Promise<UserStats> {
  const stats = await getUserStats(userId);
  const today = getLocalDateString(new Date());
  
  const newStats: UserStats = {
    ...stats,
    totalWorkouts: (stats.totalWorkouts || 0) + 1,
    lastWorkoutDate: today,
  };
  
  // Earn badges logic based on workouts
  const badges = new Set(stats.badges || []);
  if (newStats.totalWorkouts >= 1) badges.add(1); // First step
  if (newStats.totalWorkouts >= 50) badges.add(3); // Iron Will
  
  newStats.badges = Array.from(badges);
  
  await saveUserStats(userId, newStats);
  return newStats;
}

export async function logDailyObjective(userId: string): Promise<UserStats> {
  const stats = await getUserStats(userId);
  const today = getLocalDateString(new Date());
  
  let newStreak = stats.currentStreak || 0;
  let longest = stats.longestStreak || 0;
  
  if (stats.lastObjectiveDate !== today) {
    // Check if it was yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getLocalDateString(yesterday);
    
    if (stats.lastObjectiveDate === yesterdayStr) {
      newStreak += 1;
    } else {
      newStreak = 1; // reset streak if gap is more than 1 day
    }
    
    if (newStreak > longest) {
      longest = newStreak;
    }
  }
  
  const newStats: UserStats = {
    ...stats,
    currentStreak: newStreak,
    longestStreak: longest,
    lastObjectiveDate: today,
  };
  
  // Earn badges logic based on streaks
  const badges = new Set(stats.badges || []);
  if (newStats.currentStreak >= 7) badges.add(2); // 7-day streak
  if (newStats.currentStreak >= 30) badges.add(6); // Consistency king
  
  newStats.badges = Array.from(badges);
  
  await saveUserStats(userId, newStats);
  return newStats;
}

export async function logPerfectNutrition(userId: string): Promise<UserStats> {
  const stats = await getUserStats(userId);
  const newStats: UserStats = {
    ...stats,
    perfectNutritionDays: (stats.perfectNutritionDays || 0) + 1,
  };
  
  const badges = new Set(stats.badges || []);
  if (newStats.perfectNutritionDays >= 10) badges.add(4); // Nutrition pro
  
  newStats.badges = Array.from(badges);
  
  await saveUserStats(userId, newStats);
  return newStats;
}
