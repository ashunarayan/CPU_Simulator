import Vector2 from "../math/Vector2";
export default class ClipboardManager {

    private data = {
        components: [] as any[],
        wires: [] as any[],
        origin: {
            x: 0,
            y: 0
        }
    }

    public copy(
        components: any[],
        wires: any[],
        origin: Vector2
    ): void {

        this.data = {

            components: [...components],

            wires: [...wires],

            origin: {
                x: origin.x,
                y: origin.y
            }

        };

    }

    public paste() {

        return {

            components: [...this.data.components],

            wires: [...this.data.wires],

            origin: this.data.origin

        };

    }

    public hasData(): boolean {

        return this.data.components.length > 0;

    }

    public clear(): void {

        this.data = {

            components: [],

            wires: []

        };

    }

}