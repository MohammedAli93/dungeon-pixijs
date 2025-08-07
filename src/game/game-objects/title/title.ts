import * as PIXI from "pixi.js";
import { SceneBase } from "../../core/scene-manager";
import { type TitleData } from "../../utils/game-data-parser";
import { gsap } from "gsap";

const BLUR_STRENGTH = 0.4;
const WORD_WRAP_WIDTH_PERCENTAGE = 0.4;
const HEIGHT_PERCENTAGE = 0.3;

export class TitleGameObject {
  private scene: SceneBase;
  private headers: PIXI.Text[] = [];
  private data: TitleData["texts"];
  private currentIndex: number = 0;

  constructor(scene: SceneBase, titles: TitleData["texts"]) {
    this.scene = scene;
    this.data = titles;
    const { width, height } = this.scene.app.screen;

    this.headers.push(this.createHeader(width * WORD_WRAP_WIDTH_PERCENTAGE));
    this.headers.push(this.createHeader(width * WORD_WRAP_WIDTH_PERCENTAGE));

    const y = (height * HEIGHT_PERCENTAGE) / 2;
    this.header.text = titles[0].text.join(" ");
    this.header.position.set(width / 2, y);
    this.header.alpha = 0;
    this.header.zIndex = -1;
    this.oldHeader.text = titles[1].text.join(" ");
    this.oldHeader.position.set(width / 2, 0);
    this.oldHeader.alpha = 0;
    this.oldHeader.zIndex = -1;

    gsap.to(this.header, {
      duration: 0.5,
      pixi: {
        alpha: 1,
      },
    });

    // for (const header of this.headers) {
    //   header.enableFilters();
    //   const strength = header === this.header ? 0 : BLUR_STRENGTH;
    //   const blur = header.filters?.internal.addBlur(0, 2, 2, strength);
    //   header.setData("blur", blur);
    // }
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
    this.header.text = this.data[this.currentIndex].text.join(" ");
    if (stopIfLast && this.currentIndex === this.data.length) {
      return;
    }
    await this.appearHeader();
  }

  private async dissapearOldHeader() {
    const y = -this.oldHeader.height;

    return new Promise((resolve) => {
      gsap.to(this.oldHeader, {
        duration: 0.5,
        onComplete: resolve,
        pixi: {
          positionY: y,
          alpha: 0,
        },
      });
    });
  }

  private async appearHeader() {
    // const blur = this.header.getData("blur") as Phaser.Filters.Blur;
    const y = (this.scene.app.screen.height * HEIGHT_PERCENTAGE) / 2;
    this.header.position.y = y + this.header.height / 2;

    return Promise.all([
      new Promise((resolve) => {
        gsap.to(this.header, {
          duration: 0.5,
          onComplete: resolve,
          pixi: {
            positionY: y,
            alpha: 1,
          },
        });
      }),
      // new Promise((resolve) => {
      //   this.scene.tweens.add({
      //     targets: blur,
      //     duration: 500,
      //     onComplete: resolve,
      //     props: {
      //       strength: 0,
      //     },
      //   });
      // }),
    ]);
  }

  private async moveHeaderToOldHeader() {
    // const blur = this.header.getData("blur") as Phaser.Filters.Blur;
    const y = (this.scene.app.screen.height * HEIGHT_PERCENTAGE) / 4;

    return Promise.all([
      new Promise((resolve) => {
        gsap.to(this.header, {
          duration: 0.5,
          onComplete: resolve,
          pixi: {
            positionY: y,
            alpha: 0,
          },
        });
      }),
      // new Promise((resolve) => {
      //   this.scene.tweens.add({
      //     targets: blur,
      //     duration: 500,
      //     onComplete: resolve,
      //     props: {
      //       strength: BLUR_STRENGTH,
      //     },
      //   });
      // }),
    ]);
  }

  private createHeader(wrapWidth: number) {
    // @ts-ignore PixiJS typings are wrong with 'fontStyle'.
    const header = new PIXI.Text({
      style: {
        wordWrap: true,
        wordWrapWidth: wrapWidth,
        fontSize: 20,
        fontFamily: "Magra-Regular",
        fill: 0xffffff,
        fontStyle: "bold",
      },
      anchor: {
        x: 0.5,
        y: 0,
      },
    });
    this.scene.container.addChild(header);
    return header;
  }

  public async runAndStopAtEnd(onStart?: () => void, onEnd?: () => void) {
    for (let i = 0; i < this.data.length; i++) {
      if (onStart) onStart();
      if (i > 0) await this.next(true);
      const textData = this.data[i];
      await new Promise((resolve) =>
        setTimeout(resolve, textData.duration || 5_000)
      );
      if (onEnd) onEnd();
      
      await new Promise((resolve) =>
        setTimeout(resolve, textData.wait || 0)
      );
    }
    await this.dissapearAll();
  }

  private async dissapearAll() {
    return Promise.all([
      this.headers.map(
        (header) =>
          new Promise((resolve) => {
            gsap.to(header, {
              duration: 0.5,
              onComplete: resolve,
              pixi: {
                positionY: `-=${header.height}`,
                alpha: 0,
              },
            });
          })
      ),
    ]);
  }
}
