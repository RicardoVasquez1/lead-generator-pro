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
var PineconeApi_credentials_exports = {};
__export(PineconeApi_credentials_exports, {
  PineconeApi: () => PineconeApi
});
module.exports = __toCommonJS(PineconeApi_credentials_exports);
class PineconeApi {
  constructor() {
    this.name = "pineconeApi";
    this.displayName = "PineconeApi";
    this.documentationUrl = "pinecone";
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
          "Api-Key": "={{$credentials.apiKey}}"
        }
      }
    };
    this.test = {
      request: {
        baseURL: "https://api.pinecone.io/indexes",
        headers: {
          accept: "application/json; charset=utf-8"
        }
      }
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PineconeApi
});
//# sourceMappingURL=PineconeApi.credentials.js.map