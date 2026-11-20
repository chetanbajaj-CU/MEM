import { db, auth } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getLocalDateString } from "./dateUtils";

export async function getDailyData(userId: string, date: string) {
  const isLocalSession = !userId || userId.startsWith("local-") || !auth.currentUser;

  if (isLocalSession) {
    const histStr = localStorage.getItem(`daily_data_${userId}_${date}`);
    if (histStr) {
      try {
        return JSON.parse(histStr);
      } catch (e) {}
    }
    return null;
  }
  
  try {
    const docRef = doc(db, "dailyData", `${userId}_${date}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (e: any) {
    // If permission or offline error occurs, use local storage
  }
  
  // Fallback to local
  const histStr = localStorage.getItem(`daily_data_${userId}_${date}`);
  if (histStr) {
    try {
      return JSON.parse(histStr);
    } catch (e) {}
  }
  return null;
}

export async function saveDailyData(userId: string, date: string, data: any) {
  const isLocalSession = !userId || userId.startsWith("local-") || !auth.currentUser;
  const payload = { ...data, userId };

  // Always cache locally
  localStorage.setItem(`daily_data_${userId}_${date}`, JSON.stringify(payload));

  if (!isLocalSession) {
    try {
      const docRef = doc(db, "dailyData", `${userId}_${date}`);
      await setDoc(docRef, payload, { merge: true });
    } catch (e: any) {
      console.warn("Could not save daily data to Firestore (saved locally):", e);
    }
  }
}
