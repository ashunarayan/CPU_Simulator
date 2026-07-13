import Pin from "./Pin";
import Vector2 from "../math/Vector2";
import LogicState from "../simulation/LogicState";

export default class Wire {

    public from: Pin;

    public to: Pin | null = null;

    public vertices: Vector2[];

    public value: LogicState = LogicState.LOW;

    public selected = false;

    constructor(from: Pin) {

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

    public finish(pin: Pin): void {

        this.to = pin;

        // Lock both pins
        this.from.connect();

        pin.connect();

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

    public updateSignal(): void {

        this.value = this.from.value;

        if (this.to) {

            this.to.value = this.value;

        }

    }

    public disconnect(): void {

        this.from.disconnect();

        if (this.to) {

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

}