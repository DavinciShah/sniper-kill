import { useGameStore } from "@/store/gameStore";

export default function MenuScreen() {
  const setPhase = useGameStore((s) => s.setPhase);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(0,100,0,0.3) 50px, rgba(0,100,0,0.3) 51px),
            repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(0,100,0,0.3) 50px, rgba(0,100,0,0.3) 51px)
          `,
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 text-white max-w-md w-full px-8">
        {/* Title */}
        <div className="text-center">
          <div className="text-xs tracking-[0.5em] text-green-500 uppercase mb-2">
            Long Range Precision
          </div>
          <h1 className="text-6xl font-black tracking-tight text-white uppercase">
            SNIPER
          </h1>
          <h2 className="text-4xl font-black tracking-widest text-green-400 uppercase -mt-2">
            ELITE
          </h2>
          <div className="mt-3 w-32 h-0.5 bg-green-500 mx-auto" />
        </div>

        {/* Game info */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 w-full text-sm space-y-2">
          <div className="text-gray-400 font-semibold uppercase tracking-widest text-xs mb-3">
            Mission Briefing
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <span className="text-green-400">▸</span>
            Eliminate all targets to advance waves
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <span className="text-yellow-400">▸</span>
            Longer shots earn more points
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <span className="text-red-400">▸</span>
            10 rounds per magazine — reload wisely
          </div>
        </div>

        {/* Scoring */}
        <div className="grid grid-cols-4 gap-2 w-full text-center text-xs">
          {[
            { label: "40m", pts: "100", color: "text-green-400" },
            { label: "60m", pts: "150", color: "text-yellow-400" },
            { label: "80m", pts: "200", color: "text-orange-400" },
            { label: "100m+", pts: "300", color: "text-red-400" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white/5 border border-white/10 rounded p-2"
            >
              <div className={`text-lg font-bold ${s.color}`}>{s.pts}</div>
              <div className="text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Start button */}
        <button
          onClick={() => setPhase("playing")}
          className="w-full py-4 bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-bold text-lg uppercase tracking-widest rounded-lg transition-all transform hover:scale-105 active:scale-95 border border-green-400"
        >
          Deploy
        </button>

        <div className="text-gray-600 text-xs text-center">
          Use mouse to aim • Left-click to shoot • Right-click to scope
        </div>
      </div>
    </div>
  );
}
