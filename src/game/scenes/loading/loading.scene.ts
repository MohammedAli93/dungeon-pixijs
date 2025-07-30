import * as PIXI from "pixi.js";
import { SceneBase } from "../../core/scene-manager";

export class LoadingScene extends SceneBase {
  private fullLoaded = {
    once: false,
    assetsLoaded: false,
  };

  async startLoadingAssets() {
    // Global Assets
    this.setLoadPath("assets");
    this.setLoadPrefix();

    await this.loadAsset("particle", "particle.webp");
    await this.loadAsset("shadow", "shadow.webp");

    // Game Scene Assets
    this.setLoadPath("assets/scenes/game");
    this.setLoadPrefix("scenes.game.");

    // await this.load.video("background-video", "background3.webm", true);
    await this.loadAsset("hp-bar", "hp-bar.webp");
    await this.loadAsset("task-background", "task-background.webp");
    await this.loadAsset("task-icon", "task-icon.webp");
    await this.loadAsset("task-icon-checked", "task-icon-checked.webp");
    await this.loadAsset("zone-button-blocked", "zone-button-blocked.webp");
    await this.loadAsset("top-bar-avatar-01", "top-bar-avatar-01.webp");
    await this.loadAsset("top-bar-avatar-02", "top-bar-avatar-02.webp");
    await this.loadAsset("top-bar-avatar-03", "top-bar-avatar-03.webp");
    await this.loadAsset("top-bar-background", "top-bar-background.webp");
    await this.loadAsset("top-bar-button-chat-history", "top-bar-button-chat-history.webp");
    await this.loadAsset("top-bar-button-menu", "top-bar-button-menu.webp");
    await this.loadAsset("top-bar-tooltips-audio", "top-bar-tooltips-audio.webp");
    await this.loadAsset("top-bar-tooltips-background", "top-bar-tooltips-background.webp");
    await this.loadAsset("top-bar-tooltips-mic", "top-bar-tooltips-mic.webp");
    await this.loadAsset("top-bar-tooltips-video", "top-bar-tooltips-video.webp");
    await this.loadAsset("hold-to-talk", "hold-to-talk.webp");
    await this.loadAsset("text-to-game-master-background", "text-to-game-master-background.webp");
    await this.loadAsset("bottom-background", "bottom-background.webp");

    // Dmitri
    this.setLoadPrefix("scenes.game.dmitri.");
    await this.loadAsset("zone-button-altar", "dmitri/zone-button-altar.webp");
    await this.loadAsset(
      "zone-button-dmitri",
      "dmitri/zone-button-dmitri.webp"
    );
    await this.loadAsset(
      "zone-button-mushroom-forest",
      "dmitri/zone-button-mushroom-forest.webp"
    );
    // await this.load.audio("dialogue", "dmitri/dialogue.m4a");
    await this.loadAsset("data", "dmitri/dmitri.json");

    // Chatacter Assets
    this.setLoadPath("assets/characters");
    this.setLoadPrefix("characters.mushroom-forest.");

    await this.loadAsset("frogman", "character-frogman.webp");
    await this.loadAsset("king", "character-king.webp");
    await this.loadAsset("knight", "character-knight.webp");
    await this.loadAsset("medusa", "character-medusa.webp");

    await this.setLoadPath("assets/scenes/game/dmitri");
    await this.setLoadPrefix("characters.dmitri.");
    await this.loadAsset("king", "king.webp");
    await this.loadAsset("knight", "knight.webp");
    await this.loadAsset("medusa", "medusa.webp");
    // // Global Assets
    // this.setLoadPath("assets");
    // this.setLoadPrefix();

    // await this.loadAsset("particle", "particle.webp");
    // await this.loadAsset("shadow", "shadow.webp");

    // // Game Scene Assets
    // this.setLoadPath("assets/scenes/game");
    // this.setLoadPrefix("scenes.game.");

    // await this.loadAsset("hp-bar", "hp-bar.webp");
    // await this.loadAsset("task-background", "task-background.webp");
    // await this.loadAsset("task-icon", "task-icon.webp");
    // await this.loadAsset("task-icon-checked", "task-icon-checked.webp");
    // await this.loadAsset("zone-button-blocked", "zone-button-blocked.webp");
    // await this.loadAsset("mic-background", "mic-background.webp"); // TODO: Remove
    // await this.loadAsset("top-bar-avatar-01", "top-bar-avatar-01.webp");
    // await this.loadAsset("top-bar-avatar-02", "top-bar-avatar-02.webp");
    // await this.loadAsset("top-bar-avatar-03", "top-bar-avatar-03.webp");
    // await this.loadAsset("top-bar-background", "top-bar-background.webp");
    // await this.loadAsset(
    //   "top-bar-button-chat-history",
    //   "top-bar-button-chat-history.webp"
    // );
    // await this.loadAsset("top-bar-button-menu", "top-bar-button-menu.webp");
    // await this.loadAsset(
    //   "top-bar-tooltips-audio",
    //   "top-bar-tooltips-audio.webp"
    // );
    // await this.loadAsset(
    //   "top-bar-tooltips-background",
    //   "top-bar-tooltips-background.webp"
    // );
    // await this.loadAsset("top-bar-tooltips-mic", "top-bar-tooltips-mic.webp");
    // await this.loadAsset(
    //   "top-bar-tooltips-video",
    //   "top-bar-tooltips-video.webp"
    // );
    // await this.loadAsset("hold-to-talk", "hold-to-talk.webp");
    // await this.loadAsset(
    //   "text-to-game-master-background",
    //   "text-to-game-master-background.webp"
    // );

    // // Mushroom Forest
    // this.setLoadPrefix("scenes.game.mushroom-forest.");
    // await this.loadAsset(
    //   "zone-button-mushroom-forest",
    //   "mushroom-forest/zone-button-mushroom-forest.webp"
    // );
    // await this.loadAsset("data", "mushroom-forest/mushroom-forest.json");

    // // Dmitri
    // this.setLoadPrefix("scenes.game.dmitri.");
    // await this.loadAsset("zone-button-altar", "dmitri/zone-button-altar.webp");
    // await this.loadAsset(
    //   "zone-button-dmitri",
    //   "dmitri/zone-button-dmitri.webp"
    // );
    // await this.loadAsset(
    //   "zone-button-mushroom-forest",
    //   "dmitri/zone-button-mushroom-forest.webp"
    // );
    // // await this.loadAsset("dialogue", "dmitri/dialogue.m4a");
    // await this.loadAsset("data", "dmitri/dmitri.json");

    // // Chatacter Assets
    // this.setLoadPath("assets/characters");
    // this.setLoadPrefix("characters.mushroom-forest.");

    // await this.loadAsset("frogman", "character-frogman.webp");
    // await this.loadAsset("king", "character-king.webp");
    // await this.loadAsset("knight", "character-knight.webp");
    // await this.loadAsset("medusa", "character-medusa.webp");

    // this.setLoadPath("assets/scenes/game/dmitri");

    // this.setLoadPrefix("characters.dmitri.");
    // await this.loadAsset("king", "king.webp");
    // await this.loadAsset("knight", "knight.webp");
    // await this.loadAsset("medusa", "medusa.webp");

    this.fullLoaded.assetsLoaded = true;
  }

  async onCreate() {
    await this.startLoadingAssets();
    console.log("Loading assets", PIXI.Assets.get("particle"));
    // this.manager.gotoScene("game");
    // const { width, height } = this.scale;

    // this.load.once(Phaser.Loader.Events.COMPLETE, () => {
    //
    //   // Dev purpose.
    //   if (import.meta.env.DEV) {
    //     this.fullLoaded.loadingAds = true;
    //     this.scene.start("game", { dataKey: "scenes.game.dmitri.data" });
    //     // setTimeout(() => {
    //     //   this.scene.start("game", { dataKey: "scenes.game.mushroom-forest.data" });
    //     // }, 5000);
    //   }
    // });
  }

  onUpdate() {
    if (!this.fullLoaded.once && this.fullLoaded.assetsLoaded) {
      this.fullLoaded.once = true;
      // this.scene.start("game", { dataKey: "scenes.game.dmitri.data" });
      this.manager.gotoScene("game", { dataKey: "scenes.game.dmitri.data" });
    }
  }
}
