export default class ClipboardManager {

    private data: any[] = [];

    public copy(data: any[]): void {

        this.data = [...data];

    }

    public paste(): any[] {

        return [...this.data];

    }

    public hasData(): boolean {

        return this.data.length > 0;

    }

    public clear(): void {

        this.data = [];

    }

}