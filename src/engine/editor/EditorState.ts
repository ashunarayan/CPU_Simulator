import Tool from "../tools/Tool";
import Vector2 from "../math/Vector2";
import Component from "../components/base/Component";
import Wire from "../connection/Wire";

export default class EditorState {

    public currentTool: Tool = Tool.SELECT;

    public mouseWorld = new Vector2();

    public placementRotation = 0;

    public draggingComponent = false;

    public dragOffset = new Vector2();

    public selectedComponent: Component | null = null;

    public wiring = false;

    public currentWire: Wire | null = null;

    public selectedComponents: Component[] = [];

    public selectionBoxActive = false;

    public selectionStart = new Vector2();

    public selectionEnd = new Vector2();
    public multiDragOffsets = new Map<Component, Vector2>();
}