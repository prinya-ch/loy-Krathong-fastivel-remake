import { create } from 'zustand';
import {
  subscribeToKrathongs,
  saveKrathongToFirestore,
  voteKrathongInFirestore,
  clearAllKrathongsFromFirestore
} from '../services/krathongService';

const STORAGE_KEY = 'loy_krathong_fleet_v2';
const VOTES_STORAGE_KEY = 'loy_krathong_user_votes_v2';

// Purge any stale mock storage immediately
try {
  localStorage.removeItem('loy_krathong_fleet_v1');
  localStorage.removeItem('loy_krathong_fleet_v2');
} catch (e) {}

// Strict filter that strips any mockups (krathong-1 through krathong-20)
export const filterOutMockups = (list) => {
  if (!Array.isArray(list)) return [];
  return list.filter((k) => {
    if (!k || !k.id) return false;
    const isMock = /^krathong-(?:[1-9]|1[0-9]|20)$/.test(k.id);
    return !isMock;
  });
};

const loadUserVotes = () => {
  try {
    const saved = localStorage.getItem(VOTES_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return [];
};

export const useKrathongStore = create((set, get) => {
  // Real-time listener from Firestore
  try {
    subscribeToKrathongs(
      (remoteKrathongs) => {
        const cleanList = filterOutMockups(remoteKrathongs);
        set({ krathongs: cleanList });
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanList));
        } catch (e) {}
      },
      (err) => {
        console.warn('Firestore subscription fallback:', err);
      }
    );
  } catch (err) {
    console.warn('Failed to start Firestore subscription:', err);
  }

  return {
    krathongs: [], // ZERO krathongs by default
    selectedKrathong: null,
    isCustomizerOpen: false,
    isDetailOpen: false,
    isLeaderboardOpen: false,
    isAudioPlaying: false,
    userVotedIds: loadUserVotes(),
    cameraFocusTarget: null,
    newlyLaunchedKrathongId: null,
    followingKrathongId: null, // ID of Krathong currently being actively tracked by camera

    // UI modal toggles
    setSelectedKrathong: (krathong) => set({
      selectedKrathong: krathong,
      isDetailOpen: !!krathong,
      followingKrathongId: krathong ? krathong.id : null,
      cameraFocusTarget: krathong
        ? [krathong.position[0] + 1.8, krathong.position[1] + 1.4, krathong.position[2] - 3.2]
        : null
    }),

    openCustomizer: () =>
      set({ isCustomizerOpen: true, isDetailOpen: false, isLeaderboardOpen: false }),
    closeCustomizer: () => set({ isCustomizerOpen: false }),

    closeDetail: () => set({ isDetailOpen: false, selectedKrathong: null }),

    toggleLeaderboard: () =>
      set((state) => ({ isLeaderboardOpen: !state.isLeaderboardOpen })),
    closeLeaderboard: () => set({ isLeaderboardOpen: false }),

    toggleAudio: () => set((state) => ({ isAudioPlaying: !state.isAudioPlaying })),
    setAudio: (val) => set({ isAudioPlaying: val }),

    setCameraFocusTarget: (target) => set({ cameraFocusTarget: target }),
    clearCameraFocusTarget: () => set({ cameraFocusTarget: null }),

    // Follow camera controls
    startFollowing: (id) => set({ followingKrathongId: id, cameraFocusTarget: null }),
    stopFollowing: () => set({ followingKrathongId: null }),

    // Vote for a Krathong
    voteForKrathong: async (id) => {
      const { krathongs, userVotedIds } = get();

      const updatedKrathongs = krathongs.map((k) => {
        if (k.id === id) {
          return { ...k, votes: (k.votes || 0) + 1 };
        }
        return k;
      });

      const updatedVotedIds = userVotedIds.includes(id)
        ? userVotedIds
        : [...userVotedIds, id];

      try {
        localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(updatedVotedIds));
      } catch (e) {}

      set({
        krathongs: updatedKrathongs,
        userVotedIds: updatedVotedIds,
        selectedKrathong: updatedKrathongs.find((k) => k.id === id) || null
      });

      try {
        await voteKrathongInFirestore(id);
      } catch (e) {
        console.warn('Could not increment vote in Firestore, cached locally:', e);
      }
    },

    // Add user's newly customized Krathong & Immediately engage Follow Camera!
    addKrathong: async (newKrathong) => {
      const { krathongs } = get();
      const updated = [newKrathong, ...krathongs];

      set({
        krathongs: updated,
        newlyLaunchedKrathongId: newKrathong.id,
        followingKrathongId: newKrathong.id, // START FOLLOWING YOUR NEW KRATHONG!
        isCustomizerOpen: false
      });

      // Highlight for 10 seconds
      setTimeout(() => {
        set({ newlyLaunchedKrathongId: null });
      }, 10000);

      try {
        await saveKrathongToFirestore(newKrathong);
      } catch (e) {
        console.warn('Could not save to Firestore, cached locally:', e);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (err) {}
      }
    },

    // Clear all Krathongs completely (Firestore + local)
    clearAllKrathongs: async () => {
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('loy_krathong_fleet_v1');
      } catch (e) {}

      set({
        krathongs: [],
        selectedKrathong: null,
        isDetailOpen: false,
        followingKrathongId: null
      });

      try {
        await clearAllKrathongsFromFirestore();
      } catch (e) {
        console.warn('Error clearing Firestore collection:', e);
      }
    }
  };
});
