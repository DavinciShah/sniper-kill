import * as THREE from "three";
import { useMemo } from "react";

function PineTree({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  const h = scale;
  return (
    <group position={[x, 0, z]} scale={[h, h, h]}>
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.28, 3.5, 7]} />
        <meshStandardMaterial color="#3d2510" roughness={1} />
      </mesh>
      <mesh position={[0, 4.2, 0]} castShadow>
        <coneGeometry args={[1.8, 4, 8]} />
        <meshStandardMaterial color="#1a4010" roughness={0.9} />
      </mesh>
      <mesh position={[0, 6.0, 0]} castShadow>
        <coneGeometry args={[1.3, 3.2, 8]} />
        <meshStandardMaterial color="#225015" roughness={0.9} />
      </mesh>
      <mesh position={[0, 7.4, 0]} castShadow>
        <coneGeometry args={[0.8, 2.2, 7]} />
        <meshStandardMaterial color="#2d6020" roughness={0.9} />
      </mesh>
    </group>
  );
}

function BirchTree({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.22, 5, 6]} />
        <meshStandardMaterial color="#d8d0c0" roughness={0.8} />
      </mesh>
      <mesh position={[0, 6.5, 0]} castShadow>
        <sphereGeometry args={[2.2, 8, 6]} />
        <meshStandardMaterial color="#3a7020" roughness={0.8} />
      </mesh>
      <mesh position={[0.8, 5.5, 0.5]} castShadow>
        <sphereGeometry args={[1.3, 7, 5]} />
        <meshStandardMaterial color="#4a8025" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Rock({ x, z, scale, rot = 0 }: { x: number; z: number; scale: number; rot?: number }) {
  return (
    <mesh position={[x, scale * 0.35, z]} rotation={[0, rot, 0.2]} castShadow>
      <dodecahedronGeometry args={[scale, 0]} />
      <meshStandardMaterial color="#7a7468" roughness={1} metalness={0.05} />
    </mesh>
  );
}

function SandbagWall({ x, z, count = 6, rot = 0 }: { x: number; z: number; count?: number; rot?: number }) {
  const w = 0.52;
  const totalW = count * w;
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      {Array.from({ length: count }).map((_, i) => (
        <group key={i}>
          <mesh position={[i * w - totalW / 2 + w / 2, 0.22, 0]} castShadow>
            <boxGeometry args={[0.48, 0.38, 0.65]} />
            <meshStandardMaterial color="#c4a26a" roughness={1} />
          </mesh>
          {i < count - 1 && (
            <mesh position={[(i + 0.5) * w - totalW / 2 + w / 2, 0.58, 0]} castShadow>
              <boxGeometry args={[0.48, 0.36, 0.63]} />
              <meshStandardMaterial color="#b8966a" roughness={1} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

function Bunker({ x, z, rot = 0 }: { x: number; z: number; rot?: number }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[5, 2.2, 3.5]} />
        <meshStandardMaterial color="#7a7860" roughness={1} />
      </mesh>
      <mesh position={[0, 2.45, 0]} castShadow>
        <boxGeometry args={[5.4, 0.7, 3.9]} />
        <meshStandardMaterial color="#686650" roughness={1} />
      </mesh>
      <mesh position={[0, 1.0, 1.75]} castShadow>
        <boxGeometry args={[1.2, 1.0, 0.3]} />
        <meshStandardMaterial color="#3a3828" roughness={1} />
      </mesh>
      <mesh position={[0, 1.0, -1.75]} castShadow>
        <boxGeometry args={[1.2, 1.0, 0.3]} />
        <meshStandardMaterial color="#3a3828" roughness={1} />
      </mesh>
    </group>
  );
}

function Watchtower({ x, z }: { x: number; z: number }) {
  const legs: [number, number][] = [[-1.1, -1.1], [1.1, -1.1], [-1.1, 1.1], [1.1, 1.1]];
  return (
    <group position={[x, 0, z]}>
      {legs.map(([lx, lz], i) => (
        <mesh key={i} position={[lx, 3.5, lz]} castShadow>
          <boxGeometry args={[0.18, 7, 0.18]} />
          <meshStandardMaterial color="#4a3820" roughness={1} />
        </mesh>
      ))}
      {[2.5, 4.5].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} castShadow>
          <boxGeometry args={[2.4, 0.15, 2.4]} />
          <meshStandardMaterial color="#5a4830" roughness={1} />
        </mesh>
      ))}
      <mesh position={[0, 7.15, 0]} castShadow>
        <boxGeometry args={[3.2, 0.22, 3.2]} />
        <meshStandardMaterial color="#5a4828" roughness={1} />
      </mesh>
      {[[-1.45, 0], [1.45, 0], [0, -1.45], [0, 1.45]].map(([rx, rz], i) => (
        <mesh key={i} position={[rx, 7.9, rz]} castShadow>
          <boxGeometry args={[rz === 0 ? 0.12 : 2.9, 1.3, rx === 0 ? 0.12 : 2.9]} />
          <meshStandardMaterial color="#4a3820" roughness={1} />
        </mesh>
      ))}
      <mesh position={[0, 8.9, 0]} castShadow>
        <coneGeometry args={[2.3, 1.8, 4]} />
        <meshStandardMaterial color="#3a2a14" roughness={1} />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 2, 4]} />
        <meshStandardMaterial color="#888" />
      </mesh>
    </group>
  );
}

