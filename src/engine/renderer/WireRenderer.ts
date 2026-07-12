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



        ctx.setLineDash([]);

        for (const wire of circuit.getWires()) {

            if (wire.selected) {

                ctx.strokeStyle = "#FF9800";

            }
            else if (

                wire.value === LogicState.HIGH

            ) {

                ctx.strokeStyle = "#2E7D32";

            }
            else {

                ctx.strokeStyle = "#4FC3F7";

            }

            if (wire.value === LogicState.HIGH) {

                ctx.shadowBlur = 8;
                ctx.shadowColor = "#43A047";

            }
            else {

                ctx.shadowBlur = 0;

            }
            if (wire.selected) {

                ctx.lineWidth = 4;

            }
            else if (wire.value === LogicState.HIGH) {

                ctx.lineWidth = 3;

            }
            else {

                ctx.lineWidth = 2;

            }

            const fromComponent =
                circuit.getComponentById(
                    wire.from.ownerId
                );

            if (!fromComponent)
                continue;

            wire.from.setOwnerPosition(
                fromComponent.position
            );
            wire.from.setOwnerRotation(
                fromComponent.rotation
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
                    wire.to.setOwnerRotation(
                        toComponent.rotation
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