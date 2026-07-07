export default class CanvasRenderer {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;



    constructor(canvas: HTMLCanvasElement) {
         console.log("CanvasRenderer constructor called");


        this.canvas = canvas;

        const context = canvas.getContext("2d");

        if (!context) {
            throw new Error("Unable to get 2D rendering context.");
        }

        this.ctx = context;

        this.resize();

        window.addEventListener("resize", this.onResize);

        this.render();
    }

    private drawGrid(): void {

        const spacing = 20;

        this.ctx.fillStyle = "#404040";

        for (let x = 0; x < this.canvas.width; x += spacing) {
            for (let y = 0; y < this.canvas.height; y += spacing) {
                this.ctx.fillRect(x, y, 2, 2);
            }
        }
    }
    private onResize = () => {
    this.resize();
}

    private resize(): void {

        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }

    private clear(): void {

        this.ctx.fillStyle = "#181818";
        this.ctx.fillRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
    }

    private render = (): void => {

        this.clear();
        console.log(this.canvas.width, this.canvas.height);
        this.drawGrid();

        requestAnimationFrame(this.render);

    }

}