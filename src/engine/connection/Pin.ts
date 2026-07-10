import Vector2 from "../math/Vector2";
import PinType from "./PinType";

export default class Pin {

    public position: Vector2;

    private ownerPosition = new Vector2();

    public readonly type: PinType;

    public readonly ownerId: number;

    public value = false;

    constructor(
        ownerId: number,
        position: Vector2,
        type: PinType
    ) {

        this.ownerId = ownerId;
        this.position = position;
        this.type = type;

    }

    public setOwnerPosition(
        position: Vector2
    ): void {

        this.ownerPosition = position;

    }

    public getWorldPosition(): Vector2 {

        return this.ownerPosition.add(
            this.position
        );

    }

    public contains(
        point: Vector2
    ): boolean {

        const world =
            this.getWorldPosition();

        const dx =
            point.x - world.x;

        const dy =
            point.y - world.y;

        return dx * dx + dy * dy <= 36;

    }

}