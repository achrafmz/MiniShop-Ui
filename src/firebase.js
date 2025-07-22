// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyClzj0aq94fvj46c21cwX9EMGdsjPzveSM",
  authDomain: "anmoun-71266.firebaseapp.com",
  projectId: "anmoun-71266",
  storageBucket: "anmoun-71266.firebasestorage.app",
  messagingSenderId: "1031377037373",
  appId: "1:1031377037373:web:ff3a0b579753b47614e254",
  measurementId: "G-YVCZER03FQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

export default app;
