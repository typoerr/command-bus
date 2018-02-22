import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';
import { map, filter, share } from 'rxjs/operators';
import { observable } from 'rxjs/symbol/observable';
import { isCommand } from './command';
export function select(src, target) {
    if (Array.isArray(target)) {
        return merge(...target.map(select.bind(null, src))).pipe(share());
    }
    const type = typeof target === 'string' ? target : target.type;
    if (isObservable(src)) {
        return src.pipe(filter(command => command.type === type), share());
    }
    return fromEvent(src, type).pipe(map(command => isCommand(command) ? command : { type, payload: command }), share());
}
function isObservable(value) {
    return Object(value) === value && observable in value;
}
//# sourceMappingURL=select.js.map