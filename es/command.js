import { identity, constant } from 'utils';
export function factory(scope) {
    return (type, pm = identity, em = constant({})) => {
        type = scope + type;
        const creator = (...val) => (Object.assign({ type, payload: pm(...val) }, em(...val)));
        creator.type = type;
        return creator;
    };
}
export const create = factory('');
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