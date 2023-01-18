const APP = {
    init() {
        this.layout();
        this.addEvent();
        this.reset();
    },
    layout() {
        this.cursorDotEl = document.querySelector('#cursor-dot');
        this.cursorBGEl = document.querySelector('#cursor-bg');
        this.progressEl = document.querySelector('#progress');
        this.listEl = document.querySelector('#list');
        this.btnListEl = this.listEl.querySelectorAll('a');
    },
    addEvent() {
        window.addEventListener('mousemove', this.handleMouseMoveWindow.bind(this));
        this.btnListEl.forEach((el) => {
            el.addEventListener('mouseenter', this.handleMouseEnterBtnListEl.bind(this));
            el.addEventListener('mouseleave', this.handleMouseLeaveBtnListEl.bind(this));
        })
    },
    reset() {
        gsap.killTweensOf(this.cursorDotEl);
        gsap.killTweensOf(this.cursorBGEl);
        gsap.killTweensOf(this.progressEl);
    },
    handleMouseMoveWindow(e) {
        const { pageY: top, pageX: left } = e
        gsap.killTweensOf(this.cursorDotEl);
        gsap.killTweensOf(this.cursorBGEl);
        gsap.killTweensOf(this.progressEl);
        gsap.to(this.cursorDotEl, { top, left, duration: 0.1 });
        gsap.to(this.cursorBGEl, { top, left, duration: 0.3, ease: 'sine.out'});
        gsap.to(this.progressEl, { top, left, duration: 0.25, ease: 'sign.out' });
    },
    handleMouseEnterBtnListEl() {
        if (!this.cursorBGEl.classList.contains('active')) {
            this.cursorBGEl.classList.add('active');
        }
        if (!this.progressEl.classList.contains('active')) {
            this.progressEl.classList.add('active');
        }
    },
    handleMouseLeaveBtnListEl() {
        if (this.cursorBGEl.classList.contains('active')) {
            this.cursorBGEl.classList.remove('active');
        }
        if (this.progressEl.classList.contains('active')) {
            this.progressEl.classList.remove('active');
        }
    }
}

APP.init();
