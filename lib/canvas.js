class Canvas {
    constructor(id, width, height) {
        this.externalCanvas = document.getElementById(id);
        this.externalContext = this.externalCanvas.getContext('2d');
        this.externalCanvas.width = width;
        this.externalCanvas.height = height;
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext('2d');

        this.width = width;
        this.height = height;
    }

    getCanvas() {
        return this.externalCanvas;
    }

    getContext() {
        return this.context;
    }

    draw() {
        this.externalContext.drawImage(this.canvas, 0, 0);
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
        this.externalCanvas.width = width;
        this.externalCanvas.height = height;
    }
}

