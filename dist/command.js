"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_ts_1 = require("@cotto/utils.ts");
//
// ─── COMMAND CREATOR ────────────────────────────────────────────────────────────
//
function createCommand(type, payload) {
    return { type, payload };
}
function scoped(scope) {
    return _create;
    function _create(type, fn = utils_ts_1.identity) {
        const _type = scope + type;
        const creator = (payload) => createCommand(_type, fn(payload));
        creator.type = _type;
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
function withMeta(meta) {
    return (command) => Object.assign({}, command, { meta });
}
exports.withMeta = withMeta;
//# sourceMappingURL=command.js.map