import { db } from "./firebase";
import { collection, doc, getDocs, setDoc, deleteDoc, addDoc, query, orderBy, getDoc, onSnapshot } from "firebase/firestore";

export interface RegisteredMember {
  uid: string;
  email?: string | null;
  phoneNumber?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  authProvider?: string;
  registeredAt: string;
  lastActive: string;
}

export interface AdminMessage {
  id: string;
  senderName: "MEM Fitness";
  adminEmail: string;
  channel: "email" | "phone" | "in-app" | "all";
  targetType: "all" | "specific";
  recipientEmail?: string | null;
  recipientPhone?: string | null;
  recipientName?: string | null;
  recipientUid?: string | null;
  subject: string;
  content: string;
  createdAt: string;
  status: "delivered" | "sent";
  readBy?: string[];
  deletedBy?: string[];
}

const STORAGE_KEY_MEMBERS = "mem_registered_members_cache";
const STORAGE_KEY_MESSAGES = "mem_admin_messages_cache";


// Pre-seeded initial broadcast from MEM Fitness
const DEFAULT_MESSAGES: AdminMessage[] = [
  {
    id: "msg-welcome-001",
    senderName: "MEM Fitness",
    adminEmail: "chetanbajaj9a22@gmail.com",
    channel: "all",
    targetType: "all",
    subject: "Welcome to Project MEM — Mind. Energy. Motion.",
    content: "Welcome to MEM Fitness! Your athletic journey starts today. Complete your daily workout, lock in your nutritional macros, and practice your mental game. We're tracking your streak!",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: "delivered",
    readBy: []
  },
  {
    id: "msg-mind-002",
    senderName: "MEM Fitness",
    adminEmail: "chetanbajaj9a22@gmail.com",
    channel: "in-app",
    targetType: "all",
    subject: "New Feature: Mind Chess & Mental Stability Drills",
    content: "MEM Fitness Coach Alert: Train your cognitive impulse control with our new Mind Chess coach under the Mental Relief section. Consistent recovery produces peak performance.",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: "delivered",
    readBy: []
  }
];

// Helper to register or update a member in both Firestore and localStorage
export async function registerOrUpdateMember(member: RegisteredMember): Promise<void> {
  // 1. Update localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MEMBERS);
    let members: RegisteredMember[] = raw ? JSON.parse(raw) : [];
    const index = members.findIndex(m => m.uid === member.uid || (member.email && m.email === member.email) || (member.phoneNumber && m.phoneNumber === member.phoneNumber));
    if (index >= 0) {
      members[index] = { ...members[index], ...member, lastActive: new Date().toISOString() };
    } else {
      members.push(member);
    }
    localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(members));
  } catch (e) {
    console.warn("Could not cache member locally:", e);
  }

  // 2. Sync to Firestore if signed in with real UID
  try {
    if (!member.uid.startsWith("local-")) {
      const userDocRef = doc(db, "users", member.uid);
      await setDoc(userDocRef, {
        uid: member.uid,
        email: member.email || null,
        phoneNumber: member.phoneNumber || null,
        displayName: member.displayName || null,
        authProvider: member.authProvider || "firebase",
        lastActive: member.lastActive || new Date().toISOString(),
        registeredAt: member.registeredAt || new Date().toISOString()
      }, { merge: true });
    }
  } catch (e) {
    console.warn("Could not sync member to Firestore (offline/local fallback):", e);
  }
}

