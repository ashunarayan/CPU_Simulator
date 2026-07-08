import Vector2 from "../math/Vector2";

export default abstract class Component {

    public position: Vector2;

    constructor(position: Vector2) {
        this.position = position;
    }

}