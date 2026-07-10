import ToolManager from "../tools/ToolManager";
import EditorState from "../editor/EditorState";

export default class InputManager {

    constructor(

        private toolManager: typeof ToolManager,

        private editorState: EditorState

    ) {}

    public onMouseMove(): void {}

    public onMouseDown(): void {}

    public onMouseUp(): void {}

}