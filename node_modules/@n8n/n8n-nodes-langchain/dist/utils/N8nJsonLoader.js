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
var N8nJsonLoader_exports = {};
__export(N8nJsonLoader_exports, {
  N8nJsonLoader: () => N8nJsonLoader
});
module.exports = __toCommonJS(N8nJsonLoader_exports);
var import_json = require("langchain/document_loaders/fs/json");
var import_text = require("langchain/document_loaders/fs/text");
var import_n8n_workflow = require("n8n-workflow");
var import_helpers = require("./helpers");
class N8nJsonLoader {
  constructor(context, optionsPrefix = "", textSplitter) {
    this.context = context;
    this.optionsPrefix = optionsPrefix;
    this.textSplitter = textSplitter;
  }
  async processAll(items) {
    const docs = [];
    if (!items) return [];
    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      const processedDocuments = await this.processItem(items[itemIndex], itemIndex);
      docs.push(...processedDocuments);
    }
    return docs;
  }
  async processItem(item, itemIndex) {
    const mode = this.context.getNodeParameter("jsonMode", itemIndex, "allInputData");
    const pointers = this.context.getNodeParameter(
      `${this.optionsPrefix}pointers`,
      itemIndex,
      ""
    );
    const pointersArray = pointers.split(",").map((pointer) => pointer.trim());
    const metadata = (0, import_helpers.getMetadataFiltersValues)(this.context, itemIndex) ?? [];
    if (!item) return [];
    let documentLoader = null;
    if (mode === "allInputData") {
      const itemString = JSON.stringify(item.json);
      const itemBlob = new Blob([itemString], { type: "application/json" });
      documentLoader = new import_json.JSONLoader(itemBlob, pointersArray);
    }
    if (mode === "expressionData") {
      const dataString = this.context.getNodeParameter("jsonData", itemIndex);
      if (typeof dataString === "object") {
        const itemBlob = new Blob([JSON.stringify(dataString)], { type: "application/json" });
        documentLoader = new import_json.JSONLoader(itemBlob, pointersArray);
      }
      if (typeof dataString === "string") {
        const itemBlob = new Blob([dataString], { type: "text/plain" });
        documentLoader = new import_text.TextLoader(itemBlob);
      }
    }
    if (documentLoader === null) {
      throw new import_n8n_workflow.NodeOperationError(this.context.getNode(), "Document loader is not initialized");
    }
    const docs = this.textSplitter ? await this.textSplitter.splitDocuments(await documentLoader.load()) : await documentLoader.load();
    if (metadata) {
      docs.forEach((doc) => {
        doc.metadata = {
          ...doc.metadata,
          ...metadata
        };
      });
    }
    return docs;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  N8nJsonLoader
});
//# sourceMappingURL=N8nJsonLoader.js.map