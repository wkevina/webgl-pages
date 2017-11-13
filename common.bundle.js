webpackJsonp([1],{

/***/ 11:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _resource = __webpack_require__(60);

var _shaderUtil = __webpack_require__(29);

var _glMatrix = __webpack_require__(36);

var _gl = __webpack_require__(15);

var _util = __webpack_require__(16);

var _twgl = __webpack_require__(12);

var _twgl2 = _interopRequireDefault(_twgl);

__webpack_require__(66);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import * as glMatrix from 'gl-matrix';

function logGLCall(functionName, args) {
    console.log("gl." + functionName + "(" + WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ")");
}

function throwOnGLError(err, funcName, args) {
    throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to: " + funcName;
};

class App {
    constructor({ el, debug, clearColor, resolution }) {
        if (typeof canvas === 'string') {
            this.canvas = document.getElementById(el);
        } else {
            this.canvas = el;
        }

        // create rendering context
        this.gl = this.canvas.getContext('webgl2');
        (0, _gl.registerContext)(this.gl);

        if (debug) {
            WebGLDebugUtils.init(this.gl);
            this.gl = WebGLDebugUtils.makeDebugContext(this.gl, undefined, logGLCall);
        }

        _gl.gl.blendFunc(_gl.gl.SRC_ALPHA, _gl.gl.ONE_MINUS_SRC_ALPHA);
        _gl.gl.enable(_gl.gl.BLEND);

        this.clearColor = clearColor || [0.4, 0.4, 0.4, 1];
        this.resolution = resolution || { width: 352, height: 224 };

        this.framebuffer = (0, _util.attachFramebuffer)(_gl.gl, this.resolution.width, this.resolution.height);

        this.loader = new _resource.Loader();

        this.projection = _glMatrix.mat4.ortho(_glMatrix.mat4.create(), 0, this.resolution.width, 0, this.resolution.height, -1, 1);
    }

    start() {
        this.adjustViewport();
    }

    adjustViewport() {
        _twgl2.default.resizeCanvasToDisplaySize(this.canvas);

        const canvas_width = this.canvas.clientWidth;
        const canvas_height = this.canvas.clientHeight;

        const desired_aspect_ratio = this.resolution.width / this.resolution.height;
        let screen_width, screen_height;

        if (canvas_width / canvas_height >= desired_aspect_ratio) {
            screen_width = desired_aspect_ratio * canvas_height;
            screen_height = canvas_height;
        } else {
            screen_width = canvas_width;
            screen_height = canvas_width / desired_aspect_ratio;
        }

        const xoff = (canvas_width - screen_width) / 2;
        const yoff = (canvas_height - screen_height) / 2;

        this.gl.viewport(xoff, yoff, screen_width, screen_height);
    }

    clear() {
        this.gl.clearColor(...this.clearColor);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    load(paths) {
        return this.loader.load(paths);
    }

    getProgram(key) {
        const ret = this.loader.getProgram(key);

        if (!ret) {
            throw `No program loaded for key '${key}'`;
        }

        return ret;
    }
}

exports.default = App;

/***/ }),

/***/ 13:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(67);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(41)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./app.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./app.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 15:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
let gl = {};

function registerContext(_gl) {
    exports.gl = gl = _gl;
}

exports.registerContext = registerContext;
exports.gl = gl;

/***/ }),

/***/ 16:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
function arraySetter(buffer) {
    let count = 0;
    return function (newElements) {
        buffer.set(newElements, count);
        count += newElements.length;
    };
}

function hsl2rgb(h, s, l) {

    var r, g, b, m, c, x;

    if (!isFinite(h)) h = 0;
    if (!isFinite(s)) s = 0;
    if (!isFinite(l)) l = 0;

    h /= 60;
    if (h < 0) h = 6 - -h % 6;
    h %= 6;

    s = Math.max(0, Math.min(1, s / 100));
    l = Math.max(0, Math.min(1, l / 100));

    c = (1 - Math.abs(2 * l - 1)) * s;
    x = c * (1 - Math.abs(h % 2 - 1));

    if (h < 1) {
        r = c;
        g = x;
        b = 0;
    } else if (h < 2) {
        r = x;
        g = c;
        b = 0;
    } else if (h < 3) {
        r = 0;
        g = c;
        b = x;
    } else if (h < 4) {
        r = 0;
        g = x;
        b = c;
    } else if (h < 5) {
        r = x;
        g = 0;
        b = c;
    } else {
        r = c;
        g = 0;
        b = x;
    }

    m = l - c / 2;
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return [r, g, b];
}

function attachFramebuffer(gl, width, height) {
    const framebuffer = gl.createFramebuffer();
    const texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, width, height);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);

    return {
        width,
        height,
        attach() {
            gl.viewport(0, 0, width, height);
            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        },
        detach() {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        },
        texture,
        framebuffer
    };
}

function loadImage(src) {
    return new Promise(function (resolve, reject) {
        const img = new Image();

        function removeListeners() {
            img.removeEventListener('load', null);
            img.removeEventListener('error', null);
        }

        img.addEventListener('load', function () {
            removeListeners();
            resolve(img);
        });

        img.addEventListener('error', function (error) {
            removeListeners();
            reject(error);
        });

        img.src = src;
    });
}

exports.arraySetter = arraySetter;
exports.hsl2rgb = hsl2rgb;
exports.attachFramebuffer = attachFramebuffer;
exports.loadImage = loadImage;

/***/ }),

/***/ 28:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GridOutline = exports.TilemapTextureBuilder = exports.TilemapRenderer = exports.SpriteRenderer = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _shaderUtil = __webpack_require__(29);

var _twgl = __webpack_require__(12);

var _twgl2 = _interopRequireDefault(_twgl);

var _glMatrix = __webpack_require__(36);

var _gl = __webpack_require__(15);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const POSITION_COMPONENTS = 2;
const SIZE_COMPONENTS = 2;

const SPRITE_RECT_VERTICES = new Float32Array([0, 0, // bottom left
1, 0, // bottom right
0, 1, // top left
1, 1 // top right
]);

const GRID_VERTICES = new Float32Array([0, 0, // bottom left
1, 0, // bottom right
0, 1, // top left
1, 1 // top right
]);

class SpriteRenderer {
    constructor({ game, textureInfo }) {
        this.gl = game.gl;
        this.loader = game.loader;
        this.game = game;

        this.textureInfo = textureInfo;

        this.setup();
    }

    setup() {
        this.programInfo = this.game.getProgram('sprite');

        this._arrays = {
            vertex: {
                data: SPRITE_RECT_VERTICES,
                numComponents: 2,
                divisor: 0,
                drawType: this.gl.STATIC_DRAW
            },
            position: {
                //data: SPRITE_RECT_VERTICES,
                numComponents: 2,
                divisor: 1,
                drawType: this.gl.DYNAMIC_DRAW
            },
            offset: {
                //data: SPRITE_RECT_VERTICES,
                numComponents: 2,
                divisor: 1,
                drawType: this.gl.DYNAMIC_DRAW
            },
            size: {
                //data: SPRITE_RECT_VERTICES,
                numComponents: 2,
                divisor: 1,
                drawType: this.gl.DYNAMIC_DRAW
            },
            texcoord: {
                data: [
                // 0, 0,
                // this.textureInfo.width, 0,
                // 0, this.textureInfo.height,
                // this.textureInfo.width, this.textureInfo.height
                0, 0, 1, 0, 0, 1, 1, 1],
                numComponents: 2,
                divisor: 0,
                type: Int16Array
            },
            indices: {
                data: [0, 1, 2, 3]
            }
        };

        this.bufferInfo = _twgl2.default.createBufferInfoFromArrays(this.gl, this._arrays);
        this.vao = _twgl2.default.createVertexArrayInfo(this.gl, this.programInfo, this.bufferInfo);
    }

    render(sprites) {
        const positions = new Float32Array(2 * sprites.length);
        const sizes = new Float32Array(2 * sprites.length);
        const offsets = new Float32Array(2 * sprites.length);

        sprites.forEach(function (sprite, spriteIndex) {
            sprite.position.forEach(function (v, compIndex) {
                positions[spriteIndex * 2 + compIndex] = v;
            });

            sprite.size.forEach(function (v, compIndex) {
                sizes[spriteIndex * 2 + compIndex] = v;
            });

            sprite.offset.forEach(function (v, compIndex) {
                offsets[spriteIndex * 2 + compIndex] = v;
            });
        });

        _twgl2.default.setAttribInfoBufferFromArray(this.gl, this.bufferInfo.attribs.position, positions);

        _twgl2.default.setAttribInfoBufferFromArray(this.gl, this.bufferInfo.attribs.size, sizes);

        _twgl2.default.setAttribInfoBufferFromArray(this.gl, this.bufferInfo.attribs.offset, offsets);

        this.gl.useProgram(this.programInfo.program);

        _twgl2.default.setUniforms(this.programInfo, {
            projection: this.game.projection,
            texture: this.textureInfo.texture
        });

        _twgl2.default.setBuffersAndAttributes(this.gl, this.programInfo, this.vao);
        _twgl2.default.drawBufferInfo(this.gl, this.vao, this.gl.TRIANGLE_STRIP, undefined, undefined, sprites.length);
    }
}

