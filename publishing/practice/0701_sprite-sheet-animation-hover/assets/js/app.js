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

    // _col: 7,
    // _row: 7,
    // _max: 48,
    // _imageWidth: 1008,
    // _imageHeight: 1008,

    _cuId: 0,
    _isReverse: false,
    _timer: null,

    init() {
        this.layout();
        this.addEvent();
        this.reset();
    },
    layout() {
        this.clipEl = document.querySelector('#clip');
        // this.clipEl = document.querySelector('#minion');
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
        if (!this._isReverse) {
            this._cuId++;
        } else {
            this._cuId--;
        }
        if (this._cuId < 0) {
            this._cuId = 0;
            if (this._isReverse) {
                this.stopFrame();
            }
        }
        if (this._cuId >= this._max -1) {
            this._cuId = this._max - 1;
            if (!this._isReverse) {
                this.stopFrame();
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
        if (this._cuId > this._max - 1) {
            return;
        }
        this.stopFrame();
        this._isReverse = false;
        this.playFrame();
    },
    handleMouseLeaveClipEl() {
        if (this._cuId < 0) {
            return
        }
        this.stopFrame();
        this._isReverse = true;
        this.playFrame();
    }
};

APP.init();
