import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth, signInAnonymously, signOut as firebaseSignOut } from "../lib/firebase";
import { onAuthStateChanged, updateProfile, User as FirebaseUser } from "firebase/auth";
import { registerOrUpdateMember } from "../lib/adminMessages";

export interface User {
  uid: string;
  email?: string | null;
  phoneNumber?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  isAnonymous?: boolean;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
  loginWithLocalEmail: (email: string, displayName?: string) => Promise<void>;
  loginWithLocalPhone: (phoneNumber: string, displayName?: string) => Promise<void>;
  updateUserName: (name: string) => Promise<void>;
  updateUserPhoto: (photoURL: string | null) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const localUserStr = localStorage.getItem("local_guest_user");
    let initialUser: User | null = null;
    if (localUserStr) {
      try {
        initialUser = JSON.parse(localUserStr);
        if (initialUser) {
          const savedPhoto = localStorage.getItem(`mem_user_photo_${initialUser.uid}`);
          if (savedPhoto) {
            initialUser.photoURL = savedPhoto;
          }
          if (initialUser.email?.toLowerCase() === "chetanbajaj9a22@gmail.com") {
            initialUser.isAdmin = true;
          }
        }
      } catch (e) {
        console.error("Failed to parse local guest user", e);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const isUserAdmin = firebaseUser.email?.toLowerCase() === "chetanbajaj9a22@gmail.com";
        // Check for custom saved photo (localStorage first, then fallback to Firebase Auth photo)
        const cachedPhoto = localStorage.getItem(`mem_user_photo_${firebaseUser.uid}`);
        const resolvedPhoto = cachedPhoto || firebaseUser.photoURL;

        const mappedUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          phoneNumber: firebaseUser.phoneNumber,
          displayName: firebaseUser.displayName || (firebaseUser.isAnonymous ? "Guest User" : (firebaseUser.phoneNumber ? `Athlete (${firebaseUser.phoneNumber.slice(-4)})` : "User")),
          photoURL: resolvedPhoto,
          isAnonymous: firebaseUser.isAnonymous,
          isAdmin: isUserAdmin
        };
        setUser(mappedUser);

        // Async sync from Firestore users collection in case custom photo was saved on another session
        try {
          const { doc, getDoc } = await import("firebase/firestore");
          const { db } = await import("../lib/firebase");
          const snap = await getDoc(doc(db, "users", firebaseUser.uid));
          if (snap.exists() && snap.data().photoURL) {
            const fsPhoto = snap.data().photoURL;
            if (fsPhoto && fsPhoto !== mappedUser.photoURL) {
              localStorage.setItem(`mem_user_photo_${firebaseUser.uid}`, fsPhoto);
              setUser(prev => prev ? { ...prev, photoURL: fsPhoto } : null);
            }
          }
        } catch (e) {
          // offline or local mode
        }

        registerOrUpdateMember({
          uid: firebaseUser.uid,
          email: firebaseUser.email || null,
          phoneNumber: firebaseUser.phoneNumber || null,
          displayName: mappedUser.displayName || null,
          photoURL: mappedUser.photoURL || null,
          authProvider: firebaseUser.phoneNumber ? "phone" : (firebaseUser.email ? "email" : "google"),
          registeredAt: new Date().toISOString(),
          lastActive: new Date().toISOString()
        });
      } else {
        setUser((current) => {
          if (current?.uid.startsWith("local-")) return current;
          if (initialUser) return initialUser;
          return null;
        });
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginAsGuest = async () => {
    const guestUser: User = {
      uid: "local-guest-" + Date.now(),
      displayName: "Guest Athlete",
      isAnonymous: true
    };
    setUser(guestUser);
    localStorage.setItem("local_guest_user", JSON.stringify(guestUser));
    registerOrUpdateMember({
      uid: guestUser.uid,
      displayName: guestUser.displayName,
      authProvider: "guest",
      registeredAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    });
  };

  const loginWithLocalEmail = async (email: string, displayName?: string) => {
    const namePart = email.split("@")[0];
    const isUserAdmin = email.toLowerCase() === "chetanbajaj9a22@gmail.com";
    const emailUser: User = {
      uid: "local-email-" + Math.random().toString(36).substring(2, 9),
      email: email,
      displayName: displayName || (namePart.charAt(0).toUpperCase() + namePart.slice(1)),
      isAnonymous: false,
      isAdmin: isUserAdmin
    };
    setUser(emailUser);
    localStorage.setItem("local_guest_user", JSON.stringify(emailUser));
    registerOrUpdateMember({
      uid: emailUser.uid,
      email: email,
      displayName: emailUser.displayName,
      authProvider: "email",
      registeredAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    });
  };

  const loginWithLocalPhone = async (phoneNumber: string, displayName?: string) => {
    const lastDigits = phoneNumber.replace(/[^0-9]/g, "").slice(-4);
    const phoneUser: User = {
      uid: "local-phone-" + Math.random().toString(36).substring(2, 9),
      phoneNumber: phoneNumber,
      displayName: displayName || `Athlete (${lastDigits || "Mobile"})`,
      isAnonymous: false
    };
    setUser(phoneUser);
    localStorage.setItem("local_guest_user", JSON.stringify(phoneUser));
    registerOrUpdateMember({
      uid: phoneUser.uid,
      phoneNumber: phoneNumber,
      displayName: phoneUser.displayName,
      authProvider: "phone",
      registeredAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    });
  };

  const logout = async () => {
    try {
      if (user?.uid.startsWith("local-")) {
        setUser(null);
        localStorage.removeItem("local_guest_user");
      } else {
        await firebaseSignOut();
        setUser(null);
        localStorage.removeItem("local_guest_user");
      }
    } catch (error) {
      console.error("Logout failed", error);
      setUser(null);
      localStorage.removeItem("local_guest_user");
    }
  };

  const updateUserName = async (name: string) => {
    if (!user) return;

    if (user.uid.startsWith("local-")) {
      const updatedUser = { ...user, displayName: name };
      setUser(updatedUser);
      localStorage.setItem("local_guest_user", JSON.stringify(updatedUser));
    } else if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { displayName: name });
        setUser({ ...user, displayName: name });
      } catch (error) {
        console.error("Failed to update profile", error);
      }
    }
  };

  const updateUserPhoto = async (photoURL: string | null) => {
    if (!user) return;

    // 1. Always persist to localStorage for instant client reload across all auth types (email, google, phone, guest)
    if (photoURL) {
      localStorage.setItem(`mem_user_photo_${user.uid}`, photoURL);
    } else {
      localStorage.removeItem(`mem_user_photo_${user.uid}`);
    }

    const updatedUser = { ...user, photoURL };
    setUser(updatedUser);

    // 2. If guest or local user, also update local_guest_user cache
    if (user.uid.startsWith("local-")) {
      localStorage.setItem("local_guest_user", JSON.stringify(updatedUser));
    }

    // 3. Sync to member directory
    registerOrUpdateMember({
      uid: user.uid,
      email: user.email || null,
      phoneNumber: user.phoneNumber || null,
      displayName: user.displayName || null,
      photoURL: photoURL || null,
      authProvider: user.isAnonymous ? "guest" : (user.phoneNumber ? "phone" : (user.email ? "email" : "google")),
      registeredAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    });

    // 4. If signed in with Firebase (Google, Email, Phone), sync to Firestore users/{uid}
    if (auth.currentUser && !user.uid.startsWith("local-")) {
      try {
        const { doc, setDoc } = await import("firebase/firestore");
        const { db } = await import("../lib/firebase");
        await setDoc(doc(db, "users", auth.currentUser.uid), {
          uid: auth.currentUser.uid,
          photoURL: photoURL || null,
          displayName: user.displayName || null,
          email: user.email || null,
          phoneNumber: user.phoneNumber || null,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn("Could not save photo to Firestore users collection:", err);
      }

      // Also attempt Firebase Auth updateProfile if photoURL is short (standard URL)
      try {
        if (!photoURL || !photoURL.startsWith("data:") || photoURL.length < 2000) {
          await updateProfile(auth.currentUser, { photoURL });
        }
      } catch (err) {
        // Safe to ignore if base64 exceeds length; Firestore and localStorage maintain it
      }
    }
  };

  const deleteAccount = async () => {
    if (!user) return;
    const uidToDelete = user.uid;

    try {
      // 1. Remove from admin registered members directory and Firestore docs
      const { deleteRegisteredMember } = await import("../lib/adminMessages");
      await deleteRegisteredMember(uidToDelete);

      // 2. If signed in with Firebase Auth, attempt to delete Firebase Auth user
      if (auth.currentUser && !uidToDelete.startsWith("local-")) {
        try {
          const { deleteUser } = await import("firebase/auth");
          await deleteUser(auth.currentUser);
        } catch (authErr) {
          console.warn("Could not delete from Firebase Auth directly, signing out:", authErr);
          await firebaseSignOut();
        }
      } else {
        await firebaseSignOut();
      }
    } catch (e) {
      console.warn("Error during account deletion:", e);
    } finally {
      // 3. Clear local session & state
      localStorage.removeItem("local_guest_user");
      localStorage.removeItem(`mem_user_photo_${uidToDelete}`);
      setUser(null);
    }
  };

  const isAdmin = user?.email?.toLowerCase() === "chetanbajaj9a22@gmail.com";

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAdmin,
      loading, 
      logout, 
      loginAsGuest, 
      loginWithLocalEmail, 
      loginWithLocalPhone, 
      updateUserName, 
      updateUserPhoto,
      deleteAccount
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
