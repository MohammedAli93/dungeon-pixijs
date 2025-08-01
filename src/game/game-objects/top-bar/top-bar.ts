import * as PIXI from "pixi.js";
import { SceneBase } from "../../core/scene-manager";
import { generateButton } from "../../utils/button";

export class TopBarGameObject {
  private scene: SceneBase;

  constructor(scene: SceneBase) {
    this.scene = scene;
    const { width } = scene.app.screen;

    const background = new PIXI.Sprite(
      PIXI.Assets.get("scenes.game.top-bar-background")
    );
    this.scene.container.addChild(background);

    // Create DM
    const dm = new PIXI.Sprite(PIXI.Assets.get("scenes.game.top-bar-dm"));
    dm.position.set(width / 5, background.height / 2 - dm.height / 2);
    dm.anchor.set(0.5, 0);
    this.scene.container.addChild(dm);

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
    const btnChat = generateButton(
      PIXI.Sprite.from("scenes.game.top-bar-button-chat-history")
    );
    const btnMenu = generateButton(
      PIXI.Sprite.from("scenes.game.top-bar-button-menu")
    );
    btnChat.x = 0;
    btnMenu.x = btnChat.width + 30;

    buttons.addChild(btnChat, btnMenu);
    buttons.x = width - buttons.width - 250;
    buttons.y = background.height / 2 - btnChat.height / 2;
    this.scene.container.addChild(buttons);
  }

  private createTooltips(): PIXI.Container {
    const container = new PIXI.Container();

    const background = PIXI.Sprite.from(
      "scenes.game.top-bar-tooltips-background"
    );
    container.addChild(background);

    const mic = generateButton(
      PIXI.Sprite.from("scenes.game.top-bar-tooltips-mic")
    );
    const audio = generateButton(
      PIXI.Sprite.from("scenes.game.top-bar-tooltips-audio")
    );
    const video = generateButton(
      PIXI.Sprite.from("scenes.game.top-bar-tooltips-video")
    );

    const spacing = 16;
    mic.y = 12;
    audio.y = mic.y + mic.height + spacing;
    video.y = audio.y + audio.height + spacing;

    container.addChild(mic, audio, video);
    background.width = Math.max(mic.width, audio.width, video.width) + 12;
    background.height = video.y + video.height + 12;
    mic.anchor.set(0.5, 0.0);
    audio.anchor.set(0.5, 0.0);
    video.anchor.set(0.5, 0.0);
    background.anchor.set(0.5, 0.0);

    return container;
  }

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
