"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const command_1 = require("./command");
function isEELike(src) {
    if ('addEventListener' in src && 'removeEventListener' in src) {
        return true;
    }
    else if ('addListener' in src && 'removeListener' in src) {
        return true;
    }
    else if ('on' in src && 'off' in src) {
        return true;
    }
    else {
        return false;
    }
}
function getType(target) {
    if (typeof target === 'string') {
        return target;
    }
    else if ('type' in target) {
        return target.type;
    }
    return '';
}
function fromEELike(src, target) {
    const type = getType(target);
    const ensure = (payload) => (command_1.isCommand(payload) ? payload : { type, payload });
    return rxjs_1.fromEvent(src, type).pipe(operators_1.map(ensure), operators_1.share());
}
/**
 * Select a event from Observable<Command>
 */
function fromObservable(src$, target) {
    return src$.pipe(operators_1.filter((cmd) => cmd.type === target.type), operators_1.share());
}
function select(src, target) {
    if (isEELike(src)) {
        return fromEELike(src, target);
    }
    return fromObservable(src, target);
}
exports.select = select;
function each(src, target) {
    const obs = target.map(select.bind(undefined, src));
    return rxjs_1.merge(...obs).pipe(operators_1.share());
}
select.each = each;
//# sourceMappingURL=select.js.map