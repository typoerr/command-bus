//
// ─── COMMAND CREATOR ────────────────────────────────────────────────────────────
//
function defaultCommandMapper(payload) {
    return { payload };
}
export function scoped(scope) {
    return factory;
    function factory(type, mapper = defaultCommandMapper) {
        type = scope + type;
        const creator = (src) => (Object.assign({ type, payload: undefined }, mapper(src)));
        creator.type = type;
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
//# sourceMappingURL=command.js.map