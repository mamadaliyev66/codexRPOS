import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyA9SFD0p1Zgf8hwnqtYlxdmPfpLd7tx-ew',
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'rpos-d53d0.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'rpos-d53d0',
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'rpos-d53d0.firebasestorage.app',
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '158319305194',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:158319305194:web:1113ad49178f365ce2d293',
  measurementId:
    process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-P9LW699SEC',
  databaseURL:
    process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL ||
    'https://rpos-d53d0-default-rtdb.asia-southeast1.firebasedatabase.app',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
