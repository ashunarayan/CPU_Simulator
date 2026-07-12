import Circuit from "../circuit/Circuit";
import Camera from "../camera/camera";
import Vector2 from "../math/Vector2";
import Wire from "../connection/Wire";
import LogicState from "../simulation/LogicState";
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


        ctx.lineWidth = 2;
        ctx.setLineDash([]);

        for (const wire of circuit.getWires()) {

            ctx.strokeStyle =
                wire.value === LogicState.HIGH
                    ? "#2E7D32"
                    : "#4FC3F7";

            const fromComponent =
                circuit.getComponentById(
                    wire.from.ownerId
                );

            if (!fromComponent)
                continue;

            wire.from.setOwnerPosition(
                fromComponent.position
            );

            ctx.beginPath();

            const start =
                wire.from.getWorldPosition();

            ctx.moveTo(
                start.x,
                start.y
            );

            // Draw every stored vertex
            for (let i = 1; i < wire.vertices.length; i++) {

                const vertex =
                    wire.vertices[i];

                ctx.lineTo(
                    vertex.x,
                    vertex.y
                );

            }

            // Draw final pin
            if (wire.to) {

                const toComponent =
                    circuit.getComponentById(
                        wire.to.ownerId
                    );

                if (toComponent) {

                    wire.to.setOwnerPosition(
                        toComponent.position
                    );

                    const end =
                        wire.to.getWorldPosition();

                    ctx.lineTo(
                        end.x,
                        end.y
                    );

                }

            }

            ctx.stroke();

        }

        ctx.restore();

    }


    public drawPreview(
        ctx: CanvasRenderingContext2D,
        wire: Wire,
        mouse: Vector2,
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

        ctx.strokeStyle = "#FFD54F";
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);

        ctx.beginPath();

        const start =
            wire.from.getWorldPosition();

        ctx.moveTo(
            start.x,
            start.y
        );

        // Draw committed vertices
        for (let i = 1; i < wire.vertices.length; i++) {

            const vertex = wire.vertices[i];

            ctx.lineTo(
                vertex.x,
                vertex.y
            );

        }

        // Last committed point
        const last =
            wire.getLastVertex();

        // Orthogonal preview
        ctx.lineTo(
            mouse.x,
            last.y
        );

        ctx.lineTo(
            mouse.x,
            mouse.y
        );

        ctx.stroke();

        ctx.restore();

    }
}