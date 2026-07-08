import Circuit from "../circuit/Circuit";
import Camera from "../camera/camera";
import AndGate from "../components/AndGate";

export default class ComponentRenderer {

    public draw(
        ctx: CanvasRenderingContext2D,
        circuit: Circuit,
        camera: Camera
    ): void {

        for (const component of circuit.getComponents()) {

            if (component instanceof AndGate) {

                const screen = camera.worldToScreen(component.position);

                ctx.fillStyle = "#4ade80";

                ctx.fillRect(
                    screen.x,
                    screen.y,
                    60,
                    40
                );

            }

        }

    }

}