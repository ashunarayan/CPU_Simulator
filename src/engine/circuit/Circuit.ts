import Component from "../components/base/Component";
import Vector2 from "../math/Vector2";
import Wire from "../connection/Wire";
import Pin from "../connection/Pin";
import Junction from "../connection/Junction";
import LogicState from "../simulation/LogicState";
export default class Circuit {

    private components: Component[] = [];
    private wires: Wire[] = [];
    private junctions: Junction[] = [];
    public add(component: Component): void {

        this.components.push(component);

    }
    public addJunction(
        junction: Junction
    ): void {

        this.junctions.push(junction);

    }
    public getJunctions(): Junction[] {

        return this.junctions;

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

    if ("connect" in wire.from) {

        wire.from.connect();

    }

    if (wire.to && "connect" in wire.to) {

        wire.to.connect();

    }

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

    // Remove every wire connected to this component
    this.wires = this.wires.filter(wire => {

        const fromComponent =
            wire.from instanceof Pin
                ? wire.from.ownerId === component.id
                : false;

        const toComponent =
            wire.to instanceof Pin
                ? wire.to.ownerId === component.id
                : false;

        if (fromComponent || toComponent) {

            wire.disconnect();

            return false;

        }

        return true;

    });

    // Remove component
    this.components =
        this.components.filter(
            c => c !== component
        );

    // Junctions may have disappeared
    this.rebuildJunctions();

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


    public getWireHit(
        point: Vector2
    ): { wire: Wire; point: Vector2 } | null {

        const threshold = 6;

        for (let w = this.wires.length - 1; w >= 0; w--) {

            const wire = this.wires[w];

            let previous = wire.vertices[0];

            const points = [...wire.vertices];

            if (wire.to) {

                points.push(
                    wire.to.getWorldPosition()
                );

            }

            for (let i = 1; i < points.length; i++) {

                const current = points[i];

                // Vertical
                if (previous.x === current.x) {

                    if (

                        Math.abs(point.x - previous.x) <= threshold &&

                        point.y >= Math.min(previous.y, current.y) &&

                        point.y <= Math.max(previous.y, current.y)

                    ) {

                        return {

                            wire,

                            point: new Vector2(

                                previous.x,

                                Math.round(point.y / 20) * 20

                            )

                        };

                    }

                }

                // Horizontal
                else {

                    if (

                        Math.abs(point.y - previous.y) <= threshold &&

                        point.x >= Math.min(previous.x, current.x) &&

                        point.x <= Math.max(previous.x, current.x)

                    ) {

                        return {

                            wire,

                            point: new Vector2(

                                Math.round(point.x / 20) * 20,

                                previous.y

                            )

                        };

                    }

                }

                previous = current;

            }

        }

        return null;

    }



    public rebuildJunctions(): void {

        this.junctions = [];

        const map = new Map<string, number>();

        for (const wire of this.wires) {

            for (const p of wire.vertices) {

                const key = `${p.x},${p.y}`;

                map.set(
                    key,
                    (map.get(key) ?? 0) + 1
                );

            }

        }

        for (const [key, count] of map) {

            if (count < 2)
                continue;

            const [x, y] =
                key.split(",").map(Number);

            this.junctions.push(

                new Junction(
                    new Vector2(x, y)
                )

            );

        }

    }


    public splitWire(
        wire: Wire,
        point: Vector2
    ): Junction {

        // Same segment layout getWireHit() already uses: the wire's own
        // bend vertices, plus its endpoint's position tacked on at the end.
        const points = wire.to
            ? [...wire.vertices, wire.to.getWorldPosition()]
            : [...wire.vertices];

        // Find which segment the split point falls on, so we know where in
        // `vertices` to cut. getWireHit() already snapped `point` exactly
        // onto the line, so exact equality checks are safe here.
        let splitIndex = points.length - 1;

        for (let i = 1; i < points.length; i++) {

            const previous = points[i - 1];
            const current = points[i];

            if (previous.x === current.x) {

                // Vertical segment
                if (
                    point.x === previous.x &&
                    point.y >= Math.min(previous.y, current.y) &&
                    point.y <= Math.max(previous.y, current.y)
                ) {

                    splitIndex = i;
                    break;

                }

            }
            else {

                // Horizontal segment
                if (
                    point.y === previous.y &&
                    point.x >= Math.min(previous.x, current.x) &&
                    point.x <= Math.max(previous.x, current.x)
                ) {

                    splitIndex = i;
                    break;

                }

            }

        }

        const junction = new Junction(point);

        this.addJunction(junction);

        // Head keeps the wire's original start, now ending at the junction.
        const headVertices = [
            ...wire.vertices.slice(0, splitIndex),
            point
        ];

        // Tail starts at the junction and keeps the wire's original end.
        const tailVertices = [
            point,
            ...wire.vertices.slice(splitIndex)
        ];

        const originalTo = wire.to;

        wire.vertices = headVertices;
        wire.to = junction;

        const tailWire = new Wire(junction);

        tailWire.vertices = tailVertices;
        tailWire.to = originalTo;

        this.wires.push(tailWire);




        return junction;

    }
    public getJunctionAt(
        point: Vector2
    ): Junction | null {

        for (const junction of this.junctions) {

            const dx =
                point.x - junction.position.x;

            const dy =
                point.y - junction.position.y;

            if (dx * dx + dy * dy <= 36) {

                return junction;

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


    public getComponentsInside(
        start: Vector2,
        end: Vector2
    ): Component[] {

        const left = Math.min(start.x, end.x);
        const right = Math.max(start.x, end.x);

        const top = Math.min(start.y, end.y);
        const bottom = Math.max(start.y, end.y);

        return this.components.filter(component => {

            return (
                component.position.x >= left &&
                component.position.x <= right &&
                component.position.y >= top &&
                component.position.y <= bottom
            );

        });

    }

  public removeComponents(
    components: Component[]
): void {

    for (const component of components) {

        this.remove(component);

    }

}
public getSelectedComponents() {

    return this.components.filter(

        component => component.selected

    );

}

   public simulate(): void {

    // settle combinational logic
    this.runSimulationPass(true);

    this.runSimulationPass(true);

    // sample sequential components exactly once
    this.runSimulationPass(false);

    // settle any combinational logic fed by sequential outputs
    this.runSimulationPass(true);

}

// One full settle step: evaluate every gate, then push values through
// wires. Split into two passes so junctions resolve correctly within
// this same step - a wire driven by a Pin can feed a Junction, and only
// once every such contribution has landed does a wire driven BY that
// Junction read it back out. Without this ordering, a junction's value
// would always be one full simulate() call behind reality.
private runSimulationPass(
    combinationalOnly: boolean
): void {

    for (const component of this.components) {

        if (
            combinationalOnly ===
            component.isSequential()
        ) {

            continue;

        }

        component.evaluate();

    }

    // Clear junctions
    for (const junction of this.junctions) {

        junction.value = LogicState.LOW;

    }

    // Step 1 : Pin driven wires

    for (const wire of this.wires) {

        if (wire.from instanceof Junction) {

            continue;

        }

        wire.value = wire.from.value;

        if (wire.to instanceof Junction) {

            if (wire.value === LogicState.HIGH) {

                wire.to.value = LogicState.HIGH;

            }

        }
        else if (wire.to) {

            wire.to.value = wire.value;

        }

    }

    // Step 2 : Junction driven wires

    for (const wire of this.wires) {

        if (!(wire.from instanceof Junction)) {

            continue;

        }

        wire.value = wire.from.value;

        if (wire.to instanceof Junction) {

            if (wire.value === LogicState.HIGH) {

                wire.to.value = LogicState.HIGH;

            }

        }
        else if (wire.to) {

            wire.to.value = wire.value;

        }

    }

}

}