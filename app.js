import { Ripple } from "./ripple.js"

class App {
    constructor() {
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        // window.devicePixelRatio 레티나 혹은 모바일을 위해서(고해상도)
        this.pixcelRatio = window.devicePixelRatio > 1 ? 2 : 1;

        this.ripple = new Ripple();

        window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();

        this.isLoaded = false;
        this.imgPos = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };

        this.image = new Image();
        this.image.src = "./gogh1.jpg";
        this.image.onload = () => {
            this.isLoaded = true;
            this.drawImage();
        };

        window.requestAnimationFrame(this.animate.bind(this));

        this.canvas.addEventListener('click', this.onClick.bind(this), false);
    }

    resize() {
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;
        
        this.canvas.width = this.stageWidth * this.pixcelRatio;
        this.canvas.height = this.stageHeight * this.pixcelRatio;
        this.ctx.scale(this.pixcelRatio, this.pixcelRatio);

        this.ripple.resize(this.stageWidth, this.stageHeight);

        if (this.isLoaded) {
            this.drawImage();
        }
    }

    drawImage() {
        const stageRatio = this.stageWidth / this.stageHeight;
        const imgRatio = this.image.width / this.image.height;

        this.imgPos.width = this.stageWidth;
        this.imgPos.height = this.stageHeight;

        if(imgRatio > stageRatio) {
            this.imgPos.width = Math.round(
                this.image.width * (this.stageHeight / this.image.height)
            );
            this.imgPos.x = Math.round(
                (this.stageWidth - this.imgPos.width) / 2
            );
        } else {
            this.imgPos.height = Math.round(
                this.image.height * (this.stageWidth / this.image.width)
            );
            this.imgPos.y = Math.round(
                (this.stageHeight - this.imgPos.height) / 2
            );
        }

        this.ctx.drawImage(
            this.image,
            0, 0,
            this.image.width, this.image.height,
            this.imgPos.x, this.imgPos.y,
            this.imgPos.width, this.imgPos.height
        );


    }

    animate() {
        window.requestAnimationFrame(this.animate.bind(this));

        this.ripple.animate(this.ctx);
    }

    onClick(e) {
        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

        this.ctx.drawImage(
            this.image,
            0, 0,
            this.image.width, this.image.height,
            this.imgPos.x, this.imgPos.y,
            this.imgPos.width, this.imgPos.height
        );

        this.ripple.start(e.offsetX, e.offsetY);

    }
}

window.onload = () => {
    new App();
}