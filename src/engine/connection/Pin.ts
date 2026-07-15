import Vector2 from "../math/Vector2";
import PinType from "./PinType";
import LogicState from "../simulation/LogicState";
import type Component from "../components/base/Component";

export default class Pin {

    // Local, unrotated offset from the owner's top-left corner.
    public position: Vector2;

    public readonly type: PinType;

    public value: LogicState = LogicState.LOW;

    // Set true once a wire fully connects to this pin (see Wire.finish()).
    // Component.canRotate() reads this to permanently lock rotation.
    private connectionCount = 0;

    private readonly owner: Component;

    constructor(
        owner: Component,
        position: Vector2,
        type: PinType
    ) {

        this.owner = owner;
        this.position = position;
        this.type = type;

    }

    // Kept for anything elsewhere that still keys off ownerId.
    public get ownerId(): number {

        return this.owner.id;

    }

    // The owner is the single source of truth for position + rotation,
    // so this can never go stale the way a manually-synced copy could.
    public getWorldPosition(): Vector2 {

        return this.owner.localToWorld(this.position);

    }

    public contains(point: Vector2): boolean {

        const world =
            this.getWorldPosition();

        const dx =
            point.x - world.x;

        const dy =
            point.y - world.y;

        return dx * dx + dy * dy <= 36;

    }

    public connect(): void {

    this.connectionCount++;

}

public disconnect(): void {

    if (this.connectionCount > 0) {

        this.connectionCount--;

    }

}

public isConnected(): boolean {

    return this.connectionCount > 0;

}
public getIndex(): number {

    return this.owner.getPins().indexOf(this);

}

}