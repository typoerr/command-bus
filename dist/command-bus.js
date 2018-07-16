"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
exports.WILDCARD = '*';
function getEventName(target) {
    return (typeof target === 'string' || typeof target === 'symbol')
        ? target
        : target.type;
}
class CommandBus extends rxjs_1.Observable {
    constructor() {
        super(observer => this.on('*', observer.next.bind(observer)));
        /* alias */
        this.addEventListener = this.on;
        this.removeEventListener = this.off;
        this.addListener = this.on;
        this.removeListener = this.off;
        this._listeners = new Map();
    }
    on(target, listener) {
        const type = getEventName(target);
        const listeners = this._listeners.get(type);
        listeners ? listeners.add(listener) : this._listeners.set(type, new Set([listener]));
        return listener;
    }
    off(target, listener) {
        const type = getEventName(target);
        const listeners = this._listeners.get(type);
        listeners && listeners.delete(listener);
        return listener;
    }
    dispatch(command) {
        const listeners = [...this._listeners.get(command.type) || [], ...this._listeners.get('*') || []];
        listeners.forEach(listener => listener(command));
        return command;
    }
    getListeners(target) {
        const type = getEventName(target);
        const listeners = this._listeners.get(type);
        return [...listeners || []];
    }
}
exports.CommandBus = CommandBus;
//# sourceMappingURL=command-bus.js.map