// Fetch all registered members from Firestore + localStorage
export async function getRegisteredMembers(): Promise<RegisteredMember[]> {
  const membersMap = new Map<string, RegisteredMember>();

  // 1. Load from localStorage cache
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MEMBERS);
    if (raw) {
      const cached: RegisteredMember[] = JSON.parse(raw);
      cached.forEach(m => membersMap.set(m.uid || m.email || m.phoneNumber || "", m));
    }
  } catch (e) {}

  // 2. Also check if the current user exists in local_guest_user
  try {
    const localUser = localStorage.getItem("local_guest_user");
    if (localUser) {
      const parsed = JSON.parse(localUser);
      if (parsed.uid) {
        membersMap.set(parsed.uid, {
          uid: parsed.uid,
          email: parsed.email || null,
          phoneNumber: parsed.phoneNumber || null,
          displayName: parsed.displayName || "Local Athlete",
          authProvider: parsed.phoneNumber ? "phone" : (parsed.email ? "email" : "guest"),
          registeredAt: new Date().toISOString(),
          lastActive: new Date().toISOString()
        });
      }
    }
  } catch (e) {}

  // 3. Try fetching from Firestore users collection
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const member: RegisteredMember = {
        uid: docSnap.id,
        email: data.email || null,
        phoneNumber: data.phoneNumber || null,
        displayName: data.displayName || null,
        authProvider: data.authProvider || "firebase",
        registeredAt: data.registeredAt || new Date().toISOString(),
        lastActive: data.lastActive || new Date().toISOString(),
      };
      membersMap.set(docSnap.id, member);
    });
  } catch (e) {
    console.warn("Firestore getRegisteredMembers offline/fallback:", e);
  }

  // Ensure default admin user is in the list for testing
  if (!Array.from(membersMap.values()).some(m => m.email === "chetanbajaj9a22@gmail.com")) {
    membersMap.set("admin-chetan", {
      uid: "admin-chetan",
      email: "chetanbajaj9a22@gmail.com",
      phoneNumber: "+1 (555) 234-5678",
      displayName: "Chetan Bajaj (Admin)",
      authProvider: "google",
      registeredAt: "2026-01-01T00:00:00.000Z",
      lastActive: new Date().toISOString()
    });
  }

  return Array.from(membersMap.values()).sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());
}

// Delete a registered member from Firestore and all local caches
export async function deleteRegisteredMember(uid: string): Promise<boolean> {
  // Prevent deleting the primary admin account
  if (uid === "admin-chetan") {
    throw new Error("Cannot delete primary system admin account");
  }

  // 1. Delete from Firestore users collection
  try {
    if (!uid.startsWith("local-")) {
      await deleteDoc(doc(db, "users", uid));
    }
  } catch (e) {
    console.warn("Could not delete member from Firestore users:", e);
  }

  // 2. Also attempt to clean up userStats doc in Firestore
  try {
    if (!uid.startsWith("local-")) {
      await deleteDoc(doc(db, "userStats", uid));
    }
  } catch (e) {
    console.warn("Could not delete userStats from Firestore:", e);
  }

  // 3. Remove from localStorage members cache
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MEMBERS);
    if (raw) {
      let members: RegisteredMember[] = JSON.parse(raw);
      members = members.filter(m => m.uid !== uid);
      localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(members));
    }
  } catch (e) {
    console.warn("Could not remove member from local cache:", e);
  }

  // 4. Remove custom photo if stored
  try {
    localStorage.removeItem(`mem_user_photo_${uid}`);
  } catch (e) {}

  // 5. If this is the current active local guest user, clear it
  try {
    const localUserRaw = localStorage.getItem("local_guest_user");
    if (localUserRaw) {
      const parsed = JSON.parse(localUserRaw);
      if (parsed.uid === uid) {
        localStorage.removeItem("local_guest_user");
      }
    }
  } catch (e) {}

  // 6. Clean up any local daily data & streak caches for this user
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith(`daily_data_${uid}_`) || k.startsWith(`user_stats_${uid}`))) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch (e) {}

  return true;
}

// Send a message from admin MEM Fitness
export async function sendAdminMessage(payload: Omit<AdminMessage, "id" | "senderName" | "createdAt" | "status" | "readBy">): Promise<AdminMessage> {
  const newMessage: AdminMessage = {
    ...payload,
    id: "mem-msg-" + Date.now(),
    senderName: "MEM Fitness",
    createdAt: new Date().toISOString(),
    status: "delivered",
    readBy: []
  };

  // 1. Save to localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MESSAGES);
    let messages: AdminMessage[] = raw ? JSON.parse(raw) : [...DEFAULT_MESSAGES];
    messages.unshift(newMessage);
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
  } catch (e) {
    console.warn("Local storage message save error:", e);
  }

  // 2. Try Firestore save
  try {
    await setDoc(doc(db, "adminMessages", newMessage.id), newMessage);
  } catch (e) {
    console.warn("Firestore adminMessages save error:", e);
  }

  // 3. Dispatch to backend API
  try {
    await fetch("/api/admin/broadcast-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMessage)
    });
  } catch (e) {
    // offline/dev non-blocking
  }

  // 4. Trigger global window event so any athlete currently viewable in the app immediately sees the notification bar!
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("mem_admin_message_dispatched", { detail: newMessage }));
  }

  return newMessage;
}

