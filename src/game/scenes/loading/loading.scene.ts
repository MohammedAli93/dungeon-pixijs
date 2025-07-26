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

    // this.load.video("background-video", "background3.webm", true);
    this.load.image("hp-bar", "hp-bar.webp");
    this.load.image("task-background", "task-background.webp");
    this.load.image("task-icon", "task-icon.webp");
    this.load.image("task-icon-checked", "task-icon-checked.webp");
    this.load.image("zone-button-blocked", "zone-button-blocked.webp");
    this.load.image("mic", "mic.webp");
    this.load.image("mic-background", "mic-background.webp");
    this.load.image("top-bar-avatar-01", "top-bar-avatar-01.webp");
    this.load.image("top-bar-avatar-02", "top-bar-avatar-02.webp");
    this.load.image("top-bar-avatar-03", "top-bar-avatar-03.webp");
    this.load.image("top-bar-background", "top-bar-background.webp");
    this.load.image("top-bar-button-chat-history", "top-bar-button-chat-history.webp");
    this.load.image("top-bar-button-menu", "top-bar-button-menu.webp");
    this.load.image("top-bar-tooltips-audio", "top-bar-tooltips-audio.webp");
    this.load.image("top-bar-tooltips-background", "top-bar-tooltips-background.webp");
    this.load.image("top-bar-tooltips-mic", "top-bar-tooltips-mic.webp");
    this.load.image("top-bar-tooltips-video", "top-bar-tooltips-video.webp");

    // Mushroom Forest
    this.load.setPrefix("scenes.game.mushroom-forest.");
    this.load.image(
      "zone-button-mushroom-forest",
      "mushroom-forest/zone-button-mushroom-forest.webp"
    );
    this.load.json("data", "mushroom-forest/mushroom-forest.json");

    // Dmitri
    this.load.setPrefix("scenes.game.dmitri.");
    this.load.image("zone-button-altar", "dmitri/zone-button-altar.webp");
    this.load.image(
      "zone-button-dmitri",
      "dmitri/zone-button-dmitri.webp"
    );
    this.load.image(
      "zone-button-mushroom-forest",
      "dmitri/zone-button-mushroom-forest.webp"
    );
    this.load.audio("dialogue", "dmitri/dialogue.m4a");
    this.load.json("data", "dmitri/dmitri.json");

    // Chatacter Assets
    this.load.setPath("assets/characters");
    this.load.setPrefix("characters.mushroom-forest.");

    this.load.image("frogman", "character-frogman.webp");
    this.load.image("king", "character-king.webp");
    this.load.image("knight", "character-knight.webp");
    this.load.image("medusa", "character-medusa.webp");

    this.load.setPath("assets/scenes/game/dmitri");
    this.load.setPrefix("characters.dmitri.");
    this.load.image("king", "king.webp");
    this.load.image("knight", "knight.webp");
    this.load.image("medusa", "medusa.webp");

    this.load.start();
  }

  create() {
    this.load.once(Phaser.Loader.Events.COMPLETE, () => {
      this.scene.start("game", { dataKey: "scenes.game.dmitri.data" });
      // setTimeout(() => {
      //   this.scene.start("game", { dataKey: "scenes.game.mushroom-forest.data" });
      // }, 5000);
    });
    EventBus.emit("current-scene-ready", this);
    this.startLoadingAssets();
  }
}
