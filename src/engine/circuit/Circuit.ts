import Component from "../components/base/Component";
import Vector2 from "../math/Vector2";
import Wire from "../connection/Wire";
import Pin from "../connection/Pin";
//import Junction from "../connection/Junction";
import LogicState from "../simulation/LogicState";
export default class Circuit {

    private components: Component[] = [];
    private wires: Wire[] = [];

    public add(component: Component): void {

        this.components.push(component);

    }

    public getComponents(): Component[] {

        return this.components;

    }
    public clearSelection(): void {

        for (const component of this.components) {

            component.selected = false;

        }

    }
    public addWire(
        wire: Wire
    ): void {

        this.wires.push(wire);

    }



    public getWires(): Wire[] {

        return this.wires;

    }

    public getPinAt(
        point: Vector2
    ): Pin | null {

        for (
            let i = this.components.length - 1;
            i >= 0;
            i--
        ) {

            const pin =
                this.components[i]
                    .getPinAt(point);

            if (pin) {

                return pin;

            }

        }

        return null;

    }
    public remove(component: Component): void {

        this.components =

            this.components.filter(
                c => c !== component
            );

    }
    public getComponentById(id: number): Component | null {

        for (const component of this.components) {

            if (component.id === id) {

                return component;

            }

        }

        return null;

    }
    public getComponentAt(point: Vector2): Component | null {

        for (
            let i = this.components.length - 1;
            i >= 0;
            i--
        ) {

            const component =
                this.components[i];

            if (
                component.contains(point)
            ) {

                return component;

            }

        }

        return null;

    }

    public clearWireSelection(): void {

        for (const wire of this.wires) {

            wire.selected = false;

        }

    }


    public getWireAt(
        point: Vector2
    ): Wire | null {

        const threshold = 6;

        for (let w = this.wires.length - 1; w >= 0; w--) {

            const wire = this.wires[w];

            let previous =
                wire.vertices[0];

            const points = [...wire.vertices];

            if (wire.to) {

                points.push(
                    wire.to.getWorldPosition()
                );

            }

            for (let i = 1; i < points.length; i++) {

                const current =
                    points[i];

                if (

                    previous.x === current.x

                ) {

                    // Vertical segment

                    if (

                        Math.abs(point.x - previous.x) <= threshold &&

                        point.y >= Math.min(previous.y, current.y) &&

                        point.y <= Math.max(previous.y, current.y)

                    ) {

                        return wire;

                    }

                }
                else {

                    // Horizontal segment

                    if (

                        Math.abs(point.y - previous.y) <= threshold &&

                        point.x >= Math.min(previous.x, current.x) &&

                        point.x <= Math.max(previous.x, current.x)

                    ) {

                        return wire;

                    }

                }

                previous = current;

            }

        }

        return null;

    }
    public removeWire(
    wire: Wire
): void {

    this.wires =
        this.wires.filter(
            w => w !== wire
        );

}
public getSelectedWire(): Wire | null {

    for (const wire of this.wires) {

        if (wire.selected) {

            return wire;

        }

    }

    return null;

}




    public simulate(): void {

        // Pass 1
        for (const component of this.components) {

            component.evaluate();

        }

        for (const wire of this.wires) {

            wire.value = wire.from.value;

            if (wire.to) {

                wire.to.value = wire.value;

            }

        }

        // Pass 2
        for (const component of this.components) {

            component.evaluate();

        }

        for (const wire of this.wires) {

            wire.value = wire.from.value;

            if (wire.to) {

                wire.to.value = wire.value;

            }

        }

    }
}