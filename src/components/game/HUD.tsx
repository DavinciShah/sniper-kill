import { useGameStore } from "@/store/gameStore";
import { useEffect, useRef } from "react";

function ScopeOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Black mask with circular hole */}
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
        {/* Scope circle */}
        <circle cx="50" cy="50" r="28" fill="none" stroke="#1a3a1a" strokeWidth="1.5" />
        {/* Crosshair - horizontal */}
        <line x1="22" y1="50" x2="38" y2="50" stroke="#00ff44" strokeWidth="0.3" opacity="0.9" />
        <line x1="62" y1="50" x2="78" y2="50" stroke="#00ff44" strokeWidth="0.3" opacity="0.9" />
        {/* Crosshair - vertical */}
        <line x1="50" y1="22" x2="50" y2="38" stroke="#00ff44" strokeWidth="0.3" opacity="0.9" />
        <line x1="50" y1="62" x2="50" y2="78" stroke="#00ff44" strokeWidth="0.3" opacity="0.9" />
        {/* Center dot */}
        <circle cx="50" cy="50" r="0.4" fill="#00ff44" opacity="0.95" />
        {/* Mil dots */}
        <circle cx="50" cy="44" r="0.3" fill="#00ff44" opacity="0.7" />
        <circle cx="50" cy="56" r="0.3" fill="#00ff44" opacity="0.7" />
        <circle cx="44" cy="50" r="0.3" fill="#00ff44" opacity="0.7" />
        <circle cx="56" cy="50" r="0.3" fill="#00ff44" opacity="0.7" />
        {/* Range markings */}
        <line x1="36" y1="46" x2="38" y2="46" stroke="#00ff44" strokeWidth="0.2" opacity="0.6" />
        <line x1="36" y1="48" x2="38" y2="48" stroke="#00ff44" strokeWidth="0.2" opacity="0.6" />
        <line x1="36" y1="50" x2="38.5" y2="50" stroke="#00ff44" strokeWidth="0.3" opacity="0.7" />
        <line x1="36" y1="52" x2="38" y2="52" stroke="#00ff44" strokeWidth="0.2" opacity="0.6" />
        <line x1="36" y1="54" x2="38" y2="54" stroke="#00ff44" strokeWidth="0.2" opacity="0.6" />
        {/* Lens tint */}
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
  const reloadProgress = useGameStore((s) => s.reloadProgress);

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

export default function HUD() {
  const isScoped = useGameStore((s) => s.isScoped);
  const score = useGameStore((s) => s.score);
  const wave = useGameStore((s) => s.wave);
  const kills = useGameStore((s) => s.kills);
  const targets = useGameStore((s) => s.targets);
  const health = useGameStore((s) => s.health);
  const phase = useGameStore((s) => s.phase);

  const aliveCount = targets.filter((t) => t.alive).length;

  return (
    <>
      {isScoped ? <ScopeOverlay /> : <Crosshair />}

      {/* Top HUD */}
      <div className="absolute top-4 left-0 right-0 flex justify-between items-start px-6 pointer-events-none z-30">
        {/* Left: Score & Wave */}
        <div className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2 text-white">
          <div className="text-xs text-gray-400 tracking-widest uppercase">Score</div>
          <div className="text-2xl font-bold font-mono text-green-400">{score.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1">Wave <span className="text-white font-bold">{wave}</span></div>
        </div>

        {/* Center: Target count */}
        <div className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2 text-white text-center">
          <div className="text-xs text-gray-400 tracking-widest uppercase">Targets</div>
          <div className="text-2xl font-bold font-mono text-red-400">{aliveCount}</div>
          <div className="text-xs text-gray-400 mt-1">
            Kills: <span className="text-white font-bold">{kills}</span>
          </div>
        </div>

        {/* Right: Health */}
        <div className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2 text-white text-right">
          <div className="text-xs text-gray-400 tracking-widest uppercase">Health</div>
          <div className="text-2xl font-bold font-mono text-red-400">{health}%</div>
          <div className="w-24 h-1.5 bg-gray-700 rounded-full mt-1 ml-auto">
            <div
              className="h-full rounded-full bg-red-500 transition-all"
              style={{ width: `${health}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom HUD */}
      <div className="absolute bottom-6 left-6 pointer-events-none z-30">
        <div className="bg-black/70 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white">
          <AmmoBar />
        </div>
      </div>

      {/* Bottom right: Controls hint */}
      <div className="absolute bottom-6 right-6 pointer-events-none z-30">
        <div className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 text-gray-400 text-xs space-y-1">
          <div><span className="text-white">LMB</span> — Shoot</div>
          <div><span className="text-white">RMB</span> — Scope</div>
          <div><span className="text-white">R</span> — Reload</div>
        </div>
      </div>

      {/* Lock hint */}
      <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-12 pointer-events-none z-30">
        <div className="text-white/40 text-sm text-center">
          Click to capture mouse
        </div>
      </div>

      {/* Scope label */}
      {isScoped && (
        <div className="absolute top-1/2 right-8 -translate-y-1/2 pointer-events-none z-30">
          <div className="bg-black/50 rounded px-2 py-1 text-green-400 text-xs font-mono">
            8x ZOOM
          </div>
        </div>
      )}
    </>
  );
}
