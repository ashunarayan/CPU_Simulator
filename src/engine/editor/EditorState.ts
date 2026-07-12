import Tool from "../tools/Tool";
import Vector2 from "../math/Vector2";
import Component from "../components/base/Component";
import Wire from "../connection/Wire";

export default class EditorState {

    public currentTool: Tool = Tool.SELECT;

    public mouseWorld = new Vector2();

    
    // Placement Orientation
public placementRotation = 0;

    // Component Drag
    public draggingComponent = false;

    public dragOffset = new Vector2();

    public selectedComponent: Component | null = null;

    // Wire Tool
    public wiring = false;

    public currentWire: Wire | null = null;

}