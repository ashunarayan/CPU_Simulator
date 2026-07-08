import Tool from "../tools/Tool";
import Vector2 from "../math/Vector2";
import Component from "../components/Component";

export default class EditorState {

    public currentTool: Tool = Tool.SELECT;

    public mouseWorld = new Vector2();

    public selectedComponent: Component | null = null;

}