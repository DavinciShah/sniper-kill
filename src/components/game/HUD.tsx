import { useGameStore } from "@/store/gameStore";
import { useRef, useEffect, useState } from "react";

function ScopeOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id="scopeMask">
            <rect width="100" height="100" fill="white" />
            <circle cx="50" cy="50" r="28" fill="black" />
          </mask>
        </defs>
        <rect width="100" height="100" fill="black" mask="url(#scopeMask)" />
        <circle cx="50" cy="50" r="28" fill="none" stroke="#1a3a1a" strokeWidth="1.5" />
        <line x1="22" y1="50" x2="38" y2="50" stroke="#00ff44" strokeWidth="0.3" opacity="0.9" />
        <line x1="62" y1="50" x2="78" y2="50" stroke="#00ff44" strokeWidth="0.3" opacity="0.9" />
        <line x1="50" y1="22" x2="50" y2="38" stroke="#00ff44" strokeWidth="0.3" opacity="0.9" />
        <line x1="50" y1="62" x2="50" y2="78" stroke="#00ff44" strokeWidth="0.3" opacity="0.9" />
        <circle cx="50" cy="50" r="0.4" fill="#00ff44" opacity="0.95" />
        <circle cx="50" cy="44" r="0.3" fill="#00ff44" opacity="0.7" />
        <circle cx="50" cy="56" r="0.3" fill="#00ff44" opacity="0.7" />
        <circle cx="44" cy="50" r="0.3" fill="#00ff44" opacity="0.7" />
        <circle cx="56" cy="50" r="0.3" fill="#00ff44" opacity="0.7" />
        <line x1="36" y1="46" x2="38" y2="46" stroke="#00ff44" strokeWidth="0.2" opacity="0.6" />
        <line x1="36" y1="48" x2="38" y2="48" stroke="#00ff44" strokeWidth="0.2" opacity="0.6" />
        <line x1="36" y1="50" x2="38.5" y2="50" stroke="#00ff44" strokeWidth="0.3" opacity="0.7" />
        <line x1="36" y1="52" x2="38" y2="52" stroke="#00ff44" strokeWidth="0.2" opacity="0.6" />
        <line x1="36" y1="54" x2="38" y2="54" stroke="#00ff44" strokeWidth="0.2" opacity="0.6" />
        <circle cx="50" cy="50" r="27.8" fill="#001a00" opacity="0.15" />
      </svg>
    </div>
  );
}

function Crosshair() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <line x1="12" y1="2" x2="12" y2="9" stroke="white" strokeWidth="1.5" opacity="0.8" />
        <line x1="12" y1="15" x2="12" y2="22" stroke="white" strokeWidth="1.5" opacity="0.8" />
        <line x1="2" y1="12" x2="9" y2="12" stroke="white" strokeWidth="1.5" opacity="0.8" />
        <line x1="15" y1="12" x2="22" y2="12" stroke="white" strokeWidth="1.5" opacity="0.8" />
        <circle cx="12" cy="12" r="1.5" fill="white" opacity="0.9" />
      </svg>
    </div>
  );
}

