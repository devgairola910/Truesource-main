import { useState, useEffect } from "react";
import { 
  User, 
  onIdTokenChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signOut as firebaseSignOut
} from "firebase/auth";
import { auth } from "../firebase";
import { getSession, setSession } from "../auth-client";

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const idToken = await currentUser.getIdToken();
          const session = getSession();
          if (!session) {
            setSession({
              name: currentUser.displayName || currentUser.email?.split('@')[0] || "User",
              email: currentUser.email || "",
              company: "Company",
              createdAt: new Date().toISOString(),
              sessionToken: currentUser.uid,
              idToken: idToken,
            });
          } else if (session.idToken !== idToken) {
            setSession({ ...session, idToken });
          }
        } catch (err) {
          console.error("Error setting session from token change:", err);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const loginWithEmail = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = () => {
    return firebaseSignOut(auth);
  };

  return { user, loading, error, loginWithGoogle, loginWithEmail, logout };
}
