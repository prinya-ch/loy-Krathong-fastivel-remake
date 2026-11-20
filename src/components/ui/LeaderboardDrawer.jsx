import React from 'react';
import { X, Trophy, Heart, ExternalLink, Sparkles } from 'lucide-react';
import { useKrathongStore } from '../../store/useKrathongStore';

export function LeaderboardDrawer() {
  const isLeaderboardOpen = useKrathongStore((state) => state.isLeaderboardOpen);
  const closeLeaderboard = useKrathongStore((state) => state.closeLeaderboard);
  const krathongs = useKrathongStore((state) => state.krathongs);
  const setSelectedKrathong = useKrathongStore((state) => state.setSelectedKrathong);
  const setCameraFocusTarget = useKrathongStore((state) => state.setCameraFocusTarget);

  if (!isLeaderboardOpen) return null;

  // Sort by vote count descending
  const sortedKrathongs = [...krathongs].sort((a, b) => (b.votes || 0) - (a.votes || 0));

  const handleInspect = (item) => {
    setSelectedKrathong(item);
    closeLeaderboard();
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm sm:max-w-md bg-slate-900/95 border-l border-amber-500/30 backdrop-blur-xl shadow-2xl p-4 sm:p-6 flex flex-col text-white animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <Trophy size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-amber-300">
              อันดับคะแนนโหวต (Leaderboard)
            </h2>
            <p className="text-xs text-slate-400">Top Voted Krathongs in Festival</p>
          </div>
        </div>
        <button
          onClick={closeLeaderboard}
          className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
        >
          <X size={20} />
        </button>
      </div>

      {/* Contest List */}
      <div className="flex-1 overflow-y-auto py-3 space-y-2.5 pr-1">
        {sortedKrathongs.map((item, index) => {
          const isTop3 = index < 3;
          return (
            <div
              key={item.id}
              onClick={() => handleInspect(item)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                index === 0
                  ? 'bg-amber-500/15 border-amber-400/50 shadow-md shadow-amber-500/10'
                  : index === 1
                  ? 'bg-slate-800/60 border-slate-600'
                  : index === 2
                  ? 'bg-amber-900/20 border-amber-700/40'
                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Rank Number / Medal */}
                <span className="w-6 text-center text-sm font-bold">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </span>

                {/* Avatar & Flag */}
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-amber-400/50 bg-slate-950 flex-shrink-0">
                  <img
                    src={item.avatarUrl}
                    alt={item.creatorName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                    }}
                  />
                  <span className="absolute bottom-0 right-0 text-[10px] bg-black/70 rounded-full px-0.5">
                    {item.flagEmoji}
                  </span>
                </div>

                {/* Name & Country */}
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-100 truncate">
                    {item.creatorName}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {item.countryName} • {item.material.replace('_', ' ')}
                  </div>
                </div>
              </div>

              {/* Vote Count & Action */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="text-right">
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1 justify-end">
                    <Heart size={12} className="text-pink-400 fill-current" />
                    <span>{item.votes || 0}</span>
                  </div>
                  <div className="text-[9px] text-slate-400">โหวต</div>
                </div>
                <div className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white">
                  <ExternalLink size={14} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Drawer Footer */}
      <div className="pt-3 border-t border-slate-800 text-center">
        <p className="text-xs text-slate-400">
          แตะที่รายชื่อเพื่อบินกล้องไปส่องกระทงและให้คะแนนโหวต ✨
        </p>
      </div>
    </div>
  );
}
