webpackJsonp([8],{

/***/ 122:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _graphics = __webpack_require__(28);

var _components = __webpack_require__(34);

var _app = __webpack_require__(11);

var _app2 = _interopRequireDefault(_app);

__webpack_require__(13);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const mountPoint = document.getElementById('content');
const canvas = document.createElement('canvas');
canvas.classList.add('game');
mountPoint.appendChild(canvas);

const app = new _app2.default({
    el: canvas,
    resolution: {
        width: 640,
        height: 480
    },
    debug: false,
    clearColor: [0.1, 0.1, 0.1, 1]
});

app.start();

// app.load({
//     basePath: 'shaders/',
//     paths: ['sprite.frag', 'sprite.vert',
//             'grid.frag', 'grid.vert']
// });

app.load({
    basePath: 'shaders/',
    programs: ['sprite', 'grid', 'tilemap']
});

app.load({
    basePath: 'img/',
    textures: {
        sonic: {
            src: 'img/Sonic1.gif',
            mag: app.gl.NEAREST,
            min: app.gl.LINEAR,
            flipY: true
        }
    }
});

console.log(app.gl.getParameter(app.gl.MAX_ARRAY_TEXTURE_LAYERS));

async function run() {
    await app.loader.loading;

    const renderer = new _graphics.SpriteRenderer({
        game: app,
        textureInfo: _extends({
            texture: app.loader.getTexture('sonic')
        }, app.resolution)
    });

    const grid = new _graphics.GridOutline(app);
    grid.addGrid(8, 8, [0.4, 0.1, 0.9, 0.4], 0.25);
    grid.addGrid(16, 16, [0.1, 0.3, 0.9, 0.4], 0.5);
    grid.addGrid(32, 32, [0, 0.5, 0.9, 0.3], 1);

    const sprites = [];
    // for (let i = 0; (i < app.resolution.width / 32); ++i) {
    //     for (let j = 0; j < (app.resolution.height / 32); ++j) {
    //         sprites.push(new Sprite([i * 32 + 10, j * 32 + 10], [20, 40]));
    //         break;
    //     }
    //     break;
    // }

    sprites.push(new _components.Sprite({
        position: [10, 10],
        size: [300, 734]
    }));

    requestAnimationFrame(function render() {
        app.adjustViewport();
        app.clear();
        //renderer.render(sprites);
        grid.render();
        requestAnimationFrame(render);
    });
}

run();

/***/ })

},[122]);
//# sourceMappingURL=sprite.bundle.js.map