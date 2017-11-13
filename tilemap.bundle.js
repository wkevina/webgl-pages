webpackJsonp([7],{

/***/ 124:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _graphics = __webpack_require__(28);

var _components = __webpack_require__(34);

var _util = __webpack_require__(16);

__webpack_require__(13);

var _app = __webpack_require__(11);

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const mountPoint = document.getElementById('content');
const canvas = document.createElement('canvas');
canvas.classList.add('game');
mountPoint.appendChild(canvas);

const app = new _app2.default({
    el: canvas,
    debug: false,
    clearColor: [0.1, 0.1, 0.1, 1],
    resolution: {
        width: 320,
        height: 224
    }
});

app.load({
    basePath: 'shaders/',
    programs: ['grid', 'tilemap', 'sprite']
});

// app.load({
//     basePath: 'img/',
//     textures: {
//         sonic: {
//             src: 'img/Sonic1.gif',
//             mag: app.gl.NEAREST,
//             min: app.gl.LINEAR,
//             flipY: true
//         }
//     }
// });


const tilemapTex = new _graphics.TilemapTextureBuilder({
    tileWidth: 16,
    tileHeight: 16,
    width: 16,
    height: 16,
    layers: 4
});

async function run() {
    await app.loader.loading;

    tilemapTex.addTiles((await (0, _util.loadImage)('img/mario.png')));

    const framebufferRenderer = new _graphics.SpriteRenderer({
        game: app,
        textureInfo: _extends({
            texture: app.framebuffer.texture
        }, app.resolution)
    });

    const renderer = new _graphics.TilemapRenderer({
        game: app,
        textureArray: tilemapTex.texture,
        tilemap: {
            tileWidth: 16,
            tileHeight: 16,
            width: 33,
            height: 28,
            getTile(x, y) {
                const w = 33;
                const h = 28;

                x = x % w;
                y = y % h;

                return x + (h - y - 1) * w;
            }
        }
    });

    const grid = new _graphics.GridOutline(app);
    //grid.addGrid( 8,  8, [0.4, 0.1, 0.9, 0.4], 1);
    //grid.addGrid(16, 16, [0.1, 0.3, 0.9, 0.4], 1);
    //grid.addGrid(32, 32, [0,   0.5, 0.9, 0.3], 1);


    requestAnimationFrame(function render() {
        app.adjustViewport();
        app.clear();

        app.framebuffer.attach();
        app.clear();

        renderer.draw({
            x: 0,
            y: 224,
            width: 320,
            height: 224
        });

        grid.render();

        app.framebuffer.detach();
        app.adjustViewport();

        framebufferRenderer.render([new _components.Sprite({
            position: [0, 0],
            size: [app.resolution.width - 1, app.resolution.height - 1]
        })]);

        requestAnimationFrame(render);
    });
}

run();

/***/ })

},[124]);
//# sourceMappingURL=tilemap.bundle.js.map