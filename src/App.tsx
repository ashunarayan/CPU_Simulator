import Tool from "./engine/tools/Tool";
import { useEffect, useRef, useState } from "react";
import "./index.css";
import CanvasRenderer from "./engine/renderer/CanvasRenderer";
import Toolbar from "./ui/Toolbar";

function App() {

    const canvasRef =
        useRef<HTMLCanvasElement>(null);

    const rendererRef =
        useRef<CanvasRenderer | null>(null);

    const fileInputRef =
        useRef<HTMLInputElement>(null);

    const [tool, setTool] =
        useState<Tool>(Tool.SELECT);

    const [fileMenuOpen, setFileMenuOpen] =
        useState(false);

    useEffect(() => {

        if (!canvasRef.current)
            return;

        if (rendererRef.current)
            return;

        rendererRef.current =
            new CanvasRenderer(canvasRef.current);

    }, []);

    useEffect(() => {

        const timer = setInterval(() => {

            if (!rendererRef.current)
                return;

            setTool(
                rendererRef.current.getCurrentTool()
            );

        }, 40);

        return () => clearInterval(timer);

    }, []);

    const handleFileClick = () => {

        setFileMenuOpen(v => !v);

    };

    const handleOpen = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const file = e.target.files?.[0];

        if (!file)
            return;

        const text =
            await file.text();

        rendererRef.current?.loadCircuit(text);

        e.target.value = "";

    };

    return (

        <div className="app">

            <Toolbar

                activeTool={tool}

                onFileClick={handleFileClick}

            />

            {

                fileMenuOpen &&

                <div className="file-dropdown">

                    <button

                        onClick={() => {

                            rendererRef.current?.newCircuit();

                            setFileMenuOpen(false);

                        }}

                    >

                        New

                    </button>

                    <button

                        onClick={() => {

                            fileInputRef.current?.click();

                            setFileMenuOpen(false);

                        }}

                    >

                        Open...

                    </button>

                    <button

                        onClick={() => {

                            rendererRef.current?.saveCircuit();

                            setFileMenuOpen(false);

                        }}

                    >

                        Save

                    </button>

                </div>

            }

            <main className="workspace">

                <section className="canvas-container">

                    <canvas

                        ref={canvasRef}

                        className="editor-canvas"

                    />

                </section>

            </main>

            <input
    ref={fileInputRef}
    type="file"
    accept=".json"
    style={{ display: "none" }}
    onChange={async (e) => {

    const file =
        e.target.files?.[0];

    if (!file)
        return;

    const text =
        await file.text();

    rendererRef.current?.loadCircuit(text);

}}
/>

        </div>

    );

}

export default App;