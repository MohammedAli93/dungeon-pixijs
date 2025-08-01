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
    // Create main UI container
    const mainUI = new PIXI.Sprite(PIXI.Assets.get("scenes.game.top-bar-background"));
    mainUI.y = 0;
    this.scene.container.addChild(mainUI);
    // sizer.addSpace();
    // this.createTooltips()

    // Tooltips group
    const tooltips = this.createTooltips();
    tooltips.x = 750;
    tooltips.y = background.height / 2 - tooltips.height / 2;
    this.scene.container.addChild(tooltips);
    // Avatars group
    const avatars = this.createAvatars();
    avatars.x = tooltips.x + tooltips.width + 10;
    avatars.y = background.height / 2 - avatars.height / 2;
    this.scene.container.addChild(avatars);

    // Buttons group (right-aligned)
    const buttons = new PIXI.Container();
    const btnChat = generateButton(PIXI.Sprite.from("scenes.game.top-bar-button-chat-history"));
    const btnMenu = generateButton(PIXI.Sprite.from("scenes.game.top-bar-button-menu"));
    btnChat.x = 0;
    btnMenu.x = btnChat.width + 30;

    buttons.addChild(btnChat, btnMenu);
    buttons.x = width - buttons.width - 250;
    buttons.y = background.height / 2 - btnChat.height / 2;
    this.scene.container.addChild(buttons);
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

  // private createTooltips() {
  //   // const background = this.scene.add.image(
  //   //   0,
  //   //   0,
  //   //   "scenes.game.top-bar-tooltips-background"
  //   // );
  //   const { width } = this.scene.app.screen;
  //   const background = new PIXI.Sprite(PIXI.Assets.get("scenes.game.top-bar-tooltips-background"));
  //   background.position.set(width / 2, 0);
  //   this.scene.container.addChild(background);

  //   // const sizer = this.scene.rexUI.add.sizer({
  //   //   orientation: "vertical",
  //   //   space: { item: 16, top: 12, bottom: 12, left: 6, right: 6 },
  //   // });

  //   // sizer.addBackground(background);

  //   // sizer.add(
  //   //   generateButton(
  //   //     this.scene.add.image(0, 0, "scenes.game.top-bar-tooltips-mic")
  //   //   )
  //   // );
  //   // sizer.add(
  //   //   generateButton(
  //   //     this.scene.add.image(0, 0, "scenes.game.top-bar-tooltips-audio")
  //   //   )
  //   // );
  //   // sizer.add(
  //   //   generateButton(
  //   //     this.scene.add.image(0, 0, "scenes.game.top-bar-tooltips-video")
  //   //   )
  //   // );

  //   // return sizer;
  // }
private createTooltips(): PIXI.Container {
    const container = new PIXI.Container();

    const background = PIXI.Sprite.from("scenes.game.top-bar-tooltips-background");
    container.addChild(background);

    const mic = generateButton(PIXI.Sprite.from("scenes.game.top-bar-tooltips-mic"));
    const audio = generateButton(PIXI.Sprite.from("scenes.game.top-bar-tooltips-audio"));
    const video = generateButton(PIXI.Sprite.from("scenes.game.top-bar-tooltips-video"));

    const spacing = 16;
    mic.y = 12;
    audio.y = mic.y + mic.height + spacing;
    video.y = audio.y + audio.height + spacing;

    container.addChild(mic, audio, video);
    background.width = Math.max(mic.width, audio.width, video.width) + 12;
    background.height = video.y + video.height + 12;

    return container;
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
  private createAvatars(): PIXI.Container {
    const container = new PIXI.Container();

    const avatar1 = PIXI.Sprite.from("scenes.game.top-bar-avatar-01");
    const avatar2 = PIXI.Sprite.from("scenes.game.top-bar-avatar-02");
    const avatar3 = PIXI.Sprite.from("scenes.game.top-bar-avatar-03");

    const spacing = 12;

    avatar1.x = 0;
    avatar2.x = avatar1.x + avatar1.width + spacing;
    avatar3.x = avatar2.x + avatar2.width + spacing;

    container.addChild(avatar1, avatar2, avatar3);
    return container;
  }
}
