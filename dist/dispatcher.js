"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter2_1 = require("eventemitter2");
class Dispatcher extends eventemitter2_1.EventEmitter2 {
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
exports.Dispatcher = Dispatcher;
//# sourceMappingURL=dispatcher.js.map