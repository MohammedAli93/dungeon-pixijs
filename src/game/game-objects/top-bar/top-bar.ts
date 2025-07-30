import * as PIXI from "pixi.js";
import { SceneBase } from "../../core/scene-manager";
import { generateButton } from "../../utils/button";

export class TopBarGameObject {
  private scene: SceneBase;

  constructor(scene: SceneBase) {
    this.scene = scene;
    const { width } = scene.app.screen;

    // const background = this.scene.add.image(
    //   0,
    //   0,
    //   "scenes.game.top-bar-background"
    // );
    const background = new PIXI.Sprite(PIXI.Assets.get("scenes.game.top-bar-background"));
    this.scene.container.addChild(background);
    // const sizer = this.scene.rexUI.add.sizer({
    //   width,
    //   height: background.displayHeight,
    //   origin: 0,
    //   space: { item: 6 },
    // });
    // sizer.addBackground(background);

    // sizer.addSpace();
    this.createTooltips()
    // sizer.add(this.createTooltips());
    // sizer.add(this.createAvatars());
    // sizer.addSpace();

    // sizer.layout();

    // const sizerButtons = this.scene.rexUI.add.sizer({
    //   width,
    //   height: background.displayHeight,
    //   origin: 0,
    //   space: { item: 30, right: 250 },
    // });

    // sizerButtons.addSpace();
    // sizerButtons.add(generateButton(this.scene.add.image(0, 0, "scenes.game.top-bar-button-chat-history")));
    // sizerButtons.add(generateButton(this.scene.add.image(0, 0, "scenes.game.top-bar-button-menu")));

    // sizerButtons.layout();
  }

  private createTooltips() {
    // const background = this.scene.add.image(
    //   0,
    //   0,
    //   "scenes.game.top-bar-tooltips-background"
    // );
    const { width } = this.scene.app.screen;
    const background = new PIXI.Sprite(PIXI.Assets.get("scenes.game.top-bar-tooltips-background"));
    background.position.set(width / 2, 0);
    this.scene.container.addChild(background);

    // const sizer = this.scene.rexUI.add.sizer({
    //   orientation: "vertical",
    //   space: { item: 16, top: 12, bottom: 12, left: 6, right: 6 },
    // });

    // sizer.addBackground(background);

    // sizer.add(
    //   generateButton(
    //     this.scene.add.image(0, 0, "scenes.game.top-bar-tooltips-mic")
    //   )
    // );
    // sizer.add(
    //   generateButton(
    //     this.scene.add.image(0, 0, "scenes.game.top-bar-tooltips-audio")
    //   )
    // );
    // sizer.add(
    //   generateButton(
    //     this.scene.add.image(0, 0, "scenes.game.top-bar-tooltips-video")
    //   )
    // );

    // return sizer;
  }

  // private createAvatars() {
  //   const sizer = this.scene.rexUI.add.sizer({
  //     orientation: "horizontal",
  //     space: { item: 12 },
  //   });

  //   sizer.add(this.scene.add.image(0, 0, "scenes.game.top-bar-avatar-01"));
  //   sizer.add(this.scene.add.image(0, 0, "scenes.game.top-bar-avatar-02"));
  //   sizer.add(this.scene.add.image(0, 0, "scenes.game.top-bar-avatar-03"));

  //   return sizer;
  // }
}
