import { EventEmitter2 } from 'eventemitter2';
export class Dispatcher extends EventEmitter2 {
    dispatch(command) {
        super.emit(command.type, command);
        return command;
    }
    subscribe(listener) {
        const _listener = (_, command) => listener(command);
        super.onAny(_listener);
        return () => super.offAny(_listener);
    }
}
//# sourceMappingURL=dispatcher.js.map