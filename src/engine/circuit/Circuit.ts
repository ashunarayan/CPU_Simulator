import Component from "../components/base/Component";
import Vector2 from "../math/Vector2";
import Wire from "../connection/Wire";
import Pin from "../connection/Pin";
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

}