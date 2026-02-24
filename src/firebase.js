// Import SDK ที่จำเป็น
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBOa9JZpMfs80Tf2OIuBC1Hc1pN6FCeoM4",
  authDomain: "badminton-booking-2abee.firebaseapp.com",
  projectId: "badminton-booking-2abee",
  storageBucket: "badminton-booking-2abee.firebasestorage.app",
  messagingSenderId: "682853947129",
  appId: "1:682853947129:web:d4852b4ffd62f41410f428"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services ที่เราจะใช้
export const auth = getAuth(app);
export const db = getFirestore(app);