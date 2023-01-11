// const app = {
//     lang: 'ko',
//     value: 100,
//     getNumber() {
//         return this.value;
//     },
//     updateNumber(value) {
//         this.value = value;
//     }
// }
//
// let number = app.getNumber();
// console.log(number);
//
// app.updateNumber(1000);
// number = app.getNumber();
// console.log(number);

// var APP = {
//     init: function() {
//         console.log('initialize')
//     }
// }


let navEl = document.querySelector('nav#global-navigation');
let _isOpen = false;

function init() {
    layout();
}

function layout() {
    navEl = document.querySelector('nav#global-navigation');
}

init();


const APP = {
    _isOpen: false,
    init() {
        console.log('initialize');
        this.layout();
        this.addEvent();
        this.reset();
    },
    layout() {
        this.navEl = document.querySelector('nav#global-navigation');
        this.biEl = document.querySelector('a#bi');
    },
    addEvent() {
        // 이벤트.
        // Mouse Event.
        // - click, mouseover, mouseout, mouseenter, mouseleave,
        // - mouseup, mousemove, mousedown (Drag & Drop)
        // - touchend, touchmove
        // Keyboard Event.
        // - change, focusin, focusout(blur)
        // Window Event.
        // Load Event.
        // Video Event.
        // Audio Event.
        // * Player 만들기.
        // ...
        // this.navEl.addEventListener('click', this.handleClickNavEl);
        this.navEl.addEventListener('click', this.handleClickNavEl.bind(this));
        this.biEl.addEventListener('click', this.handleClickBIEl.bind(this));
        window.addEventListener('resize', this.handleResizeWindow.bind(this));
        window.addEventListener('scroll', this.handleScrollWindow.bind(this));
    },
    removeEvent() {
        // this.navEl.removeEventListener('click');
        this.navEl.removeEventListener('click', this.handleClickNavEl);
        this.biEl.removeEventListener('click');
        window.removeEventListener('resize');
        window.removeEventListener('scroll');
    },
    reset() {
        // dispatch.
        // 시스템에서 강제로 이벤트를 발생.
        window.dispatchEvent(new Event('resize'));
        window.dispatchEvent(new Event('scroll'));
    },
    handleClickNavEl(e) {
        console.log('Click Nav Element');
    },
    handleClickBIEl(e) {
        // 요소가 가진 기본 이벤트가 발생되지 않도록 방지.
        // <a> href 이동
        // <input> checkbox, radio 타입 등이 기본으로 가진 이벤트
        e.preventDefault();
        // 부모요소의 이벤트가 발생되지 않도록 버블링을 방지.
        e.stopPropagation();
        console.log('Click BI Element');
    },
    handleResizeWindow() {
        const { innerWidth: width, innerHeight: height } = window
        console.log(width, height)
    },
    handleScrollWindow() {
        const { scrollY: posY } = window;
        console.log(posY);
    }
}

APP.init();