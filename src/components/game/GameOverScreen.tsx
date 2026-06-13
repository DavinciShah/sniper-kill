import { useGameStore } from "@/store/gameStore";

export default function GameOverScreen() {
  const score = useGameStore((s) => s.score);
  const kills = useGameStore((s) => s.kills);
  const wave = useGameStore((s) => s.wave);
  const resetGame = useGameStore((s) => s.resetGame);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-50">
      <div className="flex flex-col items-center gap-6 text-white max-w-sm w-full px-8">
        <div className="text-center">
          <div className="text-red-500 text-xs tracking-[0.5em] uppercase mb-2">Mission Failed</div>
          <h1 className="text-5xl font-black text-red-400 uppercase">Game Over</h1>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-5 w-full space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Final Score</span>
            <span className="text-green-400 font-bold font-mono text-xl">{score.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Kills</span>
            <span className="text-white font-bold">{kills}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Wave Reached</span>
            <span className="text-white font-bold">{wave}</span>
          </div>
        </div>

        <button
          onClick={resetGame}
          className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold uppercase tracking-widest rounded-lg transition-all"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
