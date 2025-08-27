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
  execute: () => execute,
  properties: () => properties
});
module.exports = __toCommonJS(list_operation_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_utils = require("../../helpers/utils");
var import_transport = require("../../transport");
const properties = [
  {
    displayName: "Return All",
    name: "returnAll",
    type: "boolean",
    default: false,
    description: "Whether to return all results or only up to a given limit"
  },
  {
    displayName: "Limit",
    name: "limit",
    type: "number",
    typeOptions: {
      minValue: 1,
      maxValue: 1e3
    },
    default: 50,
    description: "Max number of results to return",
    displayOptions: {
      show: {
        returnAll: [false]
      }
    }
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
  const returnAll = this.getNodeParameter("returnAll", i, false);
  const limit = this.getNodeParameter("limit", i, 50);
  const baseUrl = await import_utils.getBaseUrl.call(this);
  if (returnAll) {
    return await getAllFiles.call(this, baseUrl, i);
  } else {
    return await getFiles.call(this, baseUrl, i, limit);
  }
}
async function getAllFiles(baseUrl, i) {
  let hasMore = true;
  let lastId = void 0;
  const files = [];
  while (hasMore) {
    const response = await import_transport.apiRequest.call(this, "GET", "/v1/files", {
      qs: {
        limit: 1e3,
        after_id: lastId
      }
    });
    hasMore = response.has_more;
    lastId = response.last_id;
    files.push(...response.data);
  }
  return files.map((file) => ({
    json: { ...file, url: `${baseUrl}/v1/files/${file.id}` },
    pairedItem: { item: i }
  }));
}
async function getFiles(baseUrl, i, limit) {
  const response = await import_transport.apiRequest.call(this, "GET", "/v1/files", {
    qs: {
      limit
    }
  });
  return response.data.map((file) => ({
    json: { ...file, url: `${baseUrl}/v1/files/${file.id}` },
    pairedItem: { item: i }
  }));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  description,
  execute,
  properties
});
//# sourceMappingURL=list.operation.js.map