function makeGridVertices({ xcells, ycells }, { w, h }, { lineWidth }) {
    const position = new Float32Array(2 * (xcells + ycells));
    const size = new Float32Array(2 * (xcells + ycells));
    const width = w * (xcells + 1);
    const height = h * (ycells + 1);

    for (let row = 0; row < ycells; ++row) {
        position[2 * row] = 0; // pos x
        position[2 * row + 1] = row * h; // pos y
        size[2 * row] = width; // line length
        size[2 * row + 1] = lineWidth; // line thickness
    }

    for (let col = 0; col < xcells; ++col) {
        position[2 * ycells + 2 * col] = col * w; // pos x
        position[2 * ycells + 2 * col + 1] = 0; // pos y
        size[2 * ycells + 2 * col] = lineWidth; // line length
        size[2 * ycells + 2 * col + 1] = height; // line thickness
    }

    return {
        position,
        size
    };
}

class GridOutline {
    constructor(game) {
        this.game = game;
        this.gl = game.gl;

        this.programInfo = this.game.getProgram('grid');

        this.bufferInfo = _twgl2.default.createBufferInfoFromArrays(this.gl, {
            vertex: {
                data: GRID_VERTICES,
                numComponents: 2,
                divisor: 0,
                drawType: this.gl.STATIC_DRAW
            },
            position: {
                numComponents: 2,
                divisor: 1,
                drawType: this.gl.DYNAMIC_DRAW
            },
            size: {
                numComponents: 2,
                divisor: 1,
                drawType: this.gl.DYNAMIC_DRAW
            },
            indices: {
                data: [0, 1, 2, 3]
            }
        });

        this.vao = _twgl2.default.createVertexArrayInfo(this.gl, this.programInfo, this.bufferInfo);

        this.grids = [];
    }

    addGrid(sx = 32, sy = 32, lineColor = [1, 1, 1, 1], lineWidth = 2) {
        const xcells = Math.floor(this.game.resolution.width / sx);
        const ycells = Math.floor(this.game.resolution.height / sy);
        const instanceCount = xcells + ycells;

        const { position, size } = makeGridVertices({ xcells, ycells }, { w: sx, h: sy }, { lineWidth: lineWidth });

        this.grids.push({
            position,
            size,
            instanceCount,
            lineColor
        });
    }

    render() {
        var _this = this;

        this.gl.useProgram(this.programInfo.program);

        _twgl2.default.setUniforms(this.programInfo, {
            projection: this.game.projection
        });

        _twgl2.default.setBuffersAndAttributes(this.gl, this.programInfo, this.vao);

        this.grids.forEach(function (gridInfo) {
            const { position, size, instanceCount, lineColor } = gridInfo;

            _twgl2.default.setAttribInfoBufferFromArray(_this.gl, _this.bufferInfo.attribs.position, position);

            _twgl2.default.setAttribInfoBufferFromArray(_this.gl, _this.bufferInfo.attribs.size, size);

            _twgl2.default.setUniforms(_this.programInfo, {
                line_color: lineColor
            });

            _twgl2.default.drawBufferInfo(_this.gl, _this.vao, _this.gl.TRIANGLE_STRIP, undefined, undefined, instanceCount);
        });
    }
}

class TilemapRenderer {
    /*
    tilemap = {
        width: width in tiles
        height: height in tiles
        tileWidth: tile width in pixels
        tileHeight: tile height in pixels
        tiles
    }
    */
    constructor(opts) {
        const {
            tilemap,
            game,
            textureArray
        } = opts;

        this.tilemap = tilemap;
        this.game = game;
        this.gl = game.gl;
        this.textureArray = textureArray;

        this.tileWidth = this.tilemap.tileWidth;
        this.tileHeight = this.tilemap.tileHeight;

        this.programInfo = this.game.getProgram('tilemap');

        this.setup();
    }

    setup() {
        this.bufferInfo = _twgl2.default.createBufferInfoFromArrays(this.gl, {
            /* Per-vertex attributes common to each instance. */
            vertex: {
                data: new Float32Array([0, 0, // bottom left
                this.tileWidth, 0, // bottom right
                0, this.tileHeight, // top left
                this.tileWidth, this.tileHeight // top right
                ]),
                numComponents: 2,
                divisor: 0,
                drawType: this.gl.STATIC_DRAW
            },

            position: {
                numComponents: 3,
                divisor: 1,
                drawType: this.gl.DYNAMIC_DRAW
            },

            texcoord: {
                data: [0, 0, this.tileWidth, 0, 0, this.tileHeight, this.tileWidth, this.tileHeight],
                numComponents: 2,
                divisor: 0,
                drawType: this.gl.STATIC_DRAW
            },

            tile_index: {
                numComponents: 1,
                divisor: 1,
                drawType: this.gl.DYNAMIC_DRAW,
                type: Int16Array
            },

            indices: {
                data: [0, 1, 2, 3]
            }
        });

        this.arrays = {
            position: new Float32Array(3 * this.maxCells()),
            tile_index: new Int16Array(this.maxCells())
        };

        this.vao = _twgl2.default.createVertexArrayInfo(this.gl, this.programInfo, this.bufferInfo);
    }

    /* Returns maximum number of cells that could be rendered. If the display
    is tw and th tiles wide and high, respectively, the value returned is
    (tw + 1) * (th + 1) */
    maxCells() {
        return this.maxWidthInCells * this.maxHeightInCells;
    }

    get maxWidthInCells() {
        return Math.floor(this.game.resolution.width / this.tileWidth) + 1;
    }

    get maxHeightInCells() {
        return Math.floor(this.game.resolution.height / this.tileHeight) + 1;
    }

    draw({ x, y, width, height }) {
        const tileCount = {
            x: Math.floor(width / this.tileWidth) + 1,
            y: Math.floor(height / this.tileHeight) + 1
        };

        const startIndex = {
            x: Math.floor(x / this.tileWidth),
            y: Math.floor(y / this.tileHeight)
        };

        tileCount.x = Math.min(tileCount.x, this.tilemap.width - startIndex.x, this.maxWidthInCells);
        tileCount.y = Math.min(tileCount.y, this.tilemap.height - startIndex.y, this.maxHeightInCells);

        const offset = { x, y };

        if (x > 0) {
            offset.x = -(x % this.tileWidth);
        }

        if (y > 0) {
            offset.y = -(y % this.tileHeight);
        }

        const addPosition = arraySetter(this.arrays.position);
        const addTileIndex = arraySetter(this.arrays.tile_index);

        for (let row = 0; row < tileCount.y; row++) {
            const yCoord = row * this.tileHeight + offset.y;
            for (let col = 0; col < tileCount.x; col++) {
                const xCoord = col * this.tileWidth + offset.x;

                const tile_index = this.tilemap.getTile(col + startIndex.x, row + startIndex.y);

                addPosition([xCoord, yCoord, 0]);
                addTileIndex(tile_index);
            }
        }

        this.gl.useProgram(this.programInfo.program);

        _twgl2.default.setAttribInfoBufferFromArray(this.gl, this.bufferInfo.attribs.position, this.arrays.position);

        _twgl2.default.setAttribInfoBufferFromArray(this.gl, this.bufferInfo.attribs.tile_index, this.arrays.tile_index);

        _twgl2.default.setUniforms(this.programInfo, {
            projection: this.game.projection,
            texture: this.textureArray,
            tile_size: [this.tileWidth, this.tileHeight]
        });

        _twgl2.default.setBuffersAndAttributes(this.gl, this.programInfo, this.vao);
        _twgl2.default.drawBufferInfo(this.gl, this.vao, this.gl.TRIANGLE_STRIP, undefined, undefined, tileCount.x * tileCount.y);
    }
}

