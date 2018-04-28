"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WILDECARD = '*';
function isWildcard(type) {
    return type === exports.WILDECARD;
}
function getEventName(target) {
    return (typeof target === 'string' || typeof target === 'symbol')
        ? target
        : target.type;
}
function createCommandBus() {
    const eventMap = new Map();
    const allListeners = new Set();
    function dispatch(command) {
        for (const listener of eventMap.get(command.type) || []) {
            listener(command);
        }
        for (const listener of allListeners) {
            listener(command);
        }
        return command;
    }
    function on(target, listener) {
        const type = getEventName(target);
        const listeners = isWildcard(type) ? allListeners : eventMap.get(type);
        listeners ? listeners.add(listener) : eventMap.set(type, new Set([listener]));
        return listener;
    }
    function off(target, listener) {
        const type = getEventName(target);
        const listeners = isWildcard(type) ? allListeners : eventMap.get(type);
        listeners && listeners.delete(listener);
        return listener;
    }
    function getListeners(target) {
        const type = getEventName(target);
        const listeners = isWildcard(type) ? allListeners : eventMap.get(type);
        return listeners ? Array.from([...listeners]) : [];
    }
    return {
        dispatch,
        on,
        off,
        getListeners,
        /* alias */
        addEventListener: on,
        removeEventListener: off,
        addListener: on,
        removeListener: off,
    };
}
exports.createCommandBus = createCommandBus;
//# sourceMappingURL=command-bus.js.map