function FenceSection({ x, z, length = 20, rot = 0 }: { x: number; z: number; length?: number; rot?: number }) {
  const postCount = Math.floor(length / 3);
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      {Array.from({ length: postCount }).map((_, i) => (
        <mesh key={i} position={[(i / (postCount - 1)) * length - length / 2, 0.9, 0]} castShadow>
          <boxGeometry args={[0.12, 1.8, 0.12]} />
          <meshStandardMaterial color="#6a5030" roughness={1} />
        </mesh>
      ))}
      <mesh position={[0, 1.3, 0]}>
        <boxGeometry args={[length, 0.06, 0.06]} />
        <meshStandardMaterial color="#6a5030" roughness={1} />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[length, 0.06, 0.06]} />
        <meshStandardMaterial color="#6a5030" roughness={1} />
      </mesh>
    </group>
  );
}

function GrassPatch({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      {[0, 0.6, -0.5, 0.3].map((ox, i) => (
        <mesh key={i} position={[ox, 0.25, (i % 2) * 0.4 - 0.2]} rotation={[0, i * 0.8, 0]}>
          <planeGeometry args={[0.18, 0.5]} />
          <meshStandardMaterial color="#5a8030" roughness={1} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function Mountain({ x, z, h, w }: { x: number; z: number; h: number; w: number }) {
  return (
    <mesh position={[x, h / 2 - 2, z]} castShadow={false}>
      <coneGeometry args={[w, h, 5]} />
      <meshStandardMaterial color="#4a5040" roughness={1} fog={true} />
    </mesh>
  );
}

export default function Environment() {
  const trees = useMemo(() => [
    { x: -32, z: -18, type: "pine", s: 1.0 },
    { x: -28, z: -35, type: "birch", s: 1 },
    { x: -38, z: -55, type: "pine", s: 1.2 },
    { x: -42, z: -75, type: "pine", s: 0.9 },
    { x: -30, z: -100, type: "birch", s: 1 },
    { x: -48, z: -120, type: "pine", s: 1.1 },
    { x: 30, z: -22, type: "birch", s: 1 },
    { x: 36, z: -48, type: "pine", s: 1.1 },
    { x: 42, z: -65, type: "pine", s: 0.85 },
    { x: 38, z: -90, type: "birch", s: 1 },
    { x: 45, z: -110, type: "pine", s: 1.3 },
    { x: -55, z: -40, type: "pine", s: 1.0 },
    { x: 52, z: -35, type: "pine", s: 1.0 },
    { x: -60, z: -80, type: "pine", s: 0.9 },
    { x: 58, z: -70, type: "pine", s: 1.1 },
  ], []);

  const grassPatches = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 40; i++) {
      pts.push({ x: (Math.random() - 0.5) * 60, z: -10 - Math.random() * 130 });
    }
    return pts;
  }, []);

  const rocks = useMemo(() => [
    { x: -14, z: -28, scale: 1.1, rot: 0.5 },
    { x: 18, z: -48, scale: 0.75, rot: 1.2 },
    { x: -26, z: -72, scale: 1.4, rot: 0.3 },
    { x: 32, z: -65, scale: 0.9, rot: 2.1 },
    { x: -9, z: -115, scale: 0.65, rot: 0.8 },
    { x: 22, z: -95, scale: 1.2, rot: 1.5 },
    { x: -35, z: -50, scale: 0.8, rot: 0.4 },
    { x: 40, z: -30, scale: 0.6, rot: 1.8 },
  ], []);

  return (
    <>
      {/* Ground base — grass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#4a6a2a" roughness={1} />
      </mesh>

      {/* Dirt path / shooting range floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -65]}>
        <planeGeometry args={[28, 140]} />
        <meshStandardMaterial color="#9a8060" roughness={1} />
      </mesh>

      {/* Shooter platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -2]}>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color="#7a6848" roughness={1} />
      </mesh>
      <mesh position={[0, 0.05, -2]} receiveShadow>
        <boxGeometry args={[8, 0.08, 6]} />
        <meshStandardMaterial color="#888070" roughness={1} />
      </mesh>

      {/* Distant grass bands */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-90, 0.005, -65]}>
        <planeGeometry args={[160, 200]} />
        <meshStandardMaterial color="#3a5820" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[90, 0.005, -65]}>
        <planeGeometry args={[160, 200]} />
        <meshStandardMaterial color="#3a5820" roughness={1} />
      </mesh>

      {/* Mountains backdrop */}
      <Mountain x={-180} z={-280} h={80} w={90} />
      <Mountain x={-80}  z={-300} h={100} w={110} />
      <Mountain x={40}   z={-310} h={90}  w={100} />
      <Mountain x={160}  z={-290} h={75}  w={85} />
      <Mountain x={-260} z={-260} h={60}  w={70} />
      <Mountain x={240}  z={-270} h={65}  w={80} />

      {/* Trees */}
      {trees.map((t, i) =>
        t.type === "pine"
          ? <PineTree key={i} x={t.x} z={t.z} scale={t.s} />
          : <BirchTree key={i} x={t.x} z={t.z} />
      )}

      {/* Grass patches */}
      {grassPatches.map((g, i) => <GrassPatch key={i} x={g.x} z={g.z} />)}

      {/* Rocks */}
      {rocks.map((r, i) => <Rock key={i} {...r} />)}

      {/* Sandbag positions */}
      <SandbagWall x={-12} z={-20} count={7} />
      <SandbagWall x={10}  z={-20} count={5} rot={0.15} />
      <SandbagWall x={-8}  z={-55} count={6} rot={-0.1} />
      <SandbagWall x={14}  z={-85} count={8} />

      {/* Bunkers */}
      <Bunker x={-22} z={-52} rot={0.15} />
      <Bunker x={24}  z={-88} rot={-0.1} />

      {/* Watchtower */}
      <Watchtower x={35} z={-28} />

      {/* Fences */}
      <FenceSection x={0} z={-14} length={18} />
      <FenceSection x={-52} z={-60} length={30} rot={0.3} />
      <FenceSection x={52}  z={-55} length={30} rot={-0.25} />

      {/* Subtle ground distance lines */}
      {[40, 60, 80, 100, 120].map((d) => (
        <mesh key={d} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, -d]}>
          <planeGeometry args={[24, 0.12]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.12} />
        </mesh>
      ))}
    </>
  );
}
