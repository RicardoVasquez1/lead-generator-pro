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
var constants_exports = {};
__export(constants_exports, {
  DEFAULT_OPERATION_MODES: () => DEFAULT_OPERATION_MODES,
  OPERATION_MODE_DESCRIPTIONS: () => OPERATION_MODE_DESCRIPTIONS
});
module.exports = __toCommonJS(constants_exports);
var import_n8n_workflow = require("n8n-workflow");
const DEFAULT_OPERATION_MODES = [
  "load",
  "insert",
  "retrieve",
  "retrieve-as-tool"
];
const OPERATION_MODE_DESCRIPTIONS = [
  {
    name: "Get Many",
    value: "load",
    description: "Get many ranked documents from vector store for query",
    action: "Get ranked documents from vector store"
  },
  {
    name: "Insert Documents",
    value: "insert",
    description: "Insert documents into vector store",
    action: "Add documents to vector store"
  },
  {
    name: "Retrieve Documents (As Vector Store for Chain/Tool)",
    value: "retrieve",
    description: "Retrieve documents from vector store to be used as vector store with AI nodes",
    action: "Retrieve documents for Chain/Tool as Vector Store",
    outputConnectionType: import_n8n_workflow.NodeConnectionTypes.AiVectorStore
  },
  {
    name: "Retrieve Documents (As Tool for AI Agent)",
    value: "retrieve-as-tool",
    description: "Retrieve documents from vector store to be used as tool with AI nodes",
    action: "Retrieve documents for AI Agent as Tool",
    outputConnectionType: import_n8n_workflow.NodeConnectionTypes.AiTool
  },
  {
    name: "Update Documents",
    value: "update",
    description: "Update documents in vector store by ID",
    action: "Update vector store documents"
  }
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DEFAULT_OPERATION_MODES,
  OPERATION_MODE_DESCRIPTIONS
});
//# sourceMappingURL=constants.js.map