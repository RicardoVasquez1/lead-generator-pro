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
var DeepSeekApi_credentials_exports = {};
__export(DeepSeekApi_credentials_exports, {
  DeepSeekApi: () => DeepSeekApi
});
module.exports = __toCommonJS(DeepSeekApi_credentials_exports);
class DeepSeekApi {
  constructor() {
    this.name = "deepSeekApi";
    this.displayName = "DeepSeek";
    this.documentationUrl = "deepseek";
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
        type: "hidden",
        default: "https://api.deepseek.com"
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
        baseURL: "={{ $credentials.url }}",
        url: "/models"
      }
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DeepSeekApi
});
//# sourceMappingURL=DeepSeekApi.credentials.js.map