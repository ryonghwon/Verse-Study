const APP = {
    _fps: 24,
    _col: 8,
    _row: 4,
    _max: 32,
    // _image: {
    //     width: 904,
    //     height: 468
    // },
    _imageWidth: 904,
    _imageHeight: 468,
    _cuId: 0,
    _timer: null,
    _loop: false,

    init() {
        this.layout();
        this.addEvent();
        this.reset();
    },
    layout() {
        this.clipEl = document.querySelector('#clip');
    },
    addEvent() {
        this.clipEl.addEventListener('mouseenter', this.handleMouseEnterClipEl.bind(this));
        this.clipEl.addEventListener('mouseleave', this.handleMouseLeaveClipEl.bind(this));
    },
    reset() {
        // this._clipWidth = this._image.width / this._col;
        // this._clipHeight = this._image.height / this._row;
        this._clipWidth = this._imageWidth / this._col; // 113
        this._clipHeight = this._imageHeight / this._row; // 117

        this.playFrame();
    },
    playFrame() {
        clearInterval(this._timer);
        // 15, 24, 30, 60
        this._timer = setInterval(this.progressFrame.bind(this), 1000 / this._fps); // 1000ms - 1s
        // this._timer = setInterval(this.progressFrame, 1000); // 1000ms - 1s
    },
    stopFrame() {
        clearInterval(this._timer);
    },
    progressFrame() {
        this._cuId++;
        if (this._cuId >= this._max -1) {
            if (!this._loop) {
                this._cuId = this._max - 1;
                this.stopFrame();
            } else {
                this._cuId = 0;
            }
        }
        this.updateFrame();
    },
    updateFrame() {
        const posX = this._cuId % this._col * this._clipWidth * -1;
        const posY = Math.floor(this._cuId / this._col) * this._clipHeight * -1;
        this.clipEl.style.backgroundPosition = `${posX}px ${posY}px`;
    },
    handleMouseEnterClipEl() {

    },
    handleMouseLeaveClipEl() {

    }
};

APP.init();
