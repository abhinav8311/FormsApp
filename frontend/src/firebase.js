import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8vxItEsjuK6Jopmb0Z6ZD1fnC97-gNpo",
  authDomain: "formsapp-91497.firebaseapp.com",
  projectId: "formsapp-91497",
  storageBucket: "formsapp-91497.firebasestorage.app",
  messagingSenderId: "625826848829",
  appId: "1:625826848829:web:522263cdbc09f67ee3ca54"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);