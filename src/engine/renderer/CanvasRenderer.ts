import Camera from "../camera/camera";
import GridRenderer from "./GridRenderer";
import Vector2 from "../math/Vector2";
import Circuit from "../circuit/Circuit";
import Wire from "../connection/Wire";
import Junction from "../connection/Junction";
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
import JunctionRenderer from "./JunctionRenderer";
import CircuitSerializer
    from "../serialization/CircuitSerializer";
import CircuitDeserializer
    from "../serialization/CircuitDeserializer";
import DFlipFlop
    from "../components/sequential/DFlipFlop";
import ComponentFactory from "../components/ComponentFactory";
import Pin from "../connection/Pin";

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
    private junctionRenderer =
        new JunctionRenderer();
    private serializer =
        new CircuitSerializer();
    private deserializer =
        new CircuitDeserializer();



    constructor(canvas: HTMLCanvasElement) {
        console.log("CanvasRenderer CREATED");
        this.canvas = canvas;
        this.camera = new Camera();
        this.toolManager = ToolManager;
        this.gridRenderer = new GridRenderer();
        this.circuit = new Circuit();










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

            this.editorState.selectedComponents = [];

            if (component) {

                this.editorState.selectedComponents.push(component);

            }

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

            case Tool.D_FLIP_FLOP:

                this.placeDFlipFlop(e);

                break;

        }

    }

    private onMouseUp = (): void => {

        this.dragging = false;

        this.editorState.draggingComponent = false;

        if (this.editorState.selectionBoxActive) {

            this.editorState.selectionBoxActive = false;

            const selected =
                this.circuit.getComponentsInside(

                    this.editorState.selectionStart,

                    this.editorState.selectionEnd

                );

            this.circuit.clearSelection();

            this.editorState.selectedComponents = [];

            for (const component of selected) {

                component.selected = true;

                this.editorState.selectedComponents.push(component);

            }

        }

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

            if (this.editorState.selectedComponents.length > 1 &&
                this.editorState.selectedComponent?.selected) {

                for (const component of this.editorState.selectedComponents) {

                    const offset =
                        this.editorState.multiDragOffsets.get(component)!;

                    const position =
                        world.subtract(offset);

                    component.moveTo(

                        new Vector2(

                            Math.round(position.x / 20) * 20,

                            Math.round(position.y / 20) * 20

                        )

                    );

                }

            }
            else {

                const position =
                    world.subtract(
                        this.editorState.dragOffset
                    );

                this.editorState.selectedComponent!.moveTo(

                    new Vector2(

                        Math.round(position.x / 20) * 20,

                        Math.round(position.y / 20) * 20

                    )

                );

            }

            return;

        }
        if (this.editorState.currentWire !== null) {

            return;

        }

        if (this.editorState.selectionBoxActive) {

            this.editorState.selectionEnd =
                this.camera.screenToWorld(mouse);

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

            if (!hit.selected) {

                this.selectComponent(hit);

            }

            // Toggle switch
            if (hit instanceof Switch) {

                hit.onClick();

                this.circuit.simulate();



            }
            this.editorState.selectedComponent = hit;
            this.editorState.draggingComponent = true;

            this.editorState.multiDragOffsets.clear();

            if (hit.selected && this.editorState.selectedComponents.length > 1) {

                for (const component of this.editorState.selectedComponents) {

                    this.editorState.multiDragOffsets.set(

                        component,

                        world.subtract(component.position)

                    );

                }

            } else {

                this.editorState.dragOffset =
                    world.subtract(hit.position);

            }
            return;

        }






        // -------------------------
        // Check Wire
        // -------------------------

        const wire =
            this.circuit.getWireAt(world);

        this.selectComponent(null);

        this.selectWire(wire);

        if (!wire) {

            this.editorState.selectionBoxActive = true;

            this.editorState.selectionStart = world;

            this.editorState.selectionEnd = world;

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

            if (pin) {

                this.editorState.currentWire =
                    new Wire(pin);

                this.editorState.wiring = true;

                return;

            }

            const junction =
                this.circuit.getJunctionAt(world);

            if (junction) {

                this.editorState.currentWire =
                    new Wire(junction);

                this.editorState.wiring = true;

                return;

            }

            return;

        }


        const wire =
            this.editorState.currentWire;



        // ------------------------------
        // Clicked on existing wire
        // ------------------------------

        const hit = this.circuit.getWireHit(world);

        if (hit) {

            // splitWire() truncates the existing wire down to the junction and
            // pushes a new "tail" wire from the junction to its old endpoint.
            // We then finish the wire the user is currently drawing onto that
            // same junction - three wires now meet at one point, like CircuitVerse.
            const junction =
                this.circuit.splitWire(hit.wire, hit.point);

            wire.finishAtJunction(junction);



            this.circuit.addWire(wire);

            this.editorState.currentWire = null;
            this.editorState.wiring = false;

            return;

        }


        // ------------------------------
        // Finish on another pin
        // ------------------------------

        const endPin =
            this.circuit.getPinAt(world);

        if (
            endPin &&
            endPin !== wire.from
        ) {

            // Wire.finish() marks both pins as connected, which
            // permanently locks rotation on both components involved.
            wire.finish(endPin);



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

            // Multiple components selected
            if (this.editorState.selectedComponents.length > 0) {

                this.circuit.removeComponents(
                    this.editorState.selectedComponents
                );

                this.editorState.selectedComponents = [];
                this.editorState.selectedComponent = null;

                return;

            }

            // Selected wire
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

            const selected =
                this.editorState.selectedComponent;

            // If something is selected, R rotates that placed component
            // directly (Component.rotate() is a no-op once it has a
            // connected wire). Otherwise R cycles the rotation that will
            // be used for the next newly-placed component.
            if (
                this.toolManager.getTool() === Tool.SELECT &&
                selected
            ) {

                selected.rotate();

            }
            else {

                this.editorState.placementRotation =
                    (this.editorState.placementRotation + 90) % 360;

            }

            return;

        }
        // Copy selected components
        if (e.ctrlKey && (e.key === "c" || e.key === "C")) {

            e.preventDefault();

            this.copySelection();

            return;

        }

        if (e.ctrlKey && e.key.toLowerCase() === "v") {

            const copied =
                this.editorState.clipboard.paste();
            const mouse =
                this.editorState.mouseWorld;

            const dx =
                mouse.x - copied.origin.x;

            const dy =
                mouse.y - copied.origin.y;

            if (copied.components.length === 0) {

                return;

            }

            const newSelection = [];

            const componentMap =
                new Map<number, Component>();

            for (const original of copied.components) {

                const data = {

                    ...original,

                    x: original.x + dx,

                    y: original.y + dy

                };

                const component =
                    ComponentFactory.create(data);

                this.circuit.add(component);

                componentMap.set(

                    original.id,

                    component

                );

                newSelection.push(component);

            }

            this.pasteWires(

                copied.wires,

                componentMap

            );

            this.editorState.selectedComponents =
                newSelection;

            this.editorState.selectedComponent =
                newSelection[0] ?? null;

            return;

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
                new Vector2(x, y),
                this.editorState.placementRotation
            )
        );
        console.log(
            "COUNT =",
            this.circuit.getComponents().length
        );

        this.toolManager.setTool(Tool.SELECT);

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
                new Vector2(x, y),
                this.editorState.placementRotation
            )

        );
        this.toolManager.setTool(Tool.SELECT);
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
                new Vector2(x, y),
                this.editorState.placementRotation
            )

        );
        this.toolManager.setTool(Tool.SELECT);

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
                new Vector2(x, y),
                this.editorState.placementRotation
            )

        );
        this.toolManager.setTool(Tool.SELECT);

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
                ),
                this.editorState.placementRotation

            )

        );
        this.toolManager.setTool(Tool.SELECT);

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
                new Vector2(x, y),
                this.editorState.placementRotation
            )

        );
        this.toolManager.setTool(Tool.SELECT);

    }
    private placeDFlipFlop(
        e: MouseEvent
    ): void {

        const mouse =
            new Vector2(
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

            new DFlipFlop(

                new Vector2(x, y),

                this.editorState.placementRotation

            )

        );

        this.toolManager.setTool(
            Tool.SELECT
        );

    }
    private copySelection(): void {

        const selected =
            this.circuit.getSelectedComponents();

        const selectedIds =
            new Set(
                selected.map(c => c.id)
            );


        const xs = selected.map(c => c.position.x);
        const ys = selected.map(c => c.position.y);

        const origin = new Vector2(

            Math.min(...xs),

            Math.min(...ys)

        );
        const components =
            selected.map(c => c.serialize());

        const wires =
            this.circuit
                .getWires()
                .filter(wire => {

                    return (

                        wire.from instanceof Pin &&
                        wire.to instanceof Pin &&

                        selectedIds.has(wire.from.ownerId) &&
                        selectedIds.has(wire.to.ownerId)

                    );

                })
                .map(wire => {

                    const start =
                        wire.from.getWorldPosition();

                    return {

                        fromComponentId:
                            (wire.from as Pin).ownerId,

                        fromPinIndex:
                            (wire.from as Pin).getIndex(),

                        toComponentId:
                            (wire.to as Pin).ownerId,

                        toPinIndex:
                            (wire.to as Pin).getIndex(),

                        vertices:

                            wire.vertices
                                .slice(1)
                                .map(v => ({

                                    x: v.x - start.x,

                                    y: v.y - start.y

                                }))

                    };

                });

        this.editorState.clipboard.copy(

            components,
            wires,
            origin

        );

    }

    private pasteWires(
        wires: any[],
        componentMap: Map<number, Component>,

    ): void {

        for (const data of wires) {

            const fromComponent =
                componentMap.get(data.fromComponentId);

            const toComponent =
                componentMap.get(data.toComponentId);

            if (!fromComponent || !toComponent)
                continue;

            const fromPin =
                fromComponent.getPins()[data.fromPinIndex];

            const toPin =
                toComponent.getPins()[data.toPinIndex];

            if (!fromPin || !toPin)
                continue;

            const start =
                fromPin.getWorldPosition();

            const restoredVertices = [

                start,

                ...data.vertices.map(
                    (v: { x: number; y: number }) =>

                        new Vector2(

                            start.x + v.x,

                            start.y + v.y

                        )
                )

            ];

            const wire =
                new Wire(fromPin);

            wire.restore(

                toPin,
                restoredVertices

            );

            this.circuit.addWire(wire);

        }

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
    private drawSelectionBox(): void {

        const start =
            this.editorState.selectionStart;

        const end =
            this.editorState.selectionEnd;

        const x =
            Math.min(start.x, end.x);

        const y =
            Math.min(start.y, end.y);

        const width =
            Math.abs(end.x - start.x);

        const height =
            Math.abs(end.y - start.y);

        this.ctx.save();

        this.ctx.translate(
            -this.camera.position.x * this.camera.zoom,
            -this.camera.position.y * this.camera.zoom
        );

        this.ctx.scale(
            this.camera.zoom,
            this.camera.zoom
        );

        this.ctx.fillStyle =
            "rgba(79,195,247,0.15)";

        this.ctx.strokeStyle =
            "#4FC3F7";

        this.ctx.lineWidth = 1;

        this.ctx.fillRect(
            x,
            y,
            width,
            height
        );

        this.ctx.strokeRect(
            x,
            y,
            width,
            height
        );

        this.ctx.restore();

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


        if (this.editorState.selectionBoxActive) {

            this.drawSelectionBox();

        }

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

        this.junctionRenderer.draw(

            this.ctx,

            this.circuit,

            this.camera

        );




        requestAnimationFrame(this.render);

    }
    public saveCircuit(): void {

        const json =
            this.serializer.save(this.circuit);

        const blob = new Blob(
            [json],
            { type: "application/json" }
        );

        const url =
            URL.createObjectURL(blob);

        const a =
            document.createElement("a");

        a.href = url;

        a.download = "circuit.json";

        a.click();

        URL.revokeObjectURL(url);

    }
    public loadCircuit(json: string): void {

        this.circuit =
            this.deserializer.load(json);

    }
    public newCircuit(): void {

        this.circuit = new Circuit();

    }

}