const APP = {
    init() {
        this.layout();
        this.addEvent();
        this.reset();
    },
    layout() {
        this.btnImageEls = document.querySelectorAll('#image-list li a');
        this.cursorDotEl = document.querySelector('#cursor-dot');
        this.cursorBGEl = document.querySelector('#cursor-bg');
        this.selectEl = document.querySelector('#select');
    },
    addEvent() {
        // for (let i = 0; i <= this.btnImageEls.length - 1; i++) {
        //     const el = this.btnImageEls[i];
        //     console.log(el, i);
        // }
        // for (let el of this.btnImageEls) {
        //     console.log(el);
        // }
        window.addEventListener('mousemove', this.handleMouseMoveWindow.bind(this));
        this.btnImageEls.forEach((el, idx) => {
            el.addEventListener('click', this.handleClickBtnImageEl.bind(this));
            // el.addEventListener('mouseover', this.handleMouseOver);
            // el.addEventListener('mouseout', this.handleMouseOut);
            el.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
            el.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
            // 요소.addEventListener('이벤트 타입', 이벤트핸들러(callback));
            // handleClickBtnImageEl
            // btnImageElClickHandler
        });

        // Mouse Event.
        // mouseover, mouseenter
        // 마우스 커서가 요소 안으로 들어올 때.
        // mouseout, mouseleave
        // (마우스 커서가 요소 안에 있는 상태) 마우스 커서가 요소 바깥으로 나갈 때.
        // mouseover, mouseout
        // 해당하는 요소에서만 이벤트가 발생.
        // mouseenter, mouseleave
        // 해당하는 요소(자식들 포함)내에서 이벤트가 발생.

        // mousedown - 마우스 버튼이 눌릴 때 발생.
        // click - 클릭.
        // mouseup - (마우스 버튼이 눌려있었고) 뗄 때 발생.

        // mousemove - 마우스 커서가 요소 안에서 움직일 때 발생.

        // drag & drop 만들 때
        // - mousedown -> mousemove -> mouseup

        // Touch Event.
        // touchstart
        // touchmove
        // touchend
        // touchcancel

        // swipe 만들 때.
        // - touchstart -> touchmove -> touchend(touchcancel)
    },
    reset() {
        // gsap.set(this.btnImageEls, { scale: 0.9, autoAlpha: 0 });
        // gsap.to(this.btnImageEls, { scale: 1.0, autoAlpha: 1, duration: 0.5, delay: 1, ease: 'power2.in' });
        // gsap.fromTo(this.btnImageEls, { scale: 0.9, autoAlpha: 0 }, { scale: 1.0, autoAlpha: 1, duration: 0.5, delay: 1, ease: 'power2.in' });

        // gsap.set(요소([요소]), 옵션);
        // gsap.set(element, options);
        // gsap.set(this.btnImageEls, { x: 50, y: 20, scale: 0.9, autoAlpha: 0.5 });
        // gsap.to()
        // gsap.fromTo()
        gsap.killTweensOf(this.cursorDotEl);
        gsap.killTweensOf(this.cursorBGEl);
        gsap.killTweensOf(this.selectEl);
    },
    handleMouseMoveWindow(e) {
        const { pageY: top, pageX: left } = e;
        // console.log(top, left);
        // this.cursorDotEl.style.top = `${top}px`;
        // this.cursorDotEl.style.left = `${left}px`;
        // this.cursorBGEl.style.top = `${top}px`;
        // this.cursorBGEl.style.left = `${left}px`;
        // this.selectEl.style.top = `${top}px`;
        // this.selectEl.style.left = `${left}px`;
        gsap.killTweensOf(this.cursorDotEl);
        gsap.killTweensOf(this.cursorBGEl);
        gsap.killTweensOf(this.selectEl);
        gsap.to(this.cursorDotEl, { top, left, duration: 0.1 });
        gsap.to(this.cursorBGEl, { top, left, duration: 0.2, ease: 'sine.out' });
        gsap.to(this.selectEl, { top, left, duration: 0.3, ease: 'sine.out' });
    },
    handleMouseOver() {
        console.log('over');
    },
    handleMouseOut() {
        console.log('out');
    },
    handleMouseEnter() {
        console.log('enter');
        if (!this.cursorBGEl.classList.contains('active')) {
            this.cursorBGEl.classList.add('active');
        }
        if (!this.selectEl.classList.contains('active')) {
            this.selectEl.classList.add('active');
        }
    },
    handleMouseLeave() {
        console.log('leave');
        if (this.cursorBGEl.classList.contains('active')) {
            this.cursorBGEl.classList.remove('active');
        }
        if (this.selectEl.classList.contains('active')) {
            this.selectEl.classList.remove('active');
        }
    },
    handleClickBtnImageEl(e) {
        e.preventDefault();
    }
};

APP.init();
