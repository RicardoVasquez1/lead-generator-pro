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
var AzureEntraCognitiveServicesOAuth2Api_credentials_exports = {};
__export(AzureEntraCognitiveServicesOAuth2Api_credentials_exports, {
  AzureEntraCognitiveServicesOAuth2Api: () => AzureEntraCognitiveServicesOAuth2Api
});
module.exports = __toCommonJS(AzureEntraCognitiveServicesOAuth2Api_credentials_exports);
const defaultScopes = ["openid", "offline_access"];
class AzureEntraCognitiveServicesOAuth2Api {
  constructor() {
    this.name = "azureEntraCognitiveServicesOAuth2Api";
    // eslint-disable-next-line n8n-nodes-base/cred-class-field-display-name-missing-oauth2
    this.displayName = "Azure Entra ID (Azure Active Directory) API";
    this.extends = ["oAuth2Api"];
    this.documentationUrl = "azureEntraCognitiveServicesOAuth2Api";
    this.properties = [
      {
        displayName: "Grant Type",
        name: "grantType",
        type: "hidden",
        default: "authorizationCode"
      },
      {
        displayName: "Resource Name",
        name: "resourceName",
        type: "string",
        required: true,
        default: ""
      },
      {
        displayName: "API Version",
        name: "apiVersion",
        type: "string",
        required: true,
        default: "2025-03-01-preview"
      },
      {
        displayName: "Endpoint",
        name: "endpoint",
        type: "string",
        default: void 0,
        placeholder: "https://westeurope.api.cognitive.microsoft.com"
      },
      {
        displayName: "Tenant ID",
        name: "tenantId",
        type: "string",
        default: "common",
        description: 'Enter your Azure Tenant ID (Directory ID) or keep "common" for multi-tenant apps. Using a specific Tenant ID is generally recommended and required for certain authentication flows.',
        placeholder: "e.g., xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx or common"
      },
      {
        displayName: "Authorization URL",
        name: "authUrl",
        type: "hidden",
        default: '=https://login.microsoftonline.com/{{$self["tenantId"]}}/oauth2/authorize'
      },
      {
        displayName: "Access Token URL",
        name: "accessTokenUrl",
        type: "hidden",
        default: '=https://login.microsoftonline.com/{{$self["tenantId"]}}/oauth2/token'
      },
      {
        displayName: "Additional Body Properties",
        name: "additionalBodyProperties",
        type: "hidden",
        default: '{"grant_type": "client_credentials", "resource": "https://cognitiveservices.azure.com/"}'
      },
      {
        displayName: "Authentication",
        name: "authentication",
        type: "hidden",
        default: "body"
      },
      {
        displayName: "Custom Scopes",
        name: "customScopes",
        type: "boolean",
        default: false,
        description: 'Define custom scopes. You might need this if the default scopes are not sufficient or if you want to minimize permissions. Ensure you include "openid" and "offline_access".'
      },
      {
        displayName: "Auth URI Query Parameters",
        name: "authQueryParameters",
        type: "hidden",
        default: "",
        description: "For some services additional query parameters have to be set which can be defined here",
        placeholder: ""
      },
      {
        displayName: "Enabled Scopes",
        name: "enabledScopes",
        type: "string",
        displayOptions: {
          show: {
            customScopes: [true]
          }
        },
        default: defaultScopes.join(" "),
        placeholder: "openid offline_access",
        description: "Space-separated list of scopes to request."
      },
      {
        displayName: "Scope",
        name: "scope",
        type: "hidden",
        default: '={{ $self.customScopes ? $self.enabledScopes : "' + defaultScopes.join(" ") + '"}}'
      }
    ];
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AzureEntraCognitiveServicesOAuth2Api
});
//# sourceMappingURL=AzureEntraCognitiveServicesOAuth2Api.credentials.js.map