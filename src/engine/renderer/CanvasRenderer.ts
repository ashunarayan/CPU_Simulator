import Camera from "../camera/camera";
import GridRenderer from "./GridRenderer";
import Vector2 from "../math/Vector2";
import Circuit from "../circuit/Circuit";
import Wire from "../connection/Wire";
import AndGate from "../components/gates/AndGate";
import Component from "../components/base/Component";
import ComponentRenderer from "./ComponentRenderer";
import ToolManager from "../tools/ToolManager";
import Tool from "../tools/Tool";
import InputManager from "../input/InputManager";
import EditorState from "../editor/EditorState";
import WireRenderer from "./WireRenderer";


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
    private toolManager = ToolManager;
    private editorState: EditorState;
    private inputManager: InputManager;
    private wireRenderer =
        new WireRenderer();


    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.camera = new Camera();
        this.toolManager = ToolManager;
        this.gridRenderer = new GridRenderer();
        this.circuit = new Circuit();

        this.circuit.add(
            new AndGate(
                new Vector2(200, 150)
            )
        );

        this.canvas.addEventListener("wheel", this.onWheel);

        this.canvas.addEventListener("mousedown", this.onMouseDown);
        this.componentRenderer = new ComponentRenderer();

        this.editorState = new EditorState();
        this.inputManager =
            new InputManager(
                this.toolManager,
                this.editorState
            );


        window.addEventListener("mousemove", this.onMouseMove);

        window.addEventListener("mouseup", this.onMouseUp);
        window.addEventListener(
            "keydown",
            this.onKeyDown
        );

        const context = canvas.getContext("2d");

        if (!context) {
            throw new Error("Unable to get 2D rendering context.");
        }

        this.ctx = context;

        this.resize();

        window.addEventListener("resize", this.onResize);

        this.render();
    }



    private selectComponent(component: Component | null): void {

        this.circuit.clearSelection();

        if (component) {

            component.selected = true;

            this.editorState.selectedComponent = component;

        }
        else {

            this.editorState.selectedComponent = null;

        }

    }
    private onMouseDown = (e: MouseEvent): void => {

        if (e.button === 1) {

            this.startCameraDrag(e);
            return;

        }

        if (e.button !== 0)
            return;

        switch (this.toolManager.getTool()) {

            case Tool.WIRE:

                this.onWireClick(e);

                break;

            case Tool.SELECT:

                this.onLeftMouseDown(e);
                break;

            case Tool.AND:

                this.placeAndGate(e);
                break;

            case Tool.OR:

                // later

                break;

            case Tool.NOT:

                // later

                break;

        }

    }

    private onMouseUp = (): void => {

        this.dragging = false;

        this.editorState.draggingComponent = false;

    }

    private onMouseMove = (e: MouseEvent): void => {
        const mouse = new Vector2(
            e.offsetX,
            e.offsetY
        );

        this.editorState.mouseWorld =
            this.camera.screenToWorld(mouse);
        // Component Drag
        if (
            this.editorState.draggingComponent &&
            this.editorState.selectedComponent
        ) {

            const mouse = new Vector2(
                e.offsetX,
                e.offsetY
            );



            const world =
                this.camera.screenToWorld(mouse);

            const position =

                world.subtract(
                    this.editorState.dragOffset
                );

            const snappedX =

                Math.round(position.x / 20) * 20;

            const snappedY =

                Math.round(position.y / 20) * 20;

            this.editorState.selectedComponent.moveTo(

                new Vector2(
                    snappedX,
                    snappedY
                )

            );

            return;

        }
        if (this.editorState.wiring) {

            return;

        }

        // Camera Pan
        if (!this.dragging)
            return;

        const dx = e.clientX - this.lastMouseX;

        const dy = e.clientY - this.lastMouseY;

        this.camera.move(
            -dx / this.camera.zoom,
            -dy / this.camera.zoom
        );

        this.lastMouseX = e.clientX;

        this.lastMouseY = e.clientY;

    }

    private onLeftMouseDown(e: MouseEvent): void {

        const mouse = new Vector2(
            e.offsetX,
            e.offsetY
        );

        const world =
            this.camera.screenToWorld(mouse);

        const hit =
            this.circuit.getComponentAt(world);

        this.selectComponent(hit);

        if (hit) {

            this.editorState.draggingComponent = true;

            this.editorState.dragOffset =
                world.subtract(hit.position);

        }

    }


    private onWireClick(
        e: MouseEvent
    ): void {

        const mouse = new Vector2(
            e.offsetX,
            e.offsetY
        );

        const world =
            this.camera.screenToWorld(mouse);

        // Snap to grid
        const snapped = new Vector2(
            Math.round(world.x / 20) * 20,
            Math.round(world.y / 20) * 20
        );

        // ------------------------------
        // First click -> Start wire
        // ------------------------------

        if (!this.editorState.currentWire) {

            const pin =
                this.circuit.getPinAt(world);

            if (!pin)
                return;

            pin.setOwnerPosition(
                this.circuit
                    .getComponentById(pin.ownerId)!
                    .position
            );

            this.editorState.currentWire =
                new Wire(pin);

            this.editorState.wiring = true;

            return;

        }

        const wire =
            this.editorState.currentWire;

        // ------------------------------
        // Finish on another pin
        // ------------------------------

        const endPin =
            this.circuit.getPinAt(world);

        if (
            endPin &&
            endPin !== wire.from
        ) {

            endPin.setOwnerPosition(
                this.circuit
                    .getComponentById(endPin.ownerId)!
                    .position
            );

            wire.finish(endPin);

            wire.addVertex(
                endPin.getWorldPosition()
            );

            this.circuit.addWire(wire);

            this.editorState.currentWire = null;
            this.editorState.wiring = false;

            return;

        }

        // ------------------------------
        // Empty space -> Add bend
        // ------------------------------

        wire.addVertex(snapped);

    }




    private onKeyDown = (
        e: KeyboardEvent
    ): void => {

        if (
            e.key === "Delete" &&
            this.editorState.selectedComponent
        ) {

            this.circuit.remove(

                this.editorState.selectedComponent

            );

            this.editorState.selectedComponent =
                null;

        }

    }

    private placeAndGate(e: MouseEvent): void {

        const mouse = new Vector2(
            e.offsetX,
            e.offsetY
        );

        const world =
            this.camera.screenToWorld(mouse);

        const x =
            Math.round(world.x / 20) * 20;

        const y =
            Math.round(world.y / 20) * 20;

        this.circuit.add(

            new AndGate(
                new Vector2(x, y)
            )

        );

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


    private startCameraDrag(e: MouseEvent): void {

        this.dragging = true;

        this.lastMouseX = e.clientX;

        this.lastMouseY = e.clientY;

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

        this.wireRenderer.draw(
            this.ctx,
            this.circuit,
            this.camera
        );

        // Preview
        if (
    this.editorState.currentWire
) {

    this.wireRenderer.drawPreview(

        this.ctx,

        this.editorState.currentWire,

        this.editorState.mouseWorld,

        this.camera

    );

}

        requestAnimationFrame(this.render);

    }

}

