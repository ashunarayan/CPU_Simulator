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
import Switch from "../components/input/Switch";
import OutputLed from "../components/input/OutputLed";
import OrGate from "../components/gates/OrGate";
import NotGate from "../components/gates/NotGate";
import XorGate from "../components/gates/XorGate";



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

        this.circuit.add(
            new OutputLed(
                new Vector2(600, 200)
            )
        );

        this.circuit.add(
            new Switch(
                new Vector2(80, 120)
            )
        );

        this.circuit.add(
            new Switch(
                new Vector2(80, 220)
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

    private selectWire(
        wire: Wire | null
    ): void {

        this.circuit.clearWireSelection();

        if (wire) {

            wire.selected = true;

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

                this.placeOrGate(e);

                break;

            case Tool.NOT:

                this.placeNotGate(e);

                break;

            case Tool.XOR:

                this.placeXorGate(e);

                break;
            case Tool.SWITCH:

                this.placeSwitch(e);

                break;

            case Tool.LED:

                this.placeLed(e);

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

    // -------------------------
    // Check Component
    // -------------------------

    const hit =
        this.circuit.getComponentAt(world);

    if (hit) {

        this.selectWire(null);

        this.selectComponent(hit);

        // Toggle switch
        if (hit instanceof Switch) {

            hit.onClick();

            return;

        }

        this.editorState.draggingComponent = true;

        this.editorState.dragOffset =
            world.subtract(hit.position);

        return;

    }

    // -------------------------
    // Check Wire
    // -------------------------

    const wire =
        this.circuit.getWireAt(world);

    this.selectComponent(null);

    this.selectWire(wire);

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

    // Delete
    if (e.key === "Delete") {

        // Delete selected component
        if (this.editorState.selectedComponent) {

            this.circuit.remove(
                this.editorState.selectedComponent
            );

            this.editorState.selectedComponent = null;

            return;

        }

        // Delete selected wire
        const wire =
            this.circuit.getSelectedWire();

        if (wire) {

            this.circuit.removeWire(wire);

            return;

        }

    }

    // Cancel wire drawing
    if (
        e.key === "Escape" &&
        this.editorState.currentWire
    ) {

        this.editorState.currentWire = null;

        this.editorState.wiring = false;

        return;

    }
    if (e.key === "r" || e.key === "R") {

    this.editorState.placementRotation =

        (this.editorState.placementRotation + 90) % 360;

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

    private placeOrGate(e: MouseEvent): void {

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

            new OrGate(
                new Vector2(x, y)
            )

        );

    }


    private placeNotGate(e: MouseEvent): void {

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

            new NotGate(
                new Vector2(x, y)
            )

        );

    }

    private placeXorGate(e: MouseEvent): void {

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

            new XorGate(
                new Vector2(x, y)
            )

        );

    }


    private placeSwitch(
        e: MouseEvent
    ): void {

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

            new Switch(

                new Vector2(
                    x,
                    y
                )

            )

        );

    }
    private placeLed(e: MouseEvent): void {

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

            new OutputLed(
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

    public getMouseWorld(): Vector2 {

    return this.editorState.mouseWorld;

}

public getZoom(): number {

    return this.camera.zoom;

}

public getCurrentTool(): Tool {

    return this.toolManager.getTool();

}


    private render = (): void => {

        this.clear();
        this.circuit.simulate();

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

