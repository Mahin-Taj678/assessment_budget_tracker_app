import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase using your actual project configuration
const firebaseConfig = {
  apiKey: typeof process !== 'undefined' && process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? process.env.NEXT_PUBLIC_FIREBASE_API_KEY : "AIzaSyC_Bq8kQdo_5AgCZRbi6PIsNhrLG5Uk6gU",
  authDomain: typeof process !== 'undefined' && process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN : "budget-tracker-867b5.firebaseapp.com",
  projectId: typeof process !== 'undefined' && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID : "budget-tracker-867b5",
  storageBucket: typeof process !== 'undefined' && process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET : "budget-tracker-867b5.firebasestorage.app",
  messagingSenderId: typeof process !== 'undefined' && process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID : "385802717492",
  appId: typeof process !== 'undefined' && process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? process.env.NEXT_PUBLIC_FIREBASE_APP_ID : "1:385802717492:web:6f2d0bc98ff541c6b1fd61",
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

