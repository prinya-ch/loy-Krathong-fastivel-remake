import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function FullMoonSky() {
  const moonRef = useRef();
  const lanternsRef = useRef();

  // Procedural sky lanterns (Kom Loi / โคมลอย) floating upward
  const lanternCount = 35;
  const lanterns = useMemo(() => {
    const list = [];
    for (let i = 0; i < lanternCount; i++) {
      list.push({
        x: (Math.random() - 0.5) * 80,
        y: 8 + Math.random() * 35,
        z: -30 - Math.random() * 50,
        speedY: 0.015 + Math.random() * 0.02,
        wobbleSpeed: 0.8 + Math.random() * 1.2,
        wobbleAmp: 0.01 + Math.random() * 0.02,
        scale: 0.4 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2
      });
    }
    return list;
  }, []);

  // Stars in the night sky
  const starsCount = 400;
  const starsData = useMemo(() => {
    const positions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 1] = 15 + Math.random() * 60;
      positions[i * 3 + 2] = -40 - Math.random() * 80;
    }
    return positions;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Subtle moon glow pulsation
    if (moonRef.current) {
      moonRef.current.rotation.y = t * 0.02;
    }

    // Animate floating sky lanterns
    if (lanternsRef.current && lanternsRef.current.children) {
      lanternsRef.current.children.forEach((child, index) => {
        const item = lanterns[index];
        if (item) {
          child.position.y += item.speedY;
          child.position.x += Math.sin(t * item.wobbleSpeed + item.phase) * item.wobbleAmp;

          // Recycle lantern when it floats too high
          if (child.position.y > 45) {
            child.position.y = 8;
            child.position.x = (Math.random() - 0.5) * 80;
          }
        }
      });
    }
  });

  return (
    <group>
      {/* Stars Points */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starsData, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.6}
          color="#ffffff"
          transparent
          opacity={0.85}
          sizeAttenuation
        />
      </points>

      {/* Full Moon (พระจันทร์วันเพ็ญ 15 ค่ำ เดือน 12) */}
      <group position={[18, 26, -60]}>
        {/* Core Moon Sphere */}
        <mesh ref={moonRef}>
          <sphereGeometry args={[4.2, 32, 32]} />
          <meshBasicMaterial color="#fffbe6" />
        </mesh>

        {/* Soft Radial Moon Glow Outer Ring */}
        <mesh>
          <sphereGeometry args={[4.8, 32, 32]} />
          <meshBasicMaterial
            color="#ffeaa7"
            transparent
            opacity={0.25}
            side={THREE.BackSide}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[6.5, 32, 32]} />
          <meshBasicMaterial
            color="#ffd166"
            transparent
            opacity={0.12}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Moonlight PointLight casting soft illumination on river */}
        <pointLight
          color="#fffae0"
          intensity={2.8}
          distance={140}
          decay={1.2}
        />
      </group>

      {/* Floating Sky Lanterns (Kom Loi / โคมลอย) */}
      <group ref={lanternsRef}>
        {lanterns.map((l, i) => (
          <group key={i} position={[l.x, l.y, l.z]} scale={l.scale}>
            {/* Paper Lantern Body */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.5, 0.7, 1.2, 12, 1, true]} />
              <meshBasicMaterial color="#ff9e00" transparent opacity={0.88} />
            </mesh>
            {/* Lantern Top Dome */}
            <mesh position={[0, 0.6, 0]}>
              <sphereGeometry args={[0.5, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshBasicMaterial color="#ffb703" transparent opacity={0.85} />
            </mesh>
            {/* Warm core fire glow */}
            <mesh position={[0, -0.3, 0]}>
              <sphereGeometry args={[0.2, 8, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
