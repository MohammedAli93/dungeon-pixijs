import { type TitleData } from "../../utils/game-data-parser";

const BLUR_STRENGTH = 0.4;
const WORD_WRAP_WIDTH_PERCENTAGE = 0.4;
const HEIGHT_PERCENTAGE = 0.2;

export class TitleGameObject {
  private scene: Phaser.Scene;
  private headers: Phaser.GameObjects.Text[] = [];
  private data: TitleData[];
  private currentIndex: number = 0;

  constructor(scene: Phaser.Scene, titles: TitleData[]) {
    this.scene = scene;
    this.data = titles;
    const { width, height } = this.scene.scale;

    this.headers.push(this.createHeader(width * WORD_WRAP_WIDTH_PERCENTAGE));
    this.headers.push(this.createHeader(width * WORD_WRAP_WIDTH_PERCENTAGE));

    const y = (height * HEIGHT_PERCENTAGE) / 2;
    this.header.setText(titles[0].text.join(" ")).setPosition(width / 2, y);
    this.nextHeader.setText(titles[1].text.join(" ")).setPosition(width / 2, 0);

    for (const header of this.headers) {
      header.enableFilters();
      const strength = header === this.header ? 0 : BLUR_STRENGTH;
      const blur = header.filters?.internal.addBlur(0, 2, 2, strength);
      header.setData("blur", blur);
    }
  }

  private get header() {
    return this.headers[0];
  }

  private get nextHeader() {
    return this.headers[1];
  }

  private swapHeaders() {
    const tmp = this.headers[0];
    this.headers[0] = this.headers[1];
    this.headers[1] = tmp;
  }

  public async next() {
    await Promise.all([this.dissapearHeader(), this.moveNextHeader()]);
    this.swapHeaders();
    this.nextHeader.getData("blur").strength = BLUR_STRENGTH;
    this.currentIndex = (this.currentIndex + 1) % this.data.length;
    const nextIndex = (this.currentIndex + 1) % this.data.length;
    this.nextHeader.setText(this.data[nextIndex].text.join(" "));
    await this.appearNextHeader();
  }

  private async dissapearHeader() {
    const y = this.scene.scale.height * HEIGHT_PERCENTAGE;
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this.header,
        duration: 500,
        onComplete: resolve,
        props: {
          y,
          alpha: 0,
        },
      });
    });
  }

  private async appearNextHeader() {
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this.nextHeader,
        duration: 500,
        onComplete: resolve,
        props: {
          y: { from: -this.nextHeader.displayHeight, to: 0 },
          alpha: 1,
        },
      });
    });
  }

  private async moveNextHeader() {
    const blur = this.nextHeader.getData("blur") as Phaser.Filters.Blur;
    const y = (this.scene.scale.height * HEIGHT_PERCENTAGE) / 2;
    return Promise.all([
      new Promise((resolve) => {
        this.scene.tweens.add({
          targets: this.nextHeader,
          duration: 500,
          onComplete: resolve,
          props: {
            y,
            alpha: 1,
          },
        });
      }),
      new Promise((resolve) => {
        this.scene.tweens.add({
          targets: blur,
          duration: 500,
          onComplete: resolve,
          props: {
            strength: 0,
          },
        });
      }),
    ]);
  }

  private createHeader(wrapWidth: number) {
    return this.scene.add
      .text(0, 0, "")
      .setFontSize(20)
      .setOrigin(0.5, 0)
      .setFontStyle("bold")
      .setFontFamily("Magra-Regular")
      .setScrollFactor(0)
      .setWordWrapWidth(wrapWidth)
      .setDepth(Infinity);
  }
}
