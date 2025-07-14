import { useRef } from "react";
import { IRefPhaserGame, PhaserGame } from "./PhaserGame";

function App() {
  //  References to the PhaserGame component (game and scene are exposed)
  const phaserRef = useRef<IRefPhaserGame | null>(null);
  // const scene = phaserRef.current.scene;

  return (
    <div id="app">
      <PhaserGame ref={phaserRef} />
    </div>
  );
}

export default App;
