"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
class CommandBus extends rxjs_1.Observable {
    constructor() {
        super(observer => this.on(CommandBus.WILDCARD, observer.next.bind(observer)));
        /* alias */
        this.on = this.addListener;
        this.off = this.removeListener;
        this.addEventListener = this.addListener;
        this.removeEventListener = this.removeListener;
        this.registory = new Map();
    }
    static getType(type) {
        return Object(type) === type ? type.type : type;
    }
    addListener(type, handler) {
        const listeners = this.getListeners(type);
        if (listeners) {
            listeners.add(handler);
        }
        else {
            this.registory.set(CommandBus.getType(type), new Set([handler]));
        }
        return handler;
    }
    removeListener(type, handler) {
        const listeners = this.getListeners(type);
        if (listeners) {
            listeners.delete(handler);
        }
        return handler;
    }
    dispatch(command) {
        const listeners = [
            ...(this.getListeners(command) || []),
            ...(this.getListeners(CommandBus.WILDCARD) || []),
        ];
        listeners.forEach(fn => fn(command));
        return command;
    }
    getListeners(type) {
        return this.registory.get(CommandBus.getType(type));
    }
}
CommandBus.WILDCARD = '*';
exports.CommandBus = CommandBus;
//# sourceMappingURL=command-bus.js.map