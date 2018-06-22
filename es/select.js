import { fromEvent, isObservable } from 'rxjs';
import { map, filter, share } from 'rxjs/operators';
import { isCommand } from './command';
function getCommandType(target) {
    if (typeof target === 'string') {
        return target;
    }
    else if ('type' in target) {
        return target.type;
    }
    return '';
}
export function select(src, target) {
    if (isObservable(src)) {
        return src.pipe(filter(command => command.type === getCommandType(target)), share());
    }
    else {
        return fromEvent(src, getCommandType(target)).pipe(
        // ensure command shape
        map(command => isCommand(command) ? command : { type: getCommandType(target), payload: command }), share());
    }
}
//# sourceMappingURL=select.js.map