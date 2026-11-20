import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKrathongStore } from '../../store/useKrathongStore';
import { KrathongItem3D } from './KrathongItem3D';
import { activeKrathongCoordinates } from '../../store/cameraCoordinates';

export function KrathongFleet() {
  const krathongs = useKrathongStore((state) => state.krathongs);
  const selectedKrathong = useKrathongStore((state) => state.selectedKrathong);
  const setSelectedKrathong = useKrathongStore((state) => state.setSelectedKrathong);
  const newlyLaunchedKrathongId = useKrathongStore((state) => state.newlyLaunchedKrathongId);
  const followingKrathongId = useKrathongStore((state) => state.followingKrathongId);

  const runtimePositionsRef = useRef(new Map());
  const itemRefs = useRef({});

  useEffect(() => {
    if (!krathongs || krathongs.length === 0) {
      runtimePositionsRef.current.clear();
      itemRefs.current = {};
      activeKrathongCoordinates.active = false;
      return;
    }

    const currentIds = new Set(krathongs.map((k) => k.id));
    for (const id of runtimePositionsRef.current.keys()) {
      if (!currentIds.has(id)) {
        runtimePositionsRef.current.delete(id);
        delete itemRefs.current[id];
      }
    }

    krathongs.forEach((k, idx) => {
      if (!runtimePositionsRef.current.has(k.id)) {
        // Position in the middle of the river, split side-by-side:
        // Left lane: -2.6m | Right lane: +2.6m
        const isLeft = k.laneSide === 'left' || idx % 2 === 0;
        const baseX = isLeft ? -2.6 : 2.6;

        runtimePositionsRef.current.set(k.id, {
          baseX: baseX,
          x: baseX,
          y: k.position ? k.position[1] : 0,
          z: k.position ? k.position[2] : -35 + Math.random() * 70,
          speed: k.speed || (0.038 + Math.random() * 0.015),
          wobbleOffset: k.wobbleOffset || Math.random() * Math.PI * 2,
          driftPhase: k.driftPhase || Math.random() * 10
        });
      }
    });
  }, [krathongs]);

  useFrame(({ clock }) => {
    if (!krathongs || krathongs.length === 0) {
      activeKrathongCoordinates.active = false;
      return;
    }

    const t = clock.getElapsedTime();
    let hasFollowMatch = false;

    krathongs.forEach((k) => {
      const state = runtimePositionsRef.current.get(k.id);
      const group = itemRefs.current[k.id];

      if (state && group) {
        state.z += state.speed;

        // Gentle sinusoidal current wobble strictly bounded within its side-by-side lane
        const lateralX = state.baseX + Math.sin(t * 0.4 + state.wobbleOffset) * 0.45;
        const waterBobY = Math.sin(t * 2.2 + state.wobbleOffset) * 0.04;
        const tiltX = Math.sin(t * 1.8 + state.wobbleOffset) * 0.04;
        const tiltZ = Math.cos(t * 1.5 + state.wobbleOffset) * 0.04;

        // Seamless loop upstream when reaching boundary
        if (state.z > 38) {
          state.z = -38;
        }

        group.position.set(lateralX, waterBobY, state.z);
        group.rotation.set(tiltX, Math.sin(t * 0.2 + state.wobbleOffset) * 0.2, tiltZ);

        // Feed real-time coordinates to cinematic follow camera
        if (followingKrathongId === k.id) {
          activeKrathongCoordinates.id = k.id;
          activeKrathongCoordinates.x = lateralX;
          activeKrathongCoordinates.y = waterBobY;
          activeKrathongCoordinates.z = state.z;
          activeKrathongCoordinates.active = true;
          hasFollowMatch = true;
        }
      }
    });

    if (!hasFollowMatch) {
      activeKrathongCoordinates.active = false;
    }
  });

  if (!krathongs || krathongs.length === 0) {
    return null;
  }

  return (
    <group>
      {krathongs.map((k) => (
        <group
          key={k.id}
          ref={(el) => {
            if (el) itemRefs.current[k.id] = el;
          }}
          position={k.position || [0, 0, 0]}
        >
          <KrathongItem3D
            krathong={k}
            isSelected={selectedKrathong?.id === k.id}
            isNewlyLaunched={newlyLaunchedKrathongId === k.id}
            onClick={(item) => setSelectedKrathong(item)}
          />
        </group>
      ))}
    </group>
  );
}
