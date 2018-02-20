"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fromEvent_1 = require("rxjs/observable/fromEvent");
const merge_1 = require("rxjs/observable/merge");
const operators_1 = require("rxjs/operators");
const observable_1 = require("rxjs/symbol/observable");
const command_1 = require("./command");
function select(src, target) {
    if (Array.isArray(target)) {
        return merge_1.merge(...target.map(select.bind(null, src)));
    }
    const type = typeof target === 'string' ? target : target.type;
    if (isObservable(src)) {
        return src.pipe(operators_1.filter(command => command.type === type));
    }
    return fromEvent_1.fromEvent(src, type).pipe(operators_1.map(command => command_1.isCommand(command) ? command : { type, payload: command }), operators_1.share());
}
exports.select = select;
function isObservable(value) {
    return Object(value) === value && observable_1.observable in value;
}
//# sourceMappingURL=select.js.map