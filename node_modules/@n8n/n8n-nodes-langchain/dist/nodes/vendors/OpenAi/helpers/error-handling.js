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
var error_handling_exports = {};
__export(error_handling_exports, {
  getCustomErrorMessage: () => getCustomErrorMessage,
  isOpenAiError: () => isOpenAiError,
  openAiFailedAttemptHandler: () => openAiFailedAttemptHandler
});
module.exports = __toCommonJS(error_handling_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_openai = require("openai");
var import_error = require("openai/error");
const errorMap = {
  insufficient_quota: 'Insufficient quota detected. <a href="https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai/common-issues/#insufficient-quota" target="_blank">Learn more</a> about resolving this issue',
  rate_limit_exceeded: "OpenAI: Rate limit reached"
};
function getCustomErrorMessage(errorCode) {
  return errorMap[errorCode];
}
function isOpenAiError(error) {
  return error instanceof import_error.OpenAIError;
}
const openAiFailedAttemptHandler = (error) => {
  if (error instanceof import_openai.RateLimitError) {
    const errorCode = error?.code;
    const errorMessage = getCustomErrorMessage(errorCode ?? "rate_limit_exceeded") ?? errorMap.rate_limit_exceeded;
    throw new import_n8n_workflow.OperationalError(errorMessage, { cause: error });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getCustomErrorMessage,
  isOpenAiError,
  openAiFailedAttemptHandler
});
//# sourceMappingURL=error-handling.js.map