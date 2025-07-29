import * as PIXI from "pixi.js";
// import { EventBus } from "../../EventBus";
import { SceneBase } from "../../core/scene-manager";
import { Character } from "../../game-objects/character/character";
import { TasksObject } from "./objects/tasks";

const POOL_COLORS = [0xff876c, 0xf8ff6c, 0xbe6cff];

export class GameScene extends SceneBase {
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
  debugText: PIXI.Text;
  videoBG: PIXI.Sprite;

  async onCreate() {
    this.assetLoadTime = performance.now();
    const { width, height } = this.app.screen;
    // const VIDEO_WIDTH = 1067;
    // const VIDEO_HEIGHT = 600;

    this.videoBG = new PIXI.Sprite(PIXI.Assets.get("scenes.game.background-video"));
    this.videoBG.position.set(width / 2, height / 2);
    this.videoBG.anchor.set(0.5);
    // this.videoBG.setScale(Math.max(width / VIDEO_WIDTH, height / VIDEO_HEIGHT));
    // this.videoBG.play(true);
    this.container.addChild(this.videoBG);

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
    king.setOrigin(0.59, 1);
    const knight = new Character(
      this,
      this.initialPos[2].x,
      this.initialPos[2].y,
      this.charData[2],
      { color: POOL_COLORS[2] }
    );
    knight.setOrigin(0.63, 1);
    new Character(
      this,
      this.initialPos[3].x,
      this.initialPos[3].y,
      this.charData[3],
      { color: POOL_COLORS[0] }
    );

    // Header
    console.log(width / 2);
    // @ts-ignore
    const header = new PIXI.Text({
      x: width / 2,
      y: 100,
      text: [
        "Ah, Barron, your wit serves you well! In this moment of clarity, you discern a hidden pathway",
        "behind a tapestry, leading deeper into the priory's mystery. What will you do now?",
      ].join("\n"),
      style: {
        fontSize: 20,
        fontFamily: "Magra-Regular",
        fill: 0xffffff,
        fontStyle: "bold",
      },
      anchor: {
        x: 0.5,
        y: 0,
      },
    });
    this.container.addChild(header);

    const logo = new PIXI.Sprite(PIXI.Assets.get("scenes.game.logo"));
    logo.position.set(width / 5, height - 200);
    logo.anchor.set(0.5);
    logo.interactive = true;
    logo.on("pointerover", () => logo.scale.set(1.1));
    logo.on("pointerout", () => logo.scale.set(1));
    logo.cursor = "pointer";
    this.container.addChild(logo);
    // // Logo
    // const logo = this.add
    //   .image(width / 5, height - 200, "scenes.game.logo")
    //   .setInteractive({ useHandCursor: true })
    //   .on(Phaser.Input.Events.POINTER_OVER, () =>
    //     this.tweens.add({ targets: logo, scale: 1.1, duration: 100 })
    //   )
    //   .on(Phaser.Input.Events.POINTER_OUT, () =>
    //     this.tweens.add({ targets: logo, scale: 1, duration: 100 })
    //   );

    // // Tasks
    // const tasksObject = new TasksObject(this, width - 350, height - 150);
    // tasksObject.addTask(
    //   "tavern",
    //   "Interrogate townsfolk in the tavern for where Mira was last seen",
    //   false
    // );
    // tasksObject.addTask(
    //   "altar",
    //   "Get through the field of mushrooms to reach the Sprite Altar",
    //   true
    // );
    // tasksObject.checkIfAllTasksCompleted();

    this.debugText = new PIXI.Text({
      x: 10,
      y: 10,
      style: {
        fontSize: 38,
        fontFamily: "monospace",
        fill: 0xffffff,
      },
    });
    this.container.addChild(this.debugText);

    // EventBus.emit("current-scene-ready", this);
  }

  onUpdate(ticker: PIXI.Ticker): void {
    // const backgroundImage = document.getElementById(
    //   "background-image"
    // ) as HTMLImageElement;
    // const gameContainer = document.getElementById(
    //   "game-container"
    // ) as HTMLDivElement;
    // const canvasInside = gameContainer.querySelector(
    //   "canvas"
    // ) as HTMLCanvasElement;
    // backgroundImage.style.width = canvasInside.style.width;
    // backgroundImage.style.height = canvasInside.style.height;
    // backgroundImage.style.marginLeft = canvasInside.style.marginLeft;
    // backgroundImage.style.marginTop = canvasInside.style.marginTop;
    const fps = ticker.FPS;
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
      `PIXI Screen Resolution: ${this.app.screen.width}x${this.app.screen.height}`,
      `Asset Load Time: ${assetLoadTime}`,
      `Errors: ${errors} / Warnings: ${warnings}`,
    ].join("\n");
    this.debugText.text = debugInfo;
  }
}
