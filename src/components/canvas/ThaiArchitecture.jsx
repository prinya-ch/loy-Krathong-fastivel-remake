import React from 'react';
import * as THREE from 'three';

// Golden Thai Chedi (เจดีย์ทรงระฆังคว่ำ)
function GoldenChedi({ position = [-17, 0.5, -12], scale = 1.3 }) {
  return (
    <group position={position} scale={scale}>
      {/* Tiered Base Terraces (ฐานเขียง 3 ชั้น) */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[6.5, 0.8, 6.5]} />
        <meshStandardMaterial color="#8d0801" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[5.4, 0.6, 5.4]} />
        <meshStandardMaterial color="#c59b27" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[4.4, 0.5, 4.4]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* Octagonal Plinth (ฐานแปดเหลี่ยม) */}
      <mesh position={[0, 2.1, 0]}>
        <cylinderGeometry args={[2.0, 2.3, 0.8, 8]} />
        <meshStandardMaterial color="#e5ba2b" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Bell Body (องค์ระฆังคว่ำ) */}
      <mesh position={[0, 3.4, 0]}>
        <cylinderGeometry args={[1.3, 2.0, 1.8, 24]} />
        <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Square Throne (บัลลังก์สี่เหลี่ยม) */}
      <mesh position={[0, 4.4, 0]}>
        <boxGeometry args={[1.3, 0.4, 1.3]} />
        <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Tiered Spire Ring (ปล้องไฉน) */}
      <mesh position={[0, 5.5, 0]}>
        <coneGeometry args={[0.9, 2.0, 24]} />
        <meshStandardMaterial color="#ffd700" metalness={0.92} roughness={0.15} />
      </mesh>

      {/* Lotus Spire & Pinnacle Needle (บัวกลุ่ม & ปลียอด) */}
      <mesh position={[0, 7.2, 0]}>
        <coneGeometry args={[0.35, 1.6, 16]} />
        <meshStandardMaterial color="#fff3b0" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0, 8.2, 0]}>
        <cylinderGeometry args={[0.08, 0.15, 0.8, 8]} />
        <meshStandardMaterial color="#ffffff" metalness={0.98} roughness={0.05} />
      </mesh>

      {/* Chedi Golden Illumination PointLight */}
      <pointLight position={[0, 4.5, 2]} color="#ffd700" intensity={3.0} distance={20} decay={1.5} />
    </group>
  );
}

