import { fromEvent, merge, isObservable } from 'rxjs';
import { map, filter, share } from 'rxjs/operators';
import { isCommand } from './command';
import { CommandBus } from './command-bus';
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
    return merge(...srouce).pipe(share());
};
const fromBus = (src, target) => {
    return fromEvent(src, getCommandType(target)).pipe(map(command => isCommand(command) ? command : { type: getCommandType(target), payload: command }), share());
};
const fromObservable = (src, target) => {
    return src.pipe(filter(command => command.type === getCommandType(target)), share());
};
export function select(src, target) {
    if (Array.isArray(target)) {
        return fromArray(src, target);
    }
    else if (src instanceof CommandBus) {
        return fromBus(src, target);
    }
    else if (isObservable(src)) {
        return fromObservable(src, target);
    }
    else {
        return fromBus(src, target);
    }
}
//# sourceMappingURL=select.js.map