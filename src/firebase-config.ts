// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDiFvua1yRxgkz6hGawVjMI4xz67QFUhnI",
  authDomain: "fir-chatting-app-1aedd.firebaseapp.com",
  projectId: "fir-chatting-app-1aedd",
  storageBucket: "fir-chatting-app-1aedd.appspot.com",
  messagingSenderId: "500281000389",
  appId: "1:500281000389:web:1a679ad249a4ec8943cbac",
  measurementId: "G-XRW6P9CTRR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const fileDb = getStorage(app)
const analytics = getAnalytics(app);