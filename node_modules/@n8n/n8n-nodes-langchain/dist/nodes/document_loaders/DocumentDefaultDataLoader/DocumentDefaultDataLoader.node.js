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
var DocumentDefaultDataLoader_node_exports = {};
__export(DocumentDefaultDataLoader_node_exports, {
  DocumentDefaultDataLoader: () => DocumentDefaultDataLoader
});
module.exports = __toCommonJS(DocumentDefaultDataLoader_node_exports);
var import_textsplitters = require("@langchain/textsplitters");
var import_n8n_workflow = require("n8n-workflow");
var import_logWrapper = require("../../../utils/logWrapper");
var import_N8nBinaryLoader = require("../../../utils/N8nBinaryLoader");
var import_N8nJsonLoader = require("../../../utils/N8nJsonLoader");
var import_sharedFields = require("../../../utils/sharedFields");
var import_mammoth = require("mammoth");
var import_epub2 = require("epub2");
var import_pdf_parse = require("pdf-parse");
function getInputs(parameters) {
  const inputs = [];
  const textSplittingMode = parameters?.textSplittingMode;
  if (!textSplittingMode || textSplittingMode === "custom") {
    inputs.push({
      displayName: "Text Splitter",
      maxConnections: 1,
      type: "ai_textSplitter",
      required: true
    });
  }
  return inputs;
}
class DocumentDefaultDataLoader {
  constructor() {
    this.description = {
      displayName: "Default Data Loader",
      name: "documentDefaultDataLoader",
      icon: "file:binary.svg",
      group: ["transform"],
      version: [1, 1.1],
      defaultVersion: 1.1,
      description: "Load data from previous step in the workflow",
      defaults: {
        name: "Default Data Loader"
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
      inputs: `={{ ((parameter) => { ${getInputs.toString()}; return getInputs(parameter) })($parameter) }}`,
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiDocument],
      outputNames: ["Document"],
      properties: [
        {
          displayName: 'This will load data from a previous step in the workflow. <a href="/templates/1962" target="_blank">Example</a>',
          name: "notice",
          type: "notice",
          default: ""
        },
        {
          displayName: "Type of Data",
          name: "dataType",
          type: "options",
          default: "json",
          required: true,
          noDataExpression: true,
          options: [
            {
              name: "JSON",
              value: "json",
              description: "Process JSON data from previous step in the workflow"
            },
            {
              name: "Binary",
              value: "binary",
              description: "Process binary data from previous step in the workflow"
            }
          ]
        },
        {
          displayName: "Mode",
          name: "jsonMode",
          type: "options",
          default: "allInputData",
          required: true,
          displayOptions: {
            show: {
              dataType: ["json"]
            }
          },
          options: [
            {
              name: "Load All Input Data",
              value: "allInputData",
              description: "Use all JSON data that flows into the parent agent or chain"
            },
            {
              name: "Load Specific Data",
              value: "expressionData",
              description: "Load a subset of data, and/or data from any previous step in the workflow"
            }
          ]
        },
        {
          displayName: "Mode",
          name: "binaryMode",
          type: "options",
          default: "allInputData",
          required: true,
          displayOptions: {
            show: {
              dataType: ["binary"]
            }
          },
          options: [
            {
              name: "Load All Input Data",
              value: "allInputData",
              description: "Use all Binary data that flows into the parent agent or chain"
            },
            {
              name: "Load Specific Data",
              value: "specificField",
              description: "Load data from a specific field in the parent agent or chain"
            }
          ]
        },
        {
          displayName: "Data Format",
          name: "loader",
          type: "options",
          default: "auto",
          required: true,
          displayOptions: {
            show: {
              dataType: ["binary"]
            }
          },
          options: [
            {
              name: "Automatically Detect by Mime Type",
              value: "auto",
              description: "Uses the mime type to detect the format"
            },
            {
              name: "CSV",
              value: "csvLoader",
              description: "Load CSV files"
            },
            {
              name: "Docx",
              value: "docxLoader",
              description: "Load Docx documents"
            },
            {
              name: "EPub",
              value: "epubLoader",
              description: "Load EPub files"
            },
            {
              name: "JSON",
              value: "jsonLoader",
              description: "Load JSON files"
            },
            {
              name: "PDF",
              value: "pdfLoader",
              description: "Load PDF documents"
            },
            {
              name: "Text",
              value: "textLoader",
              description: "Load plain text files"
            }
          ]
        },
        {
          displayName: "Data",
          name: "jsonData",
          type: "string",
          typeOptions: {
            rows: 6
          },
          default: "",
          required: true,
          description: "Drag and drop fields from the input pane, or use an expression",
          displayOptions: {
            show: {
              dataType: ["json"],
              jsonMode: ["expressionData"]
            }
          }
        },
        {
          displayName: "Input Data Field Name",
          name: "binaryDataKey",
          type: "string",
          default: "data",
          required: true,
          description: "The name of the field in the agent or chain\u2019s input that contains the binary file to be processed",
          displayOptions: {
            show: {
              dataType: ["binary"]
            },
            hide: {
              binaryMode: ["allInputData"]
            }
          }
        },
        {
          displayName: "Text Splitting",
          name: "textSplittingMode",
          type: "options",
          default: "simple",
          required: true,
          noDataExpression: true,
          displayOptions: {
            show: {
              "@version": [1.1]
            }
          },
          options: [
            {
              name: "Simple",
              value: "simple",
              description: "Splits every 1000 characters with a 200 character overlap"
            },
            {
              name: "Custom",
              value: "custom",
              description: "Connect a custom text-splitting sub-node"
            }
          ]
        },
        {
          displayName: "Options",
          name: "options",
          type: "collection",
          placeholder: "Add Option",
          default: {},
          options: [
            {
              displayName: "JSON Pointers",
              name: "pointers",
              type: "string",
              default: "",
              description: 'Pointers to extract from JSON, e.g. "/text" or "/text, /meta/title"',
              displayOptions: {
                show: {
                  "/loader": ["jsonLoader", "auto"]
                }
              }
            },
            {
              displayName: "CSV Separator",
              name: "separator",
              type: "string",
              description: "Separator to use for CSV",
              default: ",",
              displayOptions: {
                show: {
                  "/loader": ["csvLoader", "auto"]
                }
              }
            },
            {
              displayName: "CSV Column",
              name: "column",
              type: "string",
              default: "",
              description: "Column to extract from CSV",
              displayOptions: {
                show: {
                  "/loader": ["csvLoader", "auto"]
                }
              }
            },
            {
              displayName: "Split Pages in PDF",
              description: "Whether to split PDF pages into separate documents",
              name: "splitPages",
              type: "boolean",
              default: true,
              displayOptions: {
                show: {
                  "/loader": ["pdfLoader", "auto"]
                }
              }
            },
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
  async supplyData(itemIndex) {
    const node = this.getNode();
    const dataType = this.getNodeParameter("dataType", itemIndex, "json");
    let textSplitter;
    if (node.typeVersion === 1.1) {
      const textSplittingMode = this.getNodeParameter("textSplittingMode", itemIndex, "simple");
      if (textSplittingMode === "simple") {
        textSplitter = new import_textsplitters.RecursiveCharacterTextSplitter({ chunkSize: 1e3, chunkOverlap: 200 });
      } else if (textSplittingMode === "custom") {
        textSplitter = await this.getInputConnectionData(import_n8n_workflow.NodeConnectionTypes.AiTextSplitter, 0);
      }
    } else {
      textSplitter = await this.getInputConnectionData(import_n8n_workflow.NodeConnectionTypes.AiTextSplitter, 0);
    }
    const binaryDataKey = this.getNodeParameter("binaryDataKey", itemIndex, "");
    const processor = dataType === "binary" ? new import_N8nBinaryLoader.N8nBinaryLoader(this, "options.", binaryDataKey, textSplitter) : new import_N8nJsonLoader.N8nJsonLoader(this, "options.", textSplitter);
    return {
      response: (0, import_logWrapper.logWrapper)(processor, this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DocumentDefaultDataLoader
});
//# sourceMappingURL=DocumentDefaultDataLoader.node.js.map