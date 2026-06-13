import { useGameStore } from "@/store/gameStore";
import MenuScreen from "@/components/game/MenuScreen";
import HUD from "@/components/game/HUD";
import GameOverScreen from "@/components/game/GameOverScreen";
import SniperScene from "@/components/game/SniperScene";
import { useEffect } from "react";

export default function Game() {
  const phase = useGameStore((s) => s.phase);

  useEffect(() => {
    document.title = "Sniper Elite";
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-black relative select-none">
      {/* 3D scene always mounted when playing */}
      {(phase === "playing" || phase === "paused") && (
        <>
          <SniperScene />
          <HUD />
        </>
      )}
      {phase === "menu" && <MenuScreen />}
      {phase === "gameover" && <GameOverScreen />}
    </div>
  );
}
