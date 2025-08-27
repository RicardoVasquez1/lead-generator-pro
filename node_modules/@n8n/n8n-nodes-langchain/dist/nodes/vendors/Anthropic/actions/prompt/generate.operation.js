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
var generate_operation_exports = {};
__export(generate_operation_exports, {
  description: () => description,
  execute: () => execute
});
module.exports = __toCommonJS(generate_operation_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_transport = require("../../transport");
const properties = [
  {
    displayName: "Task",
    name: "task",
    type: "string",
    description: "Description of the prompt's purpose",
    placeholder: "e.g. A chef for a meal prep planning service",
    default: "",
    typeOptions: {
      rows: 2
    }
  },
  {
    displayName: "Simplify Output",
    name: "simplify",
    type: "boolean",
    default: true,
    description: "Whether to return a simplified version of the response instead of the raw data"
  }
];
const displayOptions = {
  show: {
    operation: ["generate"],
    resource: ["prompt"]
  }
};
const description = (0, import_n8n_workflow.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
  const task = this.getNodeParameter("task", i, "");
  const simplify = this.getNodeParameter("simplify", i, true);
  const body = {
    task
  };
  const response = await import_transport.apiRequest.call(this, "POST", "/v1/experimental/generate_prompt", {
    body,
    enableAnthropicBetas: { promptTools: true }
  });
  if (simplify) {
    return [
      {
        json: {
          messages: response.messages,
          system: response.system
        },
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
  description,
  execute
});
//# sourceMappingURL=generate.operation.js.map