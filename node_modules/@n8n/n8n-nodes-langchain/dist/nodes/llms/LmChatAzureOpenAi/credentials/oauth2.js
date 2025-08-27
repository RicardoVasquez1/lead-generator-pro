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
var oauth2_exports = {};
__export(oauth2_exports, {
  setupOAuth2Authentication: () => setupOAuth2Authentication
});
module.exports = __toCommonJS(oauth2_exports);
var import_identity = require("@azure/identity");
var import_n8n_workflow = require("n8n-workflow");
var import_N8nOAuth2TokenCredential = require("./N8nOAuth2TokenCredential");
const AZURE_OPENAI_SCOPE = "https://cognitiveservices.azure.com/.default";
async function setupOAuth2Authentication(credentialName) {
  try {
    const credential = await this.getCredentials(credentialName);
    const entraTokenCredential = new import_N8nOAuth2TokenCredential.N8nOAuth2TokenCredential(this.getNode(), credential);
    const deploymentDetails = await entraTokenCredential.getDeploymentDetails();
    const azureADTokenProvider = (0, import_identity.getBearerTokenProvider)(entraTokenCredential, AZURE_OPENAI_SCOPE);
    this.logger.debug("Successfully created Azure AD Token Provider.");
    return {
      azureADTokenProvider,
      azureOpenAIApiInstanceName: deploymentDetails.resourceName,
      azureOpenAIApiVersion: deploymentDetails.apiVersion,
      azureOpenAIEndpoint: deploymentDetails.endpoint
    };
  } catch (error) {
    this.logger.error(`Error setting up Entra ID authentication: ${error.message}`, error);
    throw new import_n8n_workflow.NodeOperationError(
      this.getNode(),
      `Error setting up Entra ID authentication: ${error.message}`,
      error
    );
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  setupOAuth2Authentication
});
//# sourceMappingURL=oauth2.js.map