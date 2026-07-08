import Component from "../components/Component";

export default class Circuit {

    private components: Component[] = [];

    public add(component: Component): void {

        this.components.push(component);

    }

    public getComponents(): Component[] {

        return this.components;

    }

}