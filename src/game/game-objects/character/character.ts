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
  public container: Phaser.GameObjects.Container;
  private randomHexColor: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    charData: CharacterData,
    options: CharacterOptions = {}
  ) {
    this.scene = scene;
    this.charData = charData;

    // Render Texture
    const texture = this.scene.textures.get(`characters.${charData.key}`);
    let { width: textureWidth, height: textureHeight } = texture.source[0];

    const sprite = this.scene.add.image(0, 0, texture).setOrigin(0);
    this.randomHexColor =
      options.color ?? Phaser.Display.Color.RandomRGB().color;
    sprite.enableFilters();
    sprite.filters?.internal.addGlow(
      this.randomHexColor,
      4,
      0,
      1,
      true,
      20,
      35
    );

    const rt = this.scene.add.renderTexture(0, 0, textureWidth, textureHeight);
    rt.draw(sprite);
    rt.render();
    rt.saveTexture(`characters.${charData.key}-glow`);

    rt.destroy();
    sprite.destroy();

    this.container = this.scene.add.container(x, y);

    // Glow
    const glow = this.scene.add.image(0, 0, `characters.${charData.key}-glow`);

    // Avatar
    const avatar = this.scene.add
      .image(0, 0, `characters.${charData.key}`)
      .setName("avatar");
    const maxHeight = 550;
    const scale = Math.min(maxHeight / avatar.displayHeight, 1);

    this.container.add(glow);
    this.container.add(avatar);
    this.container.bringToTop(avatar);
    this.container.setScale(scale);
    this.container.setDepth(1);
    this.setOrigin(0.5, 1);

    // Particles
    const particlesShapeWidthFactor = options.particlesShapeWidthFactor ?? 0.5;
    const displayWidth = avatar.displayWidth * scale;
    const displayHeight = avatar.displayHeight * scale;
    const shape = new Phaser.Geom.Ellipse(
      0,
      0,
      (displayWidth / 2) * particlesShapeWidthFactor,
      displayHeight / 2
    );
    const particles = this.scene.add.particles(
      x,
      y - displayHeight / 2,
      "particle",
      {
        lifespan: 6000,
        speed: { min: 15, max: 35 },
        scale: { start: 0.6, end: 0 },
        blendMode: "ADD",
        color: [this.randomHexColor],
        emitting: true,
        emitZone: { type: "edge", source: shape, quantity: 5, total: 1 },
        frequency: 150,
      }
    );
    particles.setDepth(0);

    // Shadow
    const shadow = this.scene.add
      .image(x, y, "shadow")
      .setDepth(avatar.depth - 1)
      .setOrigin(0.5, 0.7)
      .setAlpha(0.7);
    const avatarWidth = displayWidth * 1.6;
    const scaleShadow = Math.min(
      avatarWidth / shadow.displayWidth,
      avatar.displayHeight / shadow.displayHeight
    );
    shadow.setScale(scaleShadow);

    // Dynamic HUD import
    this.loadHudComponent(x, y);
  }

  private async loadHudComponent(x: number, y: number) {
    try {
      const avatar = this.container.getByName(
        "avatar"
      ) as Phaser.GameObjects.Image;
      const module = await import("./components/hud");
      new module.HudComponent(
        this,
        x,
        y - avatar.displayHeight * this.container.scale
      );
    } catch (error) {
      console.error("Failed to load HudComponent:", error);
    }
  }

  public setOrigin(x: number, y: number) {
    (this.container.getAll() as Phaser.GameObjects.Image[]).forEach((child) => {
      child.setOrigin(x, y);
    });
  }
}
