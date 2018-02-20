import { identity, mapValues } from '@cotto/utils.ts';
export function create(type, fn = identity) {
    const creator = (payload, meta) => (Object.assign({ type, payload: fn(payload) }, meta));
    creator.type = type;
    return creator;
}
export function scoped(scope, creators) {
    return mapValues(creators, creator => {
        return create(scope + creator.type, pluck(creator, 'payload'));
    });
}
export function match(creator) {
    return (command) => {
        return command != null && command.type === creator.type;
    };
}
export function isCommand(command) {
    return Object(command) === command && typeof command.type === 'string';
}
//
// ─── UTIL ───────────────────────────────────────────────────────────────────────
//
function pluck(fn, key) {
    return (...args) => {
        const result = fn(...args);
        return result ? result[key] : undefined;
    };
}
//# sourceMappingURL=command.js.map