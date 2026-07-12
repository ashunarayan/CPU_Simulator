import Component from "../base/Component";
import Vector2 from "../../math/Vector2";
import Pin from "../../connection/Pin";
import PinType from "../../connection/PinType";
import LogicState from "../../simulation/LogicState";

export default class Switch extends Component {

    private state = LogicState.LOW;

    constructor(position: Vector2) {

        super(position, 50, 30);

        this.pins.push(

            new Pin(
                this.id,
                new Vector2(50, 15),
                PinType.OUTPUT
            )

        );

    }

    public toggle(): void {

        this.state =

            this.state === LogicState.LOW

                ? LogicState.HIGH

                : LogicState.LOW;

        this.pins[0].value = this.state;

    }

    public getState(): LogicState {

        return this.state;

    }

   public draw(
    ctx: CanvasRenderingContext2D
): void {

    ctx.save();

    ctx.translate(
        this.position.x,
        this.position.y
    );

    // Body
    ctx.fillStyle = "#2A2A2A";
    ctx.strokeStyle = "#9E9E9E";
    ctx.lineWidth = 1.5;

    ctx.beginPath();

    ctx.roundRect(
        10,
        8,
        24,
        12,
        6
    );

    ctx.fill();
    ctx.stroke();

    // Knob
    const knobX =
        this.state === LogicState.HIGH
            ? 28
            : 16;

    ctx.fillStyle =
        this.state === LogicState.HIGH
            ? "#4CAF50"
            : "#F44336";

    ctx.beginPath();

    ctx.arc(
        knobX,
        14,
        5,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // Small highlight
    ctx.fillStyle = "rgba(255,255,255,0.35)";

    ctx.beginPath();

    ctx.arc(
        knobX - 1,
        12.5,
        1.5,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();

}
public override onClick(): void {

    this.toggle();

}
}