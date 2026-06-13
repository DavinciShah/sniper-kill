import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Target } from "@/store/gameStore";

interface Props {
  target: Target;
}

export default function TargetMesh({ target }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const rootRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const time = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    if (!rootRef.current || !groupRef.current) return;

    // Move with target
    groupRef.current.position.x = target.x;
    groupRef.current.position.z = target.z;

    if (!target.alive && target.killedAt) {
      // Death fall animation
      const elapsed = (Date.now() - target.killedAt) / 1000;
      const fallT = Math.min(elapsed / 0.7, 1);
      const ease = 1 - Math.pow(1 - fallT, 3);
      rootRef.current.rotation.x = ease * (Math.PI / 2);
      rootRef.current.position.y = -ease * 0.4;
      return;
    }

    // Walking cycle
    time.current += delta * target.speed * 0.9;
    const swing = Math.sin(time.current) * 0.45;

    if (leftArmRef.current)  leftArmRef.current.rotation.x  =  swing;
    if (rightArmRef.current) rightArmRef.current.rotation.x = -swing;
    if (leftLegRef.current)  leftLegRef.current.rotation.x  = -swing;
    if (rightLegRef.current) rightLegRef.current.rotation.x =  swing;

    // Slight body bob
    rootRef.current.position.y = Math.abs(Math.sin(time.current)) * 0.04;
  });

  const isDead = !target.alive;

  return (
    <group ref={groupRef} position={[target.x, 0, target.z]}>
      <group ref={rootRef}>
        {/* Shadow blob */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <circleGeometry args={[0.38, 16]} />
          <meshBasicMaterial color="#000" transparent opacity={0.25} />
        </mesh>

        {/* Boots */}
        <mesh position={[-0.14, 0.12, 0.04]} castShadow>
          <boxGeometry args={[0.17, 0.22, 0.32]} />
          <meshStandardMaterial color="#1a1a14" roughness={1} />
        </mesh>
        <mesh position={[0.14, 0.12, 0.04]} castShadow>
          <boxGeometry args={[0.17, 0.22, 0.32]} />
          <meshStandardMaterial color="#1a1a14" roughness={1} />
        </mesh>

        {/* Left leg */}
        <group ref={leftLegRef} position={[-0.14, 0.62, 0]}>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.18, 0.78, 0.2]} />
            <meshStandardMaterial color="#2a3a1c" roughness={0.9} />
          </mesh>
          {/* knee pad */}
          <mesh position={[0, -0.22, 0.1]}>
            <boxGeometry args={[0.16, 0.14, 0.1]} />
            <meshStandardMaterial color="#1e2c14" roughness={1} />
          </mesh>
        </group>

        {/* Right leg */}
        <group ref={rightLegRef} position={[0.14, 0.62, 0]}>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.18, 0.78, 0.2]} />
            <meshStandardMaterial color="#2a3a1c" roughness={0.9} />
          </mesh>
          <mesh position={[0, -0.22, 0.1]}>
            <boxGeometry args={[0.16, 0.14, 0.1]} />
            <meshStandardMaterial color="#1e2c14" roughness={1} />
          </mesh>
        </group>

        {/* Belt */}
        <mesh position={[0, 1.06, 0]} castShadow>
          <boxGeometry args={[0.52, 0.12, 0.24]} />
          <meshStandardMaterial color="#2a2218" roughness={1} />
        </mesh>

        {/* Torso / vest */}
        <mesh position={[0, 1.38, 0]} castShadow>
          <boxGeometry args={[0.52, 0.64, 0.26]} />
          <meshStandardMaterial color="#4a5a38" roughness={0.85} />
        </mesh>
        {/* Vest plate */}
        <mesh position={[0, 1.38, 0.14]}>
          <boxGeometry args={[0.36, 0.48, 0.04]} />
          <meshStandardMaterial color="#3a4830" roughness={1} />
        </mesh>

        {/* Left arm */}
        <group ref={leftArmRef} position={[-0.35, 1.45, 0]}>
          <mesh position={[0, -0.2, 0]} castShadow>
            <boxGeometry args={[0.17, 0.52, 0.18]} />
            <meshStandardMaterial color="#4a5a38" roughness={0.85} />
          </mesh>
          {/* Forearm */}
          <mesh position={[0, -0.58, 0.06]} castShadow>
            <boxGeometry args={[0.15, 0.42, 0.16]} />
            <meshStandardMaterial color="#6a7848" roughness={0.9} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.82, 0.06]}>
            <boxGeometry args={[0.13, 0.16, 0.14]} />
            <meshStandardMaterial color="#c09060" roughness={0.9} />
          </mesh>
        </group>

        {/* Right arm */}
        <group ref={rightArmRef} position={[0.35, 1.45, 0]}>
          <mesh position={[0, -0.2, 0]} castShadow>
            <boxGeometry args={[0.17, 0.52, 0.18]} />
            <meshStandardMaterial color="#4a5a38" roughness={0.85} />
          </mesh>
          <mesh position={[0, -0.58, 0.06]} castShadow>
            <boxGeometry args={[0.15, 0.42, 0.16]} />
            <meshStandardMaterial color="#6a7848" roughness={0.9} />
          </mesh>
          <mesh position={[0, -0.82, 0.06]}>
            <boxGeometry args={[0.13, 0.16, 0.14]} />
            <meshStandardMaterial color="#c09060" roughness={0.9} />
          </mesh>
        </group>

        {/* Neck */}
        <mesh position={[0, 1.76, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 0.18, 6]} />
          <meshStandardMaterial color="#b08050" roughness={0.8} />
        </mesh>

        {/* Head */}
        <mesh position={[0, 2.0, 0]} castShadow>
          <boxGeometry args={[0.34, 0.36, 0.32]} />
          <meshStandardMaterial color={isDead ? "#8a6040" : "#c09070"} roughness={0.8} />
        </mesh>
        {/* Face detail */}
        <mesh position={[0, 1.98, 0.17]}>
          <boxGeometry args={[0.22, 0.12, 0.02]} />
          <meshStandardMaterial color="#8a6840" roughness={1} />
        </mesh>

        {/* Helmet */}
        <mesh position={[0, 2.2, 0]} castShadow>
          <sphereGeometry args={[0.24, 10, 7, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
          <meshStandardMaterial color="#2a3420" roughness={0.9} metalness={0.1} />
        </mesh>
        {/* Helmet rim */}
        <mesh position={[0, 2.04, 0]}>
          <torusGeometry args={[0.22, 0.04, 5, 12]} />
          <meshStandardMaterial color="#222a18" roughness={1} />
        </mesh>

        {/* Rifle (right side) */}
        <mesh position={[0.38, 1.38, 0.14]} rotation={[0.3, 0, 0]} castShadow>
          <boxGeometry args={[0.06, 0.08, 0.9]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.7} metalness={0.3} />
        </mesh>
      </group>
    </group>
  );
}
