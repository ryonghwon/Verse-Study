// lerp (Linear Interpolation) - 선형 보간법
Math.lerp = function(start, end, ratio) {
    return start + (end - start) * ratio;
}

const APP = {
    _basePath: '/assets/img',
    _imageName: 'airpods-max_frame-',
    _extension: 'jpg',
    _frames: [],
    _max: 45,
    _width: 1004,
    _height: 1214,
    _isLoaded: false,
    _isEnabled: false,

    init() {
        this.layout();
        this.drawCanvas();
        this.preloadFrame();
        this.addEvent();
        this.reset();
    },
    layout() {
        this.mainEl = document.querySelector('#main');
        this.heroEl = this.mainEl.querySelector('#hero');
        this.stickyWrapEl = this.heroEl.querySelector('.sticky-wrap');
        this.stickyInnerEl = this.stickyWrapEl.querySelector('.sticky-inner');
        this.productEl = this.heroEl.querySelector('#product');
        this.productVisualEl = this.productEl.querySelector('#product-visual');
        this.canvasEl = this.productVisualEl.querySelector('#frame-sequence');
        this.cupsEl = this.productVisualEl.querySelector('#cups');
        this.frameEl = this.productVisualEl.querySelector('#frame');
    },
    addEvent() {
        window.addEventListener('scroll', this.handleScrollWindow.bind(this), { passive: true });
    },
    reset() {
        window.dispatchEvent(new Event('scroll'));
    },
    drawCanvas() {
        this.canvasEl.setAttribute('width', this._width);
        this.canvasEl.setAttribute('height', this._height);
        this.context = this.canvasEl.getContext('2d');
    },
    preloadFrame() {
        let loadedCheckCount = 0;
        for (let i = 0; i < this._max; i++) {
            let order = `000${i}`;
            order = order.substring(order.length - 4);
            const imageUrl = this._basePath + '/' + this._imageName + order + '.' + this._extension;
            const image = new Image();
            image.onload = () => {
                loadedCheckCount++;
                if (loadedCheckCount >= this._max) {
                    this._isLoaded = true;
                    this.drawFrame();
                    window.dispatchEvent(new Event('scroll'));
                }
            }
            this._frames.push(image);
            image.src = imageUrl;
        }
    },
    drawFrame() {
        this.context.clearRect(0, 0, this._width, this._height);
        // const image = new Image();
        // image.onload = () => {
        //     // console.log('loaded');
        //     // this.context.drawImage(image, 0, 0, this._width, this._height);
        // }
        // image.src = '/assets/img/airpods-max_frame-0000.jpg';
        // drawImage - 이미지 로드가 완료된 후에 적용할 수 있다.
        this.context.drawImage(this._frames[0], 0, 0, this._width, this._height)
        // this.context.fillStyle = "blue";
        // const rectWidth = 300;
        // const rectHeight = 500;
        // this.context.fillRect(this._width / 2 - rectWidth / 2, this._height / 2 - rectHeight / 2, rectWidth, rectHeight);
    },
    visualScroll() {
        if (!this._isLoaded) {
            return
        }
        // 1. window 스크롤 Y 좌표가 컨텐츠 영역에 포함되어 있을 때.
        // const { scrollY: posY } = window
        // const startY = this.heroEl.offsetTop;
        // const endY = startY + this.heroEl.clientHeight // - window.innerHeight
        // if (posY > startY && posY <= endY) {
        //     console.log(posY - startY);
        // }
        // 2. getBoundingClientRect() 이용하기.
        const { y, height } = this.stickyWrapEl.getBoundingClientRect();
        const limit = height - window.innerHeight;
        if (y <= 0 && limit + y >= 0) {
            // console.log(y, limit);
        }
    },
    handleScrollWindow() {
        if (this._isEnabled) {
            return
        }
        this._isEnabled = true;
        window.requestAnimationFrame(() => {
            this.visualScroll();
            this._isEnabled = false;
        });
    }
}

APP.init();
