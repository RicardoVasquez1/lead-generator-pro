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
var MotorheadApi_credentials_exports = {};
__export(MotorheadApi_credentials_exports, {
  MotorheadApi: () => MotorheadApi
});
module.exports = __toCommonJS(MotorheadApi_credentials_exports);
class MotorheadApi {
  constructor() {
    this.name = "motorheadApi";
    this.displayName = "MotorheadApi";
    this.documentationUrl = "motorhead";
    this.properties = [
      {
        displayName: "Host",
        name: "host",
        required: true,
        type: "string",
        default: "https://api.getmetal.io/v1"
      },
      {
        displayName: "API Key",
        name: "apiKey",
        type: "string",
        typeOptions: { password: true },
        required: true,
        default: ""
      },
      {
        displayName: "Client ID",
        name: "clientId",
        type: "string",
        default: ""
      }
    ];
    this.authenticate = {
      type: "generic",
      properties: {
        headers: {
          "x-metal-client-id": "={{$credentials.clientId}}",
          "x-metal-api-key": "={{$credentials.apiKey}}"
        }
      }
    };
    this.test = {
      request: {
        baseURL: "={{$credentials.host}}/keys/current"
      }
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MotorheadApi
});
//# sourceMappingURL=MotorheadApi.credentials.js.map