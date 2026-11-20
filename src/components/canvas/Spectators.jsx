import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

// Single stylized low-poly spectator
function SpectatorPerson({ data, timeOffset }) {
  const groupRef = useRef();
  const armRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + timeOffset;
    if (groupRef.current) {
      groupRef.current.position.y = data.y + Math.sin(t * 1.8) * 0.025;
      groupRef.current.rotation.y = data.rotY + Math.sin(t * 0.9) * 0.08;
    }
    if (armRef.current && data.hasLantern) {
      armRef.current.rotation.z = Math.sin(t * 2.2) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[data.x, data.y, data.z]} rotation={[0, data.rotY, 0]} scale={data.scale}>
      {/* Lower Body / Sarong */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.22, 0.28, 0.9, 10]} />
        <meshStandardMaterial color={data.lowerColor} roughness={0.7} />
      </mesh>

      {/* Torso / Thai Sabai or Shirt */}
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.28, 0.24, 0.65, 10]} />
        <meshStandardMaterial color={data.upperColor} roughness={0.6} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.68, 0]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color="#fcd5b5" roughness={0.8} />
      </mesh>

      {/* Hair Bun */}
      <mesh position={[0, 1.86, -0.04]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* Handheld Festive Lantern */}
      {data.hasLantern && (
        <group ref={armRef} position={[-0.32, 1.1, 0.18]}>
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.5, 6]} />
            <meshStandardMaterial color="#fcd5b5" />
          </mesh>
          <mesh position={[0, -0.55, 0]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshBasicMaterial color="#ff7b00" />
          </mesh>
          <pointLight color="#ff9e00" intensity={1.2} distance={3.5} />
        </group>
      )}
    </group>
  );
}

export function Spectators() {
  const spectatorsList = useMemo(() => {
    const list = [];
    const thaiColors = [
      '#e63946', '#f1faee', '#a8dadc', '#457b9d', '#1d3557',
      '#ffd166', '#06d6a0', '#118ab2', '#073b4c', '#e76f51',
      '#f4a261', '#2a9d8f', '#b5179e', '#7209b7', '#48cae4'
    ];

    // Safely placed on boardwalk at x = 13.8
    for (let i = 0; i < 20; i++) {
      let z;
      if (i < 8) {
        z = -4 + i * 1.1;
      } else {
        z = -30 + (i - 8) * 5.2;
      }

      list.push({
        id: i,
        x: 13.6 + (i % 2) * 0.4,
        y: 1.1,
        z: z,
        rotY: -Math.PI / 2 + (Math.random() - 0.5) * 0.4, // Facing river
        scale: 0.85 + (i % 4) * 0.05,
        upperColor: thaiColors[i % thaiColors.length],
        lowerColor: thaiColors[(i + 4) % thaiColors.length],
        hasLantern: i % 2 === 0
      });
    }
    return list;
  }, []);

  return (
    <group>
      {spectatorsList.map((person, idx) => (
        <SpectatorPerson key={person.id} data={person} timeOffset={idx * 0.4} />
      ))}
    </group>
  );
}
