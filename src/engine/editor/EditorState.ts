import Tool from "../tools/Tool";
import Vector2 from "../math/Vector2";
import Component from "../components/base/Component";
import Pin from "../connection/Pin";
export default class EditorState {
    

    public currentTool: Tool = Tool.SELECT;

    public mouseWorld = new Vector2();
    public showGhost = true;
    public draggingComponent = false;

    public dragOffset = new Vector2();

    public selectedComponent: Component | null = null;
     public selectedPin: Pin | null = null;
     public wirePreview = false;
}