function Sprite(target, opts = {}) {
    const targetEl = document.querySelector(target);
    const defaults = {
        fps: 24,
        id: '',
        imageUrl: '',
        imageWidth: 1,
        imageHeight: 1,
        col: 1,
        row: 1,
        max: 1
    }
    const settings = {
        ...defaults,
        ...opts
    }
    const { id, fps, imageUrl, col, row, max, imageWidth, imageHeight } = settings;
    let clipEl = null;
    const clipWidth = imageWidth / col;
    const clipHeight = imageHeight / row;

    let cuId = 0;
    let timer = null;
    let isReverse = false;

    function init() {
        if (!targetEl) {
            return
        }
        create();
        addEvent();
        reset();
    }

    function create() {
        clipEl = document.createElement('div');
        clipEl.classList.add('clip');
        if (id && id !== '') {
            clipEl.id = id;
        }
        clipEl.style.width = `${clipWidth}px`;
        clipEl.style.height = `${clipHeight}px`;
        // clipEl.style.backgroundColor = '#f00';
        clipEl.style.backgroundImage = `url(${imageUrl})`;
        clipEl.style.backgroundSize = `${imageWidth}px ${imageHeight}px`;
        // clipEl.style.backgroundColor = '#0f0';
        // clipEl.style.backgroundColor = '#00f';
        // 255 -> 16진수 00 ~ FF
        // white : ff ff ff
        // red : ff 00 00
        // green : 00 ff 00
        // blue : 00 00 ff
        // alpha: 0 - 1
        targetEl.append(clipEl);
    }

    function addEvent() {
        clipEl.addEventListener('mouseenter', handleMouseEnterClipEl);
        clipEl.addEventListener('mouseleave', handleMouseLeaveClipEl);
    }

    function reset() {

    }

    function playFrame() {
        // console.log('play');
        clearInterval(timer);
        timer = setInterval(progressFrame, 1000 / fps);
    }

    function stopFrame() {
        // console.log('stop');
        clearInterval(timer);
    }

    function progressFrame() {
        if (!isReverse) {
            cuId++;
        } else {
            cuId--;
        }
        if (cuId < 0) {
            cuId = 0;
            if (isReverse) {
                stopFrame();
            }
        }
        if (cuId >= max -1) {
            cuId = max - 1;
            if (!isReverse) {
                stopFrame();
            }
        }
        updateFrame();
    }

    function updateFrame() {
        const posX = cuId % col * clipWidth * -1;
        const posY = Math.floor(cuId / col) * clipHeight * -1;
        clipEl.style.backgroundPosition = `${posX}px ${posY}px`;
    }

    function handleMouseEnterClipEl() {
        if (cuId > max - 1) {
            return;
        }
        stopFrame();
        isReverse = false;
        playFrame();
    }

    function handleMouseLeaveClipEl() {
        if (cuId < 0) {
            return
        }
        stopFrame();
        isReverse = true;
        playFrame();
    }
    init();

    return {
        play: playFrame,
        stop: stopFrame
    }
}

// const APP = (function() {
//     let clip1;
//     function init() {
//         clip1 = new Sprite();
//     }
//     return {
//         init: init
//     }
// })();

// function App() {
//     let clip1;
//     function init() {
//         clip1 = new Sprite();
//     }
//     return {
//         init: init
//     }
// }
// APP.init();

const APP = {
    init() {
        // this._clip1 = new Sprite('abc', { a: 1, b: 2 });
        // this._clip2 = new Sprite('xyz');
        this._clip1 = new Sprite('#wrap', {
            id: 'clip',
            imageUrl: '/assets/img/sequence.png',
            fps: 30,
            col: 8,
            row: 4,
            max: 32,
            imageWidth: 904,
            imageHeight: 468
        });
        this._clip2 = new Sprite('#wrap', {
            id: 'minion',
            imageUrl: '/assets/img/minion.png',
            fps: 15,
            col: 7,
            row: 7,
            max: 48,
            imageWidth: 1008,
            imageHeight: 1008
        });
        this._clip3 = new Sprite('#wrap', {
            id: 'zootopia',
            imageUrl: '/assets/img/zootopia.png',
            col: 4,
            row: 3,
            max: 12,
            imageWidth: 576,
            imageHeight: 432
        });
        // this._clip1.play();
        // this._clip2.stop();
        // this._clip3.stop();
    }
}
APP.init();
