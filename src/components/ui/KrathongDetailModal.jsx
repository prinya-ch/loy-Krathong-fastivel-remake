import React from 'react';
import { X, Heart, Sparkles, MapPin, Award, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useKrathongStore } from '../../store/useKrathongStore';
import { MATERIAL_OPTIONS, SIZE_OPTIONS, DESIGN_STYLES } from '../../data/mockKrathongs';

export function KrathongDetailModal() {
  const isDetailOpen = useKrathongStore((state) => state.isDetailOpen);
  const selectedKrathong = useKrathongStore((state) => state.selectedKrathong);
  const closeDetail = useKrathongStore((state) => state.closeDetail);
  const voteForKrathong = useKrathongStore((state) => state.voteForKrathong);
  const userVotedIds = useKrathongStore((state) => state.userVotedIds);
  const setCameraFocusTarget = useKrathongStore((state) => state.setCameraFocusTarget);

  if (!isDetailOpen || !selectedKrathong) return null;

  const hasVoted = userVotedIds.includes(selectedKrathong.id);

  const materialObj = MATERIAL_OPTIONS.find((m) => m.id === selectedKrathong.material);
  const sizeObj = SIZE_OPTIONS.find((s) => s.id === selectedKrathong.size);
  const styleObj = DESIGN_STYLES.find((d) => d.id === selectedKrathong.designStyle);

  const handleVote = () => {
    // Fire festive confetti
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#ff69b4', '#ffd700', '#ff007f', '#00f5d4']
    });

    voteForKrathong(selectedKrathong.id);
  };

  const handleLocate = () => {
    setCameraFocusTarget([
      selectedKrathong.position[0],
      selectedKrathong.position[1] + 1.2,
      selectedKrathong.position[2] + 4
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900/95 border border-amber-500/40 rounded-3xl shadow-2xl p-5 sm:p-6 text-white animate-pulse-glow">
        {/* Close Button */}
        <button
          onClick={closeDetail}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
        >
          <X size={20} />
        </button>

        {/* Creator Avatar & Country Flag */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-full border-4 border-amber-400/80 overflow-hidden shadow-xl shadow-amber-500/20 bg-slate-950">
              <img
                src={selectedKrathong.avatarUrl}
                alt={selectedKrathong.creatorName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                }}
              />
            </div>
            {/* National Flag Badge */}
            <span
              className="absolute -bottom-1 -right-1 text-2xl bg-slate-900/90 rounded-full p-1 border border-amber-400 shadow"
              title={selectedKrathong.countryName}
            >
              {selectedKrathong.flagEmoji || '🪷'}
            </span>
          </div>

          <h2 className="text-xl font-bold text-amber-300">
            {selectedKrathong.creatorName}
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
            <MapPin size={13} className="text-amber-400" />
            <span>{selectedKrathong.countryName} ({selectedKrathong.region})</span>
          </div>
        </div>

        {/* Wish / Blessing Quote */}
        <div className="my-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
          <p className="text-xs sm:text-sm text-amber-100 italic font-['Sarabun',sans-serif]">
            "{selectedKrathong.wishText || 'ขอขมาพระแม่คงคา สุขกายสบายใจตลอดปี'}"
          </p>
        </div>

        {/* Specifications Pills */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs mb-5">
          <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-[10px] text-slate-400">วัสดุ (Material)</div>
            <div className="font-semibold text-amber-200 truncate mt-0.5">
              {materialObj ? materialObj.name.split(' (')[0] : 'ใบตอง'}
            </div>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-[10px] text-slate-400">ขนาด (Size)</div>
            <div className="font-semibold text-amber-200 truncate mt-0.5">
              {sizeObj ? sizeObj.name.split(' (')[0] : 'มาตรฐาน'}
            </div>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-[10px] text-slate-400">รูปแบบ (Style)</div>
            <div className="font-semibold text-amber-200 truncate mt-0.5">
              {styleObj ? styleObj.name.split(' (')[0] : 'ดั้งเดิม'}
            </div>
          </div>
        </div>

        {/* Live Vote Score Banner */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-pink-500/20 border border-amber-400/40 mb-5">
          <div className="flex items-center gap-2">
            <Award className="text-amber-400" size={22} />
            <div>
              <div className="text-[11px] text-slate-400">คะแนนโหวตปัจจุบัน</div>
              <div className="text-lg font-black text-amber-300">
                {selectedKrathong.votes || 0} คะแนน (Votes)
              </div>
            </div>
          </div>
          {hasVoted && (
            <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30">
              <Check size={14} /> โหวตแล้ว
            </span>
          )}
        </div>

        {/* Action Buttons: Vote & Camera Focus */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLocate}
            className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
            title="Focus 3D camera on this Krathong"
          >
            ส่องดู 3D
          </button>

          <button
            onClick={handleVote}
            className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-white font-bold text-sm sm:text-base shadow-xl shadow-pink-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Heart size={18} className="fill-current text-white animate-pulse" />
            <span>โหวตให้กระทงนี้ (+1 Vote)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
