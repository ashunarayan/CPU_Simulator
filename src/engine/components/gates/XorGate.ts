import Component from "../base/Component";
import Vector2 from "../../math/Vector2";
import Pin from "../../connection/Pin";
import PinType from "../../connection/PinType";
import LogicState from "../../simulation/LogicState";

export default class XorGate extends Component {

    constructor(
        position: Vector2,
        rotation = 0
    ) {

        super(position, 70, 60, rotation);

        this.pins.push(
            new Pin(
                this.id,
                new Vector2(0, 15),
                PinType.INPUT
            )
        );

        this.pins.push(
            new Pin(
                this.id,
                new Vector2(0, 45),
                PinType.INPUT
            )
        );

        this.pins.push(
            new Pin(
                this.id,
                new Vector2(70, 30),
                PinType.OUTPUT
            )
        );

    }

    public draw(
        ctx: CanvasRenderingContext2D
    ): void {

        ctx.save();

        ctx.translate(
            this.position.x,
            this.position.y
        );

        ctx.fillStyle = "#2e2e2e";

        ctx.strokeStyle =
            this.selected
                ? "#4FC3F7"
                : "#ffffff";

        ctx.lineWidth =
            this.selected ? 3 : 2;

        ctx.beginPath();

        ctx.moveTo(5, 0);

        ctx.quadraticCurveTo(
            35,
            30,
            5,
            60
        );

        ctx.quadraticCurveTo(
            50,
            60,
            70,
            30
        );

        ctx.quadraticCurveTo(
            50,
            0,
            5,
            0
        );

        ctx.fill();

        ctx.stroke();

        ctx.restore();

    }

    public override evaluate(): void {

        const a = this.pins[0].value;

        const b = this.pins[1].value;

        this.pins[2].value =

            a !== b
                ? LogicState.HIGH
                : LogicState.LOW;

    }

}