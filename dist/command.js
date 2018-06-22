"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_ts_1 = require("@cotto/utils.ts");
//
// ─── IMPL ────────────────────────────────────────────────────────────────────
//
function ensureObject(value, key) {
    return utils_ts_1.isObject(value) ? value : { [key]: value };
}
function factory(scope) {
    return (type, mapper) => {
        type = scope + type;
        const creator = (...value) => {
            const body = ensureObject(mapper ? mapper(...value) : value[0], 'payload');
            return Object.assign({ type }, body);
        };
        creator.type = type;
        return creator;
    };
}
exports.factory = factory;
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