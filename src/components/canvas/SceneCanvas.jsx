import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { FullMoonSky } from './FullMoonSky';
import { RiverWater } from './RiverWater';
import { ThaiArchitecture } from './ThaiArchitecture';
import { Spectators } from './Spectators';
import { KrathongFleet } from './KrathongFleet';
import { activeKrathongCoordinates } from '../../store/cameraCoordinates';
import { useKrathongStore } from '../../store/useKrathongStore';

// Cinematic Camera Controller with Dynamic Follow Mode
function CameraRig() {
  const controlsRef = useRef();
  const followingKrathongId = useKrathongStore((state) => state.followingKrathongId);
  const stopFollowing = useKrathongStore((state) => state.stopFollowing);
  const cameraFocusTarget = useKrathongStore((state) => state.cameraFocusTarget);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleUserInteractionStart = () => {
      if (useKrathongStore.getState().followingKrathongId) {
        stopFollowing();
      }
    };

    controls.addEventListener('start', handleUserInteractionStart);
    return () => {
      controls.removeEventListener('start', handleUserInteractionStart);
    };
  }, [stopFollowing]);

  useFrame(({ camera }) => {
    if (!controlsRef.current) return;

    // 1. ACTIVE DYNAMIC FOLLOW MODE:
    // Follows directly in the middle of the river behind the Krathong in its lane
    if (followingKrathongId && activeKrathongCoordinates.active) {
      const camOffsetX = activeKrathongCoordinates.x < 0 ? -1.3 : 1.3;

      const targetCamPos = new THREE.Vector3(
        activeKrathongCoordinates.x + camOffsetX,
        activeKrathongCoordinates.y + 1.25,
        activeKrathongCoordinates.z - 3.4
      );

      const lookTarget = new THREE.Vector3(
        activeKrathongCoordinates.x,
        activeKrathongCoordinates.y + 0.3,
        activeKrathongCoordinates.z + 1.8
      );

      camera.position.lerp(targetCamPos, 0.055);
      controlsRef.current.target.lerp(lookTarget, 0.075);
      controlsRef.current.update();
      return;
    }

    // 2. STATIC QUICK-FOCUS CAMERA TARGET
    if (cameraFocusTarget) {
      const targetPos = new THREE.Vector3(...cameraFocusTarget);
      camera.position.lerp(targetPos, 0.05);

      controlsRef.current.target.lerp(
        new THREE.Vector3(cameraFocusTarget[0], 0.2, cameraFocusTarget[2] - 4),
        0.05
      );
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={3}
      maxDistance={42}
      minPolarAngle={Math.PI / 8}
      maxPolarAngle={Math.PI / 2.04}
      target={[0, 0.5, 0]}
    />
  );
}

export function SceneCanvas() {
  return (
    <div className="w-full h-full absolute inset-0 touch-none">
      <Canvas
        camera={{ position: [14, 7, 14], fov: 48 }}
        dpr={[1, Math.min(window.devicePixelRatio || 1, 2)]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        <color attach="background" args={['#050813']} />
        <fog attach="fog" args={['#050813', 25, 75]} />

        <ambientLight color="#1a2536" intensity={1.2} />
        <directionalLight
          position={[20, 30, -50]}
          color="#fffae0"
          intensity={1.8}
        />
        <hemisphereLight
          skyColor="#0b1b36"
          groundColor="#040b17"
          intensity={0.6}
        />

        <FullMoonSky />
        <RiverWater />
        <ThaiArchitecture />
        <Spectators />
        <KrathongFleet />

        <CameraRig />
      </Canvas>
    </div>
  );
}
