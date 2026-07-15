import Vector2 from "../../math/Vector2";
import Pin from "../../connection/Pin";

export default abstract class Component {

    private static nextId = 1;

    public readonly id: number;

    public position: Vector2;

    public width: number;

    public height: number;

    public selected = false;
    public rotation: number;

    constructor(
        position: Vector2,
        width: number,
        height: number,
        rotation = 0
    ) {

        this.id = Component.nextId++;

        this.position = position;

        this.width = width;

        this.height = height;
        this.rotation = rotation;

    }

    // Subclasses draw in LOCAL, unrotated coordinates (0,0 to width,height),
    // exactly as before. Component.draw() applies the rotation transform
    // ONCE, centrally, so no gate ever writes rotation math itself.
    protected abstract drawShape(
        ctx: CanvasRenderingContext2D
    ): void;

    public draw(ctx: CanvasRenderingContext2D): void {
        

        const pivot = this.getCenter();

        ctx.save();

        ctx.translate(
            this.position.x + pivot.x,
            this.position.y + pivot.y
        );

        ctx.rotate(this.rotation * Math.PI / 180);

        ctx.translate(-pivot.x, -pivot.y);

        this.drawShape(ctx);

        ctx.restore();

    }

    // Single source of truth for local -> world space conversion.
    // Anything local to the component (pins, future sub-elements) goes
    // through here, so it can never drift out of sync with what's drawn.
    public localToWorld(local: Vector2): Vector2 {

    const pivot = this.getCenter();

    const dx = local.x - pivot.x;
    const dy = local.y - pivot.y;

    let rx = dx;
    let ry = dy;

    switch (this.rotation) {

        case 90:
            rx = -dy;
            ry = dx;
            break;

        case 180:
            rx = -dx;
            ry = -dy;
            break;

        case 270:
            rx = dy;
            ry = -dx;
            break;

    }

    return new Vector2(

        this.position.x + pivot.x + rx,

        this.position.y + pivot.y + ry

    );

}

    public contains(point: Vector2): boolean {

    const w = this.rotation % 180 === 0
        ? this.width
        : this.height;

    const h = this.rotation % 180 === 0
        ? this.height
        : this.width;

    const cx = this.position.x + this.width / 2;
    const cy = this.position.y + this.height / 2;

    return (

        point.x >= cx - w / 2 &&

        point.x <= cx + w / 2 &&

        point.y >= cy - h / 2 &&

        point.y <= cy + h / 2

    );

}
public isSequential(): boolean {

    return false;

}



    public getCenter(): Vector2 {

        return new Vector2(

            this.width / 2,

            this.height / 2

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

    public getPinAt(point: Vector2): Pin | null {

        for (const pin of this.pins) {

            if (pin.contains(point)) {

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

    public isVertical(): boolean {

        return this.rotation === 90 ||
               this.rotation === 270;

    }



    // --- Rotation -----------------------------------------------------
    // A component can rotate freely as long as none of its pins have a
    // wire attached. The instant one connects, this permanently locks -
    // wires are never auto-rerouted, so a rotated-after-wiring component
    // would silently detach its connections.

    public canRotate(): boolean {

    return this.pins.every(

        pin => !pin.isConnected()

    );

}

    public rotate(): void {

        if (!this.canRotate()) return;

        this.rotation = (this.rotation + 90) % 360;

    }

    public serialize() {

    return {

        id: this.id,

        type: this.constructor.name,

        x: this.position.x,

        y: this.position.y,

        rotation: this.rotation

    };

}

}