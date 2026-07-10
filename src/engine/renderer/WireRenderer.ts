import Circuit from "../circuit/Circuit";
import Camera from "../camera/camera";
import Vector2 from "../math/Vector2";

export default class WireRenderer {

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

        ctx.strokeStyle = "#4FC3F7";

        ctx.lineWidth = 2;

        for (const wire of circuit.getWires()) {

            const from = wire.from.getWorldPosition(
                circuit.getComponentById(
                    wire.from.ownerId
                )!.position
            );

            const to = wire.to.getWorldPosition(
                circuit.getComponentById(
                    wire.to.ownerId
                )!.position
            );

            ctx.beginPath();

            ctx.moveTo(from.x, from.y);

            ctx.lineTo(to.x, to.y);

            ctx.stroke();

        }

        ctx.restore();

    }
    public drawPreview(

    ctx: CanvasRenderingContext2D,

    start: Vector2,

    end: Vector2,

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

    ctx.setLineDash([8, 8]);

    ctx.strokeStyle = "#FFD54F";

    ctx.beginPath();

    ctx.moveTo(
        start.x,
        start.y
    );

    ctx.lineTo(
        end.x,
        end.y
    );

    ctx.stroke();

    ctx.restore();

}

}