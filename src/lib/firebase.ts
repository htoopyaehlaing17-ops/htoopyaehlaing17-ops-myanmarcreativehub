
import { initializeApp, getApps, getApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyAbsz2-gD6lyRaeBpwK0xVVhNjr5N5yeQU",
  authDomain: "studio-790061701-1f084.firebaseapp.com",
  projectId: "studio-790061701-1f084",
  appId: "1:446651842055:web:4cd9685a365d41d54674a2",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
