const APP = {
    _cuId: 0,
    _exId: null,
    _max: null,
    _imageWidth: 1000,
    _imageHeight: 625,
    _baseDuration: 0.3,
    _addDuration: 0.1,

    init() {
        this.layout();
        this.addEvent();
        this.reset();
    },
    layout() {
        this.galleryEl = document.querySelector('#gallery');
        this.imageWrapEl = this.galleryEl.querySelector('.image-wrap');
        this.imageContainerEl = this.imageWrapEl.querySelector('.image-container');
        this.imageItemEls = this.imageContainerEl.querySelectorAll('.image-item');
        // this.paddleNavEl = this.galleryEl.querySelector('.paddle-nav');
        // this.btnPaddleEls = this.galleryEl.querySelectorAll('.paddle-nav button.btn-paddle');
        // this.btnPaddleEls = this.galleryEl.querySelectorAll('button.btn-paddle');
        this.btnPaddleEls = this.galleryEl.querySelectorAll('.btn-paddle');
        this.btnPaddlePreviousEl = this.galleryEl.querySelector('.btn-paddle.paddle-previous');
        this.btnPaddleNextEl = this.galleryEl.querySelector('.btn-paddle.paddle-next');
        this.dotNavEl = this.galleryEl.querySelector('.dot-nav');
        this.btnDotNavEls = this.dotNavEl.querySelectorAll('button.btn-dot');
        this.thumbnailsEl = document.querySelector('#gallery-thumbnails');
        this.btnThumbnailEls = this.thumbnailsEl.querySelectorAll('button.btn-thumbnail');
    },
    addEvent() {
        const paddleMax = this.btnPaddleEls.length;
        for (let i = 0; i < paddleMax; i++) {
            this.btnPaddleEls[i].addEventListener('click', this.handleClickBtnPaddleEl.bind(this));
        }
        const thumbnailMax = this.btnThumbnailEls.length;
        for (let i = 0; i < thumbnailMax; i++) {
            this.btnThumbnailEls[i].addEventListener('click', this.handleClickBtnThumbnailEl.bind(this));
        }
    },
    reset() {
        this._cuId = 0;
        this._exId = this._cuId;
        this._max = this.imageItemEls.length;
        this.resizeGallery();
        this.changeItem();
    },
    resizeGallery() {
        const width = this._imageWidth * this._max;
        // this.imageContainerEl.style.width = `${width}px`;
        gsap.set(this.imageContainerEl, { width });
    },
    changeItem(withAni = false) {
        gsap.killTweensOf(this.imageContainerEl);
        this.checkPaddleNav();
        this.checkDotNav();
        this.checkThumbnail();
        // container 의 위치값을 _cuId 에 맞추어 계산.
        const x = this._imageWidth * this._cuId * -1
        if (!withAni) {
            gsap.set(this.imageContainerEl, { x });
            this._exId = this._cuId;
            return
        }
        // this.imageContainerEl.style.left = `${x}px`;
        // this.imageContainerEl.style.transform = `translateX(${x}px)`;
        // gsap.set(this.imageContainerEl, { x });
        const duration = this._baseDuration + Math.abs(this._cuId - this._exId) * this._addDuration;
        // 1개 간격일 때 0.3 + 0.1(0.1 * 1)
        // 2개 간격일 때 0.3 + 0.2(0.1 * 2)
        // 3개 간격일 때 0.3 + 0.3(0.1 * 3)
        gsap.to(this.imageContainerEl, { x, duration, ease: 'power2.inOut' });
        // 애니메이션, 기능이 끝난 후에 다음 이벤트 발생 시를 위한 대비.
        this._exId = this._cuId;
    },
    checkPaddleNav() {
        if (this._cuId === 0) {
            this.btnPaddlePreviousEl.disabled = true;
            this.btnPaddleNextEl.disabled = false;
            return
        }
        if (this._cuId === this._max - 1) {
            this.btnPaddlePreviousEl.disabled = false;
            this.btnPaddleNextEl.disabled = true;
            return
        }
        this.btnPaddlePreviousEl.disabled = false;
        this.btnPaddleNextEl.disabled = false;
    },
    checkDotNav() {
        this.btnDotNavEls.forEach((el, idx) => {
            if (this._cuId === idx) {
                el.classList.add('selected');
            } else if (el.classList.contains('selected')) {
                el.classList.remove('selected');
            }
        });
    },
    checkThumbnail() {
        this.btnThumbnailEls.forEach((el, idx) => {
            if (this._cuId === idx) {
                el.classList.add('selected');
            } else if (el.classList.contains('selected')) {
                el.classList.remove('selected');
            }
        });
    },
    handleClickBtnPaddleEl(e) {
        e.preventDefault();
        // console.log('paddle click');
        // const el = e.currentTarget;
        const { currentTarget: el } = e
        let id = this._exId;
        if (el.classList.contains('paddle-previous')) {
            console.log('previous');
            id = id - 1;
        } else if (el.classList.contains('paddle-next')) {
            console.log('next');
            id = id + 1;
        }
        ////////
        // id 에 대한 필터링.
        ////////
        if (id < 0) {
            id = 0;
        } else if (id > this._max - 1) {
            id = this._max;
        }
        if (this._exId !== id) {
            this._cuId = id;
            this.changeItem(true);
        }
    },
    handleClickBtnThumbnailEl(e) {
        e.preventDefault();
        // console.log('thumbnail click');
        // const el = e.currentTarget;
        const { currentTarget: el } = e
        if (el.classList.contains('selected')) {
            return
        }
        const idx = [...this.btnThumbnailEls].indexOf(el);
        // 썸네일 버튼의 위치가 이전에 선택된 버튼과 같지 않을 때만 실행.
        if (this._exId !== idx) {
            // APP 에서 사용 중인 _cuId 의 값을 업데이트.
            this._cuId = idx;
            this.changeItem(true);
        }
    }
}

APP.init();
