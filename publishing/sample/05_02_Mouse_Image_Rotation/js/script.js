Math.range = function(value, x1, y1, x2, y2) {
    return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
}

const DEGREE = 10;

const APP = {
    init() {
        this.layout();
        this.addEvent();
        this.reset();
    },
    layout() {
        this.figureEl = document.querySelector('#figure');
        this.figureImgEl = this.figureEl.querySelector('img');
    },
    addEvent() {
        this.figureEl.addEventListener('mousemove', this.handleMouseMoveFigureEl.bind(this));
        this.figureEl.addEventListener('mouseleave', this.handleMouseLeaveFigureEl.bind(this));
    },
    reset() {
    },
    handleMouseMoveFigureEl(e) {
        const {clientX, clientY, currentTarget} = e
        const {width, height} = currentTarget.getBoundingClientRect()
        const {top, left} = this.figureEl.getBoundingClientRect();
        const {pageXOffset: xOffset, pageYOffset: yOffset} = window
        const x = clientX - left + xOffset;
        const y = clientY - top + yOffset;
        const rotX = Math.range(y, 0, height, DEGREE * -1, DEGREE);
        const rotY = Math.range(x, 0, width, DEGREE * -1, DEGREE);
        gsap.killTweensOf(this.figureImgEl);
        gsap.to(this.figureImgEl, {rotationX: rotX, rotationY: rotY, duration: 0.2});
    },
    handleMouseLeaveFigureEl() {
        gsap.killTweensOf(this.figureImgEl);
        gsap.to(this.figureImgEl, {rotationX: 0, rotationY: 0, duration: 0.4, ease: 'sine.out'});
    }
}

APP.init();