class TilemapTextureBuilder {
    constructor(opts) {
        Object.assign(this, _extends({
            tileWidth: 8,
            tileHeight: 8,
            width: 256,
            height: 1,
            layers: 2
        }, opts));

        this.copyIndex = 0;

        this.texture = _gl.gl.createTexture();
        _gl.gl.bindTexture(_gl.gl.TEXTURE_2D_ARRAY, this.texture);
        _gl.gl.texStorage3D(_gl.gl.TEXTURE_2D_ARRAY, 1, _gl.gl.RGBA8, this.width * this.tileWidth, this.height * this.tileHeight, this.layers);
        _gl.gl.texParameteri(_gl.gl.TEXTURE_2D_ARRAY, _gl.gl.TEXTURE_MIN_FILTER, _gl.gl.NEAREST);
        _gl.gl.bindTexture(_gl.gl.TEXTURE_2D_ARRAY, null);
    }

    tileCoordinates() {
        return {
            x: this.copyIndex % this.width,
            y: Math.floor(this.copyIndex / this.width) % this.height,
            z: Math.floor(this.copyIndex / (this.width * this.height)) % this.layers
        };
    }

    addTiles(src) {
        var _this2 = this;

        const tileWide = this.detectWidthInTiles(src);
        const tileHigh = this.detectHeightInTiles(src);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = src.width;
        canvas.height = src.height;

        ctx.drawImage(src, 0, 0);

        /**
         *  Copies pixels in src from the tile starting at (tileX, tileY) to the current
         * tile and advances the copy index
         */
        const copyTile = function copyTile(tileX, tileY) {
            const imageData = ctx.getImageData(tileX * _this2.tileWidth, tileY * _this2.tileHeight, _this2.tileWidth, _this2.tileHeight);

            const { x, y, z } = _this2.tileCoordinates();

            _gl.gl.texSubImage3D(_gl.gl.TEXTURE_2D_ARRAY, // target
            0, // mipmap level, always zero
            x * _this2.tileWidth, // xoffset
            y * _this2.tileHeight, // yoffset
            z, // zoffset
            _this2.tileWidth, // width
            _this2.tileHeight, // height
            1, // depth
            _gl.gl.RGBA, // format, guaranteed by ImageData to be RGBA
            _gl.gl.UNSIGNED_BYTE, // type, guaranteed by ImageData to be Uint8ClampedArray, i.e. UNSIGNED_BYTE
            imageData // pixel data
            );

            _this2.copyIndex++;
        };

        _gl.gl.bindTexture(_gl.gl.TEXTURE_2D_ARRAY, this.texture);

        _gl.gl.pixelStorei(_gl.gl.UNPACK_FLIP_Y_WEBGL, 1);

        for (let y = 0; y < tileHigh; y++) {
            for (let x = 0; x < tileWide; x++) {
                if (this.isFull()) {
                    break;
                }
                copyTile(x, y);
            }
        }

        _gl.gl.pixelStorei(_gl.gl.UNPACK_FLIP_Y_WEBGL, 0);

        _gl.gl.bindTexture(_gl.gl.TEXTURE_2D_ARRAY, null);
    }

    detectWidthInTiles(src) {
        return Math.floor(src.width / this.tileWidth);
    }

    detectHeightInTiles(src) {
        return Math.floor(src.height / this.tileHeight);
    }

    get layerWidth() {
        return this.tileWidth * this.width;
    }

    get layerHeight() {
        return this.tileHeight * this.height;
    }

    get maxIndex() {
        return this.width * this.height * this.layers;
    }

    isFull() {
        return this.copyIndex >= this.maxIndex;
    }

    /**
     * Reads texture from GL memory returns it as Array of ImageData
     */
    readback() {
        // Uint8Array long enough to hold pixel data for one layer
        const buffer = new Uint8Array(this.layerWidth * this.layerHeight * 4);
        const fb = _gl.gl.createFramebuffer();
        const layers = [];

        _gl.gl.bindFramebuffer(_gl.gl.READ_FRAMEBUFFER, fb);

        for (let layer = 0; layer < this.layers; layer++) {
            _gl.gl.framebufferTextureLayer(_gl.gl.READ_FRAMEBUFFER, _gl.gl.COLOR_ATTACHMENT0, this.texture, 0, layer);
            _gl.gl.readPixels(0, 0, this.layerWidth, this.layerHeight, _gl.gl.RGBA, _gl.gl.UNSIGNED_BYTE, buffer);
            layers.push(new ImageData(new Uint8ClampedArray(buffer), this.layerWidth, this.layerHeight));
        }

        _gl.gl.bindFramebuffer(_gl.gl.READ_FRAMEBUFFER, null);

        return layers;
    }

    // function setTextureFromElement(gl, tex, element, options) {
    //     options = options || defaults.textureOptions;
    //     var target = options.target || gl.TEXTURE_2D;
    //     var level = options.level || 0;
    //     var width = element.width;
    //     var height = element.height;
    //     var internalFormat = options.internalFormat || options.format || gl.RGBA;
    //     var formatType = getFormatAndTypeForInternalFormat(internalFormat);
    //     var format = options.format || formatType.format;
    //     var type = options.type || formatType.type;
    //     savePackState(gl, options);
    //     gl.bindTexture(target, tex);
    //
    //     gl.texImage2D(target, level, internalFormat, format, type, element);
    //
    //     restorePackState(gl, options);
    //     if (shouldAutomaticallySetTextureFilteringForSize(options)) {
    //         setTextureFilteringForSize(gl, tex, options, width, height, internalFormat, type);
    //     }
    //     setTextureParameters(gl, tex, options);
    // }
}

function arraySetter(buffer) {
    let count = 0;
    return function (newElements) {
        if (!newElements.length) {
            newElements = [newElements];
        }
        buffer.set(newElements, count);
        count += newElements.length;
    };
}

exports.SpriteRenderer = SpriteRenderer;
exports.TilemapRenderer = TilemapRenderer;
exports.TilemapTextureBuilder = TilemapTextureBuilder;
exports.GridOutline = GridOutline;

/***/ }),

/***/ 29:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createProgram = undefined;

var _twgl = __webpack_require__(12);

var _twgl2 = _interopRequireDefault(_twgl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates a GLSL program from sources at two URLs
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {string} vertexShaderPath The path of the vertex shader file.
 * @param {string} fragmentShaderPath The path of the fragment shader file.
 * @return {!WebGLProgram} A program
 */
async function createProgram(gl, vertexShaderPath, fragmentShaderPath) {
    let vs = await fetch(vertexShaderPath);
    let fs = await fetch(fragmentShaderPath);

    const args = [await vs.text(), await fs.text()];

    return _twgl2.default.createProgramInfo(gl, args, null, null, function (err) {
        throw err;
    });
}

exports.createProgram = createProgram;

/***/ }),

/***/ 34:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

class Sprite {
    constructor({ position, size, image, offset }) {
        this.position = position;
        this.size = size;
        this.image = image;
        this.offset = offset || [0, 0];
    }
}

exports.Sprite = Sprite;

/***/ }),

/***/ 60:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Loader = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _underscore = __webpack_require__(35);

var _twgl = __webpack_require__(12);

var _twgl2 = _interopRequireDefault(_twgl);

var _gl = __webpack_require__(15);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getGl() {
    return _gl.gl;
}

getGl();

function createTextures(opts) {
    return new Promise(function (resolve, reject) {
        _twgl2.default.createTextures(_gl.gl, opts, function (errors, textures, images) {
            resolve({ errors, textures, images });
        });
    });
}

class Loader {
    constructor(opts) {
        this.cache = new Map();
        this.textureCache = new Map();
        this.programCache = new Map();
        this.errors = {
            programs: new Map(),
            textures: new Map(),
            paths: new Map()
        };
        this.loading = null;
        this.load(opts);
    }

    load(opts) {
        var _this = this;

        let { basePath,
            raiseOnFailure,
            paths,
            textures,
            programs } = _extends({ basePath: '', raiseOnFailure: true }, opts);
        // trim trailing slashes
        basePath = basePath.replace(/\/+$/, '');

        const loadPromise = new Promise(async function (resolve, reject) {
            if (paths) {
                await _this.loadPaths(paths, basePath, raiseOnFailure);
            }

            if (textures) {
                let { errors, textures: tex, images } = await createTextures(textures);
                if (errors) {
                    console.log(errors);
                }
                Object.keys(tex).forEach(function (key) {
                    _this.textureCache.set(key, tex[key]);
                });
            }

            if (programs) {
                for (let progOpts of programs) {
                    let name = progOpts;
                    let opts;

                    if (_underscore._.isObject(progOpts)) {
                        name = progOpts.name;
                        opts = progOpts.opts;
                    }

                    if (_this.programCache.has(name)) {
                        console.log(`Warning: attempted to load already loaded program '${name}'`);
                        continue;
                    }

                    const fp = _underscore._.compact([basePath, name.split('.').join('/')]).join('/');

                    const vsName = `${fp}.vert`;
                    const fsName = `${fp}.frag`;
                    await _this.loadPaths([vsName, fsName], '', raiseOnFailure);
                    _this.programCache.set(name, _twgl2.default.createProgramInfo(_gl.gl, [_this.get(vsName), _this.get(fsName)], opts));
                }
            }

            resolve(_this);
        });

        this.loading = this.loading ? this.loading.then(function (res) {
            return loadPromise;
        }) : loadPromise;

        return this.loading;
    }

