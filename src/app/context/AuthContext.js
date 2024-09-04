"use client"

import {createContext, useContext, useEffect, useState} from "react";
import {GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut as logOut,} from "firebase/auth";
import {auth, db} from "../firebase";
import {doc, getDoc, serverTimestamp, setDoc} from "firebase/firestore";

const AuthContext = createContext(undefined, undefined);

export const AuthContextProvider = ({children}) => {
  const [user, setUser] = useState({});

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    if (auth) {
      const {uid, displayName, email, photoURL} = auth.currentUser;

      const userDocRef = doc(db, "users", uid);

      try {
        const docSnap = await getDoc(userDocRef)

        const userDetails = {
          uid,
          displayName,
          email,
          photoURL,
          createdAt: serverTimestamp()
        };

        if (docSnap.exists()) {
          // If the document exists, merge user details without overwriting subscription
          await setDoc(userDocRef, userDetails, {merge: true});
        } else {
          // If the document does not exist, add user details with default subscription
          userDetails.subscription = {
            status: "INACTIVE",
            freeTrialQueries: 0,
            plan: null,
            expiresAt: null,
          };
          await setDoc(userDocRef, userDetails, {merge: true});
        }
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };

  const signOut = async () => {
    await logOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{user, googleSignIn, signOut}}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}
