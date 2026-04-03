
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBRWCZf7G51yQaQXEcBGTtB2xbeQI5Cv44",
    authDomain: "caltrack-a214c.firebaseapp.com",
    projectId: "caltrack-a214c",
    storageBucket: "caltrack-a214c.firebasestorage.app",
    messagingSenderId: "5304016173",
    appId: "1:5304016173:web:e88d054a8f0e6b43fb07a4"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
