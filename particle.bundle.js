webpackJsonp([3],{

/***/ 125:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _underscore = __webpack_require__(35);

var _components = __webpack_require__(34);

var _graphics = __webpack_require__(28);

var _particle = __webpack_require__(126);

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
        width: 320,
        height: 240
    },
    debug: false,
    clearColor: [0, 0, 0, 1] //[0.2, 0.2, 0.2, 1]
});

app.start();

app.load({
    basePath: 'shaders/',
    programs: [{
        name: 'particle.simulate',
        opts: {
            transformFeedbackVaryings: ['v_position', 'v_velocity']
        }
    }, 'particle.draw', 'grid', 'sprite']
});

console.log(app.gl.getParameter(app.gl.MAX_ARRAY_TEXTURE_LAYERS));

class PixelBufferWrapper {
    constructor(opts) {
        let { buffer, width, height, components } = opts;
        this.buffer = buffer;
        this.width = width;
        this.height = height;
        this.components = components;
    }

    setPixel(x, y, value) {
        const index = (y * this.width + x) * this.components;
        if (index >= 0 && index < this.buffer.length) {
            this.buffer.set(value, index);
        }
    }
}

class BarrierTextureBuilder {
    constructor(opts) {
        let { width, height } = opts;

        this.buffer = new Float32Array(2 * width * height);

        let angle = 0;
        let length = 0;
        for (let i = 0; i < width * height; i++) {
            length += Math.random() * 0.5;
            if (length > 5) length = 5;
            if (length < -5) length = -5;
            angle += Math.random() * Math.PI;
            this.buffer[i * 2] = Math.cos(angle) * length * 0.01;
            this.buffer[i * 2 + 1] = Math.sin(angle) * length * 0.01;
        }

        this.pixelBuffer = new PixelBufferWrapper({ buffer: this.buffer, width, height, components: 2 });

        this.width = width;
        this.height = height;
    }

    line(start, end, thickness) {
        var _this = this;

        let normal = [-(end[1] - start[1]), end[0] - start[0]];
        let inv_mag = 1 / Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1]);
        normal = [normal[0] * inv_mag, normal[1] * inv_mag];

        bresenham(start[0], start[1], end[0], end[1], function (x, y) {
            _this.pixelBuffer.setPixel(x, y, normal);
        });
    }

    rect(origin, size) {
        this.line([origin[0], origin[1] + size[1]], [origin[0] + size[0], origin[1] + size[1]]);
        this.line([origin[0] + size[0], origin[1] + size[1]], [origin[0] + size[0], origin[1]]);

        this.line([origin[0] + size[0], origin[1]], [origin[0], origin[1]]);
        this.line([origin[0], origin[1]], [origin[0], origin[1] + size[1]]);
    }

}

function bresenham(x0, y0, x1, y1, cb) {
    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);
    var sx = x0 < x1 ? 1 : -1;
    var sy = y0 < y1 ? 1 : -1;
    var err = dx - dy;

    while (true) {
        cb(x0, y0);

        if (x0 == x1 && y0 == y1) break;
        var e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;x0 += sx;
        }
        if (e2 < dx) {
            err += dx;y0 += sy;
        }
    }
}

const wallBuilder = new BarrierTextureBuilder({ width: 320, height: 240 });

wallBuilder.rect([160, 60], [60, 60]);

wallBuilder.line([0, 150], [106, 20]);
wallBuilder.line([0, 150 - 1], [106, 20 - 1]);

wallBuilder.line([106, 20], [214, 20]);
wallBuilder.line([106, 20 - 1], [214, 20 - 1]);

wallBuilder.line([214, 20], [320, 150]);
wallBuilder.line([214, 20 - 1], [320, 150 - 1]);

//
// for (let i = 0; i < 20; i++) {
//     wallBuilder.line([0, 0 + i], [319, 239 + i]);
// }
// for (let i = 0; i < 20; i++) {
//     wallBuilder.line([319 + i, 238], [1 + i, 0]);
// }
//
// for (let i = 0; i < 20; i++) {
//     wallBuilder.line([0, 239 + i], [319, 0 + i]);
// }
// for (let i = 0; i < 20; i++) {
//     wallBuilder.line([319, 0 - i], [0, 239 - i]);
// }


