import Camera from "../camera/camera";
import Vector2 from "../math/Vector2";
export default class GridRenderer {

    private spacing = 20;

    public draw(
        ctx: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement,
        camera: Camera
    ): void {

        ctx.fillStyle = "#404040";

        // World me visible area nikalo
        const startX = Math.floor(camera.position.x / this.spacing) * this.spacing;
        const startY = Math.floor(camera.position.y / this.spacing) * this.spacing;

        const endX =
            camera.position.x + canvas.width / camera.zoom + this.spacing;

        const endY =
            camera.position.y + canvas.height / camera.zoom + this.spacing;

        for (let x = startX; x <= endX; x += this.spacing) {

            for (let y = startY; y <= endY; y += this.spacing) {

                const screen = camera.worldToScreen(
                    new Vector2(x, y)
                );

                ctx.fillRect(
                    screen.x,
                    screen.y,
                    2,
                    2
                );
            }

        }

    }

}