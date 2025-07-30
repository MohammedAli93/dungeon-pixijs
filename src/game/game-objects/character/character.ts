import * as PIXI from "pixi.js";
import { type SceneBase } from "../../core/scene-manager";
import { GlowFilter } from "@pixi/filter-glow";

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
  public scene: SceneBase;
  public charData: CharacterData;
  public container: PIXI.Container;
  private randomHexColor: number;

  constructor(
    scene: SceneBase,
    x: number,
    y: number,
    charData: CharacterData,
    options: CharacterOptions = {}
  ) {
    this.scene = scene;
    this.charData = charData;

    // Render Texture
    // const texture = this.scene.textures.get(charData.key);
    // let { width: textureWidth, height: textureHeight } = texture.source[0];

    // const sprite = this.scene.add.image(0, 0, texture).setOrigin(0);
    // this.randomHexColor =
    //   options.color ?? Phaser.Display.Color.RandomRGB().color;
    // sprite.enableFilters();
    // sprite.filters?.internal.addGlow(
    //   this.randomHexColor,
    //   4,
    //   0,
    //   1,
    //   true,
    //   20,
    //   35
    // );

    // const rt = this.scene.add.renderTexture(0, 0, textureWidth, textureHeight);
    // rt.draw(sprite);
    // rt.render();
    // rt.saveTexture(`characters.${charData.key}-glow`);

    // rt.destroy();
    // sprite.destroy();

    this.container = new PIXI.Container({ x, y });
    this.scene.container.addChild(this.container);

    // Glow
    // const glow = this.scene.add.image(0, 0, `characters.${charData.key}-glow`);

    // Avatar
    const avatar = new PIXI.Sprite(PIXI.Assets.get(charData.key));
    avatar.anchor.set(0.5, 1);
    // const avatar = this.scene.add
    //   .image(0, 0, charData.key)
    //   .setName("avatar");
    const maxHeight = 550;
    const scale = Math.min(maxHeight / avatar.width, 1);

    // avatar.filters = [new GlowFilter({color: 0x00ff00, distance: 10, outerStrength: 4, innerStrength: 1, quality: 0.1, knockout: false, alpha: true})];

    // avatar.filters = [GlowFilter]
    
    // const distance = 10;
    // const outerStrength = 1;
    // const innerStrength = 1;
    // const quality = 10;
    // const textureWidth = avatar.width * quality;
    // const textureHeight = avatar.height * quality;
    // const r = 0.5;
    // const g = 0.5;
    // const b = 0.5;
    // const angleStep = 1 / quality / distance; // calculado en JS

    // const uniforms = {
    //     distance: distance,
    //     outerStrength: outerStrength,
    //     innerStrength: innerStrength,
    //     glowColor: new Float32Array([r, g, b, 1]),
    //     pixelWidth: 1 / textureWidth,
    //     pixelHeight: 1 / textureHeight,
    //     angleStep: angleStep,
    // };
    // GlowFilter.uniforms = uniforms;


    // this.container.add(glow);
    this.container.addChild(avatar);
    // this.container.bringToTop(avatar);
    this.container.scale.set(scale);
    // this.container.setDepth(1);
    // this.setOrigin(0.5, 1);

    // Particles
    // const particlesShapeWidthFactor = options.particlesShapeWidthFactor ?? 0.5;
    const displayWidth = avatar.width * scale;
    // const displayHeight = avatar.displayHeight * scale;
    // const shape = new Phaser.Geom.Ellipse(
    //   0,
    //   0,
    //   (displayWidth / 2) * particlesShapeWidthFactor,
    //   displayHeight / 2
    // );
    // const particles = this.scene.add.particles(
    //   x,
    //   y - displayHeight / 2,
    //   "particle",
    //   {
    //     lifespan: 6000,
    //     speed: { min: 15, max: 35 },
    //     scale: { start: 0.6, end: 0 },
    //     blendMode: "ADD",
    //     color: [this.randomHexColor],
    //     emitting: true,
    //     emitZone: { type: "edge", source: shape, quantity: 5, total: 1 },
    //     frequency: 150,
    //   }
    // );
    // particles.setDepth(0);

    // Shadow
    const shadow = new PIXI.Sprite(PIXI.Assets.get("shadow"));
    shadow.position.set(x, y);
    shadow.anchor.set(0.5);
    shadow.alpha = 0.7;
    shadow.scale.set(1.6);
    // this.scene.container.addChildAt(shadow, this.scene.container.children.length - 1);
    this.scene.container.addChild(shadow);
    const avatarWidth = displayWidth * 1.6;
    const scaleShadow = Math.min(
      avatarWidth / shadow.width,
      avatar.height / shadow.height
    );
    shadow.scale.set(scaleShadow);

    // Dynamic HUD import
    // this.loadHudComponent(x, y);
  }

  // private async loadHudComponent(x: number, y: number) {
  //   try {
  //     const avatar = this.container.getByName(
  //       "avatar"
  //     ) as Phaser.GameObjects.Image;
  //     const module = await import("./components/hud");
  //     new module.HudComponent(
  //       this,
  //       x,
  //       y - avatar.displayHeight * this.container.scale
  //     );
  //   } catch (error) {
  //     console.error("Failed to load HudComponent:", error);
  //   }
  // }

  public setOrigin(x: number, y: number) {
    // const bounds = this.container.getBounds();
    // this.container.pivot.set(bounds.width / 2 * x, bounds.height * y);
    // (this.container.getAll() as Phaser.GameObjects.Image[]).forEach((child) => {
    //   child.setOrigin(x, y);
    // });
  }
}
