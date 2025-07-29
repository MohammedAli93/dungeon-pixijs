import { generateButton } from "../../utils/button";

export class ZoneButton {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    key: string,
    blocked = false
  ) {
    this.scene = scene;
    this.container = this.scene.add.container(x, y).setDepth(3);

    const zone = generateButton(this.scene.add.image(0, 0, key));
    this.container.add(zone);

    if (blocked) {
      const blocked = this.scene.add.image(
        0,
        0,
        "scenes.game.zone-button-blocked"
      );
      this.container.add(blocked);
    }
  }
}
