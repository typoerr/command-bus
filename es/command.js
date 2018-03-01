import { identity } from '@cotto/utils.ts';
//
// ─── COMMAND CREATOR ────────────────────────────────────────────────────────────
//
function createCommand(type, payload, meta) {
    return meta ? { type, payload, meta } : { type, payload };
}
export function scoped(scope) {
    return _create;
    function _create(type, fn = identity) {
        const _type = scope + type;
        const creator = (payload, meta) => createCommand(_type, fn(payload), meta);
        creator.type = _type;
        creator.isolated = false;
        return creator;
    }
}
export const create = scoped('');
//
// ─── UTILS ──────────────────────────────────────────────────────────────────────
//
export function match(creator) {
    return (command) => {
        return command != null && command.type === creator.type;
    };
}
export function isCommand(command) {
    return Object(command) === command && typeof command.type === 'string';
}
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
export function isolate(id, creators) {
    if (Array.isArray(creators)) {
        return creators.map(fn => isolatedCommandCreator(id, fn));
    }
    return isolatedCommandCreator(id, creators);
}
export function isIsolatedCommand(command) {
    return isCommand(command) && '_isolated' in command && Boolean(command._isolated);
}
export function isIsoaltedCreator(creator) {
    return creator.isolated;
}
export function getRawType(command) {
    return command.type.replace(/#[^#]*$/, '');
}
//# sourceMappingURL=command.js.map