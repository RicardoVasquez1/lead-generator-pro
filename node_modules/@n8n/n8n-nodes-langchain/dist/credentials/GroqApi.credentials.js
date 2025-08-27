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
var GroqApi_credentials_exports = {};
__export(GroqApi_credentials_exports, {
  GroqApi: () => GroqApi
});
module.exports = __toCommonJS(GroqApi_credentials_exports);
class GroqApi {
  constructor() {
    this.name = "groqApi";
    this.displayName = "Groq";
    this.documentationUrl = "groq";
    this.properties = [
      {
        displayName: "API Key",
        name: "apiKey",
        type: "string",
        typeOptions: { password: true },
        required: true,
        default: ""
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
        baseURL: "https://api.groq.com/openai/v1",
        url: "/models"
      }
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GroqApi
});
//# sourceMappingURL=GroqApi.credentials.js.map