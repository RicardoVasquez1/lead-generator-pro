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
var DocumentBinaryInputLoader_node_exports = {};
__export(DocumentBinaryInputLoader_node_exports, {
  DocumentBinaryInputLoader: () => DocumentBinaryInputLoader
});
module.exports = __toCommonJS(DocumentBinaryInputLoader_node_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_logWrapper = require("../../../utils/logWrapper");
var import_N8nBinaryLoader = require("../../../utils/N8nBinaryLoader");
var import_sharedFields = require("../../../utils/sharedFields");
var import_mammoth = require("mammoth");
var import_epub2 = require("epub2");
var import_pdf_parse = require("pdf-parse");
class DocumentBinaryInputLoader {
  constructor() {
    this.description = {
      // This node is deprecated and will be removed in the future.
      // The functionality was merged with the `DocumentJSONInputLoader` to `DocumentDefaultDataLoader`
      hidden: true,
      displayName: "Binary Input Loader",
      name: "documentBinaryInputLoader",
      icon: "file:binary.svg",
      group: ["transform"],
      version: 1,
      description: "Use binary data from a previous step in the workflow",
      defaults: {
        name: "Binary Input Loader"
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
          type: import_n8n_workflow.NodeConnectionTypes.AiTextSplitter,
          required: true
        }
      ],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiDocument],
      outputNames: ["Document"],
      properties: [
        (0, import_sharedFields.getConnectionHintNoticeField)([import_n8n_workflow.NodeConnectionTypes.AiVectorStore]),
        {
          displayName: "Loader Type",
          name: "loader",
          type: "options",
          default: "jsonLoader",
          required: true,
          options: [
            {
              name: "CSV Loader",
              value: "csvLoader",
              description: "Load CSV files"
            },
            {
              name: "Docx Loader",
              value: "docxLoader",
              description: "Load Docx documents"
            },
            {
              name: "EPub Loader",
              value: "epubLoader",
              description: "Load EPub files"
            },
            {
              name: "JSON Loader",
              value: "jsonLoader",
              description: "Load JSON files"
            },
            {
              name: "PDF Loader",
              value: "pdfLoader",
              description: "Load PDF documents"
            },
            {
              name: "Text Loader",
              value: "textLoader",
              description: "Load plain text files"
            }
          ]
        },
        {
          displayName: "Binary Data Key",
          name: "binaryDataKey",
          type: "string",
          default: "data",
          required: true,
          description: "Name of the binary property from which to read the file buffer"
        },
        // PDF Only Fields
        {
          displayName: "Split Pages",
          name: "splitPages",
          type: "boolean",
          default: true,
          displayOptions: {
            show: {
              loader: ["pdfLoader"]
            }
          }
        },
        // CSV Only Fields
        {
          displayName: "Column",
          name: "column",
          type: "string",
          default: "",
          description: "Column to extract from CSV",
          displayOptions: {
            show: {
              loader: ["csvLoader"]
            }
          }
        },
        {
          displayName: "Separator",
          name: "separator",
          type: "string",
          description: "Separator to use for CSV",
          default: ",",
          displayOptions: {
            show: {
              loader: ["csvLoader"]
            }
          }
        },
        // JSON Only Fields
        {
          displayName: "Pointers",
          name: "pointers",
          type: "string",
          default: "",
          description: 'Pointers to extract from JSON, e.g. "/text" or "/text, /meta/title"',
          displayOptions: {
            show: {
              loader: ["jsonLoader"]
            }
          }
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
    this.logger.debug("Supply Data for Binary Input Loader");
    const textSplitter = await this.getInputConnectionData(
      import_n8n_workflow.NodeConnectionTypes.AiTextSplitter,
      0
    );
    const binaryDataKey = this.getNodeParameter("binaryDataKey", 0);
    const processor = new import_N8nBinaryLoader.N8nBinaryLoader(this, void 0, binaryDataKey, textSplitter);
    return {
      response: (0, import_logWrapper.logWrapper)(processor, this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DocumentBinaryInputLoader
});
//# sourceMappingURL=DocumentBinaryInputLoader.node.js.map