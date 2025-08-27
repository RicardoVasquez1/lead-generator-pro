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
var OllamaApi_credentials_exports = {};
__export(OllamaApi_credentials_exports, {
  OllamaApi: () => OllamaApi
});
module.exports = __toCommonJS(OllamaApi_credentials_exports);
class OllamaApi {
  constructor() {
    this.name = "ollamaApi";
    this.displayName = "Ollama";
    this.documentationUrl = "ollama";
    this.properties = [
      {
        displayName: "Base URL",
        name: "baseUrl",
        required: true,
        type: "string",
        default: "http://localhost:11434"
      },
      {
        displayName: "API Key",
        hint: "When using Ollama behind a proxy with authentication (such as Open WebUI), provide the Bearer token/API key here. This is not required for the default Ollama installation",
        name: "apiKey",
        type: "string",
        typeOptions: { password: true },
        default: "",
        required: false
      }
    ];
    this.authenticate = {
      type: "generic",
      properties: {
        headers: {
          Authorization: "=Bearer {{$credentials.apiKey}}"
        }
      }
    };
    this.test = {
      request: {
        baseURL: "={{ $credentials.baseUrl }}",
        url: "/api/tags",
        method: "GET"
      }
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  OllamaApi
});
//# sourceMappingURL=OllamaApi.credentials.js.map