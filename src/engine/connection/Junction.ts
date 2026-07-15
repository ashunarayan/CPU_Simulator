import Vector2 from "../math/Vector2";
import LogicState from "../simulation/LogicState";

export default class Junction {

    private static nextId = 1;

    public readonly id = Junction.nextId++;

    public position: Vector2;

    public value = LogicState.LOW;

    constructor(position: Vector2) {

        this.position = position;

    }

    // Lets a Junction stand in for a Pin as a wire endpoint - WireRenderer,
    // Circuit.getWireAt/getWireHit, etc. already call .getWorldPosition()
    // on whatever a wire is connected to, so this is all that's needed
    // for a Junction to work as an endpoint too.
    public getWorldPosition(): Vector2 {

        return this.position;

    }
    public serialize() {

    return {

        id: this.id,

        x: this.position.x,

        y: this.position.y

    };

}

}