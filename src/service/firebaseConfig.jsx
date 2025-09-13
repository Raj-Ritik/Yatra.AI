// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDj8KFOqfuwfh-zuVAIwAEc6cbaz2RnMzc",
  authDomain: "yatra-ai-3ce26.firebaseapp.com",
  projectId: "yatra-ai-3ce26",
  storageBucket: "yatra-ai-3ce26.firebasestorage.app",
  messagingSenderId: "334846856268",
  appId: "1:334846856268:web:7c546344c67fce1b06b8e9",
  measurementId: "G-W26ZKC48RQ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);