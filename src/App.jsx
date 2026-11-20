import React from 'react';
import { SceneCanvas } from './components/canvas/SceneCanvas';
import { Header } from './components/ui/Header';
import { BottomBar } from './components/ui/BottomBar';
import { KrathongCustomizerModal } from './components/ui/KrathongCustomizerModal';
import { KrathongDetailModal } from './components/ui/KrathongDetailModal';
import { LeaderboardDrawer } from './components/ui/LeaderboardDrawer';
import { AudioController } from './components/ui/AudioController';

export default function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050813] select-none font-['Kanit',sans-serif]">
      {/* 3D WebGL Scene Canvas */}
      <SceneCanvas />

      {/* UI Overlays */}
      <Header />
      <BottomBar />

      {/* Interactive Modals & Drawers */}
      <KrathongCustomizerModal />
      <KrathongDetailModal />
      <LeaderboardDrawer />

      {/* Ambient Audio Engine */}
      <AudioController />
    </div>
  );
}
