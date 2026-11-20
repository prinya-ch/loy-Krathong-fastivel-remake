import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCoiagKdCh1NicOlutEPPMo20csmNDvD8U",
  authDomain: "loy-krathong-fastival.firebaseapp.com",
  databaseURL: "https://loy-krathong-fastival-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "loy-krathong-fastival",
  storageBucket: "loy-krathong-fastival.firebasestorage.app",
  messagingSenderId: "94878789096",
  appId: "1:94878789096:web:61bae7ff23a4f9da8e485d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clearAll() {
  console.log('Connecting to Firestore to clear all Krathongs...');
  try {
    const colRef = collection(db, 'krathongs');
    const snap = await getDocs(colRef);
    console.log(`Found ${snap.docs.length} documents in Firestore 'krathongs' collection.`);
    
    for (const docSnap of snap.docs) {
      console.log(`Deleting ${docSnap.id}...`);
      await deleteDoc(docSnap.ref);
    }
    console.log('SUCCESS: All documents in Firestore have been permanently deleted!');
    process.exit(0);
  } catch (err) {
    console.error('Error deleting documents:', err);
    process.exit(1);
  }
}

clearAll();
