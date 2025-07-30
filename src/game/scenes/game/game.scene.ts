import * as PIXI from "pixi.js";
import {
  setBackgroundVideo,
  updateBackgroundContainer,
} from "../../../dom/background-container";
import { SceneBase } from "../../core/scene-manager";
import { Character } from "../../game-objects/character/character";
import { TasksObject } from "../../game-objects/tasks/tasks";
import { TitleGameObject } from "../../game-objects/title/title";
import { TopBarGameObject } from "../../game-objects/top-bar/top-bar";
import { ZoneButton } from "../../game-objects/zone-button/zone-button";
import { generateButton } from "../../utils/button";
import { parseGameData } from "../../utils/game-data-parser";
import { Howl } from "howler";

const POOL_COLORS = [0xff876c, 0xf8ff6c, 0xbe6cff];

interface GameSceneData {
  dataKey: string;
}

export class GameScene extends SceneBase {
  private fpsSamples: number[] = [];
  private assetLoadTime: number = 0;
  private errorCount: number = 0;
  private warningCount: number = 0;
  debugText: PIXI.Text;
  private canvasInside?: HTMLCanvasElement;

  async onCreate({ dataKey }: GameSceneData) {
    this.assetLoadTime = performance.now();
    const { width, height } = this.app.screen;
    const data = parseGameData(PIXI.Assets.get((dataKey)));

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
      const bottomBackground = PIXI.Sprite.from("scenes.game.bottom-background");
      bottomBackground.position.set(width / 2, height + 100);
      bottomBackground.anchor.set(0.5, 1);
      bottomBackground.scale.set(1.1);
      bottomBackground.zIndex = 2;
      this.container.addChild(bottomBackground);
      const mic = new PIXI.Sprite(PIXI.Assets.get("scenes.game.hold-to-talk"));
      mic.position.set(width / 2 + 4, height - 141);
      mic.anchor.set(0.5);
      mic.zIndex = 2;
      generateButton(mic);
      this.container.addChild(mic);
      const textToGameMasterBackground = new PIXI.Sprite(PIXI.Assets.get("scenes.game.text-to-game-master-background"));
      textToGameMasterBackground.position.set(width / 2 + 4, mic.y + mic.height / 2 + textToGameMasterBackground.height / 2 + 20);
      textToGameMasterBackground.anchor.set(0.5);
      textToGameMasterBackground.zIndex = 2;
      this.container.addChild(textToGameMasterBackground);
      // @ts-ignore PixiJS typings are wrong with 'fontStyle'.
      const textToGameMaster = new PIXI.Text({
        x: textToGameMasterBackground.x,
        y: textToGameMasterBackground.y,
        text: "Text to Game Master",
        style: {
          fontSize: 16,
          fontFamily: "Magra-Regular",
          fill: 0xffffff,
          fontStyle: "bold",
        },
        anchor: {
          x: 0.5,
          y: 0.5,
        },
      });
      textToGameMaster.zIndex = 2;
      this.container.addChild(textToGameMaster);
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

    this.app.stage.eventMode = 'static';
    this.app.stage.hitArea = this.app.screen;
    const onMouseDown = () => {
      const sound = new Howl({
        src: ["assets/scenes/game/dmitri/dialogue.m4a"],
      })
      sound.play();
      title.runAndStopAtEnd();
      this.app.stage.off("mousedown", onMouseDown);
    }
    this.app.stage.on('mousedown', onMouseDown);

    this.debugText = new PIXI.Text({
      x: 10,
      y: 10,
      style: {
        fontSize: 38,
        fontFamily: "monospace",
        fill: 0xffffff,
      },
    });
    this.debugText.visible = import.meta.env.DEV;
    this.container.addChild(this.debugText);

    window.addEventListener("keydown", (event) => {
      if (event.key === "d") {
        this.debugText.visible = !this.debugText.visible;
      }
    });
  }

  onUpdate(ticker: PIXI.Ticker): void {
    if (this.canvasInside) {
      updateBackgroundContainer(this.canvasInside);
    }
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
      `[DEBUG MENU] - Press [D] to toggle`,
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
