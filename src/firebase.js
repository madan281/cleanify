// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
    const firebaseConfig = {
        apiKey: "AIzaSyBbvF3NNizwXS55wOsTcmGEjYjU9n_6_u8",
        authDomain: "cleanify-c358b.firebaseapp.com",
        projectId: "cleanify-c358b",
        storageBucket: "cleanify-c358b.firebasestorage.app",
        messagingSenderId: "687882033287",
        appId: "1:687882033287:web:fce61a2516d3b63ef04022"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // <-- add this

