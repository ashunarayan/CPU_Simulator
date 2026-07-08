import Component from "./Component";
import Vector2 from "../math/Vector2";

export default class AndGate extends Component {

    constructor(position: Vector2) {

        super(position);

    }

    public draw(
        ctx: CanvasRenderingContext2D
    ): void {

        ctx.fillStyle = "#4ade80";

        ctx.fillRect(
            this.position.x,
            this.position.y,
            50,
            40
        );

    }

}