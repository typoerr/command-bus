"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const f_1 = require("f");
function factory(scope) {
    return (type, payload = f_1.identity, extra = f_1.constant({})) => {
        type = scope + type;
        const creator = (val) => (Object.assign({ type, payload: payload(val) }, extra(val)));
        creator.type = type;
        return creator;
    };
}
exports.factory = factory;
exports.create = factory('');
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