import { identity } from '@cotto/utils.ts';
export function scoped(scope) {
    return function createCreator(type, mapper = identity, extra) {
        type = scope + type;
        const f = (src) => (Object.assign({ type, payload: mapper(src) }, extra ? extra(src) : {}));
        f.type = type;
        return f;
    };
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
//# sourceMappingURL=command.js.map