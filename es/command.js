import { isObject } from '@cotto/utils.ts';
//
// ─── IMPL ────────────────────────────────────────────────────────────────────
//
function ensureObject(value, key) {
    return isObject(value) ? value : { [key]: value };
}
export function factory(scope) {
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