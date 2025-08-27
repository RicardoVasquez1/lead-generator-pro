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
var baseAnalyze_exports = {};
__export(baseAnalyze_exports, {
  baseAnalyze: () => baseAnalyze
});
module.exports = __toCommonJS(baseAnalyze_exports);
var import_utils = require("./utils");
var import_transport = require("../transport");
async function baseAnalyze(i, urlsPropertyName, fallbackMimeType) {
  const model = this.getNodeParameter("modelId", i, "", { extractValue: true });
  const inputType = this.getNodeParameter("inputType", i, "url");
  const text = this.getNodeParameter("text", i, "");
  const simplify = this.getNodeParameter("simplify", i, true);
  const options = this.getNodeParameter("options", i, {});
  const generationConfig = {
    maxOutputTokens: options.maxOutputTokens
  };
  let contents;
  if (inputType === "url") {
    const urls = this.getNodeParameter(urlsPropertyName, i, "");
    const filesDataPromises = urls.split(",").map((url) => url.trim()).filter((url) => url).map(async (url) => {
      if (url.startsWith("https://generativelanguage.googleapis.com")) {
        const { mimeType } = await import_transport.apiRequest.call(this, "GET", "", {
          option: { url }
        });
        return { fileUri: url, mimeType };
      } else {
        const { fileContent, mimeType } = await import_utils.downloadFile.call(this, url, fallbackMimeType);
        return await import_utils.uploadFile.call(this, fileContent, mimeType);
      }
    });
    const filesData = await Promise.all(filesDataPromises);
    contents = [
      {
        role: "user",
        parts: filesData.map((fileData) => ({
          fileData
        }))
      }
    ];
  } else {
    const binaryPropertyNames = this.getNodeParameter("binaryPropertyName", i, "data");
    const promises = binaryPropertyNames.split(",").map((binaryPropertyName) => binaryPropertyName.trim()).filter((binaryPropertyName) => binaryPropertyName).map(async (binaryPropertyName) => {
      const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
      const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
      return await import_utils.uploadFile.call(this, buffer, binaryData.mimeType);
    });
    const filesData = await Promise.all(promises);
    contents = [
      {
        role: "user",
        parts: filesData.map((fileData) => ({
          fileData
        }))
      }
    ];
  }
  contents[0].parts.push({ text });
  const body = {
    contents,
    generationConfig
  };
  const response = await import_transport.apiRequest.call(this, "POST", `/v1beta/${model}:generateContent`, {
    body
  });
  if (simplify) {
    return response.candidates.map((candidate) => ({
      json: candidate,
      pairedItem: { item: i }
    }));
  }
  return [
    {
      json: { ...response },
      pairedItem: { item: i }
    }
  ];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  baseAnalyze
});
//# sourceMappingURL=baseAnalyze.js.map