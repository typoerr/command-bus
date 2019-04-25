import { identity, constant } from 'atomic';
function fromMapper(scope, type, mapper) {
    type = scope + type;
    const create = (...args) => {
        const payload = (mapper || identity)(...args);
        return { type, payload, meta: undefined };
    };
    create.type = type;
    return create;
}
function fromMaperSet(scope, type, mappers) {
    type = scope + type;
    const create = (...args) => {
        const payload = mappers.payload(...args);
        const meta = (mappers.meta || constant(undefined))(...args);
        return { type, payload, meta };
    };
    create.type = type;
    return create;
}
export function factory(scope) {
    return function creator(type, mapper) {
        if (typeof mapper === 'function') {
            return fromMapper(scope, type, mapper);
        }
        else if (typeof mapper === 'object') {
            return fromMaperSet(scope, type, mapper);
        }
        else {
            return fromMapper(scope, type);
        }
    };
}
export const create = factory('');
export function match(creator) {
    return (command) => {
        return command != null && command.type === creator.type;
    };
}
export function isCommand(command) {
    return Object(command) === command && typeof command.type === 'string';
}
//# sourceMappingURL=command.js.map