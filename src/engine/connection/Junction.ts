import Vector2 from "../math/Vector2";
import Wire from "./Wire";

export default class Junction {

    constructor(

        public position: Vector2,

        public wires: Wire[] = []

    ) {}

}