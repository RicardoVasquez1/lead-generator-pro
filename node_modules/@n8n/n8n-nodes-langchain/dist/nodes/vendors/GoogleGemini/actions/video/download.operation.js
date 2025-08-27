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
var download_operation_exports = {};
__export(download_operation_exports, {
  description: () => description,
  execute: () => execute
});
module.exports = __toCommonJS(download_operation_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_utils = require("../../helpers/utils");
const properties = [
  {
    displayName: "URL",
    name: "url",
    type: "string",
    placeholder: "e.g. https://generativelanguage.googleapis.com/v1beta/files/abcdefg:download",
    description: "The URL from Google Gemini API to download the video from",
    default: ""
  },
  {
    displayName: "Options",
    name: "options",
    placeholder: "Add Option",
    type: "collection",
    default: {},
    options: [
      {
        displayName: "Put Output in Field",
        name: "binaryPropertyOutput",
        type: "string",
        default: "data",
        hint: "The name of the output field to put the binary file data in"
      }
    ]
  }
];
const displayOptions = {
  show: {
    operation: ["download"],
    resource: ["video"]
  }
};
const description = (0, import_n8n_workflow.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
  const url = this.getNodeParameter("url", i, "");
  const binaryPropertyOutput = this.getNodeParameter(
    "options.binaryPropertyOutput",
    i,
    "data"
  );
  const credentials = await this.getCredentials("googlePalmApi");
  const { fileContent, mimeType } = await import_utils.downloadFile.call(this, url, "video/mp4", {
    key: credentials.apiKey
  });
  const binaryData = await this.helpers.prepareBinaryData(fileContent, "video.mp4", mimeType);
  return [
    {
      binary: { [binaryPropertyOutput]: binaryData },
      json: {
        ...binaryData,
        data: void 0
      },
      pairedItem: { item: i }
    }
  ];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  description,
  execute
});
//# sourceMappingURL=download.operation.js.map