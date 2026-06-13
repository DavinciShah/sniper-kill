import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Target } from "@/store/gameStore";

interface Props {
  target: Target;
}

export default function TargetMesh({ target }: Props) {
  const bodyRef = useRef<THREE.Group>(null);
  const time = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    if (!bodyRef.current) return;
    time.current += delta * 1.8;
    bodyRef.current.position.x = target.x;
    bodyRef.current.position.z = target.z;
  });

  const dist = Math.abs(target.z);
  const color = dist >= 100 ? "#ff4444" : dist >= 80 ? "#ff8800" : dist >= 60 ? "#ffcc00" : "#44ff44";

  return (
    <group ref={bodyRef} position={[target.x, 0, target.z]}>
      {/* Body */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.5, 0.8, 0.25]} />
        <meshStandardMaterial color="#4a6fa5" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.75, 0]} castShadow>
        <boxGeometry args={[0.35, 0.35, 0.3]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>
      {/* Helmet */}
      <mesh position={[0, 1.97, 0]} castShadow>
        <sphereGeometry args={[0.22, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color="#3a4a2a" />
      </mesh>
      {/* Left arm */}
      <mesh position={[-0.38, 1.1, 0]} castShadow>
        <boxGeometry args={[0.2, 0.7, 0.2]} />
        <meshStandardMaterial color="#4a6fa5" />
      </mesh>
      {/* Right arm */}
      <mesh position={[0.38, 1.1, 0]} castShadow>
        <boxGeometry args={[0.2, 0.7, 0.2]} />
        <meshStandardMaterial color="#4a6fa5" />
      </mesh>
      {/* Left leg */}
      <mesh position={[-0.17, 0.4, 0]} castShadow>
        <boxGeometry args={[0.2, 0.7, 0.22]} />
        <meshStandardMaterial color="#2a3a22" />
      </mesh>
      {/* Right leg */}
      <mesh position={[0.17, 0.4, 0]} castShadow>
        <boxGeometry args={[0.2, 0.7, 0.22]} />
        <meshStandardMaterial color="#2a3a22" />
      </mesh>
      {/* Distance indicator ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.45, 0.6, 20]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
