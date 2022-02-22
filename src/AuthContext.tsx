import React from 'react';
import { createContext, useState, useEffect } from 'react';
import { Auth, getAuth, onAuthStateChanged, User, signOut } from "firebase/auth";
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { Functions, getFunctions } from 'firebase/functions';

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore();
const auth = getAuth();
const storage = getStorage();
const functions = getFunctions(app);

export const AuthContext = createContext<{functions: Functions, user: User | undefined; app: FirebaseApp; analytics: Analytics, db: Firestore, auth: Auth, storage: FirebaseStorage }>({user: undefined, app, analytics, db, auth, storage, functions});

export function AuthProvider({ children } : { children : React.ReactNode }) {
  const [user, setUser] = useState<User | undefined>(undefined);

  const value = {user, app, analytics, db, auth, storage, functions};

  useEffect(() => {

    const unsubscribed = onAuthStateChanged(auth, (user) => {
      setUser(user ?? undefined);
    });
    return () => {
      unsubscribed();
    };
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const logout = () => signOut (auth);
