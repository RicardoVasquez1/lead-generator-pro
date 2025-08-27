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
async function baseAnalyze(i, urlsPropertyName, type) {
  const model = this.getNodeParameter("modelId", i, "", { extractValue: true });
  const inputType = this.getNodeParameter("inputType", i, "url");
  const text = this.getNodeParameter("text", i, "");
  const simplify = this.getNodeParameter("simplify", i, true);
  const options = this.getNodeParameter("options", i, {});
  const baseUrl = await import_utils.getBaseUrl.call(this);
  const fileUrlPrefix = `${baseUrl}/v1/files/`;
  let content;
  if (inputType === "url") {
    const urls = this.getNodeParameter(urlsPropertyName, i, "");
    content = (0, import_utils.splitByComma)(urls).map((url) => {
      if (url.startsWith(fileUrlPrefix)) {
        return {
          type,
          source: {
            type: "file",
            file_id: url.replace(fileUrlPrefix, "")
          }
        };
      } else {
        return {
          type,
          source: {
            type: "url",
            url
          }
        };
      }
    });
  } else {
    const binaryPropertyNames = this.getNodeParameter("binaryPropertyName", i, "data");
    const promises = (0, import_utils.splitByComma)(binaryPropertyNames).map(async (binaryPropertyName) => {
      const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
      const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
      const fileBase64 = buffer.toString("base64");
      return {
        type,
        source: {
          type: "base64",
          media_type: binaryData.mimeType,
          data: fileBase64
        }
      };
    });
    content = await Promise.all(promises);
  }
  content.push({
    type: "text",
    text
  });
  const body = {
    model,
    max_tokens: options.maxTokens ?? 1024,
    messages: [
      {
        role: "user",
        content
      }
    ]
  };
  const response = await import_transport.apiRequest.call(this, "POST", "/v1/messages", {
    body
  });
  if (simplify) {
    return [
      {
        json: { content: response.content },
        pairedItem: { item: i }
      }
    ];
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