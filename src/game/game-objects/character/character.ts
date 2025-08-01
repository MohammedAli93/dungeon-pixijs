import * as PIXI from "pixi.js";
import { type GameScene } from "../../scenes/game/game.scene";
import { GlowFilter } from "pixi-filters";
import { HudComponent } from "./components/hud";

export interface CharacterData {
  key: string;
  name: string;
  role: string;
}

export interface CharacterOptions {
  color?: number;
  particlesShapeWidthFactor?: number;
}

export class Character {
  public scene: GameScene;
  public charData: CharacterData;
  public container: PIXI.Container;
  private randomHexColor: number;
  private glowSprite: PIXI.Sprite;
  private shadow: PIXI.Sprite;

  constructor(
    scene: GameScene,
    x: number,
    y: number,
    charData: CharacterData,
    options: CharacterOptions = {}
  ) {
    this.scene = scene;
    this.charData = charData;
    this.randomHexColor = options.color ?? Math.random() * 0xffffff;
    this.container = new PIXI.Container({ x, y });
    this.scene.container.addChild(this.container);

    // Render one-time glow texture
    const baseTexture = PIXI.Assets.get(charData.key);
    const sprite = new PIXI.Sprite(baseTexture);
    sprite.anchor.set(0.5);
    sprite.filters = [
      new GlowFilter({ distance: 70, outerStrength: 2, color: this.randomHexColor })
    ];

    const padding = 60;
    const w = sprite.width + padding;
    const h = sprite.height + padding;
    const rt = PIXI.RenderTexture.create({ width: w, height: h });
    const glowContainer = new PIXI.Container();
    sprite.position.set(w / 2, h / 2);
    glowContainer.addChild(sprite);
    this.scene.app.renderer.render(glowContainer, { renderTexture: rt });
    sprite.destroy({ children: true });
    glowContainer.destroy({ children: true });

    // Avatar with baked glow
    const avatar = new PIXI.Sprite(rt);
    avatar.label = "avatar";
    avatar.anchor.set(0.5, 1);
    const maxHeight = 550;
    const scale = Math.min(maxHeight / avatar.width, 1);

    this.container.addChild(avatar);
    this.container.scale.set(scale);

    const displayWidth = avatar.width * scale;
    const particlesContainer = this.scene.particlesEmitter.emit({
      texture: PIXI.Texture.from('assets/particle.webp'),
      lifetime: {
        min: .5,
        max: 1,
      },
      color: this.randomHexColor,
      frequency: 0.05,
      spawnChance: 1,
      particlesPerWave: 1,
      emitterLifetime: 0.6,
      maxParticles: 1,
      scale: {
        min: 0.1,
        max: 0.3,
      },
      velocity: {
        min: -60,
        max: 60,
      },
      pos: {
        x: x,
        y: y - avatar.height / 2,
      },
      spawnArea: {
        width: avatar.width * scale,
        height: avatar.height * scale,
      }
    });
    particlesContainer.zIndex = -1;


    // Shadow
    const shadow = new PIXI.Sprite(PIXI.Assets.get("shadow"));
    shadow.position.set(x, y);
    shadow.anchor.set(0.5, 1);
    shadow.alpha = 0.7;
    shadow.scale.set(1.6);
    this.scene.container.addChild(shadow);
    const avatarWidth = displayWidth * 1.6;
    const scaleShadow = Math.min(
      avatarWidth / shadow.width,
      avatar.height / shadow.height
    );
    shadow.scale.set(scaleShadow);

    // HUD
    this.loadHudComponent(avatar, x, y);
  }

  private async loadHudComponent(_avatar: any, x: number, y: number) {
    try {
      const avatar = _avatar;
      const module = await import("./components/hud");
      const hud = new module.HudComponent(
        this,
        0,
        -(avatar.height * this.container.scale.y)
      );
      this.container.addChild(hud.container);
    } catch (error) {
      console.error("Failed to load HudComponent:", error);
    }
  }

  public setOrigin(x: number, y: number) {
    const avatar = this.container.getChildByLabel("avatar") as PIXI.Sprite;
    if (avatar) {
      avatar.anchor.set(x, y);
    }
  }
}