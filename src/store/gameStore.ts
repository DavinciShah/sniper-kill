import { create } from "zustand";

export type GamePhase = "menu" | "playing" | "paused" | "gameover";

export interface Target {
  id: string;
  x: number;
  z: number;
  distance: number;
  alive: boolean;
  speed: number;
  direction: number;
  boundsMin: number;
  boundsMax: number;
  killedAt?: number;
}

export interface KillInfo {
  pts: number;
  dist: number;
  id: string;
}

interface GameState {
  phase: GamePhase;
  score: number;
  ammo: number;
  maxAmmo: number;
  health: number;
  wave: number;
  kills: number;
  isScoped: boolean;
  isReloading: boolean;
  reloadProgress: number;
  targets: Target[];
  lastShot: number;
  pendingShot: boolean;
  lastKill: KillInfo | null;

  setPhase: (p: GamePhase) => void;
  setScoped: (v: boolean) => void;
  addScore: (n: number) => void;
  shoot: () => boolean;
  startReload: () => void;
  finishReload: () => void;
  killTarget: (id: string) => void;
  nextWave: () => void;
  setTargets: (t: Target[]) => void;
  resetGame: () => void;
  triggerShot: () => void;
  clearPendingShot: () => void;
  clearLastKill: () => void;
}

function spawnTargets(wave: number): Target[] {
  const count = 3 + wave * 2;
  const targets: Target[] = [];
  const distances = [40, 60, 80, 100, 120];

  for (let i = 0; i < count; i++) {
    const dist = distances[i % distances.length] + Math.floor(i / distances.length) * 20;
    const spread = 30 + dist * 0.3;
    targets.push({
      id: `target-${wave}-${i}`,
      x: (Math.random() - 0.5) * spread,
      z: -dist,
      distance: dist,
      alive: true,
      speed: 2 + wave * 0.5 + Math.random() * 2,
      direction: Math.random() > 0.5 ? 1 : -1,
      boundsMin: -spread / 2,
      boundsMax: spread / 2,
    });
  }
  return targets;
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: "menu",
  score: 0,
  ammo: 10,
  maxAmmo: 10,
  health: 100,
  wave: 1,
  kills: 0,
  isScoped: false,
  isReloading: false,
  reloadProgress: 0,
  targets: [],
  lastShot: 0,
  pendingShot: false,
  lastKill: null,

  setPhase: (phase) => {
    if (phase === "playing" && get().phase === "menu") {
      const wave = 1;
      set({ phase, targets: spawnTargets(wave), wave, score: 0, kills: 0, ammo: 10, health: 100 });
    } else {
      set({ phase });
    }
  },

  setScoped: (isScoped) => set({ isScoped }),

  addScore: (n) => set((s) => ({ score: s.score + n })),

  shoot: () => {
    const { ammo, isReloading, lastShot } = get();
    const now = Date.now();
    if (ammo <= 0 || isReloading || now - lastShot < 400) return false;
    set((s) => ({ ammo: s.ammo - 1, lastShot: now }));
    return true;
  },

  startReload: () => {
    const { isReloading, ammo, maxAmmo } = get();
    if (isReloading || ammo >= maxAmmo) return;
    set({ isReloading: true, reloadProgress: 0 });
  },

  finishReload: () => set((s) => ({ isReloading: false, ammo: s.maxAmmo, reloadProgress: 0 })),

  killTarget: (id) => {
    const { targets, kills } = get();
    const target = targets.find((t) => t.id === id);
    if (!target || !target.alive) return;

    const dist = target.distance;
    const pts = dist >= 100 ? 300 : dist >= 80 ? 200 : dist >= 60 ? 150 : 100;

    const now = Date.now();
    const newTargets = targets.map((t) =>
      t.id === id ? { ...t, alive: false, killedAt: now } : t
    );
    const newKills = kills + 1;
    set({ targets: newTargets, kills: newKills, lastKill: { pts, dist, id } });
    get().addScore(pts);

    const allDead = newTargets.every((t) => !t.alive);
    if (allDead) {
      setTimeout(() => get().nextWave(), 2000);
    }
  },

  nextWave: () => {
    const wave = get().wave + 1;
    set({ wave, targets: spawnTargets(wave), ammo: 10 });
  },

  setTargets: (targets) => set({ targets }),

  triggerShot: () => set({ pendingShot: true }),
  clearPendingShot: () => set({ pendingShot: false }),
  clearLastKill: () => set({ lastKill: null }),

  resetGame: () =>
    set({
      phase: "menu",
      score: 0,
      ammo: 10,
      maxAmmo: 10,
      health: 100,
      wave: 1,
      kills: 0,
      isScoped: false,
      isReloading: false,
      reloadProgress: 0,
      targets: [],
      lastShot: 0,
      pendingShot: false,
      lastKill: null,
    }),
}));
