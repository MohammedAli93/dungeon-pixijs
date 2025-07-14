import { GameScene } from "./scenes/game/game.scene";
import { AUTO, Game, Types } from "phaser";
import { LoadingScene } from "./scenes/loading/loading.scene";

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Types.Core.GameConfig = {
  type: AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1920,
    height: 1080,
  },
  parent: "game-container",
  backgroundColor: "#028af8",
  scene: [LoadingScene, GameScene],
  // @ts-expect-error - Phaser doesn't have this property yet on the types.
  fx: {
    glow: {
        distance: 65,
        quality: 0.015,
    }
  }
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;
