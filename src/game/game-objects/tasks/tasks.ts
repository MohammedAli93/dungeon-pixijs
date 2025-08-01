import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { SceneBase } from "../../core/scene-manager";
import { getTextureKey } from "../../utils/textures";

export class TasksObject {
  private scene: SceneBase;
  private container: PIXI.Container;
  private statusText: PIXI.Text;

  constructor(scene: SceneBase, x: number, y: number) {
    this.scene = scene;

    this.container = new PIXI.Container({ x, y });
    this.container.zIndex = 3;
    this.scene.container.addChild(this.container);

    // Status
    this.statusText = new PIXI.Text({
      x: 10,
      y: 10,
      text: "Completed",
      style: {
        fontSize: 20,
        fontFamily: "Magra-Regular",
        fill: 0xffffff,
      },
      anchor: {
        x: 0,
        y: 1,
      },
    });
    this.container.addChild(this.statusText);
  }

  addTask(key: string, description: string, completed: boolean) {
    let yOffset = this.statusText.height + 20;
    if (this.container.children.length > 1) {
      const lastTask = this.container.children[this.container.children.length - 1] as PIXI.Container;
      const lastTaskHeight = lastTask.getBounds().height;
      console.log(lastTaskHeight)
      yOffset = lastTask.y + lastTaskHeight + 5;
    }
    const task = new PIXI.Container({ x: 0, y: yOffset });
    // task.setData("key", key);
    // @ts-ignore Refactor this.
    task.customData = { key };

    // Background
    const background = new PIXI.Sprite(PIXI.Assets.get("scenes.game.task-background"));
    background.anchor.set(0, 0.5);
    background.alpha = 0.8;
    background.interactive = true;
    background.cursor = "pointer";
    background.on("pointerover", () => {
      gsap.to(background, {
        duration: 0.1,
        pixi: {
          alpha: 1,
        },
      });
    });
    background.on("pointerout", () => {
      gsap.to(background, {
        duration: 0.1,
        pixi: {
          alpha: 0.8,
        },
      });
    });
    background.on("pointerdown", () => {
      this.toggleStatus(key);
    });
    task.addChild(background);

    // Icon
    const icon = new PIXI.Sprite(PIXI.Assets.get(`scenes.game.task-icon${completed ? "-checked" : ""}`));
    icon.position.x = icon.width / 4;
    icon.anchor.set(0, 0.5);
    icon.eventMode = "none";
    task.addChild(icon);

    // Description
    const descriptionText = new PIXI.Text({
      x: icon.x + icon.width + 10,
      y: icon.y,
      text: description,
      style: {
        wordWrap: true,
        wordWrapWidth: background.width - icon.width - 20,
        fontSize: 12,
        fontFamily: "Magra-Regular",
        fill: "#FFFFFF99",
      },
      anchor: {
        x: 0,
        y: 0.5,
      },
    });
    descriptionText.eventMode = "none";
    task.addChild(descriptionText);

    this.container.addChild(task);
  }

  toggleStatus(taskKey: string) {
    const task = this.container.children.find((t) => {
      // @ts-ignore Refactor this.
      const customData = t.customData;
      if (customData == undefined) return false;
      return customData.key === taskKey
    }) as PIXI.Container;
    if (task) {
      const icon = task.children[1] as PIXI.Sprite;
      const isChecked = getTextureKey(icon.texture).endsWith("checked");
      icon.texture = PIXI.Assets.get(`scenes.game.task-icon${isChecked ? "" : "-checked"}`);
    }
    this.checkIfAllTasksCompleted();
  }

  checkIfAllTasksCompleted() {
    for (const t of this.container.children) {
      // @ts-ignore Refactor this.
      const customData = t.customData;
      if (!customData || customData.key == undefined) continue; // Skip the status text container
      const taskContainer = t as PIXI.Container;
      const icon = taskContainer.children[1] as PIXI.Sprite;
      if (!getTextureKey(icon.texture).endsWith("checked")) {
        this.statusText.text = "Pending";
        return;
      }
    }
    this.statusText.text = "Completed";
  }
}
