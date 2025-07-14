import { EventBus } from "../../EventBus";

export class LoadingScene extends Phaser.Scene {
  constructor() {
    super("loading");
  }

  startLoadingAssets() {
    // Global Assets
    this.load.setPath("assets");
    this.load.setPrefix();

    this.load.image("particle", "particle.png");
    this.load.image("shadow", "shadow.png");

    // Game Scene Assets
    this.load.setPath("assets/scenes/game");
    this.load.setPrefix("scenes.game.");

    this.load.image("background", "background.png");
    this.load.video("background-video", "background.mp4", true);
    this.load.image("logo", "logo.png");
    this.load.image("hp-bar", "hp-bar.png");
    this.load.image("task-background", "task-background.png");
    this.load.image("task-icon", "task-icon.png");
    this.load.image("task-icon-checked", "task-icon-checked.png");

    // Chatacter Assets
    this.load.setPath("assets/characters");
    this.load.setPrefix("characters.");

    this.load.image("frogman", "character-frogman.png");
    this.load.image("king", "character-king.png");
    this.load.image("knight", "character-knight.png");
    this.load.image("medusa", "character-medusa.png");

    this.load.start();
  }

  create() {
    this.load.once(Phaser.Loader.Events.COMPLETE, () => {
      this.scene.start("game");
    });
    EventBus.emit("current-scene-ready", this);
    this.startLoadingAssets();
  }
}
