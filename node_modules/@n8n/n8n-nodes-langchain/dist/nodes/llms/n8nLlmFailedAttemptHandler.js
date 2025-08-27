"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var n8nLlmFailedAttemptHandler_exports = {};
__export(n8nLlmFailedAttemptHandler_exports, {
  makeN8nLlmFailedAttemptHandler: () => makeN8nLlmFailedAttemptHandler
});
module.exports = __toCommonJS(n8nLlmFailedAttemptHandler_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_n8nDefaultFailedAttemptHandler = require("./n8nDefaultFailedAttemptHandler");
const makeN8nLlmFailedAttemptHandler = (ctx, handler) => {
  return (error) => {
    try {
      handler?.(error);
      (0, import_n8nDefaultFailedAttemptHandler.n8nDefaultFailedAttemptHandler)(error);
    } catch (e) {
      const apiError2 = new import_n8n_workflow.NodeApiError(ctx.getNode(), e, {
        functionality: "configuration-node"
      });
      throw apiError2;
    }
    if (error?.retriesLeft > 0) {
      return;
    }
    const apiError = new import_n8n_workflow.NodeApiError(ctx.getNode(), error, {
      functionality: "configuration-node"
    });
    throw apiError;
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  makeN8nLlmFailedAttemptHandler
});
//# sourceMappingURL=n8nLlmFailedAttemptHandler.js.map