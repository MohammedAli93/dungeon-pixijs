import { EventBus } from "../../EventBus";
import { Character } from "../../game-objects/character/character";
import { TasksObject } from "../../game-objects/tasks/tasks";
import { TitleGameObject } from "../../game-objects/title/title";
import { ZoneButton } from "../../game-objects/zone-button/zone-button";
import { parseGameData } from "../../utils/game-data-parser";

const POOL_COLORS = [0xff876c, 0xf8ff6c, 0xbe6cff];

interface GameSceneData {
  dataKey: string;
}

export class GameScene extends Phaser.Scene {
  private fpsSamples: number[] = [];
  private assetLoadTime: number = 0;
  private errorCount: number = 0;
  private warningCount: number = 0;
  debugText: Phaser.GameObjects.Text;
  // videoBG: Phaser.GameObjects.Video;

  constructor() {
    super("game");
  }

  create({ dataKey }: GameSceneData) {
    this.assetLoadTime = performance.now();
    const { width, height } = this.scale;
    const data = parseGameData(this.cache.json.get(dataKey));
    console.log(data);
    // const VIDEO_WIDTH = 1067;
    // const VIDEO_HEIGHT = 600;

    // this.videoBG = this.add.video(
    //   width / 2,
    //   height / 2,
    //   "scenes.game.background-video"
    // );
    // this.videoBG.setScale(Math.max(width / VIDEO_WIDTH, height / VIDEO_HEIGHT));
    // this.videoBG.play(true);
    EventBus.emit("change-video", data.backgroundVideo);

    // Characters
    data.characters.forEach((characterData, index) => {
      const character = new Character(
        this,
        characterData.position.x,
        characterData.position.y,
        characterData,
        { color: POOL_COLORS[index % POOL_COLORS.length] }
      );
      if (characterData.origin) {
        character.setOrigin(characterData.origin.x, characterData.origin.y);
      }
    });

    // Title
    const title = new TitleGameObject(this, data.titles);
    this.time.addEvent({
      delay: 5_000,
      repeat: -1,
      callback: () => {
        title.next();
      },
    });

    if (data.enableMic) {
      this.add.image(width / 2, height, "scenes.game.mic-background").setOrigin(0.5, 1).setDepth(2);
      const mic = this.add.image(width / 2 + 4, height - 141, "scenes.game.mic").setDepth(2);
      mic.setInteractive({ useHandCursor: true })
        .on(Phaser.Input.Events.POINTER_OVER, () => {
          this.tweens.add({ targets: mic, scale: 1.1, duration: 100 });
        })
        .on(Phaser.Input.Events.POINTER_OUT, () => {
          this.tweens.add({ targets: mic, scale: 1, duration: 100 });
        });
    }

    // Zone Buttons
    data.zoneButtons.forEach((zoneButtonData, index) => {
      new ZoneButton(
        this,
        zoneButtonData.position.x,
        zoneButtonData.position.y,
        zoneButtonData.key,
        zoneButtonData.blocked
      );
    });

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
    const backgroundContainer = document.getElementById(
      "background-container"
    ) as HTMLImageElement;
    const gameContainer = document.getElementById(
      "game-container"
    ) as HTMLDivElement;
    const canvasInside = gameContainer.querySelector(
      "canvas"
    ) as HTMLCanvasElement;
    backgroundContainer.style.width = canvasInside.style.width;
    backgroundContainer.style.height = canvasInside.style.height;
    backgroundContainer.style.marginLeft = canvasInside.style.marginLeft;
    backgroundContainer.style.marginTop = canvasInside.style.marginTop;

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
      `Phaser Scale Resolution: ${this.scale.width}x${this.scale.height}`,
      `Asset Load Time: ${assetLoadTime}`,
      `Errors: ${errors} / Warnings: ${warnings}`,
    ].join("\n");

    this.debugText.setText(debugInfo);
  }
}
