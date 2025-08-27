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
var VercelAiGatewayApi_credentials_exports = {};
__export(VercelAiGatewayApi_credentials_exports, {
  VercelAiGatewayApi: () => VercelAiGatewayApi
});
module.exports = __toCommonJS(VercelAiGatewayApi_credentials_exports);
class VercelAiGatewayApi {
  constructor() {
    this.name = "vercelAiGatewayApi";
    this.displayName = "Vercel AI Gateway";
    this.documentationUrl = "vercelaigateway";
    this.properties = [
      {
        displayName: "API Key or OIDC Token",
        name: "apiKey",
        type: "string",
        typeOptions: { password: true },
        required: true,
        default: "",
        description: "Your credentials for the Vercel AI Gateway"
      },
      {
        displayName: "Base URL",
        name: "url",
        type: "string",
        required: true,
        default: "https://ai-gateway.vercel.sh/v1",
        description: "The base URL for your Vercel AI Gateway instance",
        placeholder: "https://ai-gateway.vercel.sh/v1"
      }
    ];
    this.authenticate = {
      type: "generic",
      properties: {
        headers: {
          Authorization: "=Bearer {{$credentials.apiKey}}",
          "http-referer": "https://n8n.io/",
          "x-title": "n8n"
        }
      }
    };
    this.test = {
      request: {
        baseURL: "={{ $credentials.url }}",
        url: "/chat/completions",
        method: "POST",
        headers: {
          "http-referer": "https://n8n.io/",
          "x-title": "n8n"
        },
        body: {
          model: "openai/gpt-4.1-nano",
          messages: [{ role: "user", content: "test" }],
          max_tokens: 1
        }
      }
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VercelAiGatewayApi
});
//# sourceMappingURL=VercelAiGatewayApi.credentials.js.map