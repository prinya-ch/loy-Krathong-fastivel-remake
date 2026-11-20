import React from 'react';
import { Sparkles, Eye, Compass, Video, X } from 'lucide-react';
import { useKrathongStore } from '../../store/useKrathongStore';

export function BottomBar() {
  const openCustomizer = useKrathongStore((state) => state.openCustomizer);
  const setCameraFocusTarget = useKrathongStore((state) => state.setCameraFocusTarget);
  const followingKrathongId = useKrathongStore((state) => state.followingKrathongId);
  const stopFollowing = useKrathongStore((state) => state.stopFollowing);

  const resetCameraView = (type) => {
    stopFollowing();
    switch (type) {
      case 'temple':
        setCameraFocusTarget([-12, 4, 12]);
        break;
      case 'pier':
        setCameraFocusTarget([10, 3, 4]);
        break;
      case 'overview':
      default:
        setCameraFocusTarget([14, 7, 14]);
        break;
    }
  };

  return (
    <footer className="absolute bottom-0 left-0 right-0 z-20 p-3 sm:p-5 flex flex-col items-center gap-2 pointer-events-none pb-[env(safe-area-inset-bottom,16px)]">
      {/* Active Follow Mode Indicator */}
      {followingKrathongId ? (
        <div className="glass-panel px-4 py-1.5 rounded-full text-xs text-amber-200 flex items-center gap-2.5 shadow-xl shadow-amber-500/20 border-amber-400/60 pointer-events-auto animate-pulse">
          <Video size={14} className="text-yellow-400" />
          <span>กำลังติดตามกระทงของคุณตามสายน้ำ (Following Your Krathong)</span>
          <button
            onClick={stopFollowing}
            className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1 text-[11px] px-2"
          >
            <X size={12} />
            <span>หยุดติดตาม</span>
          </button>
        </div>
      ) : (
        /* Helper Tip Badge */
        <div className="glass-panel-subtle px-3 py-1 rounded-full text-[11px] sm:text-xs text-amber-200/90 flex items-center gap-1.5 shadow-md">
          <Sparkles size={12} className="text-yellow-400" />
          <span>หมุนกล้อง 360° • ย่อ/ขยาย • แตะที่กระทงในแม่น้ำเพื่อโหวตให้คะแนน</span>
        </div>
      )}

      <div className="w-full max-w-xl flex items-center justify-between gap-2 pointer-events-auto">
        {/* Camera Quick Switchers */}
        <div className="flex items-center gap-1.5 glass-panel p-1 rounded-full text-xs">
          <button
            onClick={() => resetCameraView('overview')}
            className="px-2.5 py-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
            title="Overview Angle"
          >
            ภาพรวม
          </button>
          <button
            onClick={() => resetCameraView('pier')}
            className="px-2.5 py-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-all hidden sm:block"
            title="Focus on Festival Pier"
          >
            ท่าน้ำ
          </button>
          <button
            onClick={() => resetCameraView('temple')}
            className="px-2.5 py-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
            title="Focus on Wat & Chedi"
          >
            หน้าวัด
          </button>
        </div>

        {/* Primary CTA: Float My Krathong */}
        <button
          onClick={openCustomizer}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 sm:px-7 sm:py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-sm sm:text-base shadow-xl shadow-amber-500/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
        >
          <span className="text-lg">🪷</span>
          <span>สร้างกระทง & ปล่อยลงน้ำ</span>
        </button>
      </div>
    </footer>
  );
}
