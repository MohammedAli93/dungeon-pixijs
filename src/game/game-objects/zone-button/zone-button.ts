import * as PIXI from "pixi.js";
import { SceneBase } from "../../core/scene-manager";
import { generateButton } from "../../utils/button";

export class ZoneButton {
  private scene: SceneBase;
  private container: PIXI.Container;

  constructor(
    scene: SceneBase,
    x: number,
    y: number,
    key: string,
    blocked = false
  ) {
    this.scene = scene;
    this.container = new PIXI.Container({ x, y });
    this.container.zIndex = 3;
    this.scene.container.addChild(this.container);
    // this.container = this.scene.add.container(x, y).setDepth(3);

    const zone = generateButton(new PIXI.Sprite(PIXI.Assets.get(key)));
    zone.anchor.set(0.5);
    this.container.addChild(zone);

    if (blocked) {
      const blocked = new PIXI.Sprite(PIXI.Assets.get("scenes.game.zone-button-blocked"));
      blocked.anchor.set(0.5);
      blocked.eventMode = "none";
      this.container.addChild(blocked);
    }
  }
}
