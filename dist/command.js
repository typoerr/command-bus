"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_ts_1 = require("@cotto/utils.ts");
//
// ─── COMMAND CREATOR ────────────────────────────────────────────────────────────
//
function createCommand(type, payload, meta) {
    return meta ? { type, payload, meta } : { type, payload };
}
function scoped(scope) {
    return _create;
    function _create(type, fn = utils_ts_1.identity) {
        const _type = scope + type;
        const creator = (payload, meta) => createCommand(_type, fn(payload), meta);
        creator.type = _type;
        creator.isolated = false;
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
//
// ─── ISOLATE ────────────────────────────────────────────────────────────────────
//
function isolatedCommandCreator(id, creator) {
    const key = `${creator.type}#${id}`;
    const isolated = (...args) => {
        const command = creator.apply(null, args);
        command.type = key;
        command._isolated = true;
        return command;
    };
    isolated.type = key;
    isolated.isolated = true;
    return isolated;
}
function isolate(id, creators) {
    if (Array.isArray(creators)) {
        return creators.map(fn => isolatedCommandCreator(id, fn));
    }
    return isolatedCommandCreator(id, creators);
}
exports.isolate = isolate;
function isIsolatedCommand(command) {
    return isCommand(command) && '_isolated' in command && Boolean(command._isolated);
}
exports.isIsolatedCommand = isIsolatedCommand;
function isIsoaltedCreator(creator) {
    return creator.isolated;
}
exports.isIsoaltedCreator = isIsoaltedCreator;
function getRawType(command) {
    return command.type.replace(/#[^#]*$/, '');
}
exports.getRawType = getRawType;
//# sourceMappingURL=command.js.map