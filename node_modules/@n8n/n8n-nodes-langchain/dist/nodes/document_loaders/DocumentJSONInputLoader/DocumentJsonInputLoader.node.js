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
var DocumentJsonInputLoader_node_exports = {};
__export(DocumentJsonInputLoader_node_exports, {
  DocumentJsonInputLoader: () => DocumentJsonInputLoader
});
module.exports = __toCommonJS(DocumentJsonInputLoader_node_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_logWrapper = require("../../../utils/logWrapper");
var import_N8nJsonLoader = require("../../../utils/N8nJsonLoader");
var import_sharedFields = require("../../../utils/sharedFields");
class DocumentJsonInputLoader {
  constructor() {
    this.description = {
      // This node is deprecated and will be removed in the future.
      // The functionality was merged with the `DocumentBinaryInputLoader` to `DocumentDefaultDataLoader`
      hidden: true,
      displayName: "JSON Input Loader",
      name: "documentJsonInputLoader",
      icon: "file:json.svg",
      group: ["transform"],
      version: 1,
      description: "Use JSON data from a previous step in the workflow",
      defaults: {
        name: "JSON Input Loader"
      },
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Document Loaders"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.documentdefaultdataloader/"
            }
          ]
        }
      },
      inputs: [
        {
          displayName: "Text Splitter",
          maxConnections: 1,
          type: import_n8n_workflow.NodeConnectionTypes.AiTextSplitter
        }
      ],
      inputNames: ["Text Splitter"],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiDocument],
      outputNames: ["Document"],
      properties: [
        (0, import_sharedFields.getConnectionHintNoticeField)([import_n8n_workflow.NodeConnectionTypes.AiVectorStore]),
        {
          displayName: "Pointers",
          name: "pointers",
          type: "string",
          default: "",
          description: 'Pointers to extract from JSON, e.g. "/text" or "/text, /meta/title"'
        },
        {
          displayName: "Options",
          name: "options",
          type: "collection",
          placeholder: "Add Option",
          default: {},
          options: [
            {
              ...import_sharedFields.metadataFilterField,
              displayName: "Metadata",
              description: "Metadata to add to each document. Could be used for filtering during retrieval",
              placeholder: "Add property"
            }
          ]
        }
      ]
    };
  }
  async supplyData() {
    this.logger.debug("Supply Data for JSON Input Loader");
    const textSplitter = await this.getInputConnectionData(
      import_n8n_workflow.NodeConnectionTypes.AiTextSplitter,
      0
    );
    const processor = new import_N8nJsonLoader.N8nJsonLoader(this, void 0, textSplitter);
    return {
      response: (0, import_logWrapper.logWrapper)(processor, this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DocumentJsonInputLoader
});
//# sourceMappingURL=DocumentJsonInputLoader.node.js.map