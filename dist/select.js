"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const command_1 = require("./command");
function select(src, target) {
    if (Array.isArray(target)) {
        return rxjs_1.merge(...target.map(select.bind(null, src))).pipe(operators_1.share());
    }
    const type = typeof target === 'string' ? target : target.type;
    if (isObservable(src)) {
        return src.pipe(operators_1.filter(command => command.type === type), operators_1.share());
    }
    return rxjs_1.fromEvent(src, type).pipe(operators_1.map(command => command_1.isCommand(command) ? command : { type, payload: command }), operators_1.share());
}
exports.select = select;
function isObservable(value) {
    return Object(value) === value && rxjs_1.observable in value;
}
//# sourceMappingURL=select.js.map