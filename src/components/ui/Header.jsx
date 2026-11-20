import React from 'react';
import { Volume2, VolumeX, Trophy, Trash2 } from 'lucide-react';
import { useKrathongStore } from '../../store/useKrathongStore';

export function Header() {
  const krathongs = useKrathongStore((state) => state.krathongs);
  const isAudioPlaying = useKrathongStore((state) => state.isAudioPlaying);
  const toggleAudio = useKrathongStore((state) => state.toggleAudio);
  const toggleLeaderboard = useKrathongStore((state) => state.toggleLeaderboard);
  const clearAllKrathongs = useKrathongStore((state) => state.clearAllKrathongs);

  const count = krathongs.length;

  return (
    <header className="absolute top-0 left-0 right-0 z-20 p-3 sm:p-4 flex items-center justify-between pointer-events-none">
      {/* Festival Title & Live Krathong Count */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/30 text-xl sm:text-2xl animate-pulse-glow">
          🪷
        </div>
        <div>
          <h1 className="text-sm sm:text-lg font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-500 font-['Cinzel',serif]">
            LOY KRATHONG 3D
          </h1>
          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-amber-200/90 font-['Kanit',sans-serif]">
            <span className={`inline-block w-2 h-2 rounded-full ${count > 0 ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
            <span>
              {count > 0 ? `🌕 ${count} กระทงกำลังลอยในแม่น้ำ` : '🌕 รอผู้มาร่วมลอยกระทงคนแรก ✨'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Sound, Leaderboard, Clear */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Audio Ambient Toggle */}
        <button
          onClick={toggleAudio}
          className={`p-2.5 rounded-full border transition-all duration-300 ${
            isAudioPlaying
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/20'
              : 'bg-slate-900/70 border-slate-700 text-slate-400 hover:text-white'
          }`}
          title={isAudioPlaying ? 'Mute Festive Music' : 'Play Festive Khim Music'}
          aria-label="Toggle festive sound"
        >
          {isAudioPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        {/* Contest Leaderboard Button */}
        <button
          onClick={toggleLeaderboard}
          className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-semibold text-xs sm:text-sm shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-yellow-400 transition-all active:scale-95"
        >
          <Trophy size={16} />
          <span>โหวต & อันดับ ({count})</span>
        </button>

        {/* Clear All Krathongs Button */}
        {count > 0 && (
          <button
            onClick={() => {
              if (window.confirm('ต้องการล้างกระทงทั้งหมดในแม่น้ำและ Firestore หรือไม่? (Clear all Krathongs?)')) {
                clearAllKrathongs();
              }
            }}
            className="p-2.5 rounded-full bg-red-950/60 border border-red-700/60 text-red-300 hover:bg-red-900/60 transition-all"
            title="ล้างกระทงทั้งหมด (Clear All)"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </header>
  );
}
