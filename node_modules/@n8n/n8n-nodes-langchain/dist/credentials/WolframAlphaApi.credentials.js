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
var WolframAlphaApi_credentials_exports = {};
__export(WolframAlphaApi_credentials_exports, {
  WolframAlphaApi: () => WolframAlphaApi
});
module.exports = __toCommonJS(WolframAlphaApi_credentials_exports);
class WolframAlphaApi {
  constructor() {
    this.name = "wolframAlphaApi";
    this.displayName = "WolframAlphaApi";
    this.documentationUrl = "wolframalpha";
    this.properties = [
      {
        displayName: "App ID",
        name: "appId",
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
          api_key: "={{$credentials.appId}}"
        }
      }
    };
    this.test = {
      request: {
        baseURL: "https://api.wolframalpha.com/v1",
        url: "=/simple",
        qs: {
          i: "How much is 1 1",
          appid: "={{$credentials.appId}}"
        }
      }
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WolframAlphaApi
});
//# sourceMappingURL=WolframAlphaApi.credentials.js.map