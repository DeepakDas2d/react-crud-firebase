// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getStorage } from "firebase/storage"; // Import Storage

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmtSWvMbSGJmkqBtmuMZubjkDckMp6o44",
  authDomain: "crud-app-react-2caef.firebaseapp.com",
  projectId: "crud-app-react-2caef",
  storageBucket: "crud-app-react-2caef.appspot.com",
  messagingSenderId: "540973438127",
  appId: "1:540973438127:web:27c054f7d4dce81c52305a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage();
export default db;
