// Import the functions you need from the SDKs you need
import {
    initializeApp
} from "firebase/app";

import {
    getAnalytics
} from "firebase/analytics";

import {
    getAuth,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    FacebookAuthProvider,
    getAdditionalUserInfo
} from "firebase/auth";

import {
    getFirestore,
    collection,
    doc,
    setDoc,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";


// Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAzVwGgQsyw9T1GVIlb9AAEfDyFkjCyYK4",
    authDomain: "mychapapp-372b6.firebaseapp.com",
    projectId: "mychapapp-372b6",
    storageBucket: "mychapapp-372b6.appspot.com",
    messagingSenderId: "208797338282",
    appId: "1:208797338282:web:b2423018c5ce95950cded3",
    measurementId: "G-82QBFZLPWE"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// Setup:
const auth = getAuth();
const db = getFirestore();
const fb_provider = new FacebookAuthProvider();


export {
    analytics,
    db,
    auth,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    fb_provider,
    FacebookAuthProvider,
    getAdditionalUserInfo,
    collection,
    doc,
    setDoc,
    addDoc,
    serverTimestamp,
};