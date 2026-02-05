import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCNoagzGTuJa57L3F24pBZAUJJqSZgDFA8",
  authDomain: "miles-apart-game.firebaseapp.com",
  projectId: "miles-apart-game",
  storageBucket: "miles-apart-game.firebasestorage.app",
  messagingSenderId: "517113914933",
  appId: "1:517113914933:web:44ea915a4cd795892bf37c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