const MAX_PARTICLES = 10000;

app.load({
    textures: {
        wallForce: {
            internalFormat: app.gl.RG32F,
            format: app.gl.RG,
            type: app.gl.FLOAT,
            src: wallBuilder.buffer,
            width: wallBuilder.width,
            height: wallBuilder.height,
            magMag: app.gl.NEAREST
        }
    }
});

async function run() {
    await app.loader.loading;

    const grid = new _graphics.GridOutline(app);
    grid.addGrid(8, 8, [0.4, 0.1, 0.9, 0.4], 0.25);
    //grid.addGrid(16, 16, [0.1, 0.3, 0.9, 0.4], 0.5);
    //grid.addGrid(32, 32, [0,   0.5, 0.9, 0.3], 1);

    const particles = new _particle.ParticleSystem({ game: app, maxParticles: MAX_PARTICLES });

    const framebufferRenderer = new _graphics.SpriteRenderer({
        game: app,
        textureInfo: _extends({
            texture: app.framebuffer.texture
        }, app.resolution)
    });

    requestAnimationFrame(function render() {
        app.adjustViewport();
        app.clear();
        //grid.render();
        app.framebuffer.attach();
        app.clear();

        particles.draw();
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

/***/ }),

/***/ 126:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ParticleSystem = undefined;

var _shaderUtil = __webpack_require__(29);

var _gl = __webpack_require__(15);

var _util = __webpack_require__(16);

var _twgl = __webpack_require__(12);

var _twgl2 = _interopRequireDefault(_twgl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function randomColor() {
    return [...(0, _util.hsl2rgb)(Math.random() * 360, Math.random() * 50 + 50, Math.random() * 50 + 20), (Math.random() * 0.6 + 0.4) * 255];
}

class ParticleSystem {
    constructor(opts) {
        let { game, maxParticles } = opts;
        this.game = game;
        this.maxParticles = maxParticles;
        this.frameCount = 0;
        this.setup();
    }

    setup() {
        /*
        Create buffers for particle rendering and simulation
         Simulation requires buffers for
          - position in
          - velocity in
          - position out
          - velocity out
        */

        this.bufferInfo = {
            simulate: _twgl2.default.createBufferInfoFromArrays(_gl.gl, {
                position: {
                    numComponents: 2,
                    drawType: _gl.gl.DYNAMIC_DRAW
                },
                velocity: {
                    numComponents: 2,
                    drawType: _gl.gl.DYNAMIC_DRAW
                },
                color: {
                    type: Uint8Array,
                    data: this.maxParticles * 4,
                    numComponents: 4,
                    normalized: true,
                    drawType: _gl.gl.STATIC_DRAW
                },
                positionFeedback: {
                    numComponents: 2,
                    drawType: _gl.gl.DYNAMIC_COPY,
                    data: this.maxParticles * 2
                },
                velocityFeedback: {
                    numComponents: 2,
                    drawType: _gl.gl.DYNAMIC_COPY,
                    data: this.maxParticles * 2
                }
            })
        };

        this.programs = {
            simulate: this.game.getProgram('particle.simulate')
        };

        const { position, velocity, color } = this.initParticles();
        this.color = color;

        _twgl2.default.setAttribInfoBufferFromArray(_gl.gl, this.bufferInfo.simulate.attribs.position, position);

        _twgl2.default.setAttribInfoBufferFromArray(_gl.gl, this.bufferInfo.simulate.attribs.velocity, velocity);

        _twgl2.default.setAttribInfoBufferFromArray(_gl.gl, this.bufferInfo.simulate.attribs.color, color);

        this.transformFeedback = _gl.gl.createTransformFeedback();
    }

    initParticles() {
        const max_particles = this.maxParticles;
        const bounds = {
            x0: 0,
            y0: this.game.resolution.height,
            x1: this.game.resolution.width,
            y1: this.game.resolution.height
        };
        const max_speed = 1;

        const position = new Float32Array(max_particles * 2);
        const velocity = new Float32Array(max_particles * 2);
        const color = new Uint8Array(max_particles * 4);

        const setPosition = (0, _util.arraySetter)(position);
        const setVelocity = (0, _util.arraySetter)(velocity);
        const setColor = (0, _util.arraySetter)(color);

        for (let i = 0; i < max_particles; i++) {
            const angle = Math.PI * Math.random();
            const speed = Math.random() * max_speed;
            const randColor = randomColor();

            setVelocity([Math.cos(angle) * speed + 0.01, Math.sin(angle) * speed + 0.01]);
            setPosition([bounds.x0 + Math.random() * (bounds.x1 - bounds.x0), bounds.y0 + Math.random() * (bounds.y1 - bounds.y0)]);
            setColor(randColor);
        }

        return { position, velocity, color };
    }

    setColors() {
        const max_particles = this.maxParticles;

        for (let i = 0; i < max_particles / 10; i++) {
            this.color.set(randomColor(), Math.floor(Math.random() * max_particles) * 4);
        }

        _twgl2.default.setAttribInfoBufferFromArray(_gl.gl, this.bufferInfo.simulate.attribs.color, this.color);
    }

    draw() {
        _gl.gl.useProgram(this.programs.simulate.program);

        _gl.gl.bindVertexArray(null);

        _twgl2.default.setUniforms(this.programs.simulate, {
            projection: this.game.projection,
            bounds: [0, 0, this.game.resolution.width, this.game.resolution.height],
            wallForce: this.game.loader.getTexture('wallForce')
        });

        if (this.frameCount % 50 === 0) {
            this.setColors();
        }

        _twgl2.default.setBuffersAndAttributes(_gl.gl, this.programs.simulate, this.bufferInfo.simulate);

        _gl.gl.bindTransformFeedback(_gl.gl.TRANSFORM_FEEDBACK, this.transformFeedback);
        _gl.gl.bindBufferBase(_gl.gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.bufferInfo.simulate.attribs.positionFeedback.buffer);
        _gl.gl.bindBufferBase(_gl.gl.TRANSFORM_FEEDBACK_BUFFER, 1, this.bufferInfo.simulate.attribs.velocityFeedback.buffer);
        // gl.enable(gl.RASTERIZER_DISCARD);
        _gl.gl.beginTransformFeedback(_gl.gl.POINTS);

        _twgl2.default.drawBufferInfo(_gl.gl, this.bufferInfo.simulate, _gl.gl.POINTS, this.maxParticles);

        _gl.gl.endTransformFeedback();
        _gl.gl.bindTransformFeedback(_gl.gl.TRANSFORM_FEEDBACK, null);
        _gl.gl.bindBufferBase(_gl.gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
        _gl.gl.bindBufferBase(_gl.gl.TRANSFORM_FEEDBACK_BUFFER, 1, null);

        /* Copy positionFeedback buffer to position buffer */
        _gl.gl.bindBuffer(_gl.gl.COPY_READ_BUFFER, this.bufferInfo.simulate.attribs.positionFeedback.buffer);
        _gl.gl.bindBuffer(_gl.gl.COPY_WRITE_BUFFER, this.bufferInfo.simulate.attribs.position.buffer);

        _gl.gl.copyBufferSubData(_gl.gl.COPY_READ_BUFFER, _gl.gl.COPY_WRITE_BUFFER, 0, 0, this.maxParticles * 2 * 4);

        /* Copy velocityFeedback buffer to velocity buffer */
        _gl.gl.bindBuffer(_gl.gl.COPY_READ_BUFFER, this.bufferInfo.simulate.attribs.velocityFeedback.buffer);
        _gl.gl.bindBuffer(_gl.gl.COPY_WRITE_BUFFER, this.bufferInfo.simulate.attribs.velocity.buffer);

        _gl.gl.copyBufferSubData(_gl.gl.COPY_READ_BUFFER, _gl.gl.COPY_WRITE_BUFFER, 0, 0, this.maxParticles * 2 * 4);

        _gl.gl.bindBuffer(_gl.gl.COPY_READ_BUFFER, null);
        _gl.gl.bindBuffer(_gl.gl.COPY_WRITE_BUFFER, null);

        this.frameCount++;
    }
}

exports.ParticleSystem = ParticleSystem;

/***/ })

},[125]);
//# sourceMappingURL=particle.bundle.js.map