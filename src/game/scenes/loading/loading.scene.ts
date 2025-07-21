import { EventBus } from "../../EventBus";

export class LoadingScene extends Phaser.Scene {
  constructor() {
    super("loading");
  }

  startLoadingAssets() {
    // Global Assets
    this.load.setPath("assets");
    this.load.setPrefix();

    this.load.image("particle", "particle.webp");
    this.load.image("shadow", "shadow.webp");

    // Game Scene Assets
    this.load.setPath("assets/scenes/game");
    this.load.setPrefix("scenes.game.");

    this.load.video("background-video", "background.mp4", true);
    this.load.image("logo", "logo.webp");
    this.load.image("hp-bar", "hp-bar.webp");
    this.load.image("task-background", "task-background.webp");
    this.load.image("task-icon", "task-icon.webp");
    this.load.image("task-icon-checked", "task-icon-checked.webp");

    // Chatacter Assets
    this.load.setPath("assets/characters");
    this.load.setPrefix("characters.");

    this.load.image("frogman", "character-frogman.webp");
    this.load.image("king", "character-king.webp");
    this.load.image("knight", "character-knight.webp");
    this.load.image("medusa", "character-medusa.webp");

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
