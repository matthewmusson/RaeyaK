import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validate Firebase configuration
const missingKeys = Object.entries(firebaseConfig)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  console.error('Missing Firebase configuration keys:', missingKeys);
  console.error('Please ensure your .env file contains all required VITE_FIREBASE_* variables');
  console.error('Current config:', {
    apiKey: firebaseConfig.apiKey ? '(set)' : '(missing)',
    authDomain: firebaseConfig.authDomain ? '(set)' : '(missing)',
    projectId: firebaseConfig.projectId ? '(set)' : '(missing)',
    storageBucket: firebaseConfig.storageBucket ? '(set)' : '(missing)',
    messagingSenderId: firebaseConfig.messagingSenderId ? '(set)' : '(missing)',
    appId: firebaseConfig.appId ? '(set)' : '(missing)'
  });
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

export default app;
