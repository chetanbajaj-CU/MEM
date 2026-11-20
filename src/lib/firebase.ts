import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously, onAuthStateChanged, User, sendPasswordResetEmail, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId || "ai-studio-memmindenergymot-a2cb3d43-4c7e-4711-9845-5072154d95ce");
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Validate connection to Firestore per skill guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Please check your Firebase configuration.");
    }
  }
}
testConnection();

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    cachedAccessToken = credential?.accessToken || null;
    return { user: result.user, accessToken: cachedAccessToken || "" };
  } catch (error: any) {
    if (error.code !== 'auth/popup-closed-by-user') {
      console.warn('Sign in warning/error:', error);
    }
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const getAccessTokenSync = (): string | null => {
  return cachedAccessToken;
};

export const signOut = async () => {
  await firebaseSignOut(auth);
  cachedAccessToken = null;
};

export { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously, sendPasswordResetEmail, RecaptchaVerifier, signInWithPhoneNumber };
