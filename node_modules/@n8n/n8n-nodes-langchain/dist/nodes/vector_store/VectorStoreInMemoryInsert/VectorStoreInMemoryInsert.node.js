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
var VectorStoreInMemoryInsert_node_exports = {};
__export(VectorStoreInMemoryInsert_node_exports, {
  VectorStoreInMemoryInsert: () => VectorStoreInMemoryInsert
});
module.exports = __toCommonJS(VectorStoreInMemoryInsert_node_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_MemoryVectorStoreManager = require("../shared/MemoryManager/MemoryVectorStoreManager");
var import_processDocuments = require("../shared/processDocuments");
class VectorStoreInMemoryInsert {
  constructor() {
    this.description = {
      displayName: "In Memory Vector Store Insert",
      name: "vectorStoreInMemoryInsert",
      icon: "fa:database",
      group: ["transform"],
      version: 1,
      hidden: true,
      description: "Insert data into an in-memory vector store",
      defaults: {
        name: "In Memory Vector Store Insert"
      },
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Vector Stores"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.vectorstoreinmemory/"
            }
          ]
        }
      },
      inputs: [
        import_n8n_workflow.NodeConnectionTypes.Main,
        {
          displayName: "Document",
          maxConnections: 1,
          type: import_n8n_workflow.NodeConnectionTypes.AiDocument,
          required: true
        },
        {
          displayName: "Embedding",
          maxConnections: 1,
          type: import_n8n_workflow.NodeConnectionTypes.AiEmbedding,
          required: true
        }
      ],
      outputs: [import_n8n_workflow.NodeConnectionTypes.Main],
      properties: [
        {
          displayName: "The embbded data are stored in the server memory, so they will be lost when the server is restarted. Additionally, if the amount of data is too large, it may cause the server to crash due to insufficient memory.",
          name: "notice",
          type: "notice",
          default: ""
        },
        {
          displayName: "Clear Store",
          name: "clearStore",
          type: "boolean",
          default: false,
          description: "Whether to clear the store before inserting new data"
        },
        {
          displayName: "Memory Key",
          name: "memoryKey",
          type: "string",
          default: "vector_store_key",
          description: "The key to use to store the vector memory in the workflow data. The key will be prefixed with the workflow ID to avoid collisions."
        }
      ]
    };
  }
  async execute() {
    const items = this.getInputData(0);
    const embeddings = await this.getInputConnectionData(
      import_n8n_workflow.NodeConnectionTypes.AiEmbedding,
      0
    );
    const memoryKey = this.getNodeParameter("memoryKey", 0);
    const clearStore = this.getNodeParameter("clearStore", 0);
    const documentInput = await this.getInputConnectionData(import_n8n_workflow.NodeConnectionTypes.AiDocument, 0);
    const { processedDocuments, serializedDocuments } = await (0, import_processDocuments.processDocuments)(
      documentInput,
      items
    );
    const workflowId = this.getWorkflow().id;
    const vectorStoreInstance = import_MemoryVectorStoreManager.MemoryVectorStoreManager.getInstance(embeddings, this.logger);
    await vectorStoreInstance.addDocuments(
      `${workflowId}__${memoryKey}`,
      processedDocuments,
      clearStore
    );
    return [serializedDocuments];
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VectorStoreInMemoryInsert
});
//# sourceMappingURL=VectorStoreInMemoryInsert.node.js.map