// Get all admin messages
export async function getAdminMessages(): Promise<AdminMessage[]> {
  const messagesMap = new Map<string, AdminMessage>();

  // 1. Seed defaults
  DEFAULT_MESSAGES.forEach(m => messagesMap.set(m.id, m));

  // 2. Load from localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MESSAGES);
    if (raw) {
      const cached: AdminMessage[] = JSON.parse(raw);
      cached.forEach(m => messagesMap.set(m.id, m));
    }
  } catch (e) {}

  // 3. Load from Firestore
  try {
    const querySnapshot = await getDocs(collection(db, "adminMessages"));
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as AdminMessage;
      messagesMap.set(docSnap.id, { ...data, id: docSnap.id });
    });
  } catch (e) {
    console.warn("Firestore getAdminMessages offline/fallback:", e);
  }

  return Array.from(messagesMap.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Helper to normalize phone digits for matching
function normalizePhone(p?: string | null): string {
  if (!p) return "";
  return p.replace(/[^0-9]/g, "");
}

// Get messages relevant for a specific user
export async function getMessagesForUser(userEmail?: string | null, userPhone?: string | null, userId?: string | null): Promise<AdminMessage[]> {
  const all = await getAdminMessages();
  const cleanPhone = normalizePhone(userPhone);

  // Load any locally deleted message IDs for this user
  let locallyDeletedIds: string[] = [];
  if (userId) {
    try {
      const delRaw = localStorage.getItem(`mem_deleted_notifications_${userId}`);
      if (delRaw) {
        locallyDeletedIds = JSON.parse(delRaw);
      }
    } catch (e) {}
  }

  return all.filter(msg => {
    // Exclude if athlete deleted this notification
    if (userId && (msg.deletedBy || []).includes(userId)) return false;
    if (locallyDeletedIds.includes(msg.id)) return false;

    // 1. Broadcasts to all athletes
    if (msg.targetType === "all") return true;

    // 2. Direct match by athlete UID
    if (userId && msg.recipientUid && msg.recipientUid === userId) return true;

    // 3. Direct match by email
    if (userEmail && msg.recipientEmail && msg.recipientEmail.toLowerCase().trim() === userEmail.toLowerCase().trim()) return true;

    // 4. Direct match by phone
    if (cleanPhone && msg.recipientPhone) {
      const msgPhone = normalizePhone(msg.recipientPhone);
      if (msgPhone === cleanPhone || (msgPhone.length >= 7 && cleanPhone.endsWith(msgPhone)) || (cleanPhone.length >= 7 && msgPhone.endsWith(cleanPhone))) {
        return true;
      }
    }

    return false;
  });
}

// Real-time subscription hook/helper for an athlete's messages
export function subscribeToUserMessages(
  user: { uid?: string | null; email?: string | null; phoneNumber?: string | null } | null,
  callback: (messages: AdminMessage[]) => void
): () => void {
  if (!user) {
    callback([]);
    return () => {};
  }

  let isSubscribed = true;

  const refresh = async () => {
    if (!isSubscribed) return;
    try {
      const msgs = await getMessagesForUser(user.email, user.phoneNumber, user.uid);
      if (isSubscribed) {
        callback(msgs);
      }
    } catch (e) {
      console.warn("Error refreshing user messages:", e);
    }
  };

  // Immediate fetch
  refresh();

  // Listen to same-page custom events & cross-tab storage events
  const onDispatch = () => {
    refresh();
  };
  window.addEventListener("mem_admin_message_dispatched", onDispatch);
  window.addEventListener("storage", onDispatch);

  // Firestore real-time onSnapshot listener
  let unsubFirestore: (() => void) | null = null;
  try {
    unsubFirestore = onSnapshot(collection(db, "adminMessages"), () => {
      refresh();
    }, (err) => {
      console.warn("Firestore snapshot on adminMessages error:", err);
    });
  } catch (e) {
    // local fallback
  }

  // Periodic poll fallback (10 seconds)
  const interval = setInterval(refresh, 10000);

  return () => {
    isSubscribed = false;
    window.removeEventListener("mem_admin_message_dispatched", onDispatch);
    window.removeEventListener("storage", onDispatch);
    if (unsubFirestore) unsubFirestore();
    clearInterval(interval);
  };
}

// Mark message as read
export async function markMessageAsRead(messageId: string, userId: string): Promise<void> {
  // 1. Update localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MESSAGES);
    if (raw) {
      let messages: AdminMessage[] = JSON.parse(raw);
      const msg = messages.find(m => m.id === messageId);
      if (msg) {
        msg.readBy = Array.from(new Set([...(msg.readBy || []), userId]));
        localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
      }
    }
  } catch (e) {}

  // 2. Update Firestore
  try {
    const docRef = doc(db, "adminMessages", messageId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const current = snap.data() as AdminMessage;
      const readBy = Array.from(new Set([...(current.readBy || []), userId]));
      await setDoc(docRef, { readBy }, { merge: true });
    }
  } catch (e) {}

  // 3. Dispatch event to sync UI in real-time
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("mem_admin_message_dispatched", { detail: { messageId, userId, action: "read" } }));
  }
}

