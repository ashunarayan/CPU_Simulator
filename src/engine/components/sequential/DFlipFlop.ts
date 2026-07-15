import Component from "../base/Component";
import Vector2 from "../../math/Vector2";
import Pin from "../../connection/Pin";
import PinType from "../../connection/PinType";
import LogicState from "../../simulation/LogicState";

export default class DFlipFlop extends Component {

    private storedState = LogicState.LOW;

    private previousClock = LogicState.LOW;

    constructor(
        position: Vector2,
        rotation = 0
    ) {

        super(position, 50, 60, rotation);
        this.pins.push(

    new Pin(
        this,
        new Vector2(0, 15),
        PinType.INPUT
    ),

    new Pin(
        this,
        new Vector2(0, 45),
        PinType.INPUT
    ),

    new Pin(
        this,
        new Vector2(50, 15),
        PinType.OUTPUT
    ),

    new Pin(
        this,
        new Vector2(50, 45),
        PinType.OUTPUT
    )

);

    }

   

    protected drawShape(
    ctx: CanvasRenderingContext2D
): void {

    ctx.fillStyle = "#2A2A2A";

    ctx.strokeStyle = "white";

    ctx.lineWidth = 2;

    ctx.strokeRect(
        5,
        5,
        40,
        50
    );

    ctx.fillStyle = "white";

    ctx.font = "14px sans-serif";

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    ctx.fillText(
        "D",
        25,
        30
    );

}

public override isSequential(): boolean {

    return true;

}
public evaluate(): void {

    const d =
        this.pins[0].value;

    const clk =
        this.pins[1].value;

    if (

        this.previousClock === LogicState.LOW &&

        clk === LogicState.HIGH

    ) {

        this.storedState = d;

    }

    this.previousClock = clk;

    this.pins[2].value =
        this.storedState;

    this.pins[3].value =

        this.storedState === LogicState.HIGH

            ? LogicState.LOW

            : LogicState.HIGH;

}
public override serialize() {

    return {

        ...super.serialize(),

        storedState: this.storedState

    };

}



}