import { EventBus } from "../../EventBus";
import { Character } from "../../game-objects/character/character";
import { TasksObject } from "./objects/tasks";

const POOL_COLORS = [
  0xFF876C,
  0xF8FF6C,
  0xBE6CFF,
];

export class GameScene extends Phaser.Scene {
  private initialPos = [
    { x: 650, y: 1000 },
    { x: 1000, y: 950 },
    { x: 1400, y: 1000 },
    { x: 1700, y: 875 },
  ];
  private charData = [
    { key: "frogman", name: "Frogman", role: "Rogue · Poisoner" },
    { key: "king", name: "King", role: "Leader · Warrior" },
    { key: "knight", name: "Knight", role: "Swordman · Holy" },
    { key: "medusa", name: "Medusa", role: "Gorgon · Wizard" },
  ];
  debugText: Phaser.GameObjects.Text;

  constructor() {
    super("game");
  }

  create() {
    const { width, height } = this.scale;
    const VIDEO_WIDTH = 3840;
    const VIDEO_HEIGHT = 2160;

    // Background
    // const background = this.add.image(
    //   width / 2,
    //   height / 2,
    //   "scenes.game.background"
    // );
    // background.setScale(
    //   Math.max(width / background.width, height / background.height)
    // );

    const video = this.add.video(
      width / 2,
      height / 2,
      "scenes.game.background-video"
    );
    video.setScale(Math.max(width / VIDEO_WIDTH, height / VIDEO_HEIGHT));
    video.play(true);

    // Characters
    new Character(
      this,
      this.initialPos[0].x,
      this.initialPos[0].y,
      this.charData[0],
      { color: POOL_COLORS[0] }
    );
    const king = new Character(this, this.initialPos[1].x, this.initialPos[1].y, this.charData[1], { color: POOL_COLORS[0] });
    king.avatar.setOrigin(0.59, 1);
    const knight = new Character(
      this,
      this.initialPos[2].x,
      this.initialPos[2].y,
      this.charData[2],
      { color: POOL_COLORS[2] }
    );
    knight.avatar.setOrigin(0.63, 1);
    new Character(
      this,
      this.initialPos[3].x,
      this.initialPos[3].y,
      this.charData[3],
      { color: POOL_COLORS[0] }
    );

    // Header
    const header = this.add
      .text(width / 2, 100, "")
      .setFontSize(20)
      .setOrigin(0.5, 0)
      .setFontStyle("bold")
      .setFontFamily("Magra-Regular")
      .setScrollFactor(0)
      .setDepth(Infinity);
    header.setText([
      "Ah, Barron, your wit serves you well! In this moment of clarity, you discern a hidden pathway",
      "behind a tapestry, leading deeper into the priory's mystery. What will you do now?",
    ]);

    // Logo
    const logo = this.add
      .image(width / 5, height - 200, "scenes.game.logo")
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_OVER, () =>
        this.tweens.add({ targets: logo, scale: 1.1, duration: 100 })
      )
      .on(Phaser.Input.Events.POINTER_OUT, () =>
        this.tweens.add({ targets: logo, scale: 1, duration: 100 })
      );

    // Tasks
    const tasksObject = new TasksObject(this, width - 350, height - 150);
    tasksObject.addTask(
      "tavern",
      "Interrogate townsfolk in the tavern for where Mira was last seen",
      false
    );
    tasksObject.addTask(
      "altar",
      "Get through the field of mushrooms to reach the Sprite Altar",
      true
    );
    tasksObject.checkIfAllTasksCompleted();

    this.debugText = this.add
      .text(10, 10, "")
      .setFontSize(48)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(Infinity);

    EventBus.emit("current-scene-ready", this);
  }

  update(time: number, delta: number): void {
    // this.debugText.setText(`FPS: ${this.game.loop.actualFps}`);
  }
}
