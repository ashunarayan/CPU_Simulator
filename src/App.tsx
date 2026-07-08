import { useEffect, useRef } from "react";
import "./index.css";
import CanvasRenderer from "./engine/renderer/CanvasRenderer";

function App() {

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {

    if (!canvasRef.current) return;

    new CanvasRenderer(canvasRef.current);

  }, []);

  return (
    <div className="app">

      <header className="topbar">
        <div className="logo">

          <span>⚡</span>

          <span>CPU Simulator</span>

        </div>

        <div className="version">
          v0.1
        </div>
      </header>

      <main className="workspace">

        <aside className="left-panel">
          <button>🖱️</button>
          <button>AND</button>
          <button>OR</button>
          <button>NOT</button>
          <button>IN</button>
          <button>OUT</button>
          <button>WIRE</button>
        </aside>

        <section className="canvas-container">
          <canvas ref={canvasRef} className="editor-canvas"></canvas>
        </section>
        <aside className="right-panel">

        </aside>

      </main>

      <footer className="statusbar">

        <span>Mouse : (0,0)</span>

        <span>Zoom : 100%</span>

        <span>Ready</span>

      </footer>

    </div>
  );
}

export default App;