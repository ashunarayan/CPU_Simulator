import Vector2 from "../math/Vector2";

import AndGate from "./gates/AndGate";
import OrGate from "./gates/OrGate";
import XorGate from "./gates/XorGate";
import NotGate from "./gates/NotGate";

import Switch from "./input/Switch";
import OutputLed from "./input/OutputLed";

import DFlipFlop from "./sequential/DFlipFlop";

import Component from "./base/Component";

export default class ComponentFactory {

    static create(data: any): Component {

        const pos = new Vector2(
            data.x + 20,
            data.y + 20
        );

        switch (data.type) {

            case "AndGate":
                return new AndGate(pos, data.rotation);

            case "OrGate":
                return new OrGate(pos, data.rotation);

            case "XorGate":
                return new XorGate(pos, data.rotation);

            case "NotGate":
                return new NotGate(pos, data.rotation);

            case "Switch": {

                const sw = new Switch(
                    pos,
                    data.rotation
                );

                sw.setState(data.state);

                return sw;
            }

            case "OutputLed":
                return new OutputLed(
                    pos,
                    data.rotation
                );

            case "DFlipFlop":
                return new DFlipFlop(
                    pos,
                    data.rotation
                );

            default:
                throw new Error(
                    "Unknown component " + data.type
                );

        }

    }

}