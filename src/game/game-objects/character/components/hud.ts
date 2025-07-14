import { type Character } from "../character";

export class HudComponent {
  private character: Character;
  private container: Phaser.GameObjects.Container;
  private nameText: Phaser.GameObjects.Text;
  private roleText: Phaser.GameObjects.Text;
  private hpBar: Phaser.GameObjects.Image;

  constructor(character: Character, x: number, y: number) {
    this.character = character;
    const scene = this.character.scene;
    const charData = this.character.charData;

    this.container = scene.add.container(x, y);
    this.container.setDepth(1);

    // Name
    this.nameText = scene.add.text(0, 0, charData.name).setFontSize(24).setOrigin(0.5, 1).setFontStyle("bold").setFontFamily("Magra-Regular");
    this.container.add(this.nameText);

    // Role
    this.roleText = scene.add.text(0, 0, charData.role).setFontSize(16).setOrigin(0.5, 1).setColor("#FFFFFF99").setFontFamily("Magra-Regular");
    this.container.add(this.roleText);

    // HP Bar
    this.hpBar = scene.add.image(0, 0, "scenes.game.hp-bar").setOrigin(0.5, 1);
    this.container.add(this.hpBar);

    this.refreshPosition();
  }

  refreshPosition() {
    this.roleText.setY(this.hpBar.y - this.hpBar.displayHeight - 10);
    this.nameText.setY(this.roleText.y - this.roleText.displayHeight - 10);
  }

  setName(name: string) {
    this.nameText.setText(name);
  }

  setRole(role: string) {
    this.roleText.setText(role);
  }
}