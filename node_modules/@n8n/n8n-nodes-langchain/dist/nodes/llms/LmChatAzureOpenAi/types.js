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
var types_exports = {};
__export(types_exports, {
  AuthenticationType: () => AuthenticationType,
  AzureOpenAIErrorType: () => AzureOpenAIErrorType
});
module.exports = __toCommonJS(types_exports);
var AuthenticationType = /* @__PURE__ */ ((AuthenticationType2) => {
  AuthenticationType2["ApiKey"] = "azureOpenAiApi";
  AuthenticationType2["EntraOAuth2"] = "azureEntraCognitiveServicesOAuth2Api";
  return AuthenticationType2;
})(AuthenticationType || {});
var AzureOpenAIErrorType = /* @__PURE__ */ ((AzureOpenAIErrorType2) => {
  AzureOpenAIErrorType2["AuthenticationError"] = "AuthenticationError";
  AzureOpenAIErrorType2["ConfigurationError"] = "ConfigurationError";
  AzureOpenAIErrorType2["APIError"] = "APIError";
  AzureOpenAIErrorType2["UnknownError"] = "UnknownError";
  return AzureOpenAIErrorType2;
})(AzureOpenAIErrorType || {});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthenticationType,
  AzureOpenAIErrorType
});
//# sourceMappingURL=types.js.map