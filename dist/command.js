"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_ts_1 = require("@cotto/utils.ts");
function scoped(scope) {
    return function createCreator(type, mapper = utils_ts_1.identity, extra) {
        type = scope + type;
        const f = (src) => (Object.assign({ type, payload: mapper(src) }, extra ? extra(src) : {}));
        f.type = type;
        return f;
    };
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