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
  public scene: Phaser.Scene;
  public charData: CharacterData;
  public avatar: Phaser.GameObjects.Sprite;
  private randomHexColor: number;

  constructor(scene: Phaser.Scene, x: number, y: number, charData: CharacterData, options: CharacterOptions = {}) {
    this.scene = scene;
    this.charData = charData;

    // Avatar
    this.avatar = this.scene.add.sprite(x, y, `characters.${charData.key}`);
    this.avatar.setOrigin(0.5, 1);
    const maxHeight = 550;
    const scale = Math.min(maxHeight / this.avatar.displayHeight, 1);
    this.avatar.setScale(scale);
    this.randomHexColor = options.color ?? Phaser.Display.Color.RandomRGB().color;
    this.avatar.preFX?.addGlow(this.randomHexColor, 4, 0, false, 0.1, 15);
    this.avatar.setDepth(1);

    // Particles
    const particlesShapeWidthFactor = options.particlesShapeWidthFactor ?? 0.5;
    const shape = new Phaser.Geom.Ellipse(0, 0, this.avatar.displayWidth / 2 * particlesShapeWidthFactor, this.avatar.displayHeight / 2);
    const particles = this.scene.add.particles(x, y - this.avatar.displayHeight / 2, "particle", {
      lifespan: 3000,
      speed: { min: 15, max: 35 },
      scale: { start: 0.6, end: 0 },
      blendMode: "ADD",
      color: [this.randomHexColor],
      emitting: true,
      emitZone: { type: 'edge',  source: shape, quantity: 3, total: 1 },
      frequency: 150,
    });
    particles.setDepth(0);

    // Shadow
    const shadow = this.scene.add.image(x, y, "shadow").setDepth(this.avatar.depth - 1).setOrigin(0.5, 0.7).setAlpha(0.7);
    const avatarWidth = this.avatar.displayWidth * 1.6;
    const scaleShadow = Math.min(avatarWidth / shadow.displayWidth, this.avatar.displayHeight / shadow.displayHeight);
    shadow.setScale(scaleShadow);

    // Dynamic HUD import
    this.loadHudComponent(x, y);
  }

  private async loadHudComponent(x: number, y: number) {
    try {
      const module = await import("./components/hud");
      new module.HudComponent(this, x, y - this.avatar.displayHeight);
    } catch (error) {
      console.error("Failed to load HudComponent:", error);
    }
  }
}