import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { KeyboardControls, useKeyboardControls, Sky } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useEffect, useCallback } from "react";
import { useGameStore } from "@/store/gameStore";
import TargetMesh from "@/components/game/TargetMesh";
import Environment from "@/components/game/Environment";

enum Controls {
  reload = "reload",
  scope = "scope",
}

const keyMap = [
  { name: Controls.reload, keys: ["KeyR"] },
  { name: Controls.scope, keys: ["ShiftLeft"] },
];

function CameraController() {
  const { camera, gl } = useThree();
  const yaw = useRef(0);
  const pitch = useRef(-0.05);
  const isLocked = useRef(false);
  const isScoped = useGameStore((s) => s.isScoped);
  const setScoped = useGameStore((s) => s.setScoped);
  const phase = useGameStore((s) => s.phase);
  const shoot = useGameStore((s) => s.shoot);
  const killTarget = useGameStore((s) => s.killTarget);
  const targets = useGameStore((s) => s.targets);
  const startReload = useGameStore((s) => s.startReload);
  const isReloading = useGameStore((s) => s.isReloading);
  const finishReload = useGameStore((s) => s.finishReload);
  const ammo = useGameStore((s) => s.ammo);
  const reloadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [, getKeys] = useKeyboardControls<Controls>();

  useEffect(() => {
    camera.position.set(0, 1.7, 0);
  }, [camera]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isLocked.current) return;
      const sens = isScoped ? 0.0008 : 0.002;
      yaw.current -= e.movementX * sens;
      pitch.current -= e.movementY * sens;
      pitch.current = Math.max(-0.8, Math.min(0.3, pitch.current));
    },
    [isScoped]
  );

  const doRaycast = useCallback(() => {
    const raycaster = new THREE.Raycaster();
    const center = new THREE.Vector2(0, 0);
    raycaster.setFromCamera(center, camera);

    const aliveTargets = targets.filter((t) => t.alive);
    const hitRadius = isScoped ? 0.6 : 0.8;

    let closest: { id: string; dist: number } | null = null;
    for (const t of aliveTargets) {
      const pos = new THREE.Vector3(t.x, 1.5, t.z);
      const ray = raycaster.ray;
      const closestPt = ray.closestPointToPoint(pos, new THREE.Vector3());
      const dist = closestPt.distanceTo(pos);
      if (dist < hitRadius) {
        const camDist = camera.position.distanceTo(pos);
        if (!closest || camDist < closest.dist) {
          closest = { id: t.id, dist: camDist };
        }
      }
    }
    return closest;
  }, [camera, targets, isScoped]);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (phase !== "playing") return;
      if (e.button === 2) return;
      if (!isLocked.current) {
        gl.domElement.requestPointerLock();
        return;
      }
      if (isReloading) return;
      const fired = shoot();
      if (!fired) {
        if (ammo <= 0) startReload();
        return;
      }

      const hit = doRaycast();
      if (hit) {
        killTarget(hit.id);
      }
    },
    [phase, isReloading, shoot, ammo, doRaycast, killTarget, startReload, gl]
  );

  const handleContextMenu = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      if (isLocked.current) {
        setScoped(!isScoped);
      }
    },
    [isScoped, setScoped]
  );

  useEffect(() => {
    const onLockChange = () => {
      isLocked.current = document.pointerLockElement === gl.domElement;
      if (!isLocked.current) setScoped(false);
    };
    document.addEventListener("pointerlockchange", onLockChange);
    gl.domElement.addEventListener("click", handleClick);
    gl.domElement.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("pointerlockchange", onLockChange);
      gl.domElement.removeEventListener("click", handleClick);
      gl.domElement.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [gl, handleClick, handleContextMenu, handleMouseMove, setScoped]);

  useEffect(() => {
    const keys = getKeys();
    if (keys.reload && !isReloading && ammo < 10) {
      startReload();
    }
  });

  useEffect(() => {
    if (isReloading) {
      if (reloadTimer.current) clearTimeout(reloadTimer.current);
      reloadTimer.current = setTimeout(() => {
        finishReload();
      }, 2500);
    }
    return () => {
      if (reloadTimer.current) clearTimeout(reloadTimer.current);
    };
  }, [isReloading, finishReload]);

  useFrame(() => {
    const keys = getKeys();
    if (keys.reload && !isReloading && ammo < 10) {
      startReload();
    }

    const euler = new THREE.Euler(pitch.current, yaw.current, 0, "YXZ");
    camera.quaternion.setFromEuler(euler);

    const targetFov = isScoped ? 15 : 75;
    camera.fov += (targetFov - camera.fov) * 0.15;
    camera.updateProjectionMatrix();
  });

  return null;
}

function TargetAnimator() {
  const targets = useGameStore((s) => s.targets);
  const setTargets = useGameStore((s) => s.setTargets);

  useFrame((_, delta) => {
    const updated = targets.map((t) => {
      if (!t.alive) return t;
      let newX = t.x + t.direction * t.speed * delta;
      let newDir = t.direction;
      if (newX > t.boundsMax) {
        newX = t.boundsMax;
        newDir = -1;
      } else if (newX < t.boundsMin) {
        newX = t.boundsMin;
        newDir = 1;
      }
      return { ...t, x: newX, direction: newDir };
    });
    setTargets(updated);
  });

  return null;
}

function SceneContents() {
  const targets = useGameStore((s) => s.targets);
  const isScoped = useGameStore((s) => s.isScoped);

  return (
    <>
      <Sky sunPosition={[100, 80, 100]} turbidity={6} rayleigh={0.5} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[50, 80, 30]} intensity={1.2} castShadow />
      <directionalLight position={[-30, 40, -20]} intensity={0.3} color="#a0c4ff" />
      <fog attach="fog" args={["#c9e0f0", 150, 350]} />

      <CameraController />
      <TargetAnimator />
      <Environment />

      {targets.map((t) =>
        t.alive ? <TargetMesh key={t.id} target={t} /> : null
      )}

      {isScoped && (
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[0.001, 0.001]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      )}
    </>
  );
}

export default function SniperScene() {
  return (
    <KeyboardControls map={keyMap}>
      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{ fov: 75, near: 0.1, far: 500, position: [0, 1.7, 0] }}
        shadows
      >
        <SceneContents />
      </Canvas>
    </KeyboardControls>
  );
}
