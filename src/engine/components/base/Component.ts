import Vector2 from "../../math/Vector2";
import Pin from "../../connection/Pin";
export default abstract class Component {

    private static nextId = 1;

    public readonly id: number;

    public position: Vector2;

    public width: number;

    public height: number;

    public selected = false;

    constructor(
        position: Vector2,
        width: number,
        height: number
    ) {

        this.id = Component.nextId++;

        this.position = position;

        this.width = width;

        this.height = height;

    }

    public abstract draw(
        ctx: CanvasRenderingContext2D
    ): void;

    public contains(point: Vector2): boolean {

    return (

        point.x >= this.position.x &&

        point.x <= this.position.x + this.width &&

        point.y >= this.position.y &&

        point.y <= this.position.y + this.height

    );

}
public moveTo(position: Vector2): void {

    this.position = position;

}
public translate(delta: Vector2): void {

    this.position =
        this.position.add(delta);

}
protected pins: Pin[] = [];
public getPins(): Pin[] {

    return this.pins;

}
public getPinAt(
    point: Vector2
): Pin | null {

    for (const pin of this.pins) {

        pin.setOwnerPosition(
            this.position
        );

        if (
            pin.contains(point)
        ) {

            return pin;

        }

    }

    return null;

}
public onClick(): void {

}
public evaluate(): void {

    // Default: do nothing

}
}