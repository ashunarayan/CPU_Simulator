export default class ClipboardManager {

   private data = {

    components: [] as any[],

    wires: [] as any[]

};

    public copy(
    components: any[],
    wires: any[]
): void {

    this.data = {

        components: [...components],

        wires: [...wires]

    };

}

   public paste() {

    return {

        components: [...this.data.components],

        wires: [...this.data.wires]

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