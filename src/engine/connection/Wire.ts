import Pin from "./Pin";
import Junction from "./Junction";
import Vector2 from "../math/Vector2";
import LogicState from "../simulation/LogicState";
import PinType from "./PinType";
// A wire always starts and ends at either a real component Pin, or a
// Junction created by splitting another wire. Both expose the same
// getWorldPosition()/value shape, so nothing else in Wire needs to care
// which one it's holding.
type WireEndpoint = Pin | Junction;

export default class Wire {

    public from: WireEndpoint;

    public to: WireEndpoint | null = null;

    public vertices: Vector2[];

    public value: LogicState = LogicState.LOW;

    public selected = false;

    constructor(from: WireEndpoint) {

        this.from = from;

        // Starting point
        this.vertices = [
            from.getWorldPosition()
        ];

    }

    public addVertex(point: Vector2): void {

        const GRID = 20;

        const snapped = new Vector2(

            Math.round(point.x / GRID) * GRID,

            Math.round(point.y / GRID) * GRID

        );

        const last = this.getLastVertex();

        // Already horizontal / vertical
        if (

            last.x === snapped.x ||

            last.y === snapped.y

        ) {

            if (

                last.x !== snapped.x ||

                last.y !== snapped.y

            ) {

                this.vertices.push(snapped);

            }

            return;

        }

        // Auto 90° corner
        this.vertices.push(

            new Vector2(

                snapped.x,

                last.y

            )

        );

    }

    // Normal wire-to-pin completion - unchanged behaviour.
    public finish(pin: Pin): void {

        this.to = pin;

        // Lock both pins
        if (this.from instanceof Pin) {

            this.from.connect();

        }

        pin.connect();

        const end = pin.getWorldPosition();

        const last = this.getLastVertex();

        if (last.x !== end.x && last.y !== end.y) {
    this.vertices.push(
        new Vector2(end.x, last.y)
    );
}

this.normalizeDirection();
}

    // New: completing a wire onto a Junction instead of a Pin. Only the
    // originating pin (if any) gets locked - a Junction isn't a component
    // pin, so there's nothing on that side to connect/lock.
    public finishAtJunction(junction: Junction): void {

    this.to = junction;

    if (this.from instanceof Pin) {

        this.from.connect();

    }

    // Same corner insertion logic as finish()
    const end = junction.getWorldPosition();

    const last = this.getLastVertex();

    if (

        last.x !== end.x &&

        last.y !== end.y

    ) {

        this.vertices.push(

            new Vector2(

                end.x,

                last.y

            )

        );

    }

    this.normalizeDirection();

}



    public updateSignal(): void {

        this.value = this.from.value;

        if (this.to) {

            this.to.value = this.value;

        }

    }



    public disconnect(): void {

        if (this.from instanceof Pin) {

            this.from.disconnect();

        }

        if (this.to instanceof Pin) {

            this.to.disconnect();

        }

    }

    public isHigh(): boolean {

        return this.value === LogicState.HIGH;

    }

    public getLastVertex(): Vector2 {

        return this.vertices[
            this.vertices.length - 1
        ];

    }
    public serialize() {

    return {

        from: this.serializeEndpoint(this.from),

        to: this.to
            ? this.serializeEndpoint(this.to)
            : null,

        vertices: this.vertices.map(v => ({

            x: v.x,

            y: v.y

        }))

    };

}
private serializeEndpoint(endpoint: any) {

    if ("ownerId" in endpoint) {

        return {

            type: "PIN",

            componentId: endpoint.ownerId,

            pinIndex: endpoint.getIndex()

        };

    }

    return {

        type: "JUNCTION",

        junctionId: endpoint.id

    };

}
private normalizeDirection(): void {

    if (!this.to) return;

    const outputEndedUpAsSink =
        this.to instanceof Pin &&
        this.to.type === PinType.OUTPUT;

    const inputEndedUpAsSource =
        this.from instanceof Pin &&
        this.from.type === PinType.INPUT;

    if (outputEndedUpAsSink || inputEndedUpAsSource) {

        this.swapEndpoints();

    }

}
private swapEndpoints(): void {

    const oldFrom = this.from;
    const oldTo = this.to!;
    const oldBends = this.vertices.slice(1);

    this.from = oldTo;
    this.to = oldFrom;

    this.vertices = [
        oldTo.getWorldPosition(),
        ...oldBends.reverse()
    ];

}
}