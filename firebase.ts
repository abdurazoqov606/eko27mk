
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwekSD-vSZd5DX8EILw_EmuRMhDJiKVAM",
  authDomain: "eko27-2c43b.firebaseapp.com",
  projectId: "eko27-2c43b",
  storageBucket: "eko27-2c43b.firebasestorage.app",
  messagingSenderId: "506466935376",
  appId: "1:506466935376:web:5cdc05810d84a502398dd5",
  measurementId: "G-GKXH0DD8DY"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
