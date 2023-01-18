const APP = {
    _cuId: 0,
    _exId: null,

    init() {
        this.layout();
        this.addEvent();
        this.reset();
    },
    layout() {
        this.tabMenuEls = document.querySelectorAll('#tab-menu li a');
        this.tabContentEls = document.querySelectorAll('#tab-contents .tab-content');
    },
    addEvent() {
        this.tabMenuEls.forEach((el) => {
            el.addEventListener('click', this.handleClickTabMenuEls.bind(this));
        });
    },
    reset() {
        this._cuId = 0;
        this._exId = this._cuId;
    },
    handleClickTabMenuEls(e) {
        e.preventDefault();
        if (this._isAni) {
            return
        }
        const el = e.currentTarget;
        if (el.classList.contains('selected')) {
            return
        }
        const idx = [...this.tabMenuEls].indexOf(el);
        if (!el.classList.contains('selected')) {
            if (this._exId !== null) {
                this.tabMenuEls[this._exId].classList.remove('selected');
                this.tabContentEls[this._exId].classList.remove('selected');
            }
            this._cuId = idx;
            this.tabMenuEls[this._cuId].classList.add('selected');
            this.tabContentEls[this._cuId].classList.add('selected');
            this._exId = this._cuId;
        }
    }
}

APP.init();
