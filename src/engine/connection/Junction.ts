import Vector2 from "../math/Vector2";
import LogicState from "../simulation/LogicState";

export default class Junction {

    public position: Vector2;

    public value = LogicState.LOW;

    constructor(position: Vector2) {

        this.position = position;

    }

}