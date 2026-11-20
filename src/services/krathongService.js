import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  increment,
  onSnapshot,
  query,
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'krathongs';

/**
 * Subscribe to real-time Krathong updates from Firestore
 */
export function subscribeToKrathongs(onData, onError) {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }));

        onData(items);
      },
      (error) => {
        console.warn('[Firestore] Real-time listener error:', error);
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('[Firestore] Failed to subscribe to Firestore:', err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Save new customized Krathong with picture (<500KB) into Firestore
 */
export async function saveKrathongToFirestore(krathongData) {
  try {
    const docRef = doc(db, COLLECTION_NAME, krathongData.id);
    await setDoc(docRef, {
      ...krathongData,
      createdAt: Date.now(),
      serverCreated: serverTimestamp()
    });
    console.log('[Firestore] Successfully stored Krathong:', krathongData.id);
    return true;
  } catch (err) {
    console.error('[Firestore] Failed to save Krathong to Firestore:', err);
    throw err;
  }
}

/**
 * Increment vote score for a Krathong in Firestore
 */
export async function voteKrathongInFirestore(krathongId) {
  try {
    const docRef = doc(db, COLLECTION_NAME, krathongId);
    await updateDoc(docRef, {
      votes: increment(1)
    });
    console.log('[Firestore] Incremented vote for Krathong:', krathongId);
    return true;
  } catch (err) {
    console.error('[Firestore] Failed to increment vote in Firestore:', err);
    throw err;
  }
}

/**
 * Clear all Krathongs from Firestore
 */
export async function clearAllKrathongsFromFirestore() {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snap = await getDocs(colRef);
    const deletePromises = snap.docs.map((docSnap) => deleteDoc(docSnap.ref));
    await Promise.all(deletePromises);
    console.log('[Firestore] All Krathongs successfully cleared from Firestore.');
    return true;
  } catch (err) {
    console.error('[Firestore] Failed to clear all Krathongs:', err);
    throw err;
  }
}
