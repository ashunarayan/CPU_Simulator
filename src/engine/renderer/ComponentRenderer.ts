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

                pin.setOwnerPosition(
                    component.position
                );
                pin.setOwnerRotation(
    component.rotation
);

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
    public drawGhostAndGate(
        ctx: CanvasRenderingContext2D,
        position: Vector2,
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

        const x =
            Math.round(position.x / 20) * 20;

        const y =
            Math.round(position.y / 20) * 20;

        ctx.translate(x, y);

        ctx.globalAlpha = 0.35;

        ctx.fillStyle = "#3d3d3d";

        ctx.strokeStyle = "#ffffff";

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(0, 0);

        ctx.lineTo(35, 0);

        ctx.arc(
            35,
            30,
            30,
            -Math.PI / 2,
            Math.PI / 2
        );

        ctx.lineTo(0, 60);

        ctx.closePath();

        ctx.fill();

        ctx.stroke();

        ctx.restore();

    }

}