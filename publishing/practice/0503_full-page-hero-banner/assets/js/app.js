// gsap.registerPlugin(TextPlugin);

const APP = {
    _infinite: true,
    _isAni: false,
    _bannerWidth: null,
    _bannerHeight: null,
    _containerWidth: null,
    _originalImageWidth: 1200,
    _originalImageHeight: 800,
    _baseDuration: 0.3,
    _addDuration: 0.1,
    _cuId: 0,
    _exId: null,
    _max: null,
    _timer: null,
    _time: 6,

    init() {
        this.layout();
        this.create();
        this.addEvent();
        this.reset();
    },
    layout() {
        this.heroBannerEl = document.querySelector('#banner');
        this.bannerWrapEl = this.heroBannerEl.querySelector('.banner-wrap');
        this.bannerContainerEl = this.bannerWrapEl.querySelector('.banner-container');
        this.bannerItemEls = this.bannerContainerEl.querySelectorAll('.banner-item');
        this.paddleNavEl = this.heroBannerEl.querySelector('.paddle-nav');
        this.btnPaddleEls = this.paddleNavEl.querySelectorAll('button.btn-paddle');
        this.btnPaddlePreviousEl = this.paddleNavEl.querySelector('button.btn-paddle.paddle-previous');
        this.btnPaddleNextEl = this.paddleNavEl.querySelector('button.btn-paddle.paddle-next');
        this.dotNavEl = this.heroBannerEl.querySelector('.dot-nav');
        this.dotNavListEl = this.dotNavEl.querySelector('ul');
    },
    create() {
        this._max = this.bannerItemEls.length;
        this.dotNavListEl.innerText = '';
        [...Array(this._max).keys()].forEach((idx) => {
            const listItemEl = document.createElement('li');
            const btnDotEl = document.createElement('button');
            btnDotEl.type = 'button'
            btnDotEl.classList.add('btn-dot');
            btnDotEl.innerText = `Item ${idx}`;
            listItemEl.appendChild(btnDotEl);
            this.dotNavListEl.appendChild(listItemEl);
        });
        this.btnDotEls = this.dotNavListEl.querySelectorAll('button.btn-dot');
    },
    addEvent() {
        window.addEventListener('resize', this.handleResizeWindow.bind(this));
        this.btnPaddleEls.forEach((el) => {
            el.addEventListener('click', this.handleClickBtnPaddleEl.bind(this));
        });
        this.btnDotEls.forEach((el) => {
            el.addEventListener('click', this.handleClickBtnDotEl.bind(this));
        });
    },
    reset() {
        this._cuId = 0;
        this._exId = this._cuId;
        if (this._infinite) {
            this.setInfiniteBanner();
        }
        this.resizeBanner();
        this.changeImage();
    },
    setInfiniteBanner() {
        if (!this._infinite) {
            return
        }
        const firstCloneItemEl = this.bannerItemEls.item(0).cloneNode(true)
        const lastCloneItemEl = this.bannerItemEls.item(this._max - 1).cloneNode(true)
        firstCloneItemEl.classList.add('clone');
        lastCloneItemEl.classList.add('clone');
        this.bannerContainerEl.insertBefore(lastCloneItemEl, this.bannerItemEls.item(0));
        this.bannerContainerEl.appendChild(firstCloneItemEl);
        this.bannerItemEls = this.bannerContainerEl.querySelectorAll('.banner-item');
    },
    resizeBanner() {
    },
    autoPlayBanner() {
        clearInterval(this._timer);
        this._timer = setTimeout(this.rollingBanner.bind(this), this._time * 1000);
    },
    rollingBanner() {
        if (this._isAni) {
            return
        }
        let id = this._exId + 1;
        if (!this._infinite && id > this._max - 1) {
            id = 0;
        }
        if (this._exId !== id) {
            this._cuId = id;
            this.checkPaddleNav();
            this.changeImage(true);
        }
    },
    changeImage(withAni = false) {
        clearInterval(this._timer);
        let x = this._infinite ? this._bannerWidth * (this._cuId + 1) * -1 : this._bannerWidth * this._cuId * -1;
        const direction = this._cuId > this._exId;
        const duration = this._baseDuration + this._addDuration * Math.abs(this._cuId - this._exId);
        if (this._infinite) {
            if (this._cuId < 0) {
                this._cuId = this._max - 1;
            } else if (this._cuId > this._max - 1) {
                this._cuId = 0
            }
        }
        const ease = 'power2.inOut';
        // const ease = direction ? 'power2.out' : 'power2.in';
        this.checkDotNav();
        if (!withAni) {
            gsap.set(this.bannerContainerEl, { x });
            this.checkPaddleNav();
            this._exId = this._cuId;
            this._isAni = false;
            // this.autoPlayBanner();
            return
        }
        this._isAni = true;
        gsap.to(this.bannerContainerEl, {
            x, duration, ease, onComplete: () => {
                if (this._infinite) {
                    x = this._bannerWidth * (this._cuId + 1) * -1
                    gsap.set(this.bannerContainerEl,  { x })
                }
                this.checkPaddleNav();
            }
        });
    },
    itemContentInit(el, cloneEl = null) {
    },
    itemContentAppear(el, cloneEl = null, callback) {
    },
    checkPaddleNav() {
        if (this._infinite) {
            this.btnPaddlePreviousEl.disabled = false;
            this.btnPaddleNextEl.disabled = false;
            return
        }
        if (this._cuId === 0) {
            if (!this.btnPaddlePreviousEl.disabled) {
                this.btnPaddlePreviousEl.disabled = true;
            }
            this.btnPaddleNextEl.disabled = false;
            return
        }
        if (this._cuId === this._max - 1) {
            this.btnPaddlePreviousEl.disabled = false;
            if (!this.btnPaddleNextEl.disabled) {
                this.btnPaddleNextEl.disabled = true;
            }
            return
        }
        this.btnPaddlePreviousEl.disabled = false;
        this.btnPaddleNextEl.disabled = false;
    },
    checkDotNav() {
        this.btnDotEls.forEach((el, idx) => {
            if (idx === this._cuId) {
                if (!el.classList.contains('selected')) {
                    el.classList.add('selected');
                }
                el.classList.add('selected');
                return
            }
            if (el.classList.contains('selected')) {
                el.classList.remove('selected');
            }
        });
    },
    handleResizeWindow() {
        clearInterval(this._timer);
        this.resizeBanner();
        this.changeImage();
    },
    handleClickBtnPaddleEl(e) {
        e.preventDefault();
        if (this._isAni) {
            return
        }
        const { currentTarget: el } = e;
        let id = this._exId;
        if (el.classList.contains('paddle-previous')) {
            id -= 1;
        }
        if (el.classList.contains('paddle-next')) {
            id += 1;
        }
        if (this._infinite) {
            if (id < -1) {
                id = this._max - 1;
            } else if (id > this._max) {
                id = 0;
            }
        } else {
            if (id < 0) {
                id = 0;
            } else if (id > this._max - 1) {
                id = this._max - 1;
            }
        }
        if (this._exId !== id) {
            this._cuId = id;
            this.checkPaddleNav();
            this.changeImage(true);
        }
    },
    handleClickBtnDotEl(e) {
        e.preventDefault();
        if (this._isAni) {
            return
        }
        const { currentTarget: el } = e;
        if (el.classList.contains('selected')) {
            return
        }
        const id = [...this.btnDotEls].indexOf(el);
        if (this._exId !== id) {
            this._cuId = id;
            this.changeImage(true);
        }
    }
}

APP.init();