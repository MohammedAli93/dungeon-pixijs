import { AUTO, Game, Types } from "phaser";
import RexUIPlugin from "../lib/rex-plugins/templates/ui/ui-plugin";

// Scenes
import { GameScene } from "./scenes/game/game.scene";
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
  parent: "app",
  backgroundColor: "#028af8",
  scene: [LoadingScene, GameScene],
  transparent: true,
  plugins: {
    scene: [
      {
        key: "rexUI",
        plugin: RexUIPlugin,
        mapping: "rexUI",
      },
    ],
  },
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

StartGame("app");

export default StartGame;
