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
var AnthropicApi_credentials_exports = {};
__export(AnthropicApi_credentials_exports, {
  AnthropicApi: () => AnthropicApi
});
module.exports = __toCommonJS(AnthropicApi_credentials_exports);
class AnthropicApi {
  constructor() {
    this.name = "anthropicApi";
    this.displayName = "Anthropic";
    this.documentationUrl = "anthropic";
    this.properties = [
      {
        displayName: "API Key",
        name: "apiKey",
        type: "string",
        typeOptions: { password: true },
        required: true,
        default: ""
      },
      {
        displayName: "Base URL",
        name: "url",
        type: "string",
        default: "https://api.anthropic.com",
        description: "Override the default base URL for the API"
      }
    ];
    this.authenticate = {
      type: "generic",
      properties: {
        headers: {
          "x-api-key": "={{$credentials.apiKey}}"
        }
      }
    };
    this.test = {
      request: {
        baseURL: "={{$credentials?.url}}",
        url: "/v1/messages",
        method: "POST",
        headers: {
          "anthropic-version": "2023-06-01"
        },
        body: {
          model: "claude-3-haiku-20240307",
          messages: [{ role: "user", content: "Hey" }],
          max_tokens: 1
        }
      }
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AnthropicApi
});
//# sourceMappingURL=AnthropicApi.credentials.js.map