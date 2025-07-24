export class TasksObject {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private statusText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;

    this.container = this.scene.add.container(x, y);
    this.container.setDepth(3);

    // Status
    this.statusText = this.scene.add.text(10, 10, "Completed").setFontSize(20).setOrigin(0).setFontFamily("Magra-Regular");
    this.container.add(this.statusText);
  }

  addTask(key: string, description: string, completed: boolean) {
    let yOffset = this.statusText.displayHeight + 20;
    if (this.container.list.length > 1) {
      const lastTask = this.container.list[this.container.list.length - 1] as Phaser.GameObjects.Container;
      const lastTaskHeight = lastTask.getBounds().height;
      console.log(lastTaskHeight)
      yOffset = lastTask.y + lastTaskHeight + 5;
    }
    const task = this.scene.add.container(0, yOffset);
    task.setData("key", key);

    // Background
    const background = this.scene.add.image(0, 0, "scenes.game.task-background").setOrigin(0).setAlpha(0.8);
    background.setInteractive({ useHandCursor: true });
    background.on(Phaser.Input.Events.POINTER_OVER, () => {
      this.scene.tweens.add({ targets: background, alpha: 1, duration: 100 });
    });
    background.on(Phaser.Input.Events.POINTER_OUT, () => {
      this.scene.tweens.add({ targets: background, alpha: 0.8, duration: 100 });
    });
    background.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.toggleStatus(key);
    });
    task.add(background);

    // Icon
    const icon = this.scene.add.image(10, background.displayHeight / 2, `scenes.game.task-icon${completed ? "-checked" : ""}`);
    icon.setOrigin(0, 0.5);
    task.add(icon);

    // Description
    const descriptionText = this.scene.add.text(icon.x + icon.displayWidth + 10, 0, description).setOrigin(0, 0.5);
    descriptionText.setColor("#FFFFFF99")
    descriptionText.setFontSize(12);
    descriptionText.setFontFamily("Magra-Regular");
    descriptionText.setY(icon.y);
    descriptionText.setWordWrapWidth(background.displayWidth - icon.displayWidth - 20);
    task.add(descriptionText);

    this.container.add(task);
  }

  toggleStatus(taskKey: string) {
    const task = this.container.list.find((t) => t.getData("key") === taskKey) as Phaser.GameObjects.Container;
    if (task) {
      const icon = task.list[1] as Phaser.GameObjects.Image;
      const isChecked = icon.texture.key.endsWith("checked");
      icon.setTexture(`scenes.game.task-icon${isChecked ? "" : "-checked"}`);
    }
    this.checkIfAllTasksCompleted();
  }

  checkIfAllTasksCompleted() {
    for (const t of this.container.list) {
      if (t.getData("key") == undefined) continue; // Skip the status text container
      const taskContainer = t as Phaser.GameObjects.Container;
      const icon = taskContainer.list[1] as Phaser.GameObjects.Image;
      if (!icon.texture.key.endsWith("checked")) {
        this.statusText.setText("Pending");
        return;
      }
    }
    this.statusText.setText("Completed");
  }
}
