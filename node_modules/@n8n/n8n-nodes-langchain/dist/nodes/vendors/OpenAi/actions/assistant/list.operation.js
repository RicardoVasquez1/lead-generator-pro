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
    displayName: "Simplify Output",
    name: "simplify",
    type: "boolean",
    default: true,
    description: "Whether to return a simplified version of the response instead of the raw data"
  }
];
const displayOptions = {
  show: {
    operation: ["list"],
    resource: ["assistant"]
  }
};
const description = (0, import_n8n_workflow.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
  const returnData = [];
  let has_more = true;
  let after;
  do {
    const response = await import_transport.apiRequest.call(this, "GET", "/assistants", {
      headers: {
        "OpenAI-Beta": "assistants=v2"
      },
      qs: {
        limit: 100,
        after
      }
    });
    for (const assistant of response.data || []) {
      try {
        assistant.created_at = new Date(assistant.created_at * 1e3).toISOString();
      } catch (error) {
      }
      returnData.push({ json: assistant, pairedItem: { item: i } });
    }
    has_more = response.has_more;
    if (has_more) {
      after = response.last_id;
    } else {
      break;
    }
  } while (has_more);
  const simplify = this.getNodeParameter("simplify", i);
  if (simplify) {
    return returnData.map((item) => {
      const { id, name, model } = item.json;
      return {
        json: {
          id,
          name,
          model
        },
        pairedItem: { item: i }
      };
    });
  }
  return returnData;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  description,
  execute
});
//# sourceMappingURL=list.operation.js.map