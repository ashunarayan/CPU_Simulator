import Circuit from "../circuit/Circuit";

export default class CircuitSerializer {

    public save(circuit: Circuit): string {

        const data = {

            version: 1,

            components:
                circuit
                    .getComponents()
                    .map(c => c.serialize()),

            junctions:
                circuit
                    .getJunctions()
                    .map(j => j.serialize()),

            wires:
                circuit
                    .getWires()
                    .map(w => w.serialize())

        };

        return JSON.stringify(

            data,

            null,

            4

        );

    }

}