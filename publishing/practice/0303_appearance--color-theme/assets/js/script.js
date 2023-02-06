const THEMES = ['light', 'dark', 'red', 'green'];

const APP = {
    _theme: 'light',

    init() {
        this.layout();
        this.addEvent();
        this.reset();
    },
    layout() {
        this.themeNameEl = document.querySelector('#theme-name');
        this.themeMenuItemEls = document.querySelectorAll('#theme-menu li');
        this.btnThemeMenuEls = document.querySelectorAll('#theme-menu li a');
    },
    addEvent() {
        this.btnThemeMenuEls.forEach((el) => {
            el.addEventListener('click', this.handleClickBtnThemeMenuEl.bind(this))
        })
    },
    reset() {
        this.setTheme();
    },
    setTheme() {
        const { documentElement: htmlEl } = document
        THEMES.forEach((theme) => {
            htmlEl.classList.remove(`theme-${theme}`);
        });
        htmlEl.classList.add(`theme-${this._theme}`);
        this.themeNameEl.innerHTML = this._theme;
    },
    handleClickBtnThemeMenuEl(e) {
        e.preventDefault();
        const el = e.currentTarget;
        const parentEl = el.parentElement;
        if (parentEl.classList.contains('selected')) {
            return
        }
        const theme = el.getAttribute('href').replace('#', '');
        if (this._theme !== theme) {
            this._theme = theme
            this.themeMenuItemEls.forEach((itemEl) => {
                if (itemEl.classList.contains('selected')) {
                    itemEl.classList.remove('selected');
                }
            });
            parentEl.classList.add('selected');
            this.setTheme();
        }
    }
}

APP.init();
