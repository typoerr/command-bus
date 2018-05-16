"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var command_1 = require("./command");
exports.factory = command_1.factory;
exports.match = command_1.match;
exports.isCommand = command_1.isCommand;
__export(require("./select"));
__export(require("./command-bus"));
//# sourceMappingURL=index.js.map