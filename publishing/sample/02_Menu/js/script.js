const APP = {
    _isOpen: false,
    _isAni: false,

    init() {
        this.layout();
        this.addEvent();
        this.reset();
    },
    layout() {
        this.btnMenuEl = document.querySelector('#btn-menu');
        this.sideMenuEl = document.querySelector('#side-menu');
        this.btnCloseEl = document.querySelector('#btn-close');
        this.sideMenuItemEls = this.sideMenuEl.querySelectorAll('li')
    },
    addEvent() {
        this.btnMenuEl.addEventListener('click', this.handleClickBtnMenu.bind(this));
        this.btnCloseEl.addEventListener('click', this.handleClickBtnClose.bind(this));
    },
    reset() {},
    menuOpenEnded() {
        this._isAni = false;
        this.sideMenuItemEls.forEach((el, idx) => {
            this.menuItemAnim(el, idx)
        });
    },
    menuItemAnim(el, idx) {
        setTimeout(() => {
            el.classList.add('ani')
        }, 40 * idx);
    },
    menuCloseEnded() {
        this._isAni = false;
        this.sideMenuItemEls.forEach((el) => {
            el.classList.remove('ani');
        });
    },
    handleClickBtnMenu(e) {
        e.preventDefault();
        if (this._isOpen || this._isAni) {
            return
        }
        this._isOpen = true;
        this._isAni = true;
        this.sideMenuEl.classList.add('open');
        setTimeout(this.menuOpenEnded.bind(this), 380);
    },
    handleClickBtnClose(e) {
        e.preventDefault();
        if (!this._isOpen || this._isAni) {
            return
        }
        this._isOpen = false;
        this._isAni = true;
        this.sideMenuEl.classList.remove('open');
        setTimeout(this.menuCloseEnded.bind(this), 400);
    }
}

APP.init()
