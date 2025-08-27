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
var list_operation_exports = {};
__export(list_operation_exports, {
  description: () => description,
  execute: () => execute
});
module.exports = __toCommonJS(list_operation_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_transport = require("../../transport");
const properties = [
  {
    displayName: "Options",
    name: "options",
    placeholder: "Add Option",
    type: "collection",
    default: {},
    options: [
      {
        displayName: "Purpose",
        name: "purpose",
        type: "options",
        default: "any",
        description: "Only return files with the given purpose",
        options: [
          {
            name: "Any [Default]",
            value: "any"
          },
          {
            name: "Assistants",
            value: "assistants"
          },
          {
            name: "Fine-Tune",
            value: "fine-tune"
          }
        ]
      }
    ]
  }
];
const displayOptions = {
  show: {
    operation: ["list"],
    resource: ["file"]
  }
};
const description = (0, import_n8n_workflow.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
  const options = this.getNodeParameter("options", i, {});
  const qs = {};
  if (options.purpose && options.purpose !== "any") {
    qs.purpose = options.purpose;
  }
  const { data } = await import_transport.apiRequest.call(this, "GET", "/files", { qs });
  return (data || []).map((file) => ({
    json: file,
    pairedItem: { item: i }
  }));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  description,
  execute
});
//# sourceMappingURL=list.operation.js.map