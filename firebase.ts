import {getApp, getApps, initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYndsWKn4kHRTvbQNVQWJnDc8MEUebuFA",
  authDomain: "chatgpt-messenger-yt-a58e9.firebaseapp.com",
  projectId: "chatgpt-messenger-yt-a58e9",
  storageBucket: "chatgpt-messenger-yt-a58e9.appspot.com",
  messagingSenderId: "431413176754",
  appId: "1:431413176754:web:0a0d234b6fcf20d77e5cab",
  measurementId: "G-9LPC61YQF5"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export{ db };