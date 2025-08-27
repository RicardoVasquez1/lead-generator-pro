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
var createVectorStoreNode_exports = {};
__export(createVectorStoreNode_exports, {
  createVectorStoreNode: () => createVectorStoreNode
});
module.exports = __toCommonJS(createVectorStoreNode_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_sharedFields = require("../../../../utils/sharedFields");
var import_operations = require("./operations");
var import_utils = require("./utils");
const ragStarterCallout = {
  displayName: "Tip: Get a feel for vector stores in n8n with our",
  name: "ragStarterCallout",
  type: "callout",
  typeOptions: {
    calloutAction: {
      label: "RAG starter template",
      type: "openSampleWorkflowTemplate",
      templateId: "rag-starter-template"
    }
  },
  default: ""
};
const createVectorStoreNode = (args) => class VectorStoreNodeType {
  constructor() {
    this.description = {
      displayName: args.meta.displayName,
      name: args.meta.name,
      description: args.meta.description,
      icon: args.meta.icon,
      iconColor: args.meta.iconColor,
      group: ["transform"],
      // 1.2 has changes to VectorStoreInMemory node.
      // 1.3 drops `toolName` and uses node name as the tool name.
      version: [1, 1.1, 1.2, 1.3],
      defaults: {
        name: args.meta.displayName
      },
      codex: {
        categories: args.meta.categories ?? ["AI"],
        subcategories: args.meta.subcategories ?? {
          AI: ["Vector Stores", "Tools", "Root Nodes"],
          "Vector Stores": ["Other Vector Stores"],
          Tools: ["Other Tools"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: args.meta.docsUrl
            }
          ]
        }
      },
      credentials: args.meta.credentials,
      inputs: `={{
			((parameters) => {
				const mode = parameters?.mode;
				const useReranker = parameters?.useReranker;
				const inputs = [{ displayName: "Embedding", type: "${import_n8n_workflow.NodeConnectionTypes.AiEmbedding}", required: true, maxConnections: 1}]

				if (['load', 'retrieve', 'retrieve-as-tool'].includes(mode) && useReranker) {
					inputs.push({ displayName: "Reranker", type: "${import_n8n_workflow.NodeConnectionTypes.AiReranker}", required: true, maxConnections: 1})
				}

				if (mode === 'retrieve-as-tool') {
					return inputs;
				}

				if (['insert', 'load', 'update'].includes(mode)) {
					inputs.push({ displayName: "", type: "${import_n8n_workflow.NodeConnectionTypes.Main}"})
				}

				if (['insert'].includes(mode)) {
					inputs.push({ displayName: "Document", type: "${import_n8n_workflow.NodeConnectionTypes.AiDocument}", required: true, maxConnections: 1})
				}
				return inputs
			})($parameter)
		}}`,
      outputs: `={{
			((parameters) => {
				const mode = parameters?.mode ?? 'retrieve';

				if (mode === 'retrieve-as-tool') {
					return [{ displayName: "Tool", type: "${import_n8n_workflow.NodeConnectionTypes.AiTool}"}]
				}

				if (mode === 'retrieve') {
					return [{ displayName: "Vector Store", type: "${import_n8n_workflow.NodeConnectionTypes.AiVectorStore}"}]
				}
				return [{ displayName: "", type: "${import_n8n_workflow.NodeConnectionTypes.Main}"}]
			})($parameter)
		}}`,
      properties: [
        ragStarterCallout,
        {
          displayName: "Operation Mode",
          name: "mode",
          type: "options",
          noDataExpression: true,
          default: "retrieve",
          options: (0, import_utils.getOperationModeOptions)(args)
        },
        {
          ...(0, import_sharedFields.getConnectionHintNoticeField)([import_n8n_workflow.NodeConnectionTypes.AiRetriever]),
          displayOptions: {
            show: {
              mode: ["retrieve"]
            }
          }
        },
        {
          displayName: "Name",
          name: "toolName",
          type: "string",
          default: "",
          required: true,
          description: "Name of the vector store",
          placeholder: "e.g. company_knowledge_base",
          validateType: "string-alphanumeric",
          displayOptions: {
            show: {
              "@version": [{ _cnd: { lte: 1.2 } }],
              mode: ["retrieve-as-tool"]
            }
          }
        },
        {
          displayName: "Description",
          name: "toolDescription",
          type: "string",
          default: "",
          required: true,
          typeOptions: { rows: 2 },
          description: "Explain to the LLM what this tool does, a good, specific description would allow LLMs to produce expected results much more often",
          placeholder: `e.g. ${args.meta.description}`,
          displayOptions: {
            show: {
              mode: ["retrieve-as-tool"]
            }
          }
        },
        ...args.sharedFields,
        {
          displayName: "Embedding Batch Size",
          name: "embeddingBatchSize",
          type: "number",
          default: 200,
          description: "Number of documents to embed in a single batch",
          displayOptions: {
            show: {
              mode: ["insert"],
              "@version": [{ _cnd: { gte: 1.1 } }]
            }
          }
        },
        ...(0, import_utils.transformDescriptionForOperationMode)(args.insertFields ?? [], "insert"),
        // Prompt and topK are always used for the load operation
        {
          displayName: "Prompt",
          name: "prompt",
          type: "string",
          default: "",
          required: true,
          description: "Search prompt to retrieve matching documents from the vector store using similarity-based ranking",
          displayOptions: {
            show: {
              mode: ["load"]
            }
          }
        },
        {
          displayName: "Limit",
          name: "topK",
          type: "number",
          default: 4,
          description: "Number of top results to fetch from vector store",
          displayOptions: {
            show: {
              mode: ["load", "retrieve-as-tool"]
            }
          }
        },
        {
          displayName: "Include Metadata",
          name: "includeDocumentMetadata",
          type: "boolean",
          default: true,
          description: "Whether or not to include document metadata",
          displayOptions: {
            show: {
              mode: ["load", "retrieve-as-tool"]
            }
          }
        },
        {
          displayName: "Rerank Results",
          name: "useReranker",
          type: "boolean",
          default: false,
          description: "Whether or not to rerank results",
          displayOptions: {
            show: {
              mode: ["load", "retrieve", "retrieve-as-tool"]
            }
          }
        },
        // ID is always used for update operation
        {
          displayName: "ID",
          name: "id",
          type: "string",
          default: "",
          required: true,
          description: "ID of an embedding entry",
          displayOptions: {
            show: {
              mode: ["update"]
            }
          }
        },
        ...(0, import_utils.transformDescriptionForOperationMode)(args.loadFields ?? [], [
          "load",
          "retrieve-as-tool"
        ]),
        ...(0, import_utils.transformDescriptionForOperationMode)(args.retrieveFields ?? [], "retrieve"),
        ...(0, import_utils.transformDescriptionForOperationMode)(args.updateFields ?? [], "update")
      ]
    };
    this.methods = args.methods;
  }
  /**
   * Method to execute the node in regular workflow mode
   * Supports 'load', 'insert', and 'update' operation modes
   */
  async execute() {
    const mode = this.getNodeParameter("mode", 0);
    const embeddings = await this.getInputConnectionData(
      import_n8n_workflow.NodeConnectionTypes.AiEmbedding,
      0
    );
    if (mode === "load") {
      const items = this.getInputData(0);
      const resultData = [];
      for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
        const docs = await (0, import_operations.handleLoadOperation)(this, args, embeddings, itemIndex);
        resultData.push(...docs);
      }
      return [resultData];
    }
    if (mode === "insert") {
      const resultData = await (0, import_operations.handleInsertOperation)(this, args, embeddings);
      return [resultData];
    }
    if (mode === "update") {
      const resultData = await (0, import_operations.handleUpdateOperation)(this, args, embeddings);
      return [resultData];
    }
    throw new import_n8n_workflow.NodeOperationError(
      this.getNode(),
      'Only the "load", "update" and "insert" operation modes are supported with execute'
    );
  }
  /**
   * Method to supply data to AI nodes
   * Supports 'retrieve' and 'retrieve-as-tool' operation modes
   */
  async supplyData(itemIndex) {
    const mode = this.getNodeParameter("mode", 0);
    const embeddings = await this.getInputConnectionData(
      import_n8n_workflow.NodeConnectionTypes.AiEmbedding,
      0
    );
    if (mode === "retrieve") {
      return await (0, import_operations.handleRetrieveOperation)(this, args, embeddings, itemIndex);
    }
    if (mode === "retrieve-as-tool") {
      return await (0, import_operations.handleRetrieveAsToolOperation)(this, args, embeddings, itemIndex);
    }
    throw new import_n8n_workflow.NodeOperationError(
      this.getNode(),
      'Only the "retrieve" and "retrieve-as-tool" operation mode is supported to supply data'
    );
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createVectorStoreNode
});
//# sourceMappingURL=createVectorStoreNode.js.map