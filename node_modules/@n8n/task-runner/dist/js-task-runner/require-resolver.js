"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRequireResolver = createRequireResolver;
const node_module_1 = require("node:module");
const disallowed_module_error_1 = require("./errors/disallowed-module.error");
const execution_error_1 = require("./errors/execution-error");
function createRequireResolver({ allowedBuiltInModules, allowedExternalModules, }) {
    return (request) => {
        const checkIsAllowed = (allowList, moduleName) => {
            return allowList === '*' || allowList.has(moduleName);
        };
        const isAllowed = (0, node_module_1.isBuiltin)(request)
            ? checkIsAllowed(allowedBuiltInModules, request)
            : checkIsAllowed(allowedExternalModules, request);
        if (!isAllowed) {
            const error = new disallowed_module_error_1.DisallowedModuleError(request);
            throw new execution_error_1.ExecutionError(error);
        }
        return require(request);
    };
}
//# sourceMappingURL=require-resolver.js.map