function AmmoBar() {
  const ammo = useGameStore((s) => s.ammo);
  const maxAmmo = useGameStore((s) => s.maxAmmo);
  const isReloading = useGameStore((s) => s.isReloading);

  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-gray-400 uppercase tracking-widest">Ammo</div>
      <div className="flex gap-1">
        {Array.from({ length: maxAmmo }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-6 rounded-sm border transition-all ${
              i < ammo
                ? "bg-yellow-400 border-yellow-300"
                : "bg-gray-700 border-gray-600 opacity-40"
            }`}
          />
        ))}
      </div>
      {isReloading && (
        <div className="text-yellow-400 text-xs tracking-widest animate-pulse">
          RELOADING...
        </div>
      )}
    </div>
  );
}

function PubgFireButton({ onFire }: { onFire: () => void }) {
  return (
    <button
      data-hud="true"
      onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); onFire(); }}
      className="select-none active:scale-95 transition-transform"
      style={{ touchAction: "none", background: "none", border: "none", padding: 0 }}
    >
      <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer ring */}
        <circle cx="48" cy="48" r="46" fill="#1a0000" stroke="#cc2200" strokeWidth="2.5" />
        {/* Inner gradient fill */}
        <circle cx="48" cy="48" r="40" fill="url(#fireGrad)" />
        {/* Gloss highlight */}
        <ellipse cx="44" cy="32" rx="18" ry="10" fill="white" fillOpacity="0.08" />
        {/* Gun silhouette — side profile */}
        <g transform="translate(18, 30)" fill="white" fillOpacity="0.92">
          {/* barrel */}
          <rect x="30" y="13" width="28" height="5" rx="1.5"/>
          {/* front grip below barrel */}
          <rect x="30" y="18" width="10" height="8" rx="1.5"/>
          {/* body */}
          <rect x="12" y="10" width="22" height="11" rx="2"/>
          {/* trigger guard */}
          <path d="M20 21 Q18 27 22 27 L28 27 L28 21 Z" />
          {/* grip/handle */}
          <rect x="16" y="22" width="10" height="14" rx="2"/>
          {/* stock */}
          <rect x="2" y="12" width="12" height="8" rx="2"/>
          {/* sight */}
          <rect x="26" y="7" width="4" height="4" rx="1"/>
          <rect x="38" y="8" width="3" height="3" rx="0.5"/>
        </g>
        {/* FIRE label */}
        <text x="48" y="80" textAnchor="middle" fill="#ff4422" fontSize="11" fontWeight="800"
          fontFamily="'Arial Black', Arial, sans-serif" letterSpacing="3">FIRE</text>
        <defs>
          <radialGradient id="fireGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#cc1100"/>
            <stop offset="100%" stopColor="#550000"/>
          </radialGradient>
        </defs>
      </svg>
    </button>
  );
}

function BottomControls({ isTouch }: { isTouch: boolean }) {
  const triggerShot = useGameStore((s) => s.triggerShot);
  const isScoped = useGameStore((s) => s.isScoped);
  const setScoped = useGameStore((s) => s.setScoped);
  const startReload = useGameStore((s) => s.startReload);
  const isReloading = useGameStore((s) => s.isReloading);
  const ammo = useGameStore((s) => s.ammo);

  return (
    <div
      data-hud="true"
      className="absolute bottom-6 right-4 flex flex-col items-end gap-3 z-40"
    >
      {/* Reload — touch only, only when ammo critically low (≤3) or empty */}
      {isTouch && ammo <= 3 && !isReloading && (
        <button
          data-hud="true"
          onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); startReload(); }}
          className="select-none active:scale-95 transition-transform"
          style={{ touchAction: "none", background: "none", border: "none", padding: 0 }}
        >
          <svg width="72" height="36" viewBox="0 0 72 36" fill="none">
            <rect width="72" height="36" rx="8" fill="#b8860b" fillOpacity="0.9" stroke="#ffd700" strokeWidth="1.5"/>
            <text x="36" y="14" textAnchor="middle" fill="white" fontSize="9" fontWeight="700"
              fontFamily="Arial, sans-serif" letterSpacing="1.5">RELOAD</text>
            <text x="36" y="27" textAnchor="middle" fill="#ffd700" fontSize="11" fontWeight="800"
              fontFamily="'Arial Black', Arial, sans-serif">↺</text>
          </svg>
        </button>
      )}
      {isTouch && isReloading && (
        <div className="text-yellow-400 text-xs font-bold tracking-widest animate-pulse pointer-events-none">
          RELOADING...
        </div>
      )}

      <div className="flex gap-4 items-end">
        {/* Scope button — visible on ALL devices */}
        <button
          data-hud="true"
          onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); setScoped(!isScoped); }}
          onClick={() => setScoped(!isScoped)}
          className="select-none active:scale-95 transition-transform"
          style={{ touchAction: "none", background: "none", border: "none", padding: 0 }}
        >
          <svg width={isTouch ? 72 : 62} height={isTouch ? 72 : 62} viewBox="0 0 72 72" fill="none">
            <circle cx="36" cy="36" r="34" fill={isScoped ? "url(#scopeOn)" : "url(#scopeOff)"} stroke={isScoped ? "#00e060" : "#444"} strokeWidth="2"/>
            <ellipse cx="32" cy="26" rx="14" ry="7" fill="white" fillOpacity="0.07"/>
            {/* scope / binocular icon */}
            <circle cx="25" cy="38" r="9" fill="none" stroke={isScoped ? "#00ff88" : "#aaa"} strokeWidth="2.5"/>
            <circle cx="47" cy="38" r="9" fill="none" stroke={isScoped ? "#00ff88" : "#aaa"} strokeWidth="2.5"/>
            <rect x="30" y="36" width="12" height="4" rx="2" fill={isScoped ? "#00ff88" : "#aaa"}/>
            <line x1="25" y1="34" x2="25" y2="42" stroke={isScoped ? "#00ff88" : "#666"} strokeWidth="1.2"/>
            <line x1="21" y1="38" x2="29" y2="38" stroke={isScoped ? "#00ff88" : "#666"} strokeWidth="1.2"/>
            <line x1="47" y1="34" x2="47" y2="42" stroke={isScoped ? "#00ff88" : "#666"} strokeWidth="1.2"/>
            <line x1="43" y1="38" x2="51" y2="38" stroke={isScoped ? "#00ff88" : "#666"} strokeWidth="1.2"/>
            <text x="36" y="62" textAnchor="middle" fill={isScoped ? "#00ff88" : "#888"} fontSize="9" fontWeight="700"
              fontFamily="Arial, sans-serif" letterSpacing="1">{isScoped ? "8x ON" : "SCOPE"}</text>
            <defs>
              <radialGradient id="scopeOn" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#004422"/>
                <stop offset="100%" stopColor="#001a0d"/>
              </radialGradient>
              <radialGradient id="scopeOff" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#1a1a1a"/>
                <stop offset="100%" stopColor="#0a0a0a"/>
              </radialGradient>
            </defs>
          </svg>
        </button>

        {/* PUBG Fire button — touch only */}
        {isTouch && <PubgFireButton onFire={triggerShot} />}
      </div>

      {/* Desktop hint */}
      {!isTouch && (
        <div className="text-gray-500 text-xs text-right space-y-0.5 pointer-events-none mt-1">
          <div><span className="text-white/60">LMB</span> Shoot · <span className="text-white/60">R</span> Reload</div>
        </div>
      )}
    </div>
  );
}

function MuzzleFlash() {
  const lastShot = useGameStore((s) => s.lastShot);
  const [opacity, setOpacity] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!lastShot) return;
    setOpacity(1);
    const start = performance.now();
    const animate = (now: number) => {
      const t = Math.min((now - start) / 90, 1);
      setOpacity(1 - t);
      if (t < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [lastShot]);

  if (opacity <= 0) return null;
  return (
    <div
      className="absolute inset-0 pointer-events-none z-25"
      style={{ opacity }}
    >
      <div className="absolute inset-0 bg-white" style={{ opacity: opacity * 0.18 }} />
      <div
        className="absolute"
        style={{
          left: "50%", top: "50%",
          transform: "translate(-50%,-50%)",
          width: 80, height: 80,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,240,180,0.9) 0%, transparent 70%)",
          opacity: opacity * 0.7,
        }}
      />
    </div>
  );
}

function KillPopup() {
  const lastKill = useGameStore((s) => s.lastKill);
  const clearLastKill = useGameStore((s) => s.clearLastKill);
  const [visible, setVisible] = useState(false);
  const [info, setInfo] = useState<{ pts: number; dist: number } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!lastKill) return;
    setInfo({ pts: lastKill.pts, dist: lastKill.dist });
    setVisible(true);
    clearLastKill();
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 1800);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [lastKill, clearLastKill]);

  if (!visible || !info) return null;

  const isHeadshot = info.dist >= 100;
  return (
    <div
      className="absolute left-1/2 pointer-events-none z-35"
      style={{
        top: "42%",
        transform: "translateX(-50%)",
        animation: "killpop 1.8s ease-out forwards",
      }}
    >
      <style>{`
        @keyframes killpop {
          0%   { opacity: 0; transform: translateX(-50%) translateY(0px) scale(0.8); }
          15%  { opacity: 1; transform: translateX(-50%) translateY(-4px) scale(1.05); }
          70%  { opacity: 1; transform: translateX(-50%) translateY(-12px) scale(1); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-24px) scale(0.95); }
        }
      `}</style>
      <div className="flex flex-col items-center gap-0.5">
        {isHeadshot && (
          <div className="text-red-400 text-xs font-black uppercase tracking-widest">
            ☠ LONG SHOT
          </div>
        )}
        <div
          className="font-black text-center"
          style={{
            fontSize: 26,
            color: isHeadshot ? "#ff4422" : "#ffdd00",
            textShadow: "0 0 12px rgba(255,200,0,0.8), 0 2px 4px rgba(0,0,0,0.9)",
            letterSpacing: 1,
          }}
        >
          +{info.pts}
        </div>
        <div className="text-white/70 text-xs font-bold tracking-wider">
          {info.dist}m
        </div>
      </div>
    </div>
  );
}

function WaveAnnouncement() {
  const wave = useGameStore((s) => s.wave);
  const phase = useGameStore((s) => s.phase);
  const [shown, setShown] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (phase !== "playing") return;
    if (wave === shown) return;
    setShown(wave);
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2600);
    return () => clearTimeout(t);
  }, [wave, phase, shown]);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
      <div style={{ animation: "waveIn 2.6s ease-out forwards" }}>
        <style>{`
          @keyframes waveIn {
            0%   { opacity: 0; transform: scale(1.4); }
            20%  { opacity: 1; transform: scale(1.0); }
            70%  { opacity: 1; transform: scale(1.0); }
            100% { opacity: 0; transform: scale(0.9); }
          }
        `}</style>
        <div className="text-center">
          <div
            className="text-white/50 uppercase tracking-[0.4em] text-sm font-bold mb-1"
          >
            — WAVE —
          </div>
          <div
            className="font-black"
            style={{
              fontSize: 72,
              color: "#ffffff",
              textShadow: "0 0 30px rgba(255,100,0,0.8), 0 0 60px rgba(255,50,0,0.4)",
              lineHeight: 1,
              letterSpacing: 4,
            }}
          >
            {wave}
          </div>
          <div className="text-orange-400 text-sm font-bold tracking-widest uppercase mt-2">
            ENGAGE
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HUD() {
  const isScoped = useGameStore((s) => s.isScoped);
  const score = useGameStore((s) => s.score);
  const wave = useGameStore((s) => s.wave);
  const kills = useGameStore((s) => s.kills);
  const targets = useGameStore((s) => s.targets);
  const health = useGameStore((s) => s.health);

  const isTouch = useRef(
    typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0)
  ).current;

  const aliveCount = targets.filter((t) => t.alive).length;
  const healthColor = health > 60 ? "#4ade80" : health > 30 ? "#fbbf24" : "#ef4444";

  return (
    <>
      {isScoped ? <ScopeOverlay /> : <Crosshair />}

      {/* Muzzle flash overlay */}
      <MuzzleFlash />

      {/* Kill score popup */}
      <KillPopup />

      {/* Wave announcement */}
      <WaveAnnouncement />

      {/* Vignette — always on for atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Top HUD bar */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none z-30">
        <div
          className="flex justify-between items-start px-3 pt-3 pb-2"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)" }}
        >
          {/* Score + Wave */}
          <div className="flex flex-col">
            <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Score</div>
            <div className="text-2xl font-black font-mono text-green-400 leading-none" style={{ textShadow: "0 0 10px rgba(74,222,128,0.5)" }}>
              {score.toLocaleString()}
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">
              WAVE <span className="text-orange-400 font-black">{wave}</span>
            </div>
          </div>

          {/* Targets remaining */}
          <div className="flex flex-col items-center">
            <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Targets</div>
            <div className="text-2xl font-black font-mono text-red-400 leading-none">
              {aliveCount}
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">
              KILLS <span className="text-white font-black">{kills}</span>
            </div>
          </div>

          {/* Health bar */}
          <div className="flex flex-col items-end">
            <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Health</div>
            <div
              className="text-2xl font-black font-mono leading-none"
              style={{ color: healthColor, textShadow: `0 0 10px ${healthColor}66` }}
            >
              {health}%
            </div>
            <div className="w-24 h-1.5 bg-gray-800 rounded-full mt-1">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${health}%`, backgroundColor: healthColor }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom HUD bar */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-30"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)", paddingBottom: 4 }}
      >
        {/* Ammo — bottom left */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2">
            <AmmoBar />
          </div>
        </div>
      </div>

      {/* Bottom right: scope + fire */}
      <BottomControls isTouch={isTouch} />

      {/* Desktop pointer lock hint */}
      {!isTouch && (
        <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-12 pointer-events-none z-30">
          <div className="text-white/30 text-sm text-center tracking-wide">Click to capture mouse</div>
        </div>
      )}

      {/* Mobile aim hint */}
      {isTouch && (
        <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-16 pointer-events-none z-30">
          <div className="text-white/25 text-sm text-center">Drag to aim</div>
        </div>
      )}

      {/* 8x scope label */}
      {isScoped && (
        <div className="absolute top-1/2 right-6 -translate-y-1/2 pointer-events-none z-30">
          <div
            className="text-xs font-black font-mono tracking-widest"
            style={{ color: "#00ff88", textShadow: "0 0 8px #00ff88" }}
          >
            8× ZOOM
          </div>
        </div>
      )}
    </>
  );
}
