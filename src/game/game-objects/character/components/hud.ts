import * as PIXI from 'pixi.js';

export class HudComponent {
  private character: any; // Replace with a proper Character interface if needed
  public container: PIXI.Container;
  private nameText: PIXI.Text;
  private roleText: PIXI.Text;
  private hpBar: PIXI.Sprite;
  public x: number;
  public y: number;

  constructor(character: any, x: number, y: number) {
    this.character = character;
    const charData = this.character.charData;

    // Create container
    this.container = new PIXI.Container();
    this.x = x;
    this.y = y;
    this.container.zIndex = 1; // equivalent to setDepth(1)

    // Style objects
    const nameStyle = new PIXI.TextStyle({
      fontFamily: 'Magra-Regular',
      fontSize: 20,
      fontWeight: 'bold',
      fill: 0xffffff,
    });

    const roleStyle = new PIXI.TextStyle({
      fontFamily: 'Magra-Regular',
      fontSize: 16,
      fill: '#FFFFFF99',
    });

    // Name text
    this.nameText = new PIXI.Text({ text: charData.name, style: nameStyle });
    this.nameText.anchor.set(0.5, 1);
    this.container.addChild(this.nameText);

    // Role text
    this.roleText = new PIXI.Text({ text: charData.role, style: roleStyle });
    this.roleText.anchor.set(0.5, 1);
    this.container.addChild(this.roleText);

    // HP bar (assumes texture is already loaded)
    this.hpBar = PIXI.Sprite.from('scenes.game.hp-bar');
    this.hpBar.anchor.set(0.5, 1);
    this.container.addChild(this.hpBar);

    this.refreshPosition();
  }

  refreshPosition() {
    this.roleText.y = this.hpBar.y - this.hpBar.height - 10;
    this.nameText.y = this.roleText.y - this.roleText.height - 10;
    const bounds = this.container.getBounds();
    this.container.x = this.x;
    this.container.y = this.y - bounds.height / 2;
  }

  setName(name: string) {
    this.nameText.text = name;
  }

  setRole(role: string) {
    this.roleText.text = role;
  }
}
