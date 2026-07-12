import Component from "../base/Component";
import Vector2 from "../../math/Vector2";
import Pin from "../../connection/Pin";
import PinType from "../../connection/PinType";
import LogicState from "../../simulation/LogicState";

export default class OutputLed extends Component {

    constructor(position: Vector2) {

        super(position, 18, 18);

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

        // Small square body
        ctx.fillStyle = "#303030";
        ctx.strokeStyle = "#9E9E9E";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.roundRect(
            0,
            0,
            18,
            18,
            3
        );
        ctx.fill();
        ctx.stroke();

        const on =
            this.pins[0].value === LogicState.HIGH;

        if (on) {

            ctx.shadowBlur = 10;
            ctx.shadowColor = "#FF3B30";
            ctx.fillStyle = "#FF3B30";

        }
        else {

            ctx.shadowBlur = 0;
            ctx.fillStyle = "#651111";

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

        ctx.restore();

    }

}