import * as PIXI from "pixi.js";
import { SceneBase } from "../../core/scene-manager";
// import { EventBus } from "../../EventBus";

export class LoadingScene extends SceneBase {
  async startLoadingAssets() {
    // Global Assets
    this.setLoadPath("assets");
    this.setLoadPrefix();

    await this.loadAsset("particle", "particle.webp");
    await this.loadAsset("shadow", "shadow.webp");

    // Game Scene Assets
    this.setLoadPath("assets/scenes/game");
    this.setLoadPrefix("scenes.game.");

    await this.loadAsset("background-video", "background3.webm");
    await this.loadAsset("logo", "logo.webp");
    await this.loadAsset("hp-bar", "hp-bar.webp");
    await this.loadAsset("task-background", "task-background.webp");
    await this.loadAsset("task-icon", "task-icon.webp");
    await this.loadAsset("task-icon-checked", "task-icon-checked.webp");

    // Chatacter Assets
    this.setLoadPath("assets/characters");
    this.setLoadPrefix("characters.");

    await this.loadAsset("frogman", "character-frogman.webp");
    await this.loadAsset("king", "character-king.webp");
    await this.loadAsset("knight", "character-knight.webp");
    await this.loadAsset("medusa", "character-medusa.webp");
  }

  async onCreate() {
    // this.load.once(Phaser.Loader.Events.COMPLETE, () => {
    //   this.scene.start("game");
    // });
    // EventBus.emit("current-scene-ready", this);
    await this.startLoadingAssets();
    console.log("Loading assets", PIXI.Assets.get("particle"), PIXI.Assets.get("scenes.game.logo"));
    this.manager.gotoScene("game");
  }
}
