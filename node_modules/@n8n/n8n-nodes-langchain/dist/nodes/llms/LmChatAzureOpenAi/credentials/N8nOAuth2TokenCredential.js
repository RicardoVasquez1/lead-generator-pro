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
var N8nOAuth2TokenCredential_exports = {};
__export(N8nOAuth2TokenCredential_exports, {
  N8nOAuth2TokenCredential: () => N8nOAuth2TokenCredential
});
module.exports = __toCommonJS(N8nOAuth2TokenCredential_exports);
var import_client_oauth2 = require("@n8n/client-oauth2");
var import_n8n_workflow = require("n8n-workflow");
class N8nOAuth2TokenCredential {
  constructor(node, credential) {
    this.node = node;
    this.credential = credential;
  }
  /**
   * Gets an access token from OAuth credential
   */
  async getToken() {
    try {
      if (!this.credential?.oauthTokenData?.access_token) {
        throw new import_n8n_workflow.NodeOperationError(this.node, "Failed to retrieve access token");
      }
      const oAuthClient = new import_client_oauth2.ClientOAuth2({
        clientId: this.credential.clientId,
        clientSecret: this.credential.clientSecret,
        accessTokenUri: this.credential.accessTokenUrl,
        scopes: this.credential.scope?.split(" "),
        authentication: this.credential.authentication,
        authorizationUri: this.credential.authUrl,
        additionalBodyProperties: {
          resource: "https://cognitiveservices.azure.com/"
        }
      });
      const token = await oAuthClient.credentials.getToken();
      const data = token.data;
      return {
        token: data.access_token,
        expiresOnTimestamp: data.expires_on
      };
    } catch (error) {
      throw new import_n8n_workflow.NodeOperationError(this.node, "Failed to retrieve OAuth2 access token", error);
    }
  }
  /**
   * Gets the deployment details from the credential
   */
  async getDeploymentDetails() {
    return {
      apiVersion: this.credential.apiVersion,
      endpoint: this.credential.endpoint,
      resourceName: this.credential.resourceName
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  N8nOAuth2TokenCredential
});
//# sourceMappingURL=N8nOAuth2TokenCredential.js.map