import { type TitleData } from "../../utils/game-data-parser";

const BLUR_STRENGTH = 0.4;
const WORD_WRAP_WIDTH_PERCENTAGE = 0.4;
const HEIGHT_PERCENTAGE = 0.3;

export class TitleGameObject {
  private scene: Phaser.Scene;
  private headers: Phaser.GameObjects.Text[] = [];
  private data: TitleData["texts"];
  private currentIndex: number = 0;

  constructor(scene: Phaser.Scene, titles: TitleData["texts"]) {
    this.scene = scene;
    this.data = titles;
    const { width, height } = this.scene.scale;

    this.headers.push(this.createHeader(width * WORD_WRAP_WIDTH_PERCENTAGE));
    this.headers.push(this.createHeader(width * WORD_WRAP_WIDTH_PERCENTAGE));

    const y = (height * HEIGHT_PERCENTAGE) / 2;
    this.header.setText(titles[0].text.join(" ")).setPosition(width / 2, y);
    this.oldHeader
      .setText(titles[1].text.join(" "))
      .setPosition(width / 2, 0)
      .setAlpha(0);

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

  private get oldHeader() {
    return this.headers[1];
  }

  private swapHeaders() {
    const tmp = this.headers[0];
    this.headers[0] = this.headers[1];
    this.headers[1] = tmp;
  }

  public async next(stopIfLast: boolean = false) {
    await Promise.all([
      this.dissapearOldHeader(),
      this.moveHeaderToOldHeader(),
    ]);
    this.swapHeaders();
    this.currentIndex = (this.currentIndex + 1) % this.data.length;
    this.header.setText(this.data[this.currentIndex].text.join(" "));
    if (stopIfLast && this.currentIndex === this.data.length) {
      return;
    }
    await this.appearHeader();
  }

  private async dissapearOldHeader() {
    const y = -this.oldHeader.displayHeight;
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this.oldHeader,
        duration: 500,
        onComplete: resolve,
        props: {
          y,
          alpha: 0,
        },
      });
    });
  }

  private async appearHeader() {
    const blur = this.header.getData("blur") as Phaser.Filters.Blur;
    const y = (this.scene.scale.height * HEIGHT_PERCENTAGE) / 2;
    this.header.setY(y + this.header.displayHeight / 2);
    return Promise.all([
      new Promise((resolve) => {
        this.scene.tweens.add({
          targets: this.header,
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

  private async moveHeaderToOldHeader() {
    const blur = this.header.getData("blur") as Phaser.Filters.Blur;
    const y = 0;
    return Promise.all([
      new Promise((resolve) => {
        this.scene.tweens.add({
          targets: this.header,
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
            strength: BLUR_STRENGTH,
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

  public async runAndStopAtEnd() {
    for (let i = 0; i < this.data.length; i++) {
      if (i > 0) await this.next(true);
      const textData = this.data[i];
      await new Promise((resolve) =>
        this.scene.time.delayedCall(textData.duration || 5_000, resolve)
      );
    }
    await this.dissapearAll();
  }

  private async dissapearAll() {
    return Promise.all([
      this.headers.map(
        (header) =>
          new Promise((resolve) => {
            this.scene.tweens.add({
              targets: header,
              duration: 500,
              onComplete: resolve,
              props: {
                y: `-=${header.displayHeight}`,
                alpha: 0,
              },
            });
          })
      ),
    ]);
  }
}
