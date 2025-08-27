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
var classify_operation_exports = {};
__export(classify_operation_exports, {
  description: () => description,
  execute: () => execute
});
module.exports = __toCommonJS(classify_operation_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_transport = require("../../transport");
const properties = [
  {
    displayName: "Text Input",
    name: "input",
    type: "string",
    placeholder: "e.g. Sample text goes here",
    description: "The input text to classify if it is violates the moderation policy",
    default: "",
    typeOptions: {
      rows: 2
    }
  },
  {
    displayName: "Simplify Output",
    name: "simplify",
    type: "boolean",
    default: false,
    description: "Whether to return a simplified version of the response instead of the raw data"
  },
  {
    displayName: "Options",
    name: "options",
    placeholder: "Add Option",
    type: "collection",
    default: {},
    options: [
      {
        displayName: "Use Stable Model",
        name: "useStableModel",
        type: "boolean",
        default: false,
        description: "Whether to use the stable version of the model instead of the latest version, accuracy may be slightly lower"
      }
    ]
  }
];
const displayOptions = {
  show: {
    operation: ["classify"],
    resource: ["text"]
  }
};
const description = (0, import_n8n_workflow.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
  const input = this.getNodeParameter("input", i);
  const options = this.getNodeParameter("options", i);
  const model = options.useStableModel ? "text-moderation-stable" : "text-moderation-latest";
  const body = {
    input,
    model
  };
  const { results } = await import_transport.apiRequest.call(this, "POST", "/moderations", { body });
  if (!results) return [];
  const simplify = this.getNodeParameter("simplify", i);
  if (simplify && results) {
    return [
      {
        json: { flagged: results[0].flagged },
        pairedItem: { item: i }
      }
    ];
  } else {
    return [
      {
        json: results[0],
        pairedItem: { item: i }
      }
    ];
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  description,
  execute
});
//# sourceMappingURL=classify.operation.js.map