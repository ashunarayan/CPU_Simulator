export default class Vector2 {

    public x: number;
    public y: number;

    constructor(x = 0, y = 0) {

        this.x = x;
        this.y = y;

    }

    public set(x: number, y: number): void {

        this.x = x;
        this.y = y;

    }

    public copy(): Vector2 {

        return new Vector2(this.x, this.y);

    }

    public add(v: Vector2): Vector2 {

        return new Vector2(
            this.x + v.x,
            this.y + v.y
        );

    }

    public subtract(v: Vector2): Vector2 {

        return new Vector2(
            this.x - v.x,
            this.y - v.y
        );

    }

    public multiply(value: number): Vector2 {

        return new Vector2(
            this.x * value,
            this.y * value
        );

    }

}