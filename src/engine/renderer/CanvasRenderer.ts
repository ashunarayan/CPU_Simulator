import Camera from "../camera/camera";
import GridRenderer from "./GridRenderer";
import Vector2 from "../math/Vector2";
import Circuit from "../circuit/Circuit";
import AndGate from "../components/AndGate";
import ComponentRenderer from "./ComponentRenderer";
import ToolManager from "../tools/ToolManager";
import InputManager from "../input/InputManager";
import EditorState from "../editor/EditorState";


export default class CanvasRenderer {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private camera: Camera;
    private dragging = false;
    private gridRenderer: GridRenderer;
    private lastMouseX = 0;

    private lastMouseY = 0;
    private circuit: Circuit;
    private componentRenderer: ComponentRenderer;
    private toolManager: ToolManager;
    private editorState: EditorState;
    private inputManager: InputManager;


    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.camera = new Camera();
        this.gridRenderer = new GridRenderer();
        this.canvas.addEventListener("wheel", this.onWheel);

        this.canvas.addEventListener("mousedown", this.onMouseDown);

        this.circuit = new Circuit();
        this.componentRenderer = new ComponentRenderer();
        this.toolManager = new ToolManager();
        this.editorState = new EditorState();
        this.inputManager =
            new InputManager(
                this.toolManager
            );


        window.addEventListener("mousemove", this.onMouseMove);

        window.addEventListener("mouseup", this.onMouseUp);


        const context = canvas.getContext("2d");

        if (!context) {
            throw new Error("Unable to get 2D rendering context.");
        }

        this.ctx = context;

        this.resize();

        window.addEventListener("resize", this.onResize);

        this.render();
    }


    private onMouseDown = (e: MouseEvent): void => {

        if (e.button !== 1)
            return;

        this.dragging = true;

        this.lastMouseX = e.clientX;

        this.lastMouseY = e.clientY;

    }
    private onMouseUp = (): void => {

        this.dragging = false;

    }
    private onMouseMove = (e: MouseEvent): void => {

        if (!this.dragging)
            return;

        const dx = e.clientX - this.lastMouseX;

        const dy = e.clientY - this.lastMouseY;

        this.camera.move(-dx / this.camera.zoom, -dy / this.camera.zoom);

        this.lastMouseX = e.clientX;

        this.lastMouseY = e.clientY;

    }
    private onWheel = (e: WheelEvent): void => {

        e.preventDefault();

        const factor = e.deltaY > 0 ? 0.9 : 1.1;

        // Mouse position in screen coordinates
        const mouse = new Vector2(
            e.offsetX,
            e.offsetY
        );

        // World position before zoom
        const worldBefore = this.camera.screenToWorld(mouse);

        // Apply zoom
        this.camera.setZoom(
            this.camera.zoom * factor
        );

        // World position after zoom
        const worldAfter = this.camera.screenToWorld(mouse);

        // Difference
        const delta = worldBefore.subtract(worldAfter);

        // Move camera so the point under the cursor stays fixed
        this.camera.translate(delta);

    }


    private onResize = () => {
        this.resize();
    }

    private resize(): void {

        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }

    private clear(): void {

        this.ctx.fillStyle = "#181818";
        this.ctx.fillRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
    }


    private render = (): void => {

        this.clear();

        this.gridRenderer.draw(
            this.ctx,
            this.canvas,
            this.camera
        );

        this.componentRenderer.draw(
            this.ctx,
            this.circuit,
            this.camera
        );
        requestAnimationFrame(this.render);

    }

}

