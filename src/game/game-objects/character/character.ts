import { HudComponent } from "./components/hud";

export interface CharacterData {
  key: string;
  name: string;
  role: string;
}

export interface CharacterOptions {
  color?: number;
}

export class Character {
  public scene: Phaser.Scene;
  public charData: CharacterData;
  public avatar: Phaser.GameObjects.Sprite;
  private hud: HudComponent;

  constructor(scene: Phaser.Scene, x: number, y: number, charData: CharacterData, options: CharacterOptions = {}) {
    this.scene = scene;
    this.charData = charData;

    // Avatar
    this.avatar = this.scene.add.sprite(x, y, `characters.${charData.key}`);
    this.avatar.setOrigin(0.5, 1);
    const maxHeight = 550;
    const scale = Math.min(maxHeight / this.avatar.displayHeight, 1);
    this.avatar.setScale(scale);
    const randomHexColor = options.color ?? Phaser.Display.Color.RandomRGB().color;
    this.avatar.preFX?.addGlow(randomHexColor, 2, 0, false, 0.1, 32);
    this.avatar.setDepth(1);

    // Particles
    const shape = new Phaser.Geom.Ellipse(0, 0, this.avatar.displayWidth / 2 / 2, this.avatar.displayHeight / 2);
    const particles = this.scene.add.particles(x, y - this.avatar.displayHeight / 2, "particle", {
      lifespan: 5000,
      speed: { min: 15, max: 35 },
      scale: { start: 0.8, end: 0 },
      blendMode: "ADD",
      color: [randomHexColor],
      emitting: true,
      emitZone: { type: 'edge', source: shape, quantity: 5, total: 1 },
      frequency: 100,
    });
    particles.setDepth(0);

    // Hud
    this.hud = new HudComponent(this, x, y - this.avatar.displayHeight);

    const shadow = this.scene.add.image(x, y, "shadow").setDepth(this.avatar.depth - 1).setOrigin(0.5, 0.5);
    const scaleShadow = Math.min(this.avatar.displayWidth / shadow.displayWidth, this.avatar.displayHeight / shadow.displayHeight);
    shadow.setScale(scaleShadow);
  }
}
