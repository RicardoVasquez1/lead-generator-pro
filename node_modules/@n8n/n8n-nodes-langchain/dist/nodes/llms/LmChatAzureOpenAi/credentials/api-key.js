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
var api_key_exports = {};
__export(api_key_exports, {
  setupApiKeyAuthentication: () => setupApiKeyAuthentication
});
module.exports = __toCommonJS(api_key_exports);
var import_n8n_workflow = require("n8n-workflow");
async function setupApiKeyAuthentication(credentialName) {
  try {
    const configCredentials = await this.getCredentials(credentialName);
    if (!configCredentials.apiKey) {
      throw new import_n8n_workflow.NodeOperationError(
        this.getNode(),
        "API Key is missing in the selected Azure OpenAI API credential. Please configure the API Key or choose Entra ID authentication."
      );
    }
    this.logger.info("Using API Key authentication for Azure OpenAI.");
    return {
      azureOpenAIApiKey: configCredentials.apiKey,
      azureOpenAIApiInstanceName: configCredentials.resourceName,
      azureOpenAIApiVersion: configCredentials.apiVersion,
      azureOpenAIEndpoint: configCredentials.endpoint
    };
  } catch (error) {
    if (error instanceof import_n8n_workflow.OperationalError) {
      throw error;
    }
    this.logger.error(`Error setting up API Key authentication: ${error.message}`, error);
    throw new import_n8n_workflow.NodeOperationError(this.getNode(), "Failed to retrieve API Key", error);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  setupApiKeyAuthentication
});
//# sourceMappingURL=api-key.js.map