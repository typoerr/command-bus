"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_js_1 = require("@nullabletypo/utils-js");
function fromMapper(scope, type, mapper) {
    type = scope + type;
    const create = (...args) => {
        const payload = (mapper || utils_js_1.identity)(...args);
        return { type, payload, meta: undefined };
    };
    create.type = type;
    return create;
}
function fromMaperSet(scope, type, mappers) {
    type = scope + type;
    const create = (...args) => {
        const payload = mappers.payload(...args);
        const meta = (mappers.meta || utils_js_1.constant(undefined))(...args);
        return { type, payload, meta };
    };
    create.type = type;
    return create;
}
function factory(scope) {
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
exports.factory = factory;
exports.create = factory('');
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