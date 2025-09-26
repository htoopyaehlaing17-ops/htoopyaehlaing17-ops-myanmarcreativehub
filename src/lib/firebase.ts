
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDMZNLzYIkDnj9IHL11X1B7FiKBSlzu5vQ",
  authDomain: "studio-1647897662-a4d44.firebaseapp.com",
  projectId: "studio-1647897662-a4d44",
  storageBucket: "studio-1647897662-a4d44.firebasestorage.app",
  messagingSenderId: "114777119992",
  appId: "1:114777119992:web:027c8e8b4175777ca56f0d"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
