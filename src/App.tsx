
import toolManager from "./engine/tools/ToolManager";
import Tool from "./engine/tools/Tool";
import { useEffect, useRef, useState } from "react";
import "./index.css";
import CanvasRenderer from "./engine/renderer/CanvasRenderer";

function App() {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef =
    useRef<CanvasRenderer | null>(null);

  const [mouse, setMouse] =
    useState("(0,0)");

  const [zoom, setZoom] =
    useState("100%");

  const [tool, setTool] =
    useState("SELECT");

  useEffect(() => {

    if (!canvasRef.current)
      return;

    rendererRef.current =

      new CanvasRenderer(
        canvasRef.current
      );

  }, []);

  useEffect(() => {

    const timer = setInterval(() => {

      if (!rendererRef.current)
        return;

      const pos =
        rendererRef.current.getMouseWorld();

      setMouse(

        `(${Math.round(pos.x)}, ${Math.round(pos.y)})`

      );

      setZoom(

        `${Math.round(

          rendererRef.current.getZoom() * 100

        )}%`

      );

      setTool(

        Tool[
        rendererRef.current.getCurrentTool()
        ]

      );

    }, 40);

    return () => clearInterval(timer);

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

          <button onClick={() => toolManager.setTool(Tool.SELECT)}>
            Select
          </button>

          <button
            className={
              toolManager.getTool() === Tool.WIRE
                ? "active-tool"
                : ""
            }
            onClick={() => toolManager.setTool(Tool.WIRE)}
          >
            Wire
          </button>

          <button onClick={() => toolManager.setTool(Tool.AND)}>
            AND
          </button>

          <button onClick={() => toolManager.setTool(Tool.OR)}>
            OR
          </button>

          <button onClick={() => toolManager.setTool(Tool.NOT)}>
            NOT
          </button>

          <button onClick={() => toolManager.setTool(Tool.XOR)}>
            XOR
          </button>

          <button onClick={() => toolManager.setTool(Tool.SWITCH)}>
            Switch
          </button>

          <button onClick={() => toolManager.setTool(Tool.LED)}>
            LED
          </button>

        </aside>

        <section className="canvas-container">
          <canvas ref={canvasRef} className="editor-canvas"></canvas>
        </section>
        <aside className="right-panel">

        </aside>

      </main>

      <footer className="statusbar">

        <span>Mouse : {mouse}</span>

        <span>Zoom : {zoom}</span>

        <span>Tool : {tool}</span>

      </footer>

    </div>
  );
}

export default App;