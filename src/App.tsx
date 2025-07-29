import { useRef } from "react";
import { IRefPixiGame, PixiGame } from "./PixiGame";

function App() {
  //  References to the PixiGame component (game and scene are exposed)
  const pixiRef = useRef<IRefPixiGame | null>(null);
  // const scene = pixiRef.current.scene;

  return (
    <div id="app" style={{ backgroundColor: "pink"}}>
      <PixiGame ref={pixiRef} />
    </div>
  );
}

export default App;