// Delete notification for user (removes it from their notification bar and inbox)
export async function deleteNotificationForUser(messageId: string, userId: string): Promise<void> {
  // 1. Update local storage deleted list for fast, instant client persistence
  try {
    const key = `mem_deleted_notifications_${userId}`;
    const raw = localStorage.getItem(key);
    const deleted: string[] = raw ? JSON.parse(raw) : [];
    if (!deleted.includes(messageId)) {
      deleted.push(messageId);
      localStorage.setItem(key, JSON.stringify(deleted));
    }
  } catch (e) {
    console.warn("Could not cache deleted notification locally:", e);
  }

  // 2. Update cached messages in localStorage
  try {
    const rawMsgs = localStorage.getItem(STORAGE_KEY_MESSAGES);
    if (rawMsgs) {
      let messages: AdminMessage[] = JSON.parse(rawMsgs);
      const msg = messages.find(m => m.id === messageId);
      if (msg) {
        msg.deletedBy = Array.from(new Set([...(msg.deletedBy || []), userId]));
        localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
      }
    }
  } catch (e) {
    console.warn("Could not update local cached message deleted status:", e);
  }

  // 3. Update Firestore doc with deletedBy array
  try {
    const docRef = doc(db, "adminMessages", messageId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const current = snap.data() as AdminMessage;
      const deletedBy = Array.from(new Set([...(current.deletedBy || []), userId]));
      await setDoc(docRef, { deletedBy }, { merge: true });
    }
  } catch (e) {
    console.warn("Firestore deleteNotificationForUser offline/fallback:", e);
  }

  // 4. Dispatch event to sync UI in real-time across components
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("mem_admin_message_dispatched", { detail: { messageId, userId, action: "delete" } }));
  }
}

// Global helper to trigger MemberInbox opening with optional message focus
export function openMemberInboxModal(messageId?: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("mem_open_inbox", { detail: { messageId } }));
  }
}

// Global deletion by Admin (removes message completely from system)
export async function deleteAdminMessage(messageId: string): Promise<boolean> {
  // 1. Remove from localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MESSAGES);
    if (raw) {
      let messages: AdminMessage[] = JSON.parse(raw);
      messages = messages.filter(m => m.id !== messageId);
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    }
  } catch (e) {
    console.warn("Could not remove message from local cache:", e);
  }

  // 2. Remove from Firestore
  try {
    await deleteDoc(doc(db, "adminMessages", messageId));
  } catch (e) {
    console.warn("Could not delete message from Firestore:", e);
  }

  // 3. Dispatch update event
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("mem_admin_message_dispatched", { detail: { messageId, action: "global_delete" } }));
  }

  return true;
}