    get(path) {
        const ret = this.cache.get(path);
        if (ret === undefined) {
            raise`No value for key ${path}`;
        }
        return ret;
    }

    getTexture(name) {
        const ret = this.textureCache.get(name);
        if (ret === undefined) {
            raise`No texture value for key ${path}`;
        }
        return ret;
    }

    getProgram(name) {
        return this.programCache.get(name);
    }

    async loadPaths(paths, basePath, raiseOnFailure = true) {
        for (let path of paths) {
            if (this.cache.has(basePath + path)) {
                console.log(`Warning: attempted to load already loaded path '${basePath + path}'`);
                continue;
            }
            const contents = await this.fetch(basePath + path, raiseOnFailure);
            if (contents) {
                this.cache.set(basePath + path, contents);
            }
        }
    }

    async fetch(path, raiseOnFailure = true) {
        const req = await fetch(path);

        if (req.ok) {
            return await req.text();
        } else if (raiseOnFailure) {
            throw `failed to fetch resource '${path}'; got status ${req.status} '${req.statusText}'`;
        } else {
            this.errors.paths.set(path, req.statusText);

            return false;
        }
    }
}

exports.Loader = Loader;

/***/ }),

/***/ 66:
/***/ (function(module, exports) {

/*
** Copyright (c) 2012 The Khronos Group Inc.
**
** Permission is hereby granted, free of charge, to any person obtaining a
** copy of this software and/or associated documentation files (the
** "Materials"), to deal in the Materials without restriction, including
** without limitation the rights to use, copy, modify, merge, publish,
** distribute, sublicense, and/or sell copies of the Materials, and to
** permit persons to whom the Materials are furnished to do so, subject to
** the following conditions:
**
** The above copyright notice and this permission notice shall be included
** in all copies or substantial portions of the Materials.
**
** THE MATERIALS ARE PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
** EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
** MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
** IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
** CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
** TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
** MATERIALS OR THE USE OR OTHER DEALINGS IN THE MATERIALS.
*/

// Various functions for helping debug WebGL apps.

WebGLDebugUtils = function() {

/**
 * Wrapped logging function.
 * @param {string} msg Message to log.
 */
var log = function(msg) {
  if (window.console && window.console.log) {
    window.console.log(msg);
  }
};

/**
 * Wrapped error logging function.
 * @param {string} msg Message to log.
 */
var error = function(msg) {
  if (window.console && window.console.error) {
    window.console.error(msg);
  } else {
    log(msg);
  }
};


/**
 * Which arguments are enums based on the number of arguments to the function.
 * So
 *    'texImage2D': {
 *       9: { 0:true, 2:true, 6:true, 7:true },
 *       6: { 0:true, 2:true, 3:true, 4:true },
 *    },
 *
 * means if there are 9 arguments then 6 and 7 are enums, if there are 6
 * arguments 3 and 4 are enums
 *
 * @type {!Object.<number, !Object.<number, string>}
 */
var glValidEnumContexts = {
  // Generic setters and getters

  'enable': {1: { 0:true }},
  'disable': {1: { 0:true }},
  'getParameter': {1: { 0:true }},

  // Rendering

  'drawArrays': {3:{ 0:true }},
  'drawElements': {4:{ 0:true, 2:true }},

  // Shaders

  'createShader': {1: { 0:true }},
  'getShaderParameter': {2: { 1:true }},
  'getProgramParameter': {2: { 1:true }},
  'getShaderPrecisionFormat': {2: { 0: true, 1:true }},

  // Vertex attributes

  'getVertexAttrib': {2: { 1:true }},
  'vertexAttribPointer': {6: { 2:true }},

  // Textures

  'bindTexture': {2: { 0:true }},
  'activeTexture': {1: { 0:true }},
  'getTexParameter': {2: { 0:true, 1:true }},
  'texParameterf': {3: { 0:true, 1:true }},
  'texParameteri': {3: { 0:true, 1:true, 2:true }},
  // texImage2D and texSubImage2D are defined below with WebGL 2 entrypoints
  'copyTexImage2D': {8: { 0:true, 2:true }},
  'copyTexSubImage2D': {8: { 0:true }},
  'generateMipmap': {1: { 0:true }},
  // compressedTexImage2D and compressedTexSubImage2D are defined below with WebGL 2 entrypoints

  // Buffer objects

  'bindBuffer': {2: { 0:true }},
  // bufferData and bufferSubData are defined below with WebGL 2 entrypoints
  'getBufferParameter': {2: { 0:true, 1:true }},

  // Renderbuffers and framebuffers

  'pixelStorei': {2: { 0:true, 1:true }},
  // readPixels is defined below with WebGL 2 entrypoints
  'bindRenderbuffer': {2: { 0:true }},
  'bindFramebuffer': {2: { 0:true }},
  'checkFramebufferStatus': {1: { 0:true }},
  'framebufferRenderbuffer': {4: { 0:true, 1:true, 2:true }},
  'framebufferTexture2D': {5: { 0:true, 1:true, 2:true }},
  'getFramebufferAttachmentParameter': {3: { 0:true, 1:true, 2:true }},
  'getRenderbufferParameter': {2: { 0:true, 1:true }},
  'renderbufferStorage': {4: { 0:true, 1:true }},

  // Frame buffer operations (clear, blend, depth test, stencil)

  'clear': {1: { 0: { 'enumBitwiseOr': ['COLOR_BUFFER_BIT', 'DEPTH_BUFFER_BIT', 'STENCIL_BUFFER_BIT'] }}},
  'depthFunc': {1: { 0:true }},
  'blendFunc': {2: { 0:true, 1:true }},
  'blendFuncSeparate': {4: { 0:true, 1:true, 2:true, 3:true }},
  'blendEquation': {1: { 0:true }},
  'blendEquationSeparate': {2: { 0:true, 1:true }},
  'stencilFunc': {3: { 0:true }},
  'stencilFuncSeparate': {4: { 0:true, 1:true }},
  'stencilMaskSeparate': {2: { 0:true }},
  'stencilOp': {3: { 0:true, 1:true, 2:true }},
  'stencilOpSeparate': {4: { 0:true, 1:true, 2:true, 3:true }},

  // Culling

  'cullFace': {1: { 0:true }},
  'frontFace': {1: { 0:true }},

  // ANGLE_instanced_arrays extension

  'drawArraysInstancedANGLE': {4: { 0:true }},
  'drawElementsInstancedANGLE': {5: { 0:true, 2:true }},

  // EXT_blend_minmax extension

  'blendEquationEXT': {1: { 0:true }},

  // WebGL 2 Buffer objects

  'bufferData': {
    3: { 0:true, 2:true }, // WebGL 1
    4: { 0:true, 2:true }, // WebGL 2
    5: { 0:true, 2:true }  // WebGL 2
  },
  'bufferSubData': {
    3: { 0:true }, // WebGL 1
    4: { 0:true }, // WebGL 2
    5: { 0:true }  // WebGL 2
  },
  'copyBufferSubData': {5: { 0:true, 1:true }},
  'getBufferSubData': {3: { 0:true }, 4: { 0:true }, 5: { 0:true }},

  // WebGL 2 Framebuffer objects

  'blitFramebuffer': {10: { 8: { 'enumBitwiseOr': ['COLOR_BUFFER_BIT', 'DEPTH_BUFFER_BIT', 'STENCIL_BUFFER_BIT'] }, 9:true }},
  'framebufferTextureLayer': {5: { 0:true, 1:true }},
  'invalidateFramebuffer': {2: { 0:true }},
  'invalidateSubFramebuffer': {6: { 0:true }},
  'readBuffer': {1: { 0:true }},

  // WebGL 2 Renderbuffer objects

  'getInternalformatParameter': {3: { 0:true, 1:true, 2:true }},
  'renderbufferStorageMultisample': {5: { 0:true, 2:true }},

  // WebGL 2 Texture objects

  'texStorage2D': {5: { 0:true, 2:true }},
  'texStorage3D': {6: { 0:true, 2:true }},
  'texImage2D': {
    9: { 0:true, 2:true, 6:true, 7:true }, // WebGL 1 & 2
    6: { 0:true, 2:true, 3:true, 4:true }, // WebGL 1
    10: { 0:true, 2:true, 6:true, 7:true } // WebGL 2
  },
  'texImage3D': {
    10: { 0:true, 2:true, 7:true, 8:true },
    11: { 0:true, 2:true, 7:true, 8:true }
  },
  'texSubImage2D': {
    9: { 0:true, 6:true, 7:true }, // WebGL 1 & 2
    7: { 0:true, 4:true, 5:true }, // WebGL 1
    10: { 0:true, 6:true, 7:true } // WebGL 2
  },
  'texSubImage3D': {
    11: { 0:true, 8:true, 9:true },
    12: { 0:true, 8:true, 9:true }
  },
  'copyTexSubImage3D': {9: { 0:true }},
  'compressedTexImage2D': {
    7: { 0: true, 2:true }, // WebGL 1 & 2
    8: { 0: true, 2:true }, // WebGL 2
    9: { 0: true, 2:true }  // WebGL 2
  },
  'compressedTexImage3D': {
    8: { 0: true, 2:true },
    9: { 0: true, 2:true },
    10: { 0: true, 2:true }
  },
  'compressedTexSubImage2D': {
    8: { 0: true, 6:true }, // WebGL 1 & 2
    9: { 0: true, 6:true }, // WebGL 2
    10: { 0: true, 6:true } // WebGL 2
  },
  'compressedTexSubImage3D': {
    10: { 0: true, 8:true },
    11: { 0: true, 8:true },
    12: { 0: true, 8:true }
  },

  // WebGL 2 Vertex attribs

  'vertexAttribIPointer': {5: { 2:true }},

  // WebGL 2 Writing to the drawing buffer

  'drawArraysInstanced': {4: { 0:true }},
  'drawElementsInstanced': {5: { 0:true, 2:true }},
  'drawRangeElements': {6: { 0:true, 4:true }},

  // WebGL 2 Reading back pixels

  'readPixels': {
    7: { 4:true, 5:true }, // WebGL 1 & 2
    8: { 4:true, 5:true }  // WebGL 2
  },

  // WebGL 2 Multiple Render Targets

  'clearBufferfv': {3: { 0:true }, 4: { 0:true }},
  'clearBufferiv': {3: { 0:true }, 4: { 0:true }},
  'clearBufferuiv': {3: { 0:true }, 4: { 0:true }},
  'clearBufferfi': {4: { 0:true }},

  // WebGL 2 Query objects

  'beginQuery': {2: { 0:true }},
  'endQuery': {1: { 0:true }},
  'getQuery': {2: { 0:true, 1:true }},
  'getQueryParameter': {2: { 1:true }},

  // WebGL 2 Sampler objects

  'samplerParameteri': {3: { 1:true, 2:true }},
  'samplerParameterf': {3: { 1:true }},
  'getSamplerParameter': {2: { 1:true }},

  // WebGL 2 Sync objects

  'fenceSync': {2: { 0:true, 1: { 'enumBitwiseOr': [] } }},
  'clientWaitSync': {3: { 1: { 'enumBitwiseOr': ['SYNC_FLUSH_COMMANDS_BIT'] } }},
  'waitSync': {3: { 1: { 'enumBitwiseOr': [] } }},
  'getSyncParameter': {2: { 1:true }},

  // WebGL 2 Transform Feedback

  'bindTransformFeedback': {2: { 0:true }},
  'beginTransformFeedback': {1: { 0:true }},
  'transformFeedbackVaryings': {3: { 2:true }},

  // WebGL2 Uniform Buffer Objects and Transform Feedback Buffers

  'bindBufferBase': {3: { 0:true }},
  'bindBufferRange': {5: { 0:true }},
  'getIndexedParameter': {2: { 0:true }},
  'getActiveUniforms': {3: { 2:true }},
  'getActiveUniformBlockParameter': {3: { 2:true }}
};

/**
 * Map of numbers to names.
 * @type {Object}
 */
var glEnums = null;

/**
 * Map of names to numbers.
 * @type {Object}
 */
var enumStringToValue = null;

/**
 * Initializes this module. Safe to call more than once.
 * @param {!WebGLRenderingContext} ctx A WebGL context. If
 *    you have more than one context it doesn't matter which one
 *    you pass in, it is only used to pull out constants.
 */
function init(ctx) {
  if (glEnums == null) {
    glEnums = { };
    enumStringToValue = { };
    for (var propertyName in ctx) {
      if (typeof ctx[propertyName] == 'number') {
        glEnums[ctx[propertyName]] = propertyName;
        enumStringToValue[propertyName] = ctx[propertyName];
      }
    }
  }
}

/**
 * Checks the utils have been initialized.
 */
function checkInit() {
  if (glEnums == null) {
    throw 'WebGLDebugUtils.init(ctx) not called';
  }
}

/**
 * Returns true or false if value matches any WebGL enum
 * @param {*} value Value to check if it might be an enum.
 * @return {boolean} True if value matches one of the WebGL defined enums
 */
function mightBeEnum(value) {
  checkInit();
  return (glEnums[value] !== undefined);
}

/**
 * Gets an string version of an WebGL enum.
 *
 * Example:
 *   var str = WebGLDebugUtil.glEnumToString(ctx.getError());
 *
 * @param {number} value Value to return an enum for
 * @return {string} The string version of the enum.
 */
function glEnumToString(value) {
  checkInit();
  var name = glEnums[value];
  return (name !== undefined) ? ("gl." + name) :
      ("/*UNKNOWN WebGL ENUM*/ 0x" + value.toString(16) + "");
}

/**
 * Returns the string version of a WebGL argument.
 * Attempts to convert enum arguments to strings.
 * @param {string} functionName the name of the WebGL function.
 * @param {number} numArgs the number of arguments passed to the function.
 * @param {number} argumentIndx the index of the argument.
 * @param {*} value The value of the argument.
 * @return {string} The value as a string.
 */
function glFunctionArgToString(functionName, numArgs, argumentIndex, value) {
  var funcInfo = glValidEnumContexts[functionName];
  if (funcInfo !== undefined) {
    var funcInfo = funcInfo[numArgs];
    if (funcInfo !== undefined) {
      if (funcInfo[argumentIndex]) {
        if (typeof funcInfo[argumentIndex] === 'object' &&
            funcInfo[argumentIndex]['enumBitwiseOr'] !== undefined) {
          var enums = funcInfo[argumentIndex]['enumBitwiseOr'];
          var orResult = 0;
          var orEnums = [];
          for (var i = 0; i < enums.length; ++i) {
            var enumValue = enumStringToValue[enums[i]];
            if ((value & enumValue) !== 0) {
              orResult |= enumValue;
              orEnums.push(glEnumToString(enumValue));
            }
          }
          if (orResult === value) {
            return orEnums.join(' | ');
          } else {
            return glEnumToString(value);
          }
        } else {
          return glEnumToString(value);
        }
      }
    }
  }
  if (value === null) {
    return "null";
  } else if (value === undefined) {
    return "undefined";
  } else {
    return value.toString();
  }
}

/**
 * Converts the arguments of a WebGL function to a string.
 * Attempts to convert enum arguments to strings.
 *
 * @param {string} functionName the name of the WebGL function.
 * @param {number} args The arguments.
 * @return {string} The arguments as a string.
 */
function glFunctionArgsToString(functionName, args) {
  // apparently we can't do args.join(",");
  var argStr = "";
  var numArgs = args.length;
  for (var ii = 0; ii < numArgs; ++ii) {
    argStr += ((ii == 0) ? '' : ', ') +
        glFunctionArgToString(functionName, numArgs, ii, args[ii]);
  }
  return argStr;
};


function makePropertyWrapper(wrapper, original, propertyName) {
  //log("wrap prop: " + propertyName);
  wrapper.__defineGetter__(propertyName, function() {
    return original[propertyName];
  });
  // TODO(gmane): this needs to handle properties that take more than
  // one value?
  wrapper.__defineSetter__(propertyName, function(value) {
    //log("set: " + propertyName);
    original[propertyName] = value;
  });
}

// Makes a function that calls a function on another object.
function makeFunctionWrapper(original, functionName) {
  //log("wrap fn: " + functionName);
  var f = original[functionName];
  return function() {
    //log("call: " + functionName);
    var result = f.apply(original, arguments);
    return result;
  };
}

/**
 * Given a WebGL context returns a wrapped context that calls
 * gl.getError after every command and calls a function if the
 * result is not gl.NO_ERROR.
 *
 * @param {!WebGLRenderingContext} ctx The webgl context to
 *        wrap.
 * @param {!function(err, funcName, args): void} opt_onErrorFunc
 *        The function to call when gl.getError returns an
 *        error. If not specified the default function calls
 *        console.log with a message.
 * @param {!function(funcName, args): void} opt_onFunc The
 *        function to call when each webgl function is called.
 *        You can use this to log all calls for example.
 * @param {!WebGLRenderingContext} opt_err_ctx The webgl context
 *        to call getError on if different than ctx.
 */
function makeDebugContext(ctx, opt_onErrorFunc, opt_onFunc, opt_err_ctx) {
  opt_err_ctx = opt_err_ctx || ctx;
  init(ctx);
  opt_onErrorFunc = opt_onErrorFunc || function(err, functionName, args) {
        // apparently we can't do args.join(",");
        var argStr = "";
        var numArgs = args.length;
        for (var ii = 0; ii < numArgs; ++ii) {
          argStr += ((ii == 0) ? '' : ', ') +
              glFunctionArgToString(functionName, numArgs, ii, args[ii]);
        }
        error("WebGL error "+ glEnumToString(err) + " in "+ functionName +
              "(" + argStr + ")");
      };

  // Holds booleans for each GL error so after we get the error ourselves
  // we can still return it to the client app.
  var glErrorShadow = { };

  // Makes a function that calls a WebGL function and then calls getError.
  function makeErrorWrapper(ctx, functionName) {
    return function() {
      if (opt_onFunc) {
        opt_onFunc(functionName, arguments);
      }
      var result = ctx[functionName].apply(ctx, arguments);
      var err = opt_err_ctx.getError();
      if (err != 0) {
        glErrorShadow[err] = true;
        opt_onErrorFunc(err, functionName, arguments);
      }
      return result;
    };
  }

  // Make a an object that has a copy of every property of the WebGL context
  // but wraps all functions.
  var wrapper = {};
  for (var propertyName in ctx) {
    if (typeof ctx[propertyName] == 'function') {
      if (propertyName != 'getExtension') {
        wrapper[propertyName] = makeErrorWrapper(ctx, propertyName);
      } else {
        var wrapped = makeErrorWrapper(ctx, propertyName);
        wrapper[propertyName] = function () {
          var result = wrapped.apply(ctx, arguments);
          if (!result) {
            return null;
          }
          return makeDebugContext(result, opt_onErrorFunc, opt_onFunc, opt_err_ctx);
        };
      }
    } else {
      makePropertyWrapper(wrapper, ctx, propertyName);
    }
  }

  // Override the getError function with one that returns our saved results.
  wrapper.getError = function() {
    for (var err in glErrorShadow) {
      if (glErrorShadow.hasOwnProperty(err)) {
        if (glErrorShadow[err]) {
          glErrorShadow[err] = false;
          return err;
        }
      }
    }
    return ctx.NO_ERROR;
  };

  return wrapper;
}

function resetToInitialState(ctx) {
  var isWebGL2RenderingContext = !!ctx.createTransformFeedback;

  if (isWebGL2RenderingContext) {
    ctx.bindVertexArray(null);
  }

  var numAttribs = ctx.getParameter(ctx.MAX_VERTEX_ATTRIBS);
  var tmp = ctx.createBuffer();
  ctx.bindBuffer(ctx.ARRAY_BUFFER, tmp);
  for (var ii = 0; ii < numAttribs; ++ii) {
    ctx.disableVertexAttribArray(ii);
    ctx.vertexAttribPointer(ii, 4, ctx.FLOAT, false, 0, 0);
    ctx.vertexAttrib1f(ii, 0);
    if (isWebGL2RenderingContext) {
      ctx.vertexAttribDivisor(ii, 0);
    }
  }
  ctx.deleteBuffer(tmp);

  var numTextureUnits = ctx.getParameter(ctx.MAX_TEXTURE_IMAGE_UNITS);
  for (var ii = 0; ii < numTextureUnits; ++ii) {
    ctx.activeTexture(ctx.TEXTURE0 + ii);
    ctx.bindTexture(ctx.TEXTURE_CUBE_MAP, null);
    ctx.bindTexture(ctx.TEXTURE_2D, null);
    if (isWebGL2RenderingContext) {
      ctx.bindTexture(ctx.TEXTURE_2D_ARRAY, null);
      ctx.bindTexture(ctx.TEXTURE_3D, null);
      ctx.bindSampler(ii, null);
    }
  }

  ctx.activeTexture(ctx.TEXTURE0);
  ctx.useProgram(null);
  ctx.bindBuffer(ctx.ARRAY_BUFFER, null);
  ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, null);
  ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
  ctx.bindRenderbuffer(ctx.RENDERBUFFER, null);
  ctx.disable(ctx.BLEND);
  ctx.disable(ctx.CULL_FACE);
  ctx.disable(ctx.DEPTH_TEST);
  ctx.disable(ctx.DITHER);
  ctx.disable(ctx.SCISSOR_TEST);
  ctx.blendColor(0, 0, 0, 0);
  ctx.blendEquation(ctx.FUNC_ADD);
  ctx.blendFunc(ctx.ONE, ctx.ZERO);
  ctx.clearColor(0, 0, 0, 0);
  ctx.clearDepth(1);
  ctx.clearStencil(-1);
  ctx.colorMask(true, true, true, true);
  ctx.cullFace(ctx.BACK);
  ctx.depthFunc(ctx.LESS);
  ctx.depthMask(true);
  ctx.depthRange(0, 1);
  ctx.frontFace(ctx.CCW);
  ctx.hint(ctx.GENERATE_MIPMAP_HINT, ctx.DONT_CARE);
  ctx.lineWidth(1);
  ctx.pixelStorei(ctx.PACK_ALIGNMENT, 4);
  ctx.pixelStorei(ctx.UNPACK_ALIGNMENT, 4);
  ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, false);
  ctx.pixelStorei(ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  // TODO: Delete this IF.
  if (ctx.UNPACK_COLORSPACE_CONVERSION_WEBGL) {
    ctx.pixelStorei(ctx.UNPACK_COLORSPACE_CONVERSION_WEBGL, ctx.BROWSER_DEFAULT_WEBGL);
  }
  ctx.polygonOffset(0, 0);
  ctx.sampleCoverage(1, false);
  ctx.scissor(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.stencilFunc(ctx.ALWAYS, 0, 0xFFFFFFFF);
  ctx.stencilMask(0xFFFFFFFF);
  ctx.stencilOp(ctx.KEEP, ctx.KEEP, ctx.KEEP);
  ctx.viewport(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT | ctx.STENCIL_BUFFER_BIT);

  if (isWebGL2RenderingContext) {
    ctx.drawBuffers([ctx.BACK]);
    ctx.readBuffer(ctx.BACK);
    ctx.bindBuffer(ctx.COPY_READ_BUFFER, null);
    ctx.bindBuffer(ctx.COPY_WRITE_BUFFER, null);
    ctx.bindBuffer(ctx.PIXEL_PACK_BUFFER, null);
    ctx.bindBuffer(ctx.PIXEL_UNPACK_BUFFER, null);
    var numTransformFeedbacks = ctx.getParameter(ctx.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS);
    for (var ii = 0; ii < numTransformFeedbacks; ++ii) {
      ctx.bindBufferBase(ctx.TRANSFORM_FEEDBACK_BUFFER, ii, null);
    }
    var numUBOs = ctx.getParameter(ctx.MAX_UNIFORM_BUFFER_BINDINGS);
    for (var ii = 0; ii < numUBOs; ++ii) {
      ctx.bindBufferBase(ctx.UNIFORM_BUFFER, ii, null);
    }
    ctx.disable(ctx.RASTERIZER_DISCARD);
    ctx.pixelStorei(ctx.UNPACK_IMAGE_HEIGHT, 0);
    ctx.pixelStorei(ctx.UNPACK_SKIP_IMAGES, 0);
    ctx.pixelStorei(ctx.UNPACK_ROW_LENGTH, 0);
    ctx.pixelStorei(ctx.UNPACK_SKIP_ROWS, 0);
    ctx.pixelStorei(ctx.UNPACK_SKIP_PIXELS, 0);
    ctx.pixelStorei(ctx.PACK_ROW_LENGTH, 0);
    ctx.pixelStorei(ctx.PACK_SKIP_ROWS, 0);
    ctx.pixelStorei(ctx.PACK_SKIP_PIXELS, 0);
    ctx.hint(ctx.FRAGMENT_SHADER_DERIVATIVE_HINT, ctx.DONT_CARE);
  }

  // TODO: This should NOT be needed but Firefox fails with 'hint'
  while(ctx.getError());
}

function makeLostContextSimulatingCanvas(canvas) {
  var unwrappedContext_;
  var wrappedContext_;
  var onLost_ = [];
  var onRestored_ = [];
  var wrappedContext_ = {};
  var contextId_ = 1;
  var contextLost_ = false;
  var resourceId_ = 0;
  var resourceDb_ = [];
  var numCallsToLoseContext_ = 0;
  var numCalls_ = 0;
  var canRestore_ = false;
  var restoreTimeout_ = 0;
  var isWebGL2RenderingContext;

  // Holds booleans for each GL error so can simulate errors.
  var glErrorShadow_ = { };

  canvas.getContext = function(f) {
    return function() {
      var ctx = f.apply(canvas, arguments);
      // Did we get a context and is it a WebGL context?
      if ((ctx instanceof WebGLRenderingContext) || (window.WebGL2RenderingContext && (ctx instanceof WebGL2RenderingContext))) {
        if (ctx != unwrappedContext_) {
          if (unwrappedContext_) {
            throw "got different context"
          }
          isWebGL2RenderingContext = window.WebGL2RenderingContext && (ctx instanceof WebGL2RenderingContext);
          unwrappedContext_ = ctx;
          wrappedContext_ = makeLostContextSimulatingContext(unwrappedContext_);
        }
        return wrappedContext_;
      }
      return ctx;
    }
  }(canvas.getContext);

  function wrapEvent(listener) {
    if (typeof(listener) == "function") {
      return listener;
    } else {
      return function(info) {
        listener.handleEvent(info);
      }
    }
  }

  var addOnContextLostListener = function(listener) {
    onLost_.push(wrapEvent(listener));
  };

  var addOnContextRestoredListener = function(listener) {
    onRestored_.push(wrapEvent(listener));
  };


  function wrapAddEventListener(canvas) {
    var f = canvas.addEventListener;
    canvas.addEventListener = function(type, listener, bubble) {
      switch (type) {
        case 'webglcontextlost':
          addOnContextLostListener(listener);
          break;
        case 'webglcontextrestored':
          addOnContextRestoredListener(listener);
          break;
        default:
          f.apply(canvas, arguments);
      }
    };
  }

  wrapAddEventListener(canvas);

  canvas.loseContext = function() {
    if (!contextLost_) {
      contextLost_ = true;
      numCallsToLoseContext_ = 0;
      ++contextId_;
      while (unwrappedContext_.getError());
      clearErrors();
      glErrorShadow_[unwrappedContext_.CONTEXT_LOST_WEBGL] = true;
      var event = makeWebGLContextEvent("context lost");
      var callbacks = onLost_.slice();
      setTimeout(function() {
          //log("numCallbacks:" + callbacks.length);
          for (var ii = 0; ii < callbacks.length; ++ii) {
            //log("calling callback:" + ii);
            callbacks[ii](event);
          }
          if (restoreTimeout_ >= 0) {
            setTimeout(function() {
                canvas.restoreContext();
              }, restoreTimeout_);
          }
        }, 0);
    }
  };

  canvas.restoreContext = function() {
    if (contextLost_) {
      if (onRestored_.length) {
        setTimeout(function() {
            if (!canRestore_) {
              throw "can not restore. webglcontestlost listener did not call event.preventDefault";
            }
            freeResources();
            resetToInitialState(unwrappedContext_);
            contextLost_ = false;
            numCalls_ = 0;
            canRestore_ = false;
            var callbacks = onRestored_.slice();
            var event = makeWebGLContextEvent("context restored");
            for (var ii = 0; ii < callbacks.length; ++ii) {
              callbacks[ii](event);
            }
          }, 0);
      }
    }
  };

  canvas.loseContextInNCalls = function(numCalls) {
    if (contextLost_) {
      throw "You can not ask a lost contet to be lost";
    }
    numCallsToLoseContext_ = numCalls_ + numCalls;
  };

  canvas.getNumCalls = function() {
    return numCalls_;
  };

  canvas.setRestoreTimeout = function(timeout) {
    restoreTimeout_ = timeout;
  };

  function isWebGLObject(obj) {
    //return false;
    return (obj instanceof WebGLBuffer ||
            obj instanceof WebGLFramebuffer ||
            obj instanceof WebGLProgram ||
            obj instanceof WebGLRenderbuffer ||
            obj instanceof WebGLShader ||
            obj instanceof WebGLTexture);
  }

  function checkResources(args) {
    for (var ii = 0; ii < args.length; ++ii) {
      var arg = args[ii];
      if (isWebGLObject(arg)) {
        return arg.__webglDebugContextLostId__ == contextId_;
      }
    }
    return true;
  }

  function clearErrors() {
    var k = Object.keys(glErrorShadow_);
    for (var ii = 0; ii < k.length; ++ii) {
      delete glErrorShadow_[k[ii]];
    }
  }

  function loseContextIfTime() {
    ++numCalls_;
    if (!contextLost_) {
      if (numCallsToLoseContext_ == numCalls_) {
        canvas.loseContext();
      }
    }
  }

  // Makes a function that simulates WebGL when out of context.
  function makeLostContextFunctionWrapper(ctx, functionName) {
    var f = ctx[functionName];
    return function() {
      // log("calling:" + functionName);
      // Only call the functions if the context is not lost.
      loseContextIfTime();
      if (!contextLost_) {
        //if (!checkResources(arguments)) {
        //  glErrorShadow_[wrappedContext_.INVALID_OPERATION] = true;
        //  return;
        //}
        var result = f.apply(ctx, arguments);
        return result;
      }
    };
  }

  function freeResources() {
    for (var ii = 0; ii < resourceDb_.length; ++ii) {
      var resource = resourceDb_[ii];
      if (resource instanceof WebGLBuffer) {
        unwrappedContext_.deleteBuffer(resource);
      } else if (resource instanceof WebGLFramebuffer) {
        unwrappedContext_.deleteFramebuffer(resource);
      } else if (resource instanceof WebGLProgram) {
        unwrappedContext_.deleteProgram(resource);
      } else if (resource instanceof WebGLRenderbuffer) {
        unwrappedContext_.deleteRenderbuffer(resource);
      } else if (resource instanceof WebGLShader) {
        unwrappedContext_.deleteShader(resource);
      } else if (resource instanceof WebGLTexture) {
        unwrappedContext_.deleteTexture(resource);
      }
      else if (isWebGL2RenderingContext) {
        if (resource instanceof WebGLQuery) {
          unwrappedContext_.deleteQuery(resource);
        } else if (resource instanceof WebGLSampler) {
          unwrappedContext_.deleteSampler(resource);
        } else if (resource instanceof WebGLSync) {
          unwrappedContext_.deleteSync(resource);
        } else if (resource instanceof WebGLTransformFeedback) {
          unwrappedContext_.deleteTransformFeedback(resource);
        } else if (resource instanceof WebGLVertexArrayObject) {
          unwrappedContext_.deleteVertexArray(resource);
        }
      }
    }
  }

  function makeWebGLContextEvent(statusMessage) {
    return {
      statusMessage: statusMessage,
      preventDefault: function() {
          canRestore_ = true;
        }
    };
  }

  return canvas;

  function makeLostContextSimulatingContext(ctx) {
    // copy all functions and properties to wrapper
    for (var propertyName in ctx) {
      if (typeof ctx[propertyName] == 'function') {
         wrappedContext_[propertyName] = makeLostContextFunctionWrapper(
             ctx, propertyName);
       } else {
         makePropertyWrapper(wrappedContext_, ctx, propertyName);
       }
    }

    // Wrap a few functions specially.
    wrappedContext_.getError = function() {
      loseContextIfTime();
      if (!contextLost_) {
        var err;
        while (err = unwrappedContext_.getError()) {
          glErrorShadow_[err] = true;
        }
      }
      for (var err in glErrorShadow_) {
        if (glErrorShadow_[err]) {
          delete glErrorShadow_[err];
          return err;
        }
      }
      return wrappedContext_.NO_ERROR;
    };

    var creationFunctions = [
      "createBuffer",
      "createFramebuffer",
      "createProgram",
      "createRenderbuffer",
      "createShader",
      "createTexture"
    ];
    if (isWebGL2RenderingContext) {
      creationFunctions.push(
        "createQuery",
        "createSampler",
        "fenceSync",
        "createTransformFeedback",
        "createVertexArray"
      );
    }
    for (var ii = 0; ii < creationFunctions.length; ++ii) {
      var functionName = creationFunctions[ii];
      wrappedContext_[functionName] = function(f) {
        return function() {
          loseContextIfTime();
          if (contextLost_) {
            return null;
          }
          var obj = f.apply(ctx, arguments);
          obj.__webglDebugContextLostId__ = contextId_;
          resourceDb_.push(obj);
          return obj;
        };
      }(ctx[functionName]);
    }

    var functionsThatShouldReturnNull = [
      "getActiveAttrib",
      "getActiveUniform",
      "getBufferParameter",
      "getContextAttributes",
      "getAttachedShaders",
      "getFramebufferAttachmentParameter",
      "getParameter",
      "getProgramParameter",
      "getProgramInfoLog",
      "getRenderbufferParameter",
      "getShaderParameter",
      "getShaderInfoLog",
      "getShaderSource",
      "getTexParameter",
      "getUniform",
      "getUniformLocation",
      "getVertexAttrib"
    ];
    if (isWebGL2RenderingContext) {
      functionsThatShouldReturnNull.push(
        "getInternalformatParameter",
        "getQuery",
        "getQueryParameter",
        "getSamplerParameter",
        "getSyncParameter",
        "getTransformFeedbackVarying",
        "getIndexedParameter",
        "getUniformIndices",
        "getActiveUniforms",
        "getActiveUniformBlockParameter",
        "getActiveUniformBlockName"
      );
    }
    for (var ii = 0; ii < functionsThatShouldReturnNull.length; ++ii) {
      var functionName = functionsThatShouldReturnNull[ii];
      wrappedContext_[functionName] = function(f) {
        return function() {
          loseContextIfTime();
          if (contextLost_) {
            return null;
          }
          return f.apply(ctx, arguments);
        }
      }(wrappedContext_[functionName]);
    }

    var isFunctions = [
      "isBuffer",
      "isEnabled",
      "isFramebuffer",
      "isProgram",
      "isRenderbuffer",
      "isShader",
      "isTexture"
    ];
    if (isWebGL2RenderingContext) {
      isFunctions.push(
        "isQuery",
        "isSampler",
        "isSync",
        "isTransformFeedback",
        "isVertexArray"
      );
    }
    for (var ii = 0; ii < isFunctions.length; ++ii) {
      var functionName = isFunctions[ii];
      wrappedContext_[functionName] = function(f) {
        return function() {
          loseContextIfTime();
          if (contextLost_) {
            return false;
          }
          return f.apply(ctx, arguments);
        }
      }(wrappedContext_[functionName]);
    }

    wrappedContext_.checkFramebufferStatus = function(f) {
      return function() {
        loseContextIfTime();
        if (contextLost_) {
          return wrappedContext_.FRAMEBUFFER_UNSUPPORTED;
        }
        return f.apply(ctx, arguments);
      };
    }(wrappedContext_.checkFramebufferStatus);

    wrappedContext_.getAttribLocation = function(f) {
      return function() {
        loseContextIfTime();
        if (contextLost_) {
          return -1;
        }
        return f.apply(ctx, arguments);
      };
    }(wrappedContext_.getAttribLocation);

    wrappedContext_.getVertexAttribOffset = function(f) {
      return function() {
        loseContextIfTime();
        if (contextLost_) {
          return 0;
        }
        return f.apply(ctx, arguments);
      };
    }(wrappedContext_.getVertexAttribOffset);

    wrappedContext_.isContextLost = function() {
      return contextLost_;
    };

    if (isWebGL2RenderingContext) {
      wrappedContext_.getFragDataLocation = function(f) {
        return function() {
          loseContextIfTime();
          if (contextLost_) {
            return -1;
          }
          return f.apply(ctx, arguments);
        };
      }(wrappedContext_.getFragDataLocation);

      wrappedContext_.clientWaitSync = function(f) {
        return function() {
          loseContextIfTime();
          if (contextLost_) {
            return wrappedContext_.WAIT_FAILED;
          }
          return f.apply(ctx, arguments);
        };
      }(wrappedContext_.clientWaitSync);

      wrappedContext_.getUniformBlockIndex = function(f) {
        return function() {
          loseContextIfTime();
          if (contextLost_) {
            return wrappedContext_.INVALID_INDEX;
          }
          return f.apply(ctx, arguments);
        };
      }(wrappedContext_.getUniformBlockIndex);
    }

    return wrappedContext_;
  }
}

return {
  /**
   * Initializes this module. Safe to call more than once.
   * @param {!WebGLRenderingContext} ctx A WebGL context. If
   *    you have more than one context it doesn't matter which one
   *    you pass in, it is only used to pull out constants.
   */
  'init': init,

  /**
   * Returns true or false if value matches any WebGL enum
   * @param {*} value Value to check if it might be an enum.
   * @return {boolean} True if value matches one of the WebGL defined enums
   */
  'mightBeEnum': mightBeEnum,

  /**
   * Gets an string version of an WebGL enum.
   *
   * Example:
   *   WebGLDebugUtil.init(ctx);
   *   var str = WebGLDebugUtil.glEnumToString(ctx.getError());
   *
   * @param {number} value Value to return an enum for
   * @return {string} The string version of the enum.
   */
  'glEnumToString': glEnumToString,

  /**
   * Converts the argument of a WebGL function to a string.
   * Attempts to convert enum arguments to strings.
   *
   * Example:
   *   WebGLDebugUtil.init(ctx);
   *   var str = WebGLDebugUtil.glFunctionArgToString('bindTexture', 2, 0, gl.TEXTURE_2D);
   *
   * would return 'TEXTURE_2D'
   *
   * @param {string} functionName the name of the WebGL function.
   * @param {number} numArgs The number of arguments
   * @param {number} argumentIndx the index of the argument.
   * @param {*} value The value of the argument.
   * @return {string} The value as a string.
   */
  'glFunctionArgToString': glFunctionArgToString,

  /**
   * Converts the arguments of a WebGL function to a string.
   * Attempts to convert enum arguments to strings.
   *
   * @param {string} functionName the name of the WebGL function.
   * @param {number} args The arguments.
   * @return {string} The arguments as a string.
   */
  'glFunctionArgsToString': glFunctionArgsToString,

  /**
   * Given a WebGL context returns a wrapped context that calls
   * gl.getError after every command and calls a function if the
   * result is not NO_ERROR.
   *
   * You can supply your own function if you want. For example, if you'd like
   * an exception thrown on any GL error you could do this
   *
   *    function throwOnGLError(err, funcName, args) {
   *      throw WebGLDebugUtils.glEnumToString(err) +
   *            " was caused by call to " + funcName;
   *    };
   *
   *    ctx = WebGLDebugUtils.makeDebugContext(
   *        canvas.getContext("webgl"), throwOnGLError);
   *
   * @param {!WebGLRenderingContext} ctx The webgl context to wrap.
   * @param {!function(err, funcName, args): void} opt_onErrorFunc The function
   *     to call when gl.getError returns an error. If not specified the default
   *     function calls console.log with a message.
   * @param {!function(funcName, args): void} opt_onFunc The
   *     function to call when each webgl function is called. You
   *     can use this to log all calls for example.
   */
  'makeDebugContext': makeDebugContext,

  /**
   * Given a canvas element returns a wrapped canvas element that will
   * simulate lost context. The canvas returned adds the following functions.
   *
   * loseContext:
   *   simulates a lost context event.
   *
   * restoreContext:
   *   simulates the context being restored.
   *
   * lostContextInNCalls:
   *   loses the context after N gl calls.
   *
   * getNumCalls:
   *   tells you how many gl calls there have been so far.
   *
   * setRestoreTimeout:
   *   sets the number of milliseconds until the context is restored
   *   after it has been lost. Defaults to 0. Pass -1 to prevent
   *   automatic restoring.
   *
   * @param {!Canvas} canvas The canvas element to wrap.
   */
  'makeLostContextSimulatingCanvas': makeLostContextSimulatingCanvas,

  /**
   * Resets a context to the initial state.
   * @param {!WebGLRenderingContext} ctx The webgl context to
   *     reset.
   */
  'resetToInitialState': resetToInitialState
};

}();


/***/ }),

/***/ 67:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(40)(undefined);
// imports


// module
exports.push([module.i, "html {\n    height: 100%;\n    background-color: #555;\n    color: #eee;\n    font-family: monospace;\n}\n\nbody {\n    padding: 0;\n    margin: 0;\n    height: 100%;\n}\n\n#content {\n    width: 100%;\n    height: 100%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n\ncanvas.game {\n    width: 100vw;\n    height: 100vh;\n}\n", ""]);

// exports


/***/ })

});
//# sourceMappingURL=common.bundle.js.map