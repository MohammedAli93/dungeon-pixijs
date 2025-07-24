import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import StartGame from "./game/main";
import { EventBus } from "./game/EventBus";

export interface IRefPhaserGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

interface IProps {
  currentActiveScene?: (scene_instance: Phaser.Scene) => void;
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(
  function PhaserGame({ currentActiveScene }, ref) {
    const game = useRef<Phaser.Game | null>(null!);
    const [videoUrl, setVideoUrl] = useState<string>("");

    useLayoutEffect(() => {
      if (game.current === null) {
        game.current = StartGame("game-container");

        if (typeof ref === "function") {
          ref({ game: game.current, scene: null });
        } else if (ref) {
          ref.current = { game: game.current, scene: null };
        }
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

    useEffect(() => {
      EventBus.on("current-scene-ready", (scene_instance: Phaser.Scene) => {
        if (currentActiveScene && typeof currentActiveScene === "function") {
          currentActiveScene(scene_instance);
        }

        if (typeof ref === "function") {
          ref({ game: game.current, scene: scene_instance });
        } else if (ref) {
          ref.current = { game: game.current, scene: scene_instance };
        }
      });
      EventBus.on("change-video", (videoUrl: string) => {
        console.log(videoUrl);
        setVideoUrl(videoUrl);
      });
      return () => {
        EventBus.removeListener("current-scene-ready");
        EventBus.removeListener("change-video");
      };
    }, [currentActiveScene, ref]);

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
        <div
          id="background-container"
          style={{ position: "absolute", zIndex: -1, pointerEvents: "none" }}
        >
          {videoUrl.length > 0 && (
            <>
              <video
                key={videoUrl}
                autoPlay
                loop
                muted
                playsInline
                style={{ width: "100%", height: "100%" }}
              >
                <source src={videoUrl} type="video/mp4" />
              </video>
              <div
                id="top-blur"
                style={{
                  width: "100%",
                  height: "20%",
                  backdropFilter: "blur(3px)",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              ></div>
            </>
          )}
        </div>
      </div>
    );
  }
);
