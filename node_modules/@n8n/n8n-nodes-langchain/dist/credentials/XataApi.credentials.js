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
var XataApi_credentials_exports = {};
__export(XataApi_credentials_exports, {
  XataApi: () => XataApi
});
module.exports = __toCommonJS(XataApi_credentials_exports);
class XataApi {
  constructor() {
    this.name = "xataApi";
    this.displayName = "Xata Api";
    this.documentationUrl = "xata";
    this.properties = [
      {
        displayName: "Database Endpoint",
        name: "databaseEndpoint",
        required: true,
        type: "string",
        default: "",
        placeholder: "https://{workspace}.{region}.xata.sh/db/{database}"
      },
      {
        displayName: "Branch",
        name: "branch",
        required: true,
        type: "string",
        default: "main"
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
        headers: {
          Authorization: "=Bearer {{$credentials.apiKey}}"
        }
      }
    };
    this.test = {
      request: {
        baseURL: "={{$credentials.databaseEndpoint}}:{{$credentials.branch}}"
      }
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  XataApi
});
//# sourceMappingURL=XataApi.credentials.js.map