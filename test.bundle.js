webpackJsonp([2],{

/***/ 69:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(70);
module.exports = __webpack_require__(72);


/***/ }),

/***/ 70:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _lib = __webpack_require__(71);

describe('', function () {
    const canary = {};

    (0, _lib.registerLib)(canary);

    it('should be the same as the registered object', function () {
        canary.should.equal(_lib.lib);
    });

    it('should be rebindable', function () {
        const finch = {};
        (0, _lib.registerLib)(finch);
        finch.should.equal(_lib.lib);
        canary.should.not.equal(_lib.lib);
    });

    it('is different', function () {
        let a = {};
        let b = a;
        a = {};
        a.should.not.equal(b);
    });
});

/***/ }),

/***/ 71:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
let lib;

function registerLib(ob) {
    exports.lib = lib = ob;
}

exports.lib = lib;
exports.registerLib = registerLib;

/***/ }),

/***/ 72:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _stateMachine = __webpack_require__(73);

class TestState extends _stateMachine.State {
    constructor() {
        super();
        this.enter = sinon.spy();
        this.exit = sinon.spy();
    }
}

describe('StateStack', function () {
    let stack = new _stateMachine.StateStack();

    beforeEach(function () {
        stack = new _stateMachine.StateStack();
    });

    describe('#push', function () {
        let newState;

        beforeEach(function () {
            newState = new TestState();
            stack.push(newState);
        });

        it("should push the stack", function () {
            stack.top().should.equal(newState);
        });

        it("calls enter on incoming state", function () {
            newState.enter.called.should.be.true;
        });

        describe("with a non-empty stack", function () {
            it("calls exit on top of stack", function () {
                newState.exit.called.should.be.false;
                stack.push(new TestState());
                newState.exit.called.should.be.true;
            });
        });
    });

    describe('#replace', function () {
        describe('with a non-empty stack', function () {
            it('should replace top', function () {
                stack.push(new TestState());
                const newState = new TestState();
                stack.top().should.not.equal(newState);
                stack.replace(newState);
                stack.top().should.equal(newState);
            });

            it('calls exit on top', function () {
                const newState = new TestState();

                stack.replace(newState);
                stack.replace(new TestState());

                newState.exit.called.should.be.true;
            });
        });

        it('should replace top', function () {
            const newState = new TestState();
            should.not.exist(stack.top());
            stack.replace(newState);
            stack.top().should.equal(newState);
        });

        it('calls enter on incoming state', function () {
            const newState = new TestState();
            stack.replace(newState);
            newState.enter.called.should.be.true;
        });
    });
});

/***/ }),

/***/ 73:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
class StateStack {
    constructor() {
        this.states = [];
    }

    replace(next) {
        const leaving = this.states.shift();
        if (leaving) {
            leaving.exit(next);
        }
        this.states.unshift(next);
        next.enter(leaving || null);
    }

    push(next) {
        const leaving = this.states[0] || null;
        this.states.unshift(next);
        if (leaving) {
            leaving.exit(next);
        }
        if (next) {
            next.enter(leaving);
        }
    }

    pop() {
        const leaving = this.states.shift() || null;
        const next = this.states[0] || null;
        if (leaving) {
            leaving.exit(next);
        }
        if (next) {
            next.enter(leaving);
        }
    }

    top() {
        return this.states[0] || null;
    }
}

class StateGroup {
    constructor(states, context) {
        this.states = states;
        this.context = context;
    }

    enter(last) {
        var _this = this;

        this.states.forEach(function (state) {
            return state.enter(last, _this.context);
        });
    }

    exit(next) {
        var _this2 = this;

        this.states.forEach(function (state) {
            return state.exit(next, _this2.context);
        });
    }

    first() {
        return this.states[0];
    }
}

class State {
    enter(last) {}

    exit(next) {}
}

exports.State = State;
exports.StateStack = StateStack;
exports.StateGroup = StateGroup;

/***/ })

},[69]);
//# sourceMappingURL=test.bundle.js.map