import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA952H6p1GoLEylDSHp1CWcOUHWRydHtn4",
  authDomain: "alert-telesale.firebaseapp.com",
  databaseURL: "https://alert-telesale-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "alert-telesale",
  storageBucket: "alert-telesale.firebasestorage.app",
  messagingSenderId: "1094969909225",
  appId: "1:1094969909225:web:48b012db6fef0de355f578",
  measurementId: "G-EWGPYW8HQQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const db = getDatabase(app);
