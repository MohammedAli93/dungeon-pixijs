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

    this.load.setPrefix("scenes.game.mushroom-forest.");
    this.load.image(
      "zone-button-mushroom-forest",
      "mushroom-forest/zone-button-mushroom-forest.webp"
    );
    this.load.json("data", "mushroom-forest/mushroom-forest.json");

    this.load.setPrefix("scenes.game.barracks.");
    this.load.image("zone-button-altar", "barracks/zone-button-altar.webp");
    this.load.image(
      "zone-button-barracks",
      "barracks/zone-button-barracks.webp"
    );
    this.load.image(
      "zone-button-mushroom-forest",
      "barracks/zone-button-mushroom-forest.webp"
    );
    this.load.json("data", "barracks/barracks.json");

    // Chatacter Assets
    this.load.setPath("assets/characters");
    this.load.setPrefix("characters.mushroom-forest.");

    this.load.image("frogman", "character-frogman.webp");
    this.load.image("king", "character-king.webp");
    this.load.image("knight", "character-knight.webp");
    this.load.image("medusa", "character-medusa.webp");

    this.load.setPath("assets/scenes/game/barracks");
    this.load.setPrefix("characters.barracks.");
    this.load.image("king", "king.webp");
    this.load.image("knight", "knight.webp");
    this.load.image("medusa", "medusa.webp");

    this.load.start();
  }

  create() {
    this.load.once(Phaser.Loader.Events.COMPLETE, () => {
      this.scene.start("game", { dataKey: "scenes.game.mushroom-forest.data" });
      setTimeout(() => {
        this.scene.start("game", { dataKey: "scenes.game.barracks.data" });
      }, 5000);
    });
    EventBus.emit("current-scene-ready", this);
    this.startLoadingAssets();
  }
}
