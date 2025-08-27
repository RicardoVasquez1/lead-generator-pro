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
var QdrantApi_credentials_exports = {};
__export(QdrantApi_credentials_exports, {
  QdrantApi: () => QdrantApi
});
module.exports = __toCommonJS(QdrantApi_credentials_exports);
class QdrantApi {
  constructor() {
    this.name = "qdrantApi";
    this.displayName = "QdrantApi";
    this.documentationUrl = "https://docs.n8n.io/integrations/builtin/credentials/qdrant/";
    this.properties = [
      {
        displayName: "API Key",
        name: "apiKey",
        type: "string",
        typeOptions: { password: true },
        required: false,
        default: ""
      },
      {
        displayName: "Qdrant URL",
        name: "qdrantUrl",
        type: "string",
        required: true,
        default: ""
      }
    ];
    this.authenticate = {
      type: "generic",
      properties: {
        headers: {
          "api-key": "={{$credentials.apiKey}}"
        }
      }
    };
    this.test = {
      request: {
        baseURL: "={{$credentials.qdrantUrl}}",
        url: "/collections"
      }
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  QdrantApi
});
//# sourceMappingURL=QdrantApi.credentials.js.map