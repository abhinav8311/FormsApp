// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKXE62EIsuAsJvGKluhp6ipHT_XXozp0o",
  authDomain: "form-app-789d8.firebaseapp.com",
  projectId: "form-app-789d8",
  storageBucket: "form-app-789d8.firebasestorage.app",
  messagingSenderId: "695837132438",
  appId: "1:695837132438:web:731071d377c53bc237e4b7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account"
});

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);