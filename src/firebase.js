import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD2k9TI99EglAZ3_ST8HMHZDXfLwGs7Vb8",
  authDomain: "umroh-farfasa-apps.firebaseapp.com",
  databaseURL: "https://umroh-farfasa-apps-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "umroh-farfasa-apps",
  storageBucket: "umroh-farfasa-apps.appspot.com",
  messagingSenderId: "365687546752",
  appId: "1:365687546752:web:0402344bccc65dc68e9765",
  measurementId: "G-Y2NRYQ4WN2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth();