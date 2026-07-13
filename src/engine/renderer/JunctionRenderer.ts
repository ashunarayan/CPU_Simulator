import Circuit from "../circuit/Circuit";
import Camera from "../camera/camera";

export default class JunctionRenderer {

    public draw(
        ctx: CanvasRenderingContext2D,
        circuit: Circuit,
        camera: Camera
    ): void {

        ctx.save();

        ctx.translate(
            -camera.position.x * camera.zoom,
            -camera.position.y * camera.zoom
        );

        ctx.scale(
            camera.zoom,
            camera.zoom
        );

        ctx.fillStyle = "#FFD54F";

        for (const junction of circuit.getJunctions()) {

            ctx.beginPath();

            ctx.arc(

                junction.position.x,

                junction.position.y,

                4,

                0,

                Math.PI * 2

            );

            ctx.fill();

        }

        ctx.restore();

    }

}