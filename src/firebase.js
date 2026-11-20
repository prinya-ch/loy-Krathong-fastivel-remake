import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// User's Firebase Project Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoiagKdCh1NicOlutEPPMo20csmNDvD8U",
  authDomain: "loy-krathong-fastival.firebaseapp.com",
  databaseURL: "https://loy-krathong-fastival-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "loy-krathong-fastival",
  storageBucket: "loy-krathong-fastival.firebasestorage.app",
  messagingSenderId: "94878789096",
  appId: "1:94878789096:web:61bae7ff23a4f9da8e485d"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore
export const db = getFirestore(app);
export default app;
