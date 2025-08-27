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
var GooglePalmApi_credentials_exports = {};
__export(GooglePalmApi_credentials_exports, {
  GooglePalmApi: () => GooglePalmApi
});
module.exports = __toCommonJS(GooglePalmApi_credentials_exports);
class GooglePalmApi {
  constructor() {
    this.name = "googlePalmApi";
    this.displayName = "Google Gemini(PaLM) Api";
    this.documentationUrl = "google";
    this.properties = [
      {
        displayName: "Host",
        name: "host",
        required: true,
        type: "string",
        default: "https://generativelanguage.googleapis.com"
      },
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
        qs: {
          key: "={{$credentials.apiKey}}"
        }
      }
    };
    this.test = {
      request: {
        baseURL: "={{$credentials.host}}/v1beta/models"
      }
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GooglePalmApi
});
//# sourceMappingURL=GooglePalmApi.credentials.js.map