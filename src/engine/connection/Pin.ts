import Vector2 from "../math/Vector2";
import PinType from "./PinType";

export default class Pin {

    public position: Vector2;

    public readonly type: PinType;

    public readonly ownerId: number;

    public value = false;
    public contains(
    point: Vector2,
    componentPosition: Vector2
): boolean {

    const world =
        this.getWorldPosition(
            componentPosition
        );

    const dx =
        point.x - world.x;

    const dy =
        point.y - world.y;

    return dx * dx + dy * dy <= 36;
}


    constructor(
        ownerId: number,
        position: Vector2,
        type: PinType
    ) {

        this.ownerId = ownerId;
        this.position = position;
        this.type = type;

    }
    public getWorldPosition(
    componentPosition: Vector2
): Vector2 {

    return componentPosition.add(
        this.position
    );

}

}