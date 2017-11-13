webpackJsonp([6],{

/***/ 123:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _graphics = __webpack_require__(28);

var _util = __webpack_require__(16);

__webpack_require__(13);

var _app = __webpack_require__(11);

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const mountPoint = document.getElementById('content');
mountPoint.style.display = 'none';
const canvas = document.createElement('canvas');
canvas.classList.add('game');
mountPoint.appendChild(canvas);

const app = new _app2.default({
    el: canvas
});

const tilemapTex = new _graphics.TilemapTextureBuilder({
    tileWidth: 16,
    tileHeight: 16,
    width: 16,
    height: 16,
    layers: 4
});

(0, _util.loadImage)('img/mario.png').then(function (img) {
    tilemapTex.addTiles(img);

    const layers = tilemapTex.readback();

    const canvas = document.createElement('canvas');
    document.body.prepend(canvas);
    canvas.width = tilemapTex.width * tilemapTex.tileWidth;
    canvas.height = tilemapTex.height * tilemapTex.tileHeight * layers.length;

    const ctx = canvas.getContext('2d');

    for (let i = 0; i < layers.length; i++) {
        ctx.putImageData(layers[i], 0, i * tilemapTex.layerHeight);
    }
});

/***/ })

},[123]);
//# sourceMappingURL=tilemap_texture.bundle.js.map