// Thai Temple Ubosot (วัด & พระอุโบสถไทย)
function ThaiTemple({ position = [-18, 0.5, 10], scale = 1.1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Foundation & Steps */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[11, 1.2, 16]} />
        <meshStandardMaterial color="#f8f9fa" roughness={0.7} />
      </mesh>

      {/* Marble Pillars / Columns */}
      {[-4.6, 4.6].map((x, xi) =>
        [-6.5, -3.5, 0, 3.5, 6.5].map((z, zi) => (
          <group key={`${xi}-${zi}`} position={[x, 2.8, z]}>
            <mesh>
              <cylinderGeometry args={[0.32, 0.38, 3.4, 12]} />
              <meshStandardMaterial color="#edf2f4" roughness={0.4} />
            </mesh>
            {/* Golden Pillar Capital */}
            <mesh position={[0, 1.8, 0]}>
              <cylinderGeometry args={[0.48, 0.32, 0.4, 12]} />
              <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        ))
      )}

      {/* Main Temple Hall Walls */}
      <mesh position={[0, 3.0, 0]}>
        <boxGeometry args={[8.2, 3.6, 13.5]} />
        <meshStandardMaterial color="#f1faee" roughness={0.6} />
      </mesh>

      {/* Golden Front & Rear Door Entrances with Warm Glow */}
      <mesh position={[0, 2.5, 6.8]}>
        <boxGeometry args={[2.2, 3.0, 0.2]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.3} />
      </mesh>
      <pointLight position={[0, 2.6, 7.5]} color="#ffb703" intensity={3.5} distance={14} />

      {/* Lower Multi-tiered Curved Roof */}
      <mesh position={[0, 5.2, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[10.2, 0.6, 15.6]} />
        <meshStandardMaterial color="#b7094c" roughness={0.4} />
      </mesh>
      {/* Mid Roof Tier */}
      <mesh position={[0, 6.0, 0]}>
        <boxGeometry args={[8.5, 0.7, 14.2]} />
        <meshStandardMaterial color="#005f73" roughness={0.4} />
      </mesh>
      {/* Upper Main Ridge Roof */}
      <mesh position={[0, 7.0, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[4.8, 2.0, 4]} rotation={[0, Math.PI / 4, 0]} />
        <meshStandardMaterial color="#d90429" roughness={0.35} />
      </mesh>

      {/* Golden Chofa Finials (ช่อฟ้า - Sacred Roof Finials at front and rear peaks) */}
      {[7.2, -7.2].map((z, idx) => (
        <group key={idx} position={[0, 8.2, z]} rotation={[idx === 0 ? 0.3 : -0.3, 0, 0]}>
          <mesh>
            <coneGeometry args={[0.22, 1.4, 8]} />
            <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Ornate Gable Apex (หน้าบันลายทอง) */}
      <mesh position={[0, 6.3, 7.2]}>
        <coneGeometry args={[2.2, 1.8, 3]} rotation={[0, 0, 0]} />
        <meshStandardMaterial color="#ffd700" metalness={0.85} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Traditional Thai Stilt House (เรือนไทยริมน้ำ)
function ThaiStiltHouse({ position = [19, 0.5, -15], rotation = [0, -0.2, 0], scale = 1.0 }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Wooden Stilts in Ground/Riverbank */}
      {[-2.2, 0, 2.2].map((x, xi) =>
        [-2.5, 0, 2.5].map((z, zi) => (
          <mesh key={`${xi}-${zi}`} position={[x, 1.0, z]}>
            <cylinderGeometry args={[0.12, 0.12, 2.0, 8]} />
            <meshStandardMaterial color="#3a1d00" roughness={0.85} />
          </mesh>
        ))
      )}

      {/* Elevated Wooden Deck / Veranda */}
      <mesh position={[0, 2.0, 0]}>
        <boxGeometry args={[5.2, 0.25, 6.0]} />
        <meshStandardMaterial color="#583101" roughness={0.7} />
      </mesh>

      {/* Teak Wood Living Quarters */}
      <mesh position={[0.4, 3.4, 0]}>
        <boxGeometry args={[3.8, 2.4, 4.4]} />
        <meshStandardMaterial color="#6f4e37" roughness={0.6} />
      </mesh>

      {/* Traditional Pointed Gable Roof */}
      <mesh position={[0.4, 4.9, 0]} rotation={[0, Math.PI / 2, 0]}>
        <coneGeometry args={[3.2, 1.6, 4]} />
        <meshStandardMaterial color="#3d2314" roughness={0.5} />
      </mesh>

      {/* Hanging Festive Paper Lantern on Veranda */}
      <group position={[-1.8, 2.6, 1.8]}>
        <mesh>
          <sphereGeometry args={[0.3, 12, 12]} />
          <meshBasicMaterial color="#ff5400" />
        </mesh>
        <pointLight color="#ff7b00" intensity={1.8} distance={7} />
      </group>
    </group>
  );
}

// Lush Riverside Trees & Banana Plants (ต้นกล้วย & ต้นไม้ไทย)
function TropicalFoliage({ position = [-13, 0.5, -2] }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.2, 0.35, 3.0, 8]} />
        <meshStandardMaterial color="#4a3525" roughness={0.9} />
      </mesh>
      {/* Banana / Palm Canopy */}
      {[-0.8, 0, 0.8].map((offset, i) => (
        <mesh key={i} position={[offset, 3.2, (i - 1) * 0.4]} rotation={[0.2 * i, 0.5 * i, 0]}>
          <coneGeometry args={[1.6 - i * 0.2, 2.2, 8]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#2d6a4f" : "#40916c"} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

export function ThaiArchitecture() {
  return (
    <group>
      {/* Left Bank: Spiritual Heritage (Chedi, Temple, Trees) */}
      <GoldenChedi position={[-17, 0.5, -15]} scale={1.25} />
      <ThaiTemple position={[-18, 0.5, 6]} scale={1.05} />
      
      {/* Foliage around temple */}
      <TropicalFoliage position={[-13.5, 0.5, -5]} />
      <TropicalFoliage position={[-14.0, 0.5, -26]} />
      <TropicalFoliage position={[-13.8, 0.5, 18]} />

      {/* Right Bank: Lively Festival Village (Multiple Traditional Stilt Houses) */}
      <ThaiStiltHouse position={[19, 0.5, -20]} rotation={[0, -0.3, 0]} scale={1.0} />
      <ThaiStiltHouse position={[19.5, 0.5, -4]} rotation={[0, -0.15, 0]} scale={1.15} />
      <ThaiStiltHouse position={[19, 0.5, 14]} rotation={[0, 0.1, 0]} scale={1.05} />
      <ThaiStiltHouse position={[18.5, 0.5, 30]} rotation={[0, -0.25, 0]} scale={0.95} />

      {/* Foliage along right bank village */}
      <TropicalFoliage position={[15.8, 0.5, -28]} />
      <TropicalFoliage position={[16.2, 0.5, 7]} />
      <TropicalFoliage position={[16.0, 0.5, 23]} />
    </group>
  );
}
