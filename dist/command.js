"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//
// ─── COMMAND CREATOR ────────────────────────────────────────────────────────────
//
function defaultCommandMapper(payload) {
    return { payload };
}
function scoped(scope) {
    return factory;
    function factory(type, mapper = defaultCommandMapper) {
        type = scope + type;
        const creator = (src) => (Object.assign({ type, payload: undefined }, mapper(src)));
        creator.type = type;
        return creator;
    }
}
exports.scoped = scoped;
exports.create = scoped('');
//
// ─── UTILS ──────────────────────────────────────────────────────────────────────
//
function match(creator) {
    return (command) => {
        return command != null && command.type === creator.type;
    };
}
exports.match = match;
function isCommand(command) {
    return Object(command) === command && typeof command.type === 'string';
}
exports.isCommand = isCommand;
//# sourceMappingURL=command.js.map