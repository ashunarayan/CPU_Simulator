import Tool from "../engine/tools/Tool";
import ToolManager from "../engine/tools/ToolManager";

// Add future gates here - each entry becomes one button, in order.
// No JSX gets duplicated per tool.
const TOOL_BUTTONS: { tool: Tool; label: string }[] = [
  { tool: Tool.SELECT, label: "Select" },
  { tool: Tool.WIRE, label: "Wire" },
  { tool: Tool.AND, label: "AND" },
  { tool: Tool.OR, label: "OR" },
  { tool: Tool.NOT, label: "NOT" },
  { tool: Tool.XOR, label: "XOR" },
  { tool: Tool.SWITCH, label: "Switch" },
  { tool: Tool.LED, label: "LED" },
  { tool: Tool.D_FLIP_FLOP, label: "DFF" },
];

interface ToolbarProps {
  activeTool: Tool;
  onFileClick: () => void;
}

export default function Toolbar({ activeTool, onFileClick }: ToolbarProps) {

  return (
    <header className="toolbar">

      <div className="file-menu">

    <button
        className="toolbar-file"
        onClick={onFileClick}
    >
        📁 File
    </button>

</div>

      <div className="toolbar-divider" />

      <div className="toolbar-tools">

        {TOOL_BUTTONS.map(({ tool, label }) => (
          <button
            key={label}
            className={
              activeTool === tool ? "active-tool" : ""
            }
            onClick={() => ToolManager.setTool(tool)}
          >
            {label}
          </button>
        ))}

      </div>

    </header>
  );

}