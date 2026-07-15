import Circuit from "../circuit/Circuit";

import Vector2 from "../math/Vector2";

import AndGate from "../components/gates/AndGate";
import OrGate from "../components/gates/OrGate";
import NotGate from "../components/gates/NotGate";
import XorGate from "../components/gates/XorGate";
import DFlipFlop from "../components/sequential/DFlipFlop";

import Component from "../components/base/Component";

import Junction from "../connection/Junction";
import Wire from "../connection/Wire";

import Switch from "../components/input/Switch";
import OutputLed from "../components/input/OutputLed";

export default class CircuitDeserializer {

    private readonly componentMap =
        new Map<number, Component>();

    private readonly junctionMap =
        new Map<number, Junction>();

    public load(json: string): Circuit {

        this.componentMap.clear();

        this.junctionMap.clear();

        const data =
            JSON.parse(json);

        const circuit =
            new Circuit();

        // -------------------------
        // Components
        // -------------------------

        for (const component of data.components) {

            switch (component.type) {

                case "AndGate": {

                    const gate =
                        new AndGate(
                            new Vector2(
                                component.x,
                                component.y
                            ),
                            component.rotation
                        );

                    circuit.add(gate);

                    this.componentMap.set(
                        component.id,
                        gate
                    );

                    break;

                }

                case "OrGate": {

                    const gate =
                        new OrGate(
                            new Vector2(
                                component.x,
                                component.y
                            ),
                            component.rotation
                        );

                    circuit.add(gate);

                    this.componentMap.set(
                        component.id,
                        gate
                    );

                    break;

                }

                case "NotGate": {

                    const gate =
                        new NotGate(
                            new Vector2(
                                component.x,
                                component.y
                            ),
                            component.rotation
                        );

                    circuit.add(gate);

                    this.componentMap.set(
                        component.id,
                        gate
                    );

                    break;

                }

                case "XorGate": {

                    const gate =
                        new XorGate(
                            new Vector2(
                                component.x,
                                component.y
                            ),
                            component.rotation
                        );

                    circuit.add(gate);

                    this.componentMap.set(
                        component.id,
                        gate
                    );

                    break;

                }

                case "Switch": {

                    const sw =
                        new Switch(
                            new Vector2(
                                component.x,
                                component.y
                            ),
                            component.rotation
                        );

                    sw.setState(component.state);

                    circuit.add(sw);

                    this.componentMap.set(
                        component.id,
                        sw
                    );

                    break;

                }

                case "OutputLed": {

                    const led =
                        new OutputLed(
                            new Vector2(
                                component.x,
                                component.y
                            ),
                            component.rotation
                        );

                    circuit.add(led);

                    this.componentMap.set(
                        component.id,
                        led
                    );

                    break;

                }

                case "DFlipFlop": {

                    const dff =
                        new DFlipFlop(
                            new Vector2(
                                component.x,
                                component.y
                            ),
                            component.rotation
                        );

                    circuit.add(dff);

                    this.componentMap.set(
                        component.id,
                        dff
                    );

                    break;

                }

            }

        }

        // -------------------------
        // Junctions
        // -------------------------

        for (const junction of data.junctions) {

            const j =
                new Junction(

                    new Vector2(

                        junction.x,

                        junction.y

                    )

                );

            circuit.addJunction(j);

            this.junctionMap.set(

                junction.id,

                j

            );

        }

        // -------------------------
        // Wires
        // -------------------------

        for (const wireData of data.wires) {

            if (!wireData.to)
                continue;

            let from;
            let to;

            if (wireData.from.type === "PIN") {

                const component =
                    this.componentMap.get(
                        wireData.from.componentId
                    )!;

                from =
                    component.getPins()[
                        wireData.from.pinIndex
                    ];

            }

            else {

                from =
                    this.junctionMap.get(
                        wireData.from.junctionId
                    )!;

            }

            if (wireData.to.type === "PIN") {

                const component =
                    this.componentMap.get(
                        wireData.to.componentId
                    )!;

                to =
                    component.getPins()[
                        wireData.to.pinIndex
                    ];

            }

            else {

                to =
                    this.junctionMap.get(
                        wireData.to.junctionId
                    )!;

            }

            const wire =
                new Wire(from);

            wire.to = to;

            wire.vertices =
                wireData.vertices.map(
                    (v: any) =>
                        new Vector2(v.x, v.y)
                );

            circuit.addWire(wire);

        }

        return circuit;

    }

}