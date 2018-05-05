import { fromEvent, merge, isObservable } from 'rxjs';
import { map, filter, share } from 'rxjs/operators';
import { isCommand } from './command';
function getType(target) {
    if (typeof target === 'string') {
        return target;
    }
    else if ('type' in target) {
        return target.type;
    }
    return '';
}
export function select(src, target) {
    const type = getType(target);
    if (Array.isArray(target)) {
        return merge(...target.map(select.bind(null, src))).pipe(share());
    }
    else if (isObservable(src)) {
        return src.pipe(filter(command => command.type === type), share());
    }
    else {
        return fromEvent(src, type).pipe(map(command => isCommand(command) ? command : { type, payload: command }), share());
    }
}
//# sourceMappingURL=select.js.map