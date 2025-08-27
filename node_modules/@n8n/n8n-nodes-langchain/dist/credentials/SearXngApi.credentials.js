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
var SearXngApi_credentials_exports = {};
__export(SearXngApi_credentials_exports, {
  SearXngApi: () => SearXngApi
});
module.exports = __toCommonJS(SearXngApi_credentials_exports);
class SearXngApi {
  constructor() {
    this.name = "searXngApi";
    this.displayName = "SearXNG";
    this.documentationUrl = "searxng";
    this.properties = [
      {
        displayName: "API URL",
        name: "apiUrl",
        type: "string",
        default: "",
        required: true
      }
    ];
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SearXngApi
});
//# sourceMappingURL=SearXngApi.credentials.js.map