"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var utils_exports = {};
__export(utils_exports, {
  downloadFile: () => downloadFile,
  getBaseUrl: () => getBaseUrl,
  getMimeType: () => getMimeType,
  splitByComma: () => splitByComma,
  uploadFile: () => uploadFile
});
module.exports = __toCommonJS(utils_exports);
var import_form_data = __toESM(require("form-data"));
var import_transport = require("../transport");
function getMimeType(contentType) {
  return contentType?.split(";")?.[0];
}
async function downloadFile(url, qs) {
  const downloadResponse = await this.helpers.httpRequest({
    method: "GET",
    url,
    qs,
    returnFullResponse: true,
    encoding: "arraybuffer"
  });
  const mimeType = getMimeType(downloadResponse.headers?.["content-type"]) ?? "application/octet-stream";
  const fileContent = Buffer.from(downloadResponse.body);
  return {
    fileContent,
    mimeType
  };
}
async function uploadFile(fileContent, mimeType, fileName) {
  const form = new import_form_data.default();
  form.append("file", fileContent, {
    filename: fileName ?? "file",
    contentType: mimeType
  });
  return await import_transport.apiRequest.call(this, "POST", "/v1/files", {
    headers: form.getHeaders(),
    body: form
  });
}
function splitByComma(str) {
  return str.split(",").map((s) => s.trim()).filter((s) => s);
}
async function getBaseUrl() {
  const credentials = await this.getCredentials("anthropicApi");
  return credentials.url ?? "https://api.anthropic.com";
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  downloadFile,
  getBaseUrl,
  getMimeType,
  splitByComma,
  uploadFile
});
//# sourceMappingURL=utils.js.map