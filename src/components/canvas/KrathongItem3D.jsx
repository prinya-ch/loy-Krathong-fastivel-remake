import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Procedurally generate a texture with user photo and flag emoji for the Krathong banner
function createAvatarFlagTexture(avatarUrl, flagEmoji, creatorName) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Background badge
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.beginPath();
  ctx.roundRect(10, 10, 236, 236, 32);
  ctx.fill();

  // Golden border
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#ffd700';
  ctx.stroke();

  // Flag Emoji at top
  ctx.font = '64px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(flagEmoji || '🪷', 128, 70);

  // Name (truncated)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Kanit, sans-serif';
  const cleanName = (creatorName || 'Loy Krathong').slice(0, 14);
  ctx.fillText(cleanName, 128, 140);

  // Lotus symbol / Heart
  ctx.fillStyle = '#ff69b4';
  ctx.font = '36px sans-serif';
  ctx.fillText('✨ Vote', 128, 195);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function KrathongItem3D({
  krathong,
  isSelected,
  onClick,
  isNewlyLaunched
}) {
  const groupRef = useRef();
  const flameRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Build canvas texture for the avatar/flag sign
  const bannerTexture = useMemo(() => {
    return createAvatarFlagTexture(krathong.avatarUrl, krathong.flagEmoji, krathong.creatorName);
  }, [krathong.avatarUrl, krathong.flagEmoji, krathong.creatorName]);

  // Petal geometries arranged in radial rings
  const petalCount = krathong.material === 'lotus' ? 16 : 12;
  const petalRings = useMemo(() => {
    const list = [];
    const radius = 0.85;
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      list.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        rotY: -angle,
        rotZ: 0.28
      });
    }
    return list;
  }, [petalCount]);

  // Inner petal layer
  const innerPetalCount = 8;
  const innerPetalRings = useMemo(() => {
    const list = [];
    const radius = 0.55;
    for (let i = 0; i < innerPetalCount; i++) {
      const angle = ((i + 0.5) / innerPetalCount) * Math.PI * 2;
      list.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        rotY: -angle,
        rotZ: 0.35
      });
    }
    return list;
  }, [innerPetalCount]);

  // Scale based on size option
  const scale = krathong.size === 'large' ? 1.25 : krathong.size === 'small' ? 0.8 : 1.0;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + (krathong.driftPhase || 0);

    // Candle flame dynamic flicker
    if (flameRef.current) {
      const flicker = 1.0 + Math.sin(t * 15) * 0.18 + Math.cos(t * 22) * 0.12;
      flameRef.current.scale.set(flicker, flicker * 1.15, flicker);
    }
  });

  // Material properties based on selection
  const materialProps = useMemo(() => {
    switch (krathong.material) {
      case 'gold_leaf':
        return {
          metalness: 0.95,
          roughness: 0.15,
          color: '#ffd700',
          emissive: '#d4af37',
          emissiveIntensity: 0.2
        };
      case 'ice':
        return {
          metalness: 0.1,
          roughness: 0.05,
          color: '#a0e7e5',
          transparent: true,
          opacity: 0.82
        };
      case 'bread':
        return {
          metalness: 0.05,
          roughness: 0.85,
          color: krathong.petalColor || '#b08968'
        };
      case 'lotus':
        return {
          metalness: 0.1,
          roughness: 0.4,
          color: krathong.petalColor || '#ff69b4',
          emissive: '#ff1493',
          emissiveIntensity: 0.15
        };
      case 'banana_leaf':
      default:
        return {
          metalness: 0.1,
          roughness: 0.5,
          color: krathong.petalColor || '#2d6a4f',
          emissive: '#1b4332',
          emissiveIntensity: 0.1
        };
    }
  }, [krathong.material, krathong.petalColor]);

  return (
    <group
      ref={groupRef}
      scale={scale * (hovered ? 1.08 : 1.0)}
      onClick={(e) => {
        e.stopPropagation();
        onClick(krathong);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Selection / Newly Launched Glowing Aura Ring */}
      {(isSelected || hovered || isNewlyLaunched) && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.3, 1.5, 32]} />
          <meshBasicMaterial
            color={isNewlyLaunched ? '#00f5d4' : '#ffd700'}
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Krathong Base Trunk Slice (หยวกกล้วย / ฐานกระทง) */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[1.05, 1.15, 0.3, 24]} />
        <meshStandardMaterial
          color={krathong.baseColor || '#1b4332'}
          roughness={0.7}
        />
      </mesh>

      {/* Outer Folded Petals Ring (Dok Phaka / กลีบกระทงชั้นนอก) */}
      {petalRings.map((p, idx) => (
        <group key={`outer-${idx}`} position={[p.x, 0.28, p.z]} rotation={[0, p.rotY, p.rotZ]}>
          <mesh>
            <coneGeometry args={[0.22, 0.55, 4]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
        </group>
      ))}

      {/* Inner Petals Ring (กลีบชั้นใน) */}
      {innerPetalRings.map((p, idx) => (
        <group key={`inner-${idx}`} position={[p.x, 0.35, p.z]} rotation={[0, p.rotY, p.rotZ]}>
          <mesh>
            <coneGeometry args={[0.18, 0.45, 4]} />
            <meshStandardMaterial
              {...materialProps}
              color={krathong.petalColor || '#ffb703'}
            />
          </mesh>
        </group>
      ))}

      {/* Marigold and Jasmine floral bed center (ดอกดาวเรือง & ดอกมะลิ) */}
      <mesh position={[0, 0.33, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.08, 16]} />
        <meshStandardMaterial color="#fcbf49" roughness={0.6} />
      </mesh>

      {/* Central Festival Candle (เทียนไข) */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.6, 12]} />
        <meshStandardMaterial color="#fefae0" roughness={0.3} />
      </mesh>
      {/* Candle Wick */}
      <mesh position={[0, 0.98, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.1, 6]} />
        <meshBasicMaterial color="#111111" />
      </mesh>

      {/* Flickering Teardrop Flame (เปลวเทียน) */}
      <group ref={flameRef} position={[0, 1.08, 0]}>
        <mesh>
          <coneGeometry args={[0.08, 0.22, 10]} />
          <meshBasicMaterial color="#ff7b00" />
        </mesh>
        <mesh position={[0, -0.04, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Candle PointLight illuminating water surface around Krathong */}
      <pointLight
        position={[0, 1.1, 0]}
        color="#ffa200"
        intensity={2.2}
        distance={7.5}
        decay={1.8}
      />

      {/* Triple Incense Sticks (ธูป 3 ดอก) */}
      {[-0.06, 0, 0.06].map((offset, i) => (
        <group key={`incense-${i}`} position={[offset - 0.12, 0.7, -0.12]} rotation={[0.15, 0, (i - 1) * 0.08]}>
          {/* Stick */}
          <mesh>
            <cylinderGeometry args={[0.012, 0.012, 0.75, 6]} />
            <meshStandardMaterial color="#9d0208" />
          </mesh>
          {/* Glowing Incense Ash Tip */}
          <mesh position={[0, 0.38, 0]}>
            <sphereGeometry args={[0.02, 6, 6]} />
            <meshBasicMaterial color="#ff5400" />
          </mesh>
        </group>
      ))}

      {/* Miniature Bamboo Banner Post holding Creator's Avatar & Flag */}
      <group position={[0.42, 0.8, -0.3]}>
        {/* Bamboo Pole */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 1.1, 6]} />
          <meshStandardMaterial color="#583101" />
        </mesh>
        {/* Flag Signboard with User Avatar, Flag Emoji, and Name */}
        <mesh position={[0, 0.38, 0]} rotation={[0, -Math.PI / 4, 0]}>
          <planeGeometry args={[0.7, 0.7]} />
          <meshBasicMaterial map={bannerTexture} transparent side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}
