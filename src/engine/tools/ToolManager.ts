import Tool from "./Tool";

class ToolManager {

    private currentTool = Tool.SELECT;

    public setTool(tool: Tool): void {

        this.currentTool = tool;

    }

    public getTool(): Tool {

        return this.currentTool;

    }

}

export default new ToolManager();