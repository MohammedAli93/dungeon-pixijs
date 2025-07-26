export function generateButton(
  gameObject: Phaser.GameObjects.GameObject &
    Phaser.GameObjects.Components.Alpha,
  callback?: () => void
) {
  const button = gameObject
    .setAlpha(0.85)
    .setInteractive({ useHandCursor: true })
    .on(Phaser.Input.Events.POINTER_OVER, () => {
      gameObject.scene.tweens.add({
        targets: button,
        props: { scale: 1.1, alpha: 1 },
        duration: 100,
      });
    })
    .on(Phaser.Input.Events.POINTER_OUT, () => {
      const tweens = gameObject.scene.tweens.getTweensOf(gameObject);
      for (let i = 0; i < tweens.length; i++) {
        tweens[i].stop();
        tweens[i].destroy();
      }
      gameObject.scene.tweens.add({
        targets: button,
        props: { scale: 1, alpha: 0.85 },
        duration: 100,
      });
    })
    .on(Phaser.Input.Events.POINTER_DOWN, () => {
      gameObject.scene.tweens.add({
        targets: button,
        props: { scale: 0.9, alpha: 0.5 },
        duration: 100,
        yoyo: true,
        onComplete: () => {
          if (callback) callback();
        },
        onStop: () => {
          if (callback) callback();
        },
      });
    });
  return button;
}
