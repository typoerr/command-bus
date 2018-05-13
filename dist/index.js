"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var command_1 = require("./command");
exports.create = command_1.create;
exports.scoped = command_1.scoped;
exports.match = command_1.match;
exports.isCommand = command_1.isCommand;
__export(require("./select"));
__export(require("./command-bus"));
//# sourceMappingURL=index.js.map