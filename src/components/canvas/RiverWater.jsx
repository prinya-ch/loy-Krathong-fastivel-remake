import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function RiverWater() {
  const meshRef = useRef();

  // Create segmented river plane for vertex wave animation
  const { geometry, originalPositions } = useMemo(() => {
    // Width: 28, Length: 90, segments: 50x80
    const geom = new THREE.PlaneGeometry(26, 90, 50, 80);
    geom.rotateX(-Math.PI / 2); // Lay flat on XZ plane
    const orig = geom.attributes.position.clone();
    return { geometry: geom, originalPositions: orig };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!meshRef.current) return;

    const pos = meshRef.current.geometry.attributes.position;
    const orig = originalPositions;

    // Animate river ripples and directional current flow along the Z-axis
    for (let i = 0; i < pos.count; i++) {
      const uX = orig.getX(i);
      const uZ = orig.getZ(i);

      // Multi-frequency wave calculation simulating river current
      const wave1 = Math.sin(uZ * 0.45 + t * 2.2) * 0.08;
      const wave2 = Math.cos(uX * 0.8 + t * 1.5) * 0.05;
      const wave3 = Math.sin((uX + uZ) * 0.3 + t * 1.8) * 0.04;

      pos.setY(i, wave1 + wave2 + wave3);
    }

    pos.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
  });

  return (
    <group position={[0, -0.2, 0]}>
      {/* Dynamic Animated Flowing River Surface */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color="#0b2545"
          emissive="#041224"
          roughness={0.12}
          metalness={0.88}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* River Bed (Dark river bottom underneath) */}
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 92]} />
        <meshStandardMaterial color="#030811" roughness={0.95} />
      </mesh>

      {/* Left Riverbank (Natural grassy embankment with Temple & Chedi) */}
      <group position={[-16, -0.1, 0]}>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[8, 1.2, 92]} />
          <meshStandardMaterial color="#1a3a22" roughness={0.9} />
        </mesh>
        {/* River stone border */}
        <mesh position={[3.8, 0.2, 0]}>
          <boxGeometry args={[0.8, 0.6, 92]} />
          <meshStandardMaterial color="#2c302e" roughness={0.85} />
        </mesh>
      </group>

      {/* Right Riverbank (Festival Promenade & Wooden Boardwalk safely on the bank) */}
      <group position={[16, -0.1, 0]}>
        {/* Stone / soil foundation */}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[8, 1.2, 92]} />
          <meshStandardMaterial color="#1c2541" roughness={0.9} />
        </mesh>
        {/* Wooden Boardwalk Planks - firmly positioned on the dry bank */}
        <mesh position={[-2.2, 0.95, 0]}>
          <boxGeometry args={[3.2, 0.2, 92]} />
          <meshStandardMaterial color="#583101" roughness={0.7} />
        </mesh>
        {/* Boardwalk safety railing facing the river */}
        <mesh position={[-3.6, 1.4, 0]}>
          <boxGeometry args={[0.15, 0.7, 92]} />
          <meshStandardMaterial color="#3a1d00" roughness={0.6} />
        </mesh>

        {/* Festival Pier & Krathong Launch Slipway */}
        <group position={[-3.6, 0.2, 0]}>
          {/* Slanted Launch Ramp extending smoothly towards the water */}
          <mesh position={[-1.6, 0.35, 0]} rotation={[0, 0, 0.28]}>
            <boxGeometry args={[3.4, 0.18, 4.5]} />
            <meshStandardMaterial color="#6f4e37" roughness={0.65} />
          </mesh>
          {/* Pier Wooden Pilings */}
          {[-1.8, 1.8].map((z, idx) => (
            <mesh key={idx} position={[-2.8, -0.4, z]}>
              <cylinderGeometry args={[0.16, 0.16, 1.6, 8]} />
              <meshStandardMaterial color="#3d2314" roughness={0.9} />
            </mesh>
          ))}
          {/* Festive Launch Gate */}
          <group position={[0, 1.2, 0]}>
            {/* Left pillar */}
            <mesh position={[0, 0.8, -2.2]}>
              <cylinderGeometry args={[0.12, 0.12, 2.2, 8]} />
              <meshStandardMaterial color="#ffd700" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Right pillar */}
            <mesh position={[0, 0.8, 2.2]}>
              <cylinderGeometry args={[0.12, 0.12, 2.2, 8]} />
              <meshStandardMaterial color="#ffd700" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Arch banner */}
            <mesh position={[0, 1.9, 0]}>
              <boxGeometry args={[0.3, 0.4, 4.4]} />
              <meshStandardMaterial color="#9d0208" roughness={0.4} />
            </mesh>
            {/* Warm Pier Lantern */}
            <pointLight position={[-0.5, 1.5, 0]} color="#ffb703" intensity={2.0} distance={10} />
          </group>
        </group>
      </group>
    </group>
  );
}
