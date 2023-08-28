// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzwrLpd9jBBLTOUV4Ho7OswM8OkGbyvGo",
  authDomain: "test-auth-4c38f.firebaseapp.com",
  projectId: "test-auth-4c38f",
  storageBucket: "test-auth-4c38f.appspot.com",
  messagingSenderId: "187334706418",
  appId: "1:187334706418:web:cc7996008983819a95fc6b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
