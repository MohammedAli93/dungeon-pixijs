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

    const zone = this.scene.add
      .image(0, 0, key)
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_OVER, () =>
        this.scene.tweens.add({ targets: this.container, scale: 1.1, duration: 100 })
      )
      .on(Phaser.Input.Events.POINTER_OUT, () =>
        this.scene.tweens.add({ targets: this.container, scale: 1, duration: 100 })
      );
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
