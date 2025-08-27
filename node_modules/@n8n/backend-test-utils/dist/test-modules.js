"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadModules = loadModules;
const backend_common_1 = require("@n8n/backend-common");
const di_1 = require("@n8n/di");
async function loadModules(moduleNames) {
    await di_1.Container.get(backend_common_1.ModuleRegistry).loadModules(moduleNames);
}
//# sourceMappingURL=test-modules.js.map