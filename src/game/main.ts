import { SceneManager } from "./core/scene-manager";
import { GameScene } from "./scenes/game/game.scene";
import { LoadingScene } from "./scenes/loading/loading.scene";

const StartGame = (parent: string) => {
  // return new SceneManager(window, document.body);
  const manager = new SceneManager({
    parent,
    width: 1920,
    height: 1080,
    scenes: {
      loading: LoadingScene,
      game: GameScene,
    },
  });
  return manager;
};

export default StartGame;
