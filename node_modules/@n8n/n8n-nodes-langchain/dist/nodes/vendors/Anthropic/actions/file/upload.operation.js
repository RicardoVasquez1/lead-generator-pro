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
var upload_operation_exports = {};
__export(upload_operation_exports, {
  description: () => description,
  execute: () => execute,
  properties: () => properties
});
module.exports = __toCommonJS(upload_operation_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_utils = require("../../helpers/utils");
const properties = [
  {
    displayName: "Input Type",
    name: "inputType",
    type: "options",
    default: "url",
    options: [
      {
        name: "File URL",
        value: "url"
      },
      {
        name: "Binary File",
        value: "binary"
      }
    ]
  },
  {
    displayName: "URL",
    name: "fileUrl",
    type: "string",
    placeholder: "e.g. https://example.com/file.pdf",
    description: "URL of the file to upload",
    default: "",
    displayOptions: {
      show: {
        inputType: ["url"]
      }
    }
  },
  {
    displayName: "Input Data Field Name",
    name: "binaryPropertyName",
    type: "string",
    default: "data",
    placeholder: "e.g. data",
    hint: "The name of the input field containing the binary file data to be processed",
    description: "Name of the binary field which contains the file",
    displayOptions: {
      show: {
        inputType: ["binary"]
      }
    }
  },
  {
    displayName: "Options",
    name: "options",
    type: "collection",
    placeholder: "Add Option",
    default: {},
    options: [
      {
        displayName: "File Name",
        name: "fileName",
        type: "string",
        description: "The file name to use for the uploaded file",
        default: ""
      }
    ]
  }
];
const displayOptions = {
  show: {
    operation: ["upload"],
    resource: ["file"]
  }
};
const description = (0, import_n8n_workflow.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
  const inputType = this.getNodeParameter("inputType", i, "url");
  const fileName = this.getNodeParameter("options.fileName", i, "file");
  const baseUrl = await import_utils.getBaseUrl.call(this);
  let response;
  if (inputType === "url") {
    const fileUrl = this.getNodeParameter("fileUrl", i, "");
    const { fileContent, mimeType } = await import_utils.downloadFile.call(this, fileUrl);
    response = await import_utils.uploadFile.call(this, fileContent, mimeType, fileName);
  } else {
    const binaryPropertyName = this.getNodeParameter("binaryPropertyName", i, "data");
    const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
    const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
    response = await import_utils.uploadFile.call(this, buffer, binaryData.mimeType, fileName);
  }
  return [
    {
      json: { ...response, url: `${baseUrl}/v1/files/${response.id}` },
      pairedItem: {
        item: i
      }
    }
  ];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  description,
  execute,
  properties
});
//# sourceMappingURL=upload.operation.js.map