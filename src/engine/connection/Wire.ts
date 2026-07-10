import Pin from "./Pin";
import Vector2 from "../math/Vector2";

export default class Wire {

    public from: Pin;

    public to: Pin | null;

    public vertices: Vector2[];

    constructor(from: Pin) {

        this.from = from;

        this.to = null;

        this.vertices = [
            from.getWorldPosition()
        ];

    }

    public addVertex(point: Vector2): void {

    const GRID = 20;

    // Snap to grid
    const snapped = new Vector2(

        Math.round(point.x / GRID) * GRID,

        Math.round(point.y / GRID) * GRID

    );

    const last = this.getLastVertex();

    // Already aligned
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

    // Orthogonal corner
    const corner = new Vector2(

        snapped.x,

        last.y

    );

    this.vertices.push(corner);

}

public finish(pin: Pin): void {

    this.to = pin;

    const end = pin.getWorldPosition();

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

}
    public getLastVertex(): Vector2 {

        return this.vertices[
            this.vertices.length - 1
        ];

    }

}