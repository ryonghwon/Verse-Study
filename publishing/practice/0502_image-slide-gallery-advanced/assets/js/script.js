const APP = {
    _infinite: true,
    _isAni: false,
    _galleryWidth: null,
    _galleryHeight: null,
    _imageWidth: 1000,
    _imageHeight: 625,
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
        this.imageGalleryEl = document.querySelector('#gallery');
        this.imageWrapEl = this.imageGalleryEl.querySelector('.image-wrap');
        this.imageContainerEl = this.imageWrapEl.querySelector('.image-container');
        this.imageItemEls = this.imageContainerEl.querySelectorAll('.image-item');
        this.paddleNavEl = this.imageGalleryEl.querySelector('.paddle-nav');
        this.btnPaddleEls = this.paddleNavEl.querySelectorAll('button.btn-paddle');
        this.btnPaddlePreviousEl = this.paddleNavEl.querySelector('button.btn-paddle.paddle-previous');
        this.btnPaddleNextEl = this.paddleNavEl.querySelector('button.btn-paddle.paddle-next');
        this.dotNavEl = this.imageGalleryEl.querySelector('.dot-nav');
        this.dotNavListEl = this.dotNavEl.querySelector('ul');
        this.thumbnailsEl = document.querySelector('#gallery-thumbnails');
        this.btnThumbnailEls = this.thumbnailsEl.querySelectorAll('button.btn-thumbnail');
    },
    create() {
        this._max = this.imageItemEls.length;
        // clone item 적용.
        this.setCloneImageItems();
        // dot nav item 적용.
        this.setDotNavItems();
    },
    addEvent() {
        this.btnPaddleEls.forEach((el) => {
            el.addEventListener('click', this.handleClickBtnPaddleEl.bind(this));
        });
        this.btnThumbnailEls.forEach((el) => {
            el.addEventListener('click', this.handleClickBtnThumbnailEl.bind(this));
        });
    },
    reset() {
        this._cuId = 0;
        this._exId = this._cuId;
        this.resizeGallery();
        this.changeImage();
    },
    setCloneImageItems() {
        // const firstCloneItemEl = this.imageItemEls.item(0).cloneNode();
        // const lastCloneItemEl = this.imageItemEls.item(this._max - 1).cloneNode();
        const firstCloneItemEl = this.imageItemEls.item(0).cloneNode(true);
        const lastCloneItemEl = this.imageItemEls.item(this._max - 1).cloneNode(true);
        firstCloneItemEl.classList.add('clone');
        lastCloneItemEl.classList.add('clone');
        this.imageContainerEl.appendChild(firstCloneItemEl);
        this.imageContainerEl.insertBefore(lastCloneItemEl, this.imageItemEls.item(0));
    },
    setDotNavItems() {
        // for (let i = 0; i < this._max; i++) {
            // console.log(i);
        // }
        this.dotNavListEl.innerHTML = '';
        [...Array(this._max).keys()].forEach((idx) => {
            const itemEl = document.createElement('li');
            // <li></li>
            const btnDotEl = document.createElement('button');
            // <button></button>
            btnDotEl.type = 'button';
            btnDotEl.classList.add('btn-dot');
            btnDotEl.innerText = `Image ${idx + 1}`;
            itemEl.appendChild(btnDotEl);
            this.dotNavListEl.appendChild(itemEl);
        });
        this.btnDotEls = this.dotNavListEl.querySelectorAll('button.btn-dot');
    },
    resizeGallery() {
        // this._galleryWidth = this._imageWidth * this._max;
        // this._galleryWidth = this._imageWidth * (this._max + 2);
        // this._galleryHeight = this._imageHeight;
        const width = this._imageWidth * (this._max + 2);
        gsap.set(this.imageContainerEl, { width });
    },
    autoPlayGallery() {
        clearInterval(this._timer);
        this._timer = setTimeout(this.rollingGallery.bind(this), this._time * 1000);
    },
    rollingGallery() {
        if (this._isAni) {
            return
        }
        let id = this._exId + 1;
        if (id > this._max - 1) {
            id = 0;
        }
        if (this._exId !== id) {
            this._cuId = id;
            this.checkPaddleNav();
            this.checkThumbnails();
            this.changeImage(true);
        }
    },
    changeImage(withAni = false) {
        clearInterval(this._timer);
        gsap.killTweensOf(this.imageContainerEl);
        // const x = this._imageWidth * this._cuId * -1;
        let x = this._imageWidth * (this._cuId + 1) * -1;
        console.log('Change', this._cuId, x);
        if (this._cuId < 0) {
            this._cuId = this._max -1;
        } else if (this._cuId > this._max - 1) {
            this._cuId = 0;
        }
        this.checkDotNav();
        if (!withAni) {
            x = this._imageWidth * (this._cuId + 1) * -1;
            gsap.set(this.imageContainerEl, { x });
            this.checkPaddleNav();
            this.checkThumbnails();
            this._exId = this._cuId;
            this._isAni = false;
            // this.autoPlayGallery();
            return
        }
        this._isAni = true;
        // const direction = this.cuId > this.exId;
        const duration = this._baseDuration + this._addDuration * Math.abs(this._cuId - this._exId);
        const ease = 'power2.inOut';
        // const ease = direction ? 'power2.out' : 'power2.in';
        gsap.to(this.imageContainerEl, {
            x, duration, ease, onComplete: () => {
                // 원래 위치로 이동.
                x = this._imageWidth * (this._cuId + 1) * -1;
                console.log('Complete', this._cuId, x);
                gsap.set(this.imageContainerEl, { x });
                this.checkPaddleNav();
                this.checkThumbnails();
                this._exId = this._cuId;
                this._isAni = false;
                // this.autoPlayGallery();
            }
        });
    },
    checkPaddleNav() {
        // if (this._cuId === 0) {
        //     if (!this.btnPaddlePreviousEl.disabled) {
        //         this.btnPaddlePreviousEl.disabled = true;
        //     }
        //     this.btnPaddleNextEl.disabled = false;
        //     return
        // }
        // if (this._cuId === this._max - 1) {
        //     this.btnPaddlePreviousEl.disabled = false;
        //     if (!this.btnPaddleNextEl.disabled) {
        //         this.btnPaddleNextEl.disabled = true;
        //     }
        //     return
        // }
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
    checkThumbnails() {
        this.btnThumbnailEls.forEach((el, idx) => {
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
        // if (id < 0) {
        //     id = 0;
        // } else if (id > this._max - 1) {
        //     id = this._max - 1;
        // }
        if (this._exId !== id) {
            this._cuId = id;
            this.checkPaddleNav();
            this.changeImage(true);
        }
    },
    handleClickBtnThumbnailEl(e) {
        e.preventDefault();
        if (this._isAni) {
            return
        }
        const { currentTarget: el } = e;
        if (el.classList.contains('selected')) {
            return
        }
        const id = [...this.btnThumbnailEls].indexOf(el);
        if (this._exId !== id) {
            this._cuId = id;
            this.checkThumbnails();
            this.changeImage(true);
        }
    }
}

APP.init();
