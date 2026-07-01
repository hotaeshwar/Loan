import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDUy_SoP4qqzu4ObV86lLn3tBNIURImVVM",
  authDomain: "loan-e41f8.firebaseapp.com",
  projectId: "loan-e41f8",
  storageBucket: "loan-e41f8.firebasestorage.app",
  messagingSenderId: "816558677137",
  appId: "1:816558677137:web:9c7a9761330dadfa027330"
};

// Initialize Firebase (checking if already initialized)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
export { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
  onSnapshot,
  serverTimestamp 
} from "firebase/firestore";
export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
