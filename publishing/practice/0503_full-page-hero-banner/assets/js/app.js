gsap.registerPlugin(TextPlugin);

const APP = {
    _infinite: false,
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
        // window.addEventListener('scroll', this.handleScrollWindow.bind(this));
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
        // this.resizeBanner();
        // this.changeImage();
        window.dispatchEvent(new Event('resize'));
        // window.dispatchEvent(new Event('scroll'));
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
        // 브라우저 화면의 width, height.
        const { innerWidth: width, innerHeight: height } = window;
        // image 사이즈를 계산.
        let imageWidth = width;
        // 1200(원본 이미지의 width) : 800(원본 이미지의 height) = x : y
        // this._originalImageWidth : this._originalImageHeight = imageWidth : ?
        // ? = x * 800 / 1200
        // imageHeight = imageWidth * this._originalImageHeight / this._originalImageWidth
        let imageHeight = Math.round((imageWidth * this._originalImageHeight) / this._originalImageWidth);
        // 계산한 이미지 사이즈-높이가 브라우저의 높이보다 작아지면 브라우저 높이를 기준으로 다시 계산 필요.
        if (imageHeight <= height) {
            imageHeight = height;
            // 1200(원본 이미지의 width) : 800(원본 이미지의 height) = x : y
            // this._originalImageWidth : this._originalImageHeight = ? : imageHeight
            // imageWidth = imageHeight * this._originalImageWidth / this._originalImageHeight
            imageWidth = Math.round((imageHeight * this._originalImageWidth) / this._originalImageHeight)
        }
        // 이미지를 브라우저의 가운데로 위치시키기 위한 계산식.
        const marginTop = height / 2 - imageHeight / 2;
        const marginLeft = width / 2 - imageWidth / 2;
        this._bannerWidth = width;
        this._bannerHeight = height;
        this._containerWidth = this._bannerWidth * this._max;
        gsap.set(this.heroBannerEl, { width: this._bannerWidth, height: this._bannerHeight });
        gsap.set(this.bannerContainerEl, { width: this._containerWidth, height: this._bannerHeight });
        gsap.set(this.bannerItemEls, { width: this._bannerWidth, height: this._bannerHeight });
        this.bannerItemEls.forEach((el) => {
            const imageEl = el.querySelector('.image-area figure img');
            gsap.set(imageEl, { width: imageWidth, height: imageHeight, marginTop, marginLeft });
        });
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
        const itemEl = this.bannerItemEls.item(this._cuId);
        this.itemContentInit(itemEl);
        gsap.to(this.bannerContainerEl, {
            x, duration, ease, onComplete: () => {
                if (this._infinite) {
                    x = this._bannerWidth * (this._cuId + 1) * -1
                    gsap.set(this.bannerContainerEl,  { x })
                }
                this.checkPaddleNav();
                this.itemContentAppear(itemEl, null, () => {
                    this._exId = this._cuId;
                    this._isAni = false
                });
            }
        });
    },
    itemContentInit(el, cloneEl = null) {
        const eyebrowEl = el.querySelector('.eyebrow');
        const headlineEl = el.querySelector('.headline');
        const headlineSpanEls = headlineEl.querySelectorAll('span');
        const copyEl = el.querySelector('.copy');
        headlineSpanEls.forEach((spanEl) => {
            spanEl.classList.remove('active');
            // 데이터 속성을 부여해서 기억할 수 있게.
            spanEl.dataset.text = spanEl.innerText;
            spanEl.innerText = '';
        });
        gsap.set(eyebrowEl, { x: 20, autoAlpha: 0 });
        gsap.set(headlineEl, { x: 40, autoAlpha: 0 });
        gsap.set(headlineSpanEls, { text: '' })
        gsap.set(copyEl, { y: 20, autoAlpha: 0 });
    },
    itemContentAppear(el, cloneEl = null, callback) {
        const eyebrowEl = el.querySelector('.eyebrow');
        const headlineEl = el.querySelector('.headline');
        const headlineSpanEls = headlineEl.querySelectorAll('span');
        const copyEl = el.querySelector('.copy');
        // gsap.to(eyebrowEl, { x: 0, autoAlpha: 1, duration: 0.15 });
        // gsap.to(headlineEl, { x: 0, autoAlpha: 1, duration: 0.25, delay: 0.1 });
        // gsap.to(copyEl, { y: 0, autoAlpha: 1, duration: 0.35, delay: 0.2, onComplete: () => {
        //     this._exId = this._cuId;
        //     this._isAni = false;
        // }});
        const tl = gsap.timeline();
        tl.addLabel('first')
            .to(eyebrowEl, { x: 0, autoAlpha: 1, duration: 0.15, ease: 'sine.out' }, 'first')
            .addLabel('second', '-=0.1')
            .to(headlineEl, { x: 0, autoAlpha: 1, duration: 0.25, ease: 'sine.inOut' }, 'second')
            .addLabel('third', '-=0.05')
            .to(headlineSpanEls, {
                // text: 'hello'
                text: (_, spanEl) => {
                    return spanEl.dataset.text
                },
                duration: (_, spanEl) => {
                    return spanEl.dataset.text.length * 0.02
                },
                // stagger: {
                //     each: 0.1,
                //     onComplete: function() {
                //         const spanEl = this.targets()[0];
                //         spanEl.classList.add('active');
                //     }
                // },
                stagger: 0.1,
                onComplete: () => {
                    headlineSpanEls.forEach((spanEl) => {
                        spanEl.classList.add('active');
                    })
                }
            }, 'second')
            .to(copyEl, { y: 0, autoAlpha: 1, duration: 0.35, ease: 'circ.out' }, 'third')
        tl.eventCallback('onComplete', () => {
            gsap.set(eyebrowEl, { clearProps: 'all' });
            // gsap.set(eyebrowEl, { clearProps: 'opacity, transform, visibility' });
            gsap.set(headlineEl, { clearProps: 'all' });
            gsap.set(headlineSpanEls, { clearProps: 'all' });
            gsap.set(copyEl, { clearProps: 'all' });
            if (callback) {
                callback();
            }
        });
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
