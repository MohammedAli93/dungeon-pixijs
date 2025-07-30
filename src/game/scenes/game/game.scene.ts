import {
  setBackgroundVideo,
  updateBackgroundContainer,
} from "../../../dom/background-container";
import { Character } from "../../game-objects/character/character";
import { TasksObject } from "../../game-objects/tasks/tasks";
import { TitleGameObject } from "../../game-objects/title/title";
import { TopBarGameObject } from "../../game-objects/top-bar/top-bar";
import { ZoneButton } from "../../game-objects/zone-button/zone-button";
import { generateButton } from "../../utils/button";
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
  private canvasInside?: HTMLCanvasElement;

  constructor() {
    super("game");
  }

  create({ dataKey }: GameSceneData) {
    this.assetLoadTime = performance.now();
    const { width, height } = this.scale;
    const data = parseGameData(this.cache.json.get(dataKey));
    const sound = this.sound.add("scenes.game.dmitri.dialogue");
    console.log(data);

    // Background video setup (disabled)
    setBackgroundVideo(data.backgroundVideo);

    // Cache canvas for DOM sync
    const gameContainer = document.getElementById("app") as HTMLDivElement;
    this.canvasInside = gameContainer?.querySelector("canvas") ?? undefined;

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
    const title = new TitleGameObject(this, data.title.texts);

    if (data.enableMic) {
      this.add
        .image(width / 2, height + 100, "scenes.game.bottom-background")
        .setScale(1.1)
        .setOrigin(0.5, 1)
        .setDepth(2);
      const mic = this.add
        .image(width / 2 + 4, height - 141, "scenes.game.hold-to-talk")
        .setDepth(2);
      generateButton(mic);
      const textToGameMaster = this.add
        .image(width / 2 + 4, 0, "scenes.game.text-to-game-master-background")
        .setDepth(2);
      textToGameMaster.setY(
        mic.y + mic.displayHeight / 2 + textToGameMaster.displayHeight / 2 + 20
      );
      this.add
        .text(textToGameMaster.x, textToGameMaster.y, "Text to Game Master")
        .setOrigin(0.5)
        .setFontSize(16)
        .setFontFamily("Magra-Regular")
        .setColor("#FFFFFF99")
        .setDepth(2);
    }

    // Zone Buttons
    data.zoneButtons.forEach((zoneButtonData) => {
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

    new TopBarGameObject(this);

    this.input.once(Phaser.Input.Events.POINTER_DOWN, () => {
      sound.play();
      title.runAndStopAtEnd();
    });
    
    document.addEventListener("visibilitychange", function() {
      if (document.hidden) {
        // The tab is now hidden (user switched to another tab or minimized the browser)
        console.log("Browser tab is hidden.");
        // Perform actions when the tab becomes hidden
        sound.pause();
      } else {
        // The tab is now visible (user switched back to this tab or restored the browser)
        console.log("Browser tab is visible.");
        sound.resume();
        // Perform actions when the tab becomes visible
      }
    });

    this.debugText = this.add
      .text(10, 10, "")
      .setFontSize(38)
      .setFontFamily("monospace")
      .setOrigin(0)
      .setScrollFactor(0)
      .setVisible(import.meta.env.DEV)
      .setDepth(Infinity);

    this.input.keyboard?.on(Phaser.Input.Keyboard.Events.KEY_DOWN + "D", () => {
      this.debugText.setVisible(!this.debugText.visible);
    });
  }

  update(_time: number, _delta: number): void {
    if (this.canvasInside) {
      updateBackgroundContainer(this.canvasInside);
    }

    const fps = this.game.loop.actualFps;
    const frameTime = 1000 / fps;

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
    const assetLoadTime = this.assetLoadTime
      ? `${(this.assetLoadTime - performance.timing.navigationStart).toFixed(
          0
        )}ms`
      : "~1200ms";

    const errors = this.errorCount || 0;
    const warnings = this.warningCount || 0;

    const debugInfo = [
      `[DEBUG MENU] - Press [D] to toggle`,
      `FPS: ${fps.toFixed(1)} (average: ${avgFps})`,
      `Frame Time: ${frameTime.toFixed(1)}ms`,
      `Dropped Frames: ${droppedPercent}%`,
      `Resolution: ${res}`,
      `Phaser Scale Resolution: ${this.scale.width}x${this.scale.height}`,
      `Asset Load Time: ${assetLoadTime}`,
      `Errors: ${errors} / Warnings: ${warnings}`,
      `Game Objects: ${this.children.length}`,
    ].join("\n");

    this.debugText.setText(debugInfo);
  }
}
