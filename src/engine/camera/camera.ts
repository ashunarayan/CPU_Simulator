import Vector2 from "../math/Vector2";

export default class Camera {

    public position: Vector2;

    public zoom: number;

    constructor() {

        this.position = new Vector2();

        this.zoom = 1;

    }
    public move(dx: number, dy: number): void {

    this.position.x += dx;

    this.position.y += dy;

}

public setZoom(value: number): void {

    this.zoom = Math.max(0.1, Math.min(value, 5));

}

public worldToScreen(point: Vector2): Vector2 {

    return point
        .subtract(this.position)
        .multiply(this.zoom);

}
public screenToWorld(point: Vector2): Vector2 {

    return point
        .multiply(1 / this.zoom)
        .add(this.position);

}

public translate(delta: Vector2): void {

    this.position = this.position.add(delta);

}

}