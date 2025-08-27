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
var MilvusApi_credentials_exports = {};
__export(MilvusApi_credentials_exports, {
  MilvusApi: () => MilvusApi
});
module.exports = __toCommonJS(MilvusApi_credentials_exports);
class MilvusApi {
  constructor() {
    this.name = "milvusApi";
    this.displayName = "Milvus";
    this.documentationUrl = "milvus";
    this.properties = [
      {
        displayName: "Base URL",
        name: "baseUrl",
        required: true,
        type: "string",
        default: "http://localhost:19530"
      },
      {
        displayName: "Username",
        name: "username",
        type: "string",
        default: ""
      },
      {
        displayName: "Password",
        name: "password",
        type: "string",
        typeOptions: { password: true },
        default: ""
      }
    ];
    this.authenticate = {
      type: "generic",
      properties: {
        headers: {
          Authorization: "=Bearer {{$credentials.username}}:{{$credentials.password}}"
        }
      }
    };
    this.test = {
      request: {
        baseURL: "={{ $credentials.baseUrl }}",
        url: "/v1/vector/collections",
        method: "GET"
      }
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MilvusApi
});
//# sourceMappingURL=MilvusApi.credentials.js.map