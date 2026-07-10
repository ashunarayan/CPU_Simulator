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

        const last =
            this.vertices[
                this.vertices.length - 1
            ];

        if (
            last &&
            last.x === point.x &&
            last.y === point.y
        ) {
            return;
        }

        this.vertices.push(point);

    }

    public getLastVertex(): Vector2 {

        return this.vertices[
            this.vertices.length - 1
        ];

    }

}