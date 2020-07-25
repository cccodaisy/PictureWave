import { Ripple } from "./ripple.js";
import { Dot } from "./dot.js"; 
import { collide } from "./utils.js";

class App {
    constructor() {
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        //dot canvas
        this.tmpCanvas = document.createElement('canvas');
        this.tmpCtx = this.tmpCanvas.getContext('2d');

        // window.devicePixelRatio 레티나 혹은 모바일을 위해서(고해상도)
        this.pixcelRatio = window.devicePixelRatio > 1 ? 2 : 1;

        this.ripple = new Ripple();

        window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();

        this.radius = 10;
        this.pixelSize = 30;
        this.dots = [];

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

        this.tmpCanvas.width = this.stageWidth;
        this.tmpCanvas.height = this.stageHeight;

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

        this.tmpCtx.drawImage(
            this.image,
            0, 0,
            this.image.width, this.image.height,
            this.imgPos.x, this.imgPos.y,
            this.imgPos.width, this.imgPos.height
        );

        this.imgData = this.tmpCtx.getImageData(0, 0, this.stageWidth, this.stageHeight);

        this.drawDots();

    }

    drawDots() {
        this.dots = [];
        
        this.columns = Math.ceil(this.stageWidth / this.pixelSize);
        this.rows = Math.ceil(this.stageHeight / this.pixelSize);

        // TODO: 이중 for문 .map으로 응용해보기
        for (let i = 0; i < this.rows; i++) {
            const y = (i + 0.5) * this.pixelSize;
            const pixelY = Math.max(Math.min(y, this.stageHeight), 0);

            for (let j = 0; j < this.columns; j++) {
                const x = (j + 0.5) * this.pixelSize;
                const pixelX = Math.max(Math.min(x, this.stageWidth), 0);

                const pixelIndex = (pixelX + pixelY * this.stageWidth) * 4;
                const red = this.imgData.data[pixelIndex + 0];
                const green = this.imgData.data[pixelIndex + 1];
                const blue = this.imgData.data[pixelIndex + 2];

                const dot = new Dot(
                    x, y,
                    this.radius,
                    this.pixelSize,
                    red, green, blue,
                );

                this.dots.push(dot);
            }
        }
    }

    animate() {
        window.requestAnimationFrame(this.animate.bind(this));

        this.ripple.animate(this.ctx);

        for (let i = 0; i < this.dots.length; i++) {
            const dot = this.dots[i];

            if (collide(
                dot.x, dot.y,
                this.ripple.x, this.ripple.y,
                this.ripple.radius
            )) {
                dot.animate(this.ctx);
            }
        }
    }

    onClick(e) {
        // 클릭시 해당 위치에서 원형으로 퍼짐
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