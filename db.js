import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, setDoc, onSnapshot, doc, query, addDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDj80BUW2r0Es2QhfncDHen4D8ynxfFz98",
  authDomain: "d3-firebase-7a793.firebaseapp.com",
  projectId: "d3-firebase-7a793",
  storageBucket: "d3-firebase-7a793.appspot.com",
  messagingSenderId: "582392464969",
  appId: "1:582392464969:web:5764ba9031a4a61f36e198",
  measurementId: "G-YP78GSSJNZ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { getDocs, db, collection, onSnapshot, query, doc, setDoc, addDoc, deleteDoc };
