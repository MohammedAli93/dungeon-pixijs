import { EventBus } from "../../EventBus";
import { Character } from "../../game-objects/character/character";
import { TasksObject } from "./objects/tasks";

const POOL_COLORS = [0xff876c, 0xf8ff6c, 0xbe6cff];

export class GameScene extends Phaser.Scene {
  private fpsSamples: number[] = [];
  private assetLoadTime: number = 0;
  private errorCount: number = 0;
  private warningCount: number = 0;
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
    this.assetLoadTime = performance.now();
    const { width, height } = this.scale;

    const video = this.add.video(
      width / 2,
      height / 2,
      "scenes.game.background-video"
    );
    video.play(true);

    // Characters
    new Character(
      this,
      this.initialPos[0].x,
      this.initialPos[0].y,
      this.charData[0],
      { color: POOL_COLORS[0] }
    );
    const king = new Character(
      this,
      this.initialPos[1].x,
      this.initialPos[1].y,
      this.charData[1],
      { color: POOL_COLORS[1], particlesShapeWidthFactor: 1.25 }
    );
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
      .setFontSize(38)
      .setFontFamily("monospace")
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(Infinity);

    EventBus.emit("current-scene-ready", this);
  }

  update(_time: number, _delta: number): void {
    const fps = this.game.loop.actualFps;
    const frameTime = 1000 / fps;

    // Smooth FPS samples for average
    if (!this.fpsSamples) this.fpsSamples = [];
    this.fpsSamples.push(fps);
    if (this.fpsSamples.length > 60) this.fpsSamples.shift();

    const avgFps = (
      this.fpsSamples.reduce((a, b) => a + b, 0) / this.fpsSamples.length
    ).toFixed(1);

    const droppedFrames = this.fpsSamples.filter((f) => f < 30).length;
    const droppedPercent = (
      (droppedFrames / this.fpsSamples.length) *
      100
    ).toFixed(1);

    const res = `${window.innerWidth}x${window.innerHeight}`;

    // === RAM Info (Chrome only)
    // const hasMemory = "memory" in performance;
    // const usedHeap = hasMemory ? performance.memory.usedJSHeapSize / 1048576 : 0;
    // const heapLimit = hasMemory ? performance.memory.jsHeapSizeLimit / 1048576 : 0;
    // const ramText = hasMemory
    //   ? `RAM: ${usedHeap.toFixed(1)}MB / ${heapLimit.toFixed(1)}MB`
    //   : `RAM: ~450MB used`;

    const assetLoadTime = this.assetLoadTime
      ? `${(this.assetLoadTime - performance.timing.navigationStart).toFixed(
          0
        )}ms`
      : "~1200ms";

    const errors = this.errorCount || 0;
    const warnings = this.warningCount || 0;

    const debugInfo = [
      `[DEBUG MENU]`,
      `FPS: ${fps.toFixed(1)} (average: ${avgFps})`,
      `Frame Time: ${frameTime.toFixed(1)}ms`,
      // `${ramText}`,
      `Dropped Frames: ${droppedPercent}%`,
      `Resolution: ${res}`,
      `Asset Load Time: ${assetLoadTime}`,
      `Errors: ${errors} / Warnings: ${warnings}`,
    ].join("\n");

    this.debugText.setText(debugInfo);
  }
}
