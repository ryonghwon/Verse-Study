// gsap.registerPlugin(TextPlugin);

const APP = {
    _layout: 'horizontal',
    _isAni: false,
    _bannerWidth: null,
    _bannerHeight: null,
    _originalImageWidth: 1200,
    _originalImageHeight: 800,
    _cuId: 0,
    _exId: null,
    _max: null,
    _cuDuration: 0.6,
    _exDuration: 1.2,
    _cuEase: 'power2.inOut',
    _exEase: 'sine.in',
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
        this.bannerItemEls = this.bannerWrapEl.querySelectorAll('.banner-item');
        this.controlsEl = this.heroBannerEl.querySelector('.controls');
        this.pageEl = this.controlsEl.querySelector('.page')
        this.cuPageEl = this.pageEl.querySelector('span.current');
        this.maxPageEl = this.pageEl.querySelector('span.max');
        this.btnArrowEls = this.controlsEl.querySelectorAll('button.btn-arrow');
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
        this.btnArrowEls.forEach((el) => {
            el.addEventListener('click', this.handleClickBtnArrowEl.bind(this));
        });
        this.btnDotEls.forEach((el) => {
            el.addEventListener('click', this.handleClickBtnDotEl.bind(this));
        });
    },
    reset() {
        this._cuId = 0;
        this._exId = this._cuId;
        // this._layout = this.heroBannerEl.dataset.layout;
        this.maxPageEl.innerText = this._max;
        this.checkPage();
        // window.dispatchEvent(new Event('resize'));
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
        if (id > this._max - 1) {
            id = 0;
        }
        if (this._exId !== id) {
            this._cuId = id;
            this.checkPage();
            this.changeItem(true);
        }
    },
    changeItem(withAni = false) {
    // changeItem(withAni = false, direction = false) {
    },
    itemContentInit(el) {
    },
    itemContentAppear(el) {
    },
    checkPage() {
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
        this.changeItem();
    },
    handleClickBtnArrowEl(e) {
        e.preventDefault();
        if (this._isAni) {
            // return
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
            this.changeItem(true);
        }
    }
}

APP.init();
