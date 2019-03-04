import { fromEvent, merge } from 'rxjs';
import { map, share, filter } from 'rxjs/operators';
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
function isCommand(command) {
    return typeof command === 'object' && command != null && 'type' in command;
}
function fromEELike(src, target) {
    const type = getType(target);
    const ensure = (payload) => isCommand(payload) ? payload : { type, payload };
    return fromEvent(src, type).pipe(map(ensure), share());
}
/**
 * Select a event from Observable<Command>
 */
function fromObservable(src$, target) {
    return src$.pipe(filter((cmd) => cmd.type === target.type), share());
}
function select(src, target) {
    if (isEELike(src)) {
        return fromEELike(src, target);
    }
    return fromObservable(src, target);
}
function each(src, target) {
    const obs = target.map(select.bind(undefined, src));
    return merge(...obs).pipe(share());
}
select.each = each;
export { select };
//# sourceMappingURL=select.js.map