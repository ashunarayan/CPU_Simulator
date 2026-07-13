import Circuit from "../circuit/Circuit";
import Camera from "../camera/camera";
import Vector2 from "../math/Vector2";

export default class ComponentRenderer {

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

        for (const component of circuit.getComponents()) {
            

            component.draw(ctx);

            for (const pin of component.getPins()) {

                // Pin.getWorldPosition() now derives directly from its
                // owner - no manual position/rotation sync needed here.
                const world =
                    pin.getWorldPosition();

                ctx.beginPath();

                ctx.fillStyle = "#FFD54F";

                ctx.arc(
                    world.x,
                    world.y,
                    4,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

            }
        }

        ctx.restore();

    }
    
}