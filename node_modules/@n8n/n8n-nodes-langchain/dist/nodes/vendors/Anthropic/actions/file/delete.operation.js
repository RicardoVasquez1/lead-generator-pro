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
var delete_operation_exports = {};
__export(delete_operation_exports, {
  description: () => description,
  execute: () => execute,
  properties: () => properties
});
module.exports = __toCommonJS(delete_operation_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_transport = require("../../transport");
const properties = [
  {
    displayName: "File ID",
    name: "fileId",
    type: "string",
    placeholder: "e.g. file_123",
    description: "ID of the file to delete",
    default: ""
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
  const fileId = this.getNodeParameter("fileId", i, "");
  const response = await import_transport.apiRequest.call(this, "DELETE", `/v1/files/${fileId}`);
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
  execute,
  properties
});
//# sourceMappingURL=delete.operation.js.map