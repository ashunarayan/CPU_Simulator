import Component from "../base/Component";
import Vector2 from "../../math/Vector2";
import Pin from "../../connection/Pin";
import PinType from "../../connection/PinType";
import LogicState from "../../simulation/LogicState";

export default class OutputLed extends Component {

    constructor(
    position: Vector2,
    rotation = 0
) {

        super(position, 18, 18, rotation);

        this.pins.push(

            new Pin(
                this.id,
                new Vector2(0, 9),
                PinType.INPUT
            )

        );

    }

    public override evaluate(): void {
        // Nothing to calculate.
    }

    public draw(
        ctx: CanvasRenderingContext2D
    ): void {

        ctx.save();

        ctx.translate(
            this.position.x,
            this.position.y
        );

        // Outer body
        ctx.fillStyle = "#2B2B2B";
        ctx.strokeStyle = "#909090";
        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.roundRect(
            0,
            0,
            18,
            18,
            4
        );

        ctx.fill();
        ctx.stroke();

        const on =
            this.pins[0].value === LogicState.HIGH;

        if (on) {

            ctx.shadowBlur = 18;
            ctx.shadowColor = "#FF3B30";

            ctx.fillStyle = "#FF3B30";

        }
        else {

            ctx.shadowBlur = 0;

            ctx.fillStyle = "#5A1414";

        }

        ctx.beginPath();

        ctx.arc(
            9,
            9,
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // White reflection
        if (on) {

            ctx.shadowBlur = 0;

            ctx.fillStyle =
                "rgba(255,255,255,0.6)";

            ctx.beginPath();

            ctx.arc(
                7,
                7,
                1.5,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }

        ctx.restore();

    }
}