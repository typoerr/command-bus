"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const command_1 = require("./command");
function getCommandType(target) {
    if (typeof target === 'string') {
        return target;
    }
    else if ('type' in target) {
        return target.type;
    }
    return '';
}
function select(src, target) {
    if (Array.isArray(target)) {
        const srouce = target.map(select.bind(null, src));
        return rxjs_1.merge(...srouce).pipe(operators_1.share());
    }
    else if (rxjs_1.isObservable(src)) {
        return src.pipe(operators_1.filter(command => command.type === getCommandType(target)), operators_1.share());
    }
    else {
        return rxjs_1.fromEvent(src, getCommandType(target)).pipe(
        // ensure command shape
        operators_1.map(command => command_1.isCommand(command) ? command : { type: getCommandType(target), payload: command }), operators_1.share());
    }
}
exports.select = select;
//# sourceMappingURL=select.js.map