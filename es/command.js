import { identity } from '@cotto/utils.ts';
//
// ─── COMMAND CREATOR ────────────────────────────────────────────────────────────
//
function createCommand(type, payload) {
    return { type, payload };
}
export function scoped(scope) {
    return _create;
    function _create(type, fn = identity) {
        const _type = scope + type;
        const creator = (payload) => createCommand(_type, fn(payload));
        creator.type = _type;
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
export function withMeta(meta) {
    return (command) => Object.assign({}, command, { meta });
}
//# sourceMappingURL=command.js.map