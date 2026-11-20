import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  RefreshCw,
  X,
  Sparkles,
  Check,
  Globe,
  Layers,
  FileCheck,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useKrathongStore } from '../../store/useKrathongStore';
import {
  COUNTRY_FLAG_OPTIONS,
  MATERIAL_OPTIONS,
  SIZE_OPTIONS,
  DESIGN_STYLES
} from '../../data/mockKrathongs';
import { resizeImageToMax500KB } from '../../utils/imageResize';

export function KrathongCustomizerModal() {
  const isCustomizerOpen = useKrathongStore((state) => state.isCustomizerOpen);
  const closeCustomizer = useKrathongStore((state) => state.closeCustomizer);
  const addKrathong = useKrathongStore((state) => state.addKrathong);
  const krathongs = useKrathongStore((state) => state.krathongs);

  // Form State
  const [creatorName, setCreatorName] = useState('');
  const [wishText, setWishText] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarSizeKB, setAvatarSizeKB] = useState(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Design State
  const [material, setMaterial] = useState('banana_leaf');
  const [baseColor, setBaseColor] = useState('#2d6a4f');
  const [petalColor, setPetalColor] = useState('#52b788');
  const [size, setSize] = useState('medium');
  const [designStyle, setDesignStyle] = useState('traditional');
  const [selectedFlag, setSelectedFlag] = useState(COUNTRY_FLAG_OPTIONS[0]); // Default Thailand
  const [activeRegionTab, setActiveRegionTab] = useState('Asian');

  // Camera State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState('user');
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError('');
    setIsCameraActive(true);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode, width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Webcam access error:', err);
      setCameraError('ไม่สามารถเปิดกล้องได้ กรุณากดปุ่ม "อัปโหลดรูปภาพ" หรืออนุญาตสิทธิ์กล้อง');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const flipCamera = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    setTimeout(startCamera, 100);
  };

  // Capture Photo Snapshot & Resize to < 500 KB
  const capturePhoto = async () => {
    if (!videoRef.current) return;
    setIsProcessingImage(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 640;
      const ctx = canvas.getContext('2d');

      const video = videoRef.current;
      const minDim = Math.min(video.videoWidth, video.videoHeight);
      const startX = (video.videoWidth - minDim) / 2;
      const startY = (video.videoHeight - minDim) / 2;

      ctx.drawImage(video, startX, startY, minDim, minDim, 0, 0, 640, 640);
      const rawDataUrl = canvas.toDataURL('image/jpeg', 0.9);

      const resized = await resizeImageToMax500KB(rawDataUrl);
      setAvatarUrl(resized.dataUrl);
      setAvatarSizeKB(resized.sizeKB);
      stopCamera();
    } catch (e) {
      console.error('Error resizing camera capture:', e);
    } finally {
      setIsProcessingImage(false);
    }
  };

  // Handle Local File Upload & Resize to < 500 KB
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessingImage(true);
      try {
        const resized = await resizeImageToMax500KB(file);
        setAvatarUrl(resized.dataUrl);
        setAvatarSizeKB(resized.sizeKB);
        stopCamera();
      } catch (err) {
        console.error('Error resizing uploaded file:', err);
      } finally {
        setIsProcessingImage(false);
      }
    }
  };

  useEffect(() => {
    if (!isCustomizerOpen) {
      stopCamera();
    }
  }, [isCustomizerOpen]);

  if (!isCustomizerOpen) return null;

  const filteredFlags = COUNTRY_FLAG_OPTIONS.filter((f) => {
    if (activeRegionTab === 'All') return true;
    return f.region === activeRegionTab;
  });

  // Handle Krathong Launch & Firestore Store
  const handleLaunch = async () => {
    setIsSubmitting(true);
    const finalName = creatorName.trim() || 'ผู้ร่วมลอยกระทง (Festival Friend)';
    const finalWish = wishText.trim() || 'ขอขมาพระแม่คงคา สุขกายสบายใจตลอดปี 🪷';
    const finalAvatar = avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

    // Split side by side in the middle of the river:
    // Alternates between Left Lane (-2.6m) and Right Lane (+2.6m)
    const isLeftLane = (krathongs.length % 2 === 0);
    const laneX = isLeftLane ? -2.6 : 2.6;

    const newKrathong = {
      id: `krathong-${Date.now()}`,
      creatorName: finalName,
      avatarUrl: finalAvatar,
      avatarSizeKB: avatarSizeKB || 45,
      countryCode: selectedFlag.code,
      countryName: selectedFlag.name,
      flagEmoji: selectedFlag.emoji,
      region: selectedFlag.region,
      wishText: finalWish,
      material: material,
      baseColor: baseColor,
      petalColor: petalColor,
      size: size,
      designStyle: designStyle,
      // Place right in the open middle of the river, split side by side
      position: [laneX, 0.15, -16],
      speed: 0.045,
      wobbleOffset: Math.random() * Math.PI,
      driftPhase: Math.random() * 5,
      laneSide: isLeftLane ? 'left' : 'right',
      votes: 1,
      createdAt: Date.now()
    };

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffd700', '#ff69b4', '#00f5d4', '#ff9e00']
    });

    try {
      await addKrathong(newKrathong);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900/95 border border-amber-500/30 rounded-3xl shadow-2xl p-4 sm:p-6 text-white my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🪷</span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-amber-300">
                ประดิษฐ์กระทง & ปล่อยลงกลางแม่น้ำ
              </h2>
              <p className="text-xs text-slate-400">
                Auto Resized &lt; 500 KB • Middle River Stream
              </p>
            </div>
          </div>
          <button
            onClick={closeCustomizer}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1">
          {/* Section 1: User Photo & Name */}
          <div className="glass-panel p-4 rounded-2xl space-y-4">
            <h3 className="text-sm font-semibold text-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera size={16} />
                <span>1. รูปถ่ายของคุณ (Resize &lt; 500 KB อัตโนมัติ)</span>
              </div>
              {avatarSizeKB !== null && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <FileCheck size={12} />
                  <span>ขนาดรูป: {avatarSizeKB} KB (&lt; 500 KB OK)</span>
                </span>
              )}
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-28 h-28 rounded-full border-2 border-amber-400/60 overflow-hidden bg-slate-950 flex items-center justify-center shadow-lg group">
                {isProcessingImage ? (
                  <div className="flex flex-col items-center gap-1 text-amber-300">
                    <Loader2 size={24} className="animate-spin" />
                    <span className="text-[10px]">บีบอัดรูป...</span>
                  </div>
                ) : isCameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Your Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-2 text-slate-500">
                    <Camera size={28} className="mx-auto mb-1 text-slate-400" />
                    <span className="text-[10px]">แตะถ่ายรูป</span>
                  </div>
                )}

                {isCameraActive && !isProcessingImage && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
                    <button
                      onClick={capturePhoto}
                      className="p-2 rounded-full bg-emerald-500 text-white hover:bg-emerald-400 shadow-md transition-all active:scale-90"
                      title="Snap Photo"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={flipCamera}
                      className="p-2 rounded-full bg-slate-700 text-white hover:bg-slate-600 transition-all"
                      title="Flip Camera"
                    >
                      <RefreshCw size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2 w-full text-center sm:text-left">
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {!isCameraActive ? (
                    <button
                      onClick={startCamera}
                      className="px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-medium hover:bg-amber-500/30 flex items-center gap-1.5 transition-all"
                    >
                      <Camera size={14} />
                      <span>เปิดกล้องถ่ายรูปเซลฟี่</span>
                    </button>
                  ) : (
                    <button
                      onClick={capturePhoto}
                      disabled={isProcessingImage}
                      className="px-3.5 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-500 flex items-center gap-1.5 transition-all"
                    >
                      <Check size={14} />
                      <span>ถ่ายรูปเดี๋ยวนี้</span>
                    </button>
                  )}

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessingImage}
                    className="px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium hover:bg-slate-700 flex items-center gap-1.5 transition-all"
                  >
                    <Upload size={14} />
                    <span>อัปโหลดรูปจากเครื่อง</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {cameraError && (
                  <p className="text-[11px] text-red-400">{cameraError}</p>
                )}

                <input
                  type="text"
                  placeholder="ชื่อของคุณ (Your Name)"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  maxLength={30}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-sm focus:border-amber-400 focus:outline-none placeholder-slate-500"
                />

                <input
                  type="text"
                  placeholder="คำอธิษฐานขอพร เช่น ขอให้ชีวิตสดใส ครอบครัวมีความสุข..."
                  value={wishText}
                  onChange={(e) => setWishText(e.target.value)}
                  maxLength={100}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-sm focus:border-amber-400 focus:outline-none placeholder-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Material & Size & Style Customization */}
          <div className="glass-panel p-4 rounded-2xl space-y-4">
            <h3 className="text-sm font-semibold text-amber-200 flex items-center gap-2">
              <Layers size={16} />
              <span>2. รูปแบบกระทง & วัสดุธรรมชาติ (Material & Design)</span>
            </h3>

            <div>
              <label className="text-xs text-slate-400 block mb-2">เลือกวัสดุ (Material):</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {MATERIAL_OPTIONS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setMaterial(m.id);
                      setPetalColor(m.color);
                    }}
                    className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                      material === m.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-semibold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className="w-3 h-3 rounded-full border border-white/30"
                        style={{ backgroundColor: m.color }}
                      ></span>
                      <span className="truncate">{m.name.split(' (')[0]}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs text-slate-400 block mb-2">ขนาดกระทง (Size):</label>
                <div className="flex gap-2">
                  {SIZE_OPTIONS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSize(s.id)}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-xs border text-center transition-all ${
                        size === s.id
                          ? 'bg-amber-500/25 border-amber-400 text-amber-300 font-bold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-2">สไตล์การพับ (Style):</label>
                <select
                  value={designStyle}
                  onChange={(e) => setDesignStyle(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
                >
                  {DESIGN_STYLES.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: National Flags */}
          <div className="glass-panel p-4 rounded-2xl space-y-3">
            <h3 className="text-sm font-semibold text-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe size={16} />
                <span>3. สัญชาติ & ธงประจำชาติ (Country Flag)</span>
              </div>
              <span className="text-xs text-amber-300 font-normal">
                {selectedFlag.emoji} {selectedFlag.name}
              </span>
            </h3>

            <div className="flex gap-1 overflow-x-auto pb-1 text-xs">
              {['Asian', 'European', 'USA', 'Americas', 'Arab', 'Global'].map((reg) => (
                <button
                  key={reg}
                  onClick={() => setActiveRegionTab(reg)}
                  className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
                    activeRegionTab === reg
                      ? 'bg-amber-500 text-slate-950 font-semibold'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {reg === 'Asian'
                    ? 'เอเชีย (Asian)'
                    : reg === 'European'
                    ? 'ยุโรป (European)'
                    : reg === 'USA'
                    ? 'สหรัฐอเมริกา (USA)'
                    : reg === 'Americas'
                    ? 'อเมริกา (Americas)'
                    : reg === 'Arab'
                    ? 'อาหรับ (Arab)'
                    : 'สันติภาพโลก (Global)'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1 bg-slate-950/50 rounded-xl">
              {filteredFlags.map((f) => (
                <button
                  key={f.code}
                  onClick={() => setSelectedFlag(f)}
                  className={`flex items-center gap-1.5 p-2 rounded-lg border text-xs transition-all ${
                    selectedFlag.code === f.code
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-base">{f.emoji}</span>
                  <span className="truncate">{f.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400 hidden sm:block">
            <span>กระทงจะลอยสู่กลางแม่น้ำเคียงข้างกันอย่างสง่างาม 🌊</span>
          </div>

          <button
            onClick={handleLaunch}
            disabled={isSubmitting || isProcessingImage}
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/35 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>กำลังบันทึกลง Firestore...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>ปล่อยกระทงลงกลางแม่น้ำ (Float in River)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
