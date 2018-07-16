"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const command_1 = require("./command");
const command_bus_1 = require("./command-bus");
function getCommandType(target) {
    if (typeof target === 'string') {
        return target;
    }
    else if ('type' in target) {
        return target.type;
    }
    return '';
}
const fromArray = (src, target) => {
    const srouce = target.map(select.bind(null, src));
    return rxjs_1.merge(...srouce).pipe(operators_1.share());
};
const fromBus = (src, target) => {
    return rxjs_1.fromEvent(src, getCommandType(target)).pipe(operators_1.map(command => command_1.isCommand(command) ? command : { type: getCommandType(target), payload: command }), operators_1.share());
};
const fromObservable = (src, target) => {
    return src.pipe(operators_1.filter(command => command.type === getCommandType(target)), operators_1.share());
};
function select(src, target) {
    if (Array.isArray(target)) {
        return fromArray(src, target);
    }
    else if (src instanceof command_bus_1.CommandBus) {
        return fromBus(src, target);
    }
    else if (rxjs_1.isObservable(src)) {
        return fromObservable(src, target);
    }
    else {
        return fromBus(src, target);
    }
}
exports.select = select;
//# sourceMappingURL=select.js.map