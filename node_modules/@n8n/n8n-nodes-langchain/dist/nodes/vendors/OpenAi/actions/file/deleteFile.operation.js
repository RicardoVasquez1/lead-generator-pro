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
var deleteFile_operation_exports = {};
__export(deleteFile_operation_exports, {
  description: () => description,
  execute: () => execute
});
module.exports = __toCommonJS(deleteFile_operation_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_transport = require("../../transport");
const properties = [
  {
    displayName: "File",
    name: "fileId",
    type: "resourceLocator",
    default: { mode: "list", value: "" },
    required: true,
    modes: [
      {
        displayName: "From List",
        name: "list",
        type: "list",
        typeOptions: {
          searchListMethod: "fileSearch",
          searchable: true
        }
      },
      {
        displayName: "ID",
        name: "id",
        type: "string",
        validation: [
          {
            type: "regex",
            properties: {
              regex: "file-[a-zA-Z0-9]",
              errorMessage: "Not a valid File ID"
            }
          }
        ],
        placeholder: "e.g. file-1234567890"
      }
    ]
  }
];
const displayOptions = {
  show: {
    operation: ["deleteFile"],
    resource: ["file"]
  }
};
const description = (0, import_n8n_workflow.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
  const fileId = this.getNodeParameter("fileId", i, "", { extractValue: true });
  const response = await import_transport.apiRequest.call(this, "DELETE", `/files/${fileId}`);
  return [
    {
      json: response,
      pairedItem: { item: i }
    }
  ];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  description,
  execute
});
//# sourceMappingURL=deleteFile.operation.js.map