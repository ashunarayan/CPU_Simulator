import Component from "../base/Component";
import Vector2 from "../../math/Vector2";
import Pin from "../../connection/Pin";
import PinType from "../../connection/PinType";

export default class AndGate extends Component {

    constructor(
    position: Vector2,
    rotation = 0
) {

        super(position, 70, 60, rotation);
        console.log("NOT CREATED");
        this.pins.push(

    new Pin(
        this,
        new Vector2(0, 15),
        PinType.INPUT
    )

);

this.pins.push(

    new Pin(
        this,
        new Vector2(0, 45),
        PinType.INPUT
    )

);

this.pins.push(

    new Pin(
        this,
        new Vector2(70, 30),
        PinType.OUTPUT
    )

);

    }

    // Local, unrotated coordinates only - Component.draw() handles the
    // rotation transform before calling this.
    protected drawShape(
    ctx: CanvasRenderingContext2D
): void {
     
    ctx.fillStyle = "#2e2e2e";

    ctx.strokeStyle =
        this.selected
            ? "#4FC3F7"
            : "#ffffff";

    ctx.lineWidth =
        this.selected ? 3 : 2;

    ctx.beginPath();

    // Left side
    ctx.moveTo(0, 0);

    ctx.lineTo(35, 0);

    // Right semicircle
    ctx.arc(
        35,
        30,
        30,
        -Math.PI / 2,
        Math.PI / 2
    );

    ctx.lineTo(0, 60);

    ctx.closePath();

    ctx.fill();

    ctx.stroke();

}
public override evaluate(): void {
   

    const a = this.pins[0].value;

    const b = this.pins[1].value;

    this.pins[2].value =

        a && b;

}
}