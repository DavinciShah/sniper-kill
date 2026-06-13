import * as THREE from "three";
import { useMemo } from "react";

function Tree({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 3, 6]} />
        <meshStandardMaterial color="#5a3a1a" />
      </mesh>
      <mesh position={[0, 4, 0]} castShadow>
        <coneGeometry args={[1.5, 3.5, 7]} />
        <meshStandardMaterial color="#2d5a1b" />
      </mesh>
      <mesh position={[0, 5.5, 0]} castShadow>
        <coneGeometry args={[1.1, 2.5, 7]} />
        <meshStandardMaterial color="#3a6e22" />
      </mesh>
    </group>
  );
}

function Rock({ x, z, scale }: { x: number; z: number; scale: number }) {
  return (
    <mesh position={[x, scale * 0.3, z]} castShadow>
      <dodecahedronGeometry args={[scale, 0]} />
      <meshStandardMaterial color="#7a7a7a" roughness={0.9} />
    </mesh>
  );
}

function DistanceMarker({ dist }: { dist: number }) {
  return (
    <group position={[0, 0, -dist]}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.1, 1, 0.1]} />
        <meshStandardMaterial color="#cc9900" />
      </mesh>
      <mesh position={[0.6, 0.5, 0]}>
        <boxGeometry args={[0.1, 1, 0.1]} />
        <meshStandardMaterial color="#cc9900" />
      </mesh>
    </group>
  );
}

function Bunker({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[4, 2, 3]} />
        <meshStandardMaterial color="#6b6b5a" roughness={1} />
      </mesh>
      <mesh position={[0, 2.3, 0]} castShadow>
        <boxGeometry args={[4.4, 0.6, 3.4]} />
        <meshStandardMaterial color="#5a5a4a" roughness={1} />
      </mesh>
    </group>
  );
}

export default function Environment() {
  const trees = useMemo(() => {
    const positions: { x: number; z: number }[] = [];
    const sideX = [-30, -25, -35, 30, 28, 38, -40, 40, -22, 25];
    const sideZ = [-15, -30, -55, -20, -45, -35, -70, -80, -100, -90];
    for (let i = 0; i < sideX.length; i++) {
      positions.push({ x: sideX[i], z: sideZ[i] });
    }
    return positions;
  }, []);

  const rocks = useMemo(() => {
    const data: { x: number; z: number; scale: number }[] = [
      { x: -15, z: -30, scale: 1.2 },
      { x: 20, z: -50, scale: 0.8 },
      { x: -25, z: -80, scale: 1.5 },
      { x: 35, z: -70, scale: 1.0 },
      { x: -10, z: -120, scale: 0.7 },
    ];
    return data;
  }, []);

  const groundColor = new THREE.Color("#5a7a3a");

  return (
    <>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color={groundColor} roughness={0.9} />
      </mesh>

      {/* Dirt patches on ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -60]}>
        <planeGeometry args={[60, 120]} />
        <meshStandardMaterial color="#8a7050" roughness={1} />
      </mesh>

      {/* Trees */}
      {trees.map((t, i) => (
        <Tree key={i} x={t.x} z={t.z} />
      ))}

      {/* Rocks */}
      {rocks.map((r, i) => (
        <Rock key={i} x={r.x} z={r.z} scale={r.scale} />
      ))}

      {/* Distance markers */}
      <DistanceMarker dist={40} />
      <DistanceMarker dist={60} />
      <DistanceMarker dist={80} />
      <DistanceMarker dist={100} />
      <DistanceMarker dist={120} />

      {/* Bunkers/cover */}
      <Bunker x={-20} z={-50} />
      <Bunker x={22} z={-85} />

      {/* Fence posts */}
      {[-3, -1, 1, 3].map((n) => (
        <mesh key={n} position={[n * 8, 0.75, -20]} castShadow>
          <boxGeometry args={[0.15, 1.5, 0.15]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
      ))}
    </>
  );
}
