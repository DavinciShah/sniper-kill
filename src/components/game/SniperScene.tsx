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
  const pendingShot = useGameStore((s) => s.pendingShot);
  const clearPendingShot = useGameStore((s) => s.clearPendingShot);
  const reloadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Touch state
  const touchId = useRef<number | null>(null);
  const lastTouchX = useRef(0);
  const lastTouchY = useRef(0);
  const isMobile = useRef(false);

  const [, getKeys] = useKeyboardControls<Controls>();

  useEffect(() => {
    isMobile.current = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isMobile.current) isLocked.current = true;
    camera.position.set(0, 1.7, 0);
  }, [camera]);

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

  const processShot = useCallback(() => {
    if (phase !== "playing") return;
    if (isReloading) return;
    const fired = shoot();
    if (!fired) {
      if (ammo <= 0) startReload();
      return;
    }
    const hit = doRaycast();
    if (hit) killTarget(hit.id);
  }, [phase, isReloading, shoot, ammo, doRaycast, killTarget, startReload]);

  // ── Mouse handlers ──────────────────────────────────────────────
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

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (phase !== "playing") return;
      if (e.button === 2) return;
      if (isMobile.current) return; // mobile uses fire button, not canvas tap
      if (!isLocked.current) {
        gl.domElement.requestPointerLock();
        return;
      }
      processShot();
    },
    [phase, processShot, gl]
  );

  const handleContextMenu = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      if (isLocked.current) setScoped(!isScoped);
    },
    [isScoped, setScoped]
  );

  // ── Touch handlers ───────────────────────────────────────────────
  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (phase !== "playing") return;
      for (const touch of Array.from(e.changedTouches)) {
        const target = touch.target as HTMLElement;
        if (target.closest("[data-hud]")) continue;
        if (touchId.current === null) {
          touchId.current = touch.identifier;
          lastTouchX.current = touch.clientX;
          lastTouchY.current = touch.clientY;
        }
      }
    },
    [phase]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      for (const touch of Array.from(e.changedTouches)) {
        if (touch.identifier !== touchId.current) continue;
        const dx = touch.clientX - lastTouchX.current;
        const dy = touch.clientY - lastTouchY.current;
        const sens = isScoped ? 0.0045 : 0.009;
        yaw.current -= dx * sens;
        pitch.current -= dy * sens;
        pitch.current = Math.max(-1.3, Math.min(0.8, pitch.current));
        lastTouchX.current = touch.clientX;
        lastTouchY.current = touch.clientY;
      }
    },
    [isScoped]
  );

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    for (const touch of Array.from(e.changedTouches)) {
      if (touch.identifier === touchId.current) touchId.current = null;
    }
  }, []);

  useEffect(() => {
    const onLockChange = () => {
      isLocked.current = document.pointerLockElement === gl.domElement;
      if (!isLocked.current && !isMobile.current) setScoped(false);
    };

    document.addEventListener("pointerlockchange", onLockChange);
    gl.domElement.addEventListener("click", handleClick);
    gl.domElement.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("mousemove", handleMouseMove);

    gl.domElement.addEventListener("touchstart", handleTouchStart, { passive: true });
    gl.domElement.addEventListener("touchmove", handleTouchMove, { passive: false });
    gl.domElement.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("pointerlockchange", onLockChange);
      gl.domElement.removeEventListener("click", handleClick);
      gl.domElement.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("mousemove", handleMouseMove);
      gl.domElement.removeEventListener("touchstart", handleTouchStart);
      gl.domElement.removeEventListener("touchmove", handleTouchMove);
      gl.domElement.removeEventListener("touchend", handleTouchEnd);
    };
  }, [gl, handleClick, handleContextMenu, handleMouseMove, handleTouchStart, handleTouchMove, handleTouchEnd, setScoped]);

  useEffect(() => {
    if (isReloading) {
      if (reloadTimer.current) clearTimeout(reloadTimer.current);
      reloadTimer.current = setTimeout(() => finishReload(), 2500);
    }
    return () => {
      if (reloadTimer.current) clearTimeout(reloadTimer.current);
    };
  }, [isReloading, finishReload]);

  useFrame(() => {
    const keys = getKeys();
    if (keys.reload && !isReloading && ammo < 10) startReload();

    // Process pending shot from mobile fire button
    if (pendingShot) {
      clearPendingShot();
      processShot();
    }

    const euler = new THREE.Euler(pitch.current, yaw.current, 0, "YXZ");
    camera.quaternion.setFromEuler(euler);

    const targetFov = isScoped ? 15 : 75;
    const perspCam = camera as THREE.PerspectiveCamera;
    perspCam.fov += (targetFov - perspCam.fov) * 0.15;
    perspCam.updateProjectionMatrix();
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

const DEATH_LINGER_MS = 900;

function SceneContents() {
  const targets = useGameStore((s) => s.targets);

  return (
    <>
      {/* Golden-hour sky */}
      <Sky
        sunPosition={[60, 18, 120]}
        turbidity={9}
        rayleigh={2.2}
        mieCoefficient={0.008}
        mieDirectionalG={0.88}
      />

      {/* Hemisphere bounce — warm sky top, cool earth bottom */}
      <hemisphereLight args={["#bdd4f0", "#4a5a30", 0.55]} />

      {/* Main sun — warm golden angle */}
      <directionalLight
        position={[60, 40, 80]}
        intensity={1.6}
        color="#ffe8b0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={300}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
      />

      {/* Soft fill from opposite sky */}
      <directionalLight position={[-50, 30, -30]} intensity={0.25} color="#c0d8ff" />

      {/* Warm haze fog matching golden hour */}
      <fog attach="fog" args={["#d4b880", 120, 320]} />

      <CameraController />
      <TargetAnimator />
      <Environment />

      {targets.map((t) => {
        if (t.alive) return <TargetMesh key={t.id} target={t} />;
        if (t.killedAt && Date.now() - t.killedAt < DEATH_LINGER_MS)
          return <TargetMesh key={t.id} target={t} />;
        return null;
      })}
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
