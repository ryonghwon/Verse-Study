const APP = {
    _cuId: 0, // current id
    _exId: null,
    // _isAni: false,

    init() {
        this.layout();
        this.addEvent();
        this.reset();
    },
    layout() {
        this.tabMenuEls = document.querySelectorAll('#tab-menu li a');
        // if (this.tabMenuEls.length > 0) {
        //     this.tabMenuEls = Array.prototype.slice.call(this.tabMenuEls);
        // }
        this.tabContentEls = document.querySelectorAll('#tab-contents .tab-content');
    },
    addEvent() {
        // for(let i = 0; i < this.tabMenuEls.length; i++) {
        //     console.log(i);
        // }
        // const _this = this
        // this.tabMenuEls.forEach(function(el, idx) {
        //     el.addEventListener('click', _this.handleClickTabMenuEls.bind(_this));
        // });
        // const _this = this;
        // this.tabMenuEls.forEach((el, idx) => {
        //     el.addEventListener('click', function (e) {
        //         e.preventDefault();
        //         _this.handleClickTabMenuEls(e, idx);
        //     })
        // });
        this.tabMenuEls.forEach((el) => {
            el.addEventListener('click', this.handleClickTabMenuEls.bind(this));
        });
    },
    reset() {
        this._cuId = 0;
        // 이전에 선택된 아이디를 체크.
        this._exId = this._cuId;
    },
    // handleClickTabMenuEls(e, idx) {
    handleClickTabMenuEls(e) {
        e.preventDefault();
        if (this._isAni) {
            return
        }
        const el = e.currentTarget;
        if (el.classList.contains('selected')) {
            // selected 클래스가 a 요소에 포함이 되어있다면 이미 선택된 콘텐츠.
            // -> 클릭을 해도 동작하지 않도록 구성
            return
        }
        const tabMenuEls = Array.prototype.slice.call(this.tabMenuEls);
        const idx = tabMenuEls.indexOf(el);
        if (!el.classList.contains('selected')) {
            if (this._exId !== null) {
                // 이미 노출되어 있던 콘텐츠의 selected 클래스를 삭제.
                this.tabMenuEls[this._exId].classList.remove('selected');
                this.tabContentEls[this._exId].classList.remove('selected');
            }
            // 새로운 ID를 적용하고 노출시킬 콘텐츠에 selected 클래스를 추가.
            this._cuId = idx;
            this.tabMenuEls[this._cuId].classList.add('selected');
            this.tabContentEls[this._cuId].classList.add('selected');

            // this._isAni = true;
            // // ... animation ...
            // this._isAni = false;

            // 클래스 적용이 완료된 이후 이전 ID 를 업데이트.
            // (다음에 발생되는 클릭 이벤트에서 이전 값을 체크하기 위한 용도)
            this._exId = this._cuId;
        }
    }
}

APP.init();
