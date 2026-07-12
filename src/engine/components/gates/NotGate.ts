import Component from "../base/Component";
import Vector2 from "../../math/Vector2";
import Pin from "../../connection/Pin";
import PinType from "../../connection/PinType";
import LogicState from "../../simulation/LogicState";
export default class NotGate extends Component {

    constructor(
    position: Vector2,
    rotation = 0
) {

        super(position,60,40,rotation);

        this.pins.push(

            new Pin(
                this.id,
                new Vector2(0,20),
                PinType.INPUT
            )

        );

        this.pins.push(

            new Pin(
                this.id,
                new Vector2(60,20),
                PinType.OUTPUT
            )

        );

    }

    public draw(
        ctx:CanvasRenderingContext2D
    ):void{

        ctx.save();

        ctx.translate(
            this.position.x,
            this.position.y
        );

        ctx.fillStyle="#2e2e2e";

        ctx.strokeStyle=
            this.selected
                ? "#4FC3F7"
                : "#ffffff";

        ctx.lineWidth=
            this.selected?3:2;

        ctx.beginPath();

        ctx.moveTo(0,0);

        ctx.lineTo(45,20);

        ctx.lineTo(0,40);

        ctx.closePath();

        ctx.fill();

        ctx.stroke();

        ctx.beginPath();

        ctx.arc(
            50,
            20,
            5,
            0,
            Math.PI*2
        );

        ctx.fill();

        ctx.stroke();

        ctx.restore();

    }

    public override evaluate(): void {

    this.pins[1].value =

        this.pins[0].value === LogicState.HIGH

            ? LogicState.LOW

            : LogicState.HIGH;

}

}