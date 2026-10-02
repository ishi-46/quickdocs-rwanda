import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDLqHRG-xoTOAvOLjr3exqbXG87h3rDBqY",
  authDomain: "quickdocs-rwanda.firebaseapp.com",
  projectId: "quickdocs-rwanda",
  storageBucket: "quickdocs-rwanda.firebasestorage.app",
  messagingSenderId: "160172630753",
  appId: "1:160172630753:web:793d95852a9dc64be28da0",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);