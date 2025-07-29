import { forwardRef, useLayoutEffect, useRef } from "react";
import StartGame from "./game/main";
// import { EventBus } from "./game/EventBus";
// import PIXI from "pixi.js";
import { type SceneManager } from "./game/core/scene-manager";

export interface IRefPixiGame {
  game: SceneManager | null;
  // scene: PIXI.Scene | null;
}

interface IProps {
  // currentActiveScene?: (scene_instance: Pixi.Scene) => void;
}

export const PixiGame = forwardRef<IRefPixiGame, IProps>(
  function PixiGame({  }, ref) {
    const game = useRef<SceneManager | null>(null!);

    useLayoutEffect(() => {
      if (game.current === null) {
        game.current = StartGame("game-container");

        // if (typeof ref === "function") {
        //   ref({ game: game.current, scene: null });
        // } else if (ref) {
        //   ref.current = { game: game.current, scene: null };
        // }
      }

      return () => {
        if (game.current) {
          game.current.destroy(true);
          if (game.current !== null) {
            game.current = null;
          }
        }
      };
    }, [ref]);

    // useEffect(() => {
    //   EventBus.on("current-scene-ready", (scene_instance: Pixi.Scene) => {
    //     if (currentActiveScene && typeof currentActiveScene === "function") {
    //       currentActiveScene(scene_instance);
    //     }

    //     if (typeof ref === "function") {
    //       ref({ game: game.current, scene: scene_instance });
    //     } else if (ref) {
    //       ref.current = { game: game.current, scene: scene_instance };
    //     }
    //   });
    //   return () => {
    //     EventBus.removeListener("current-scene-ready");
    //   };
    // }, [currentActiveScene, ref]);

    return (
      <div id="game-container" style={{ position: "relative" }}>
        {/* <img
          id="background-image"
          src="/assets/scenes/game/background.gif"
          alt="gif"
          width="1920px"
          height="1080px"
          style={{
            position: "absolute",
            zIndex: -1,
            // pointerEvents: "none",
          }}
        /> */}
      </div>
    );
  }
);
