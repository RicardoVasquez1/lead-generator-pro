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
var VectorStoreInMemoryLoad_node_exports = {};
__export(VectorStoreInMemoryLoad_node_exports, {
  VectorStoreInMemoryLoad: () => VectorStoreInMemoryLoad
});
module.exports = __toCommonJS(VectorStoreInMemoryLoad_node_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_logWrapper = require("../../../utils/logWrapper");
var import_MemoryVectorStoreManager = require("../shared/MemoryManager/MemoryVectorStoreManager");
class VectorStoreInMemoryLoad {
  constructor() {
    this.description = {
      displayName: "In Memory Vector Store Load",
      name: "vectorStoreInMemoryLoad",
      icon: "fa:database",
      group: ["transform"],
      version: 1,
      hidden: true,
      description: "Load embedded data from an in-memory vector store",
      defaults: {
        name: "In Memory Vector Store Load"
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
        {
          displayName: "Embedding",
          maxConnections: 1,
          type: import_n8n_workflow.NodeConnectionTypes.AiEmbedding,
          required: true
        }
      ],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiVectorStore],
      outputNames: ["Vector Store"],
      properties: [
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
  async supplyData(itemIndex) {
    const embeddings = await this.getInputConnectionData(
      import_n8n_workflow.NodeConnectionTypes.AiEmbedding,
      itemIndex
    );
    const workflowId = this.getWorkflow().id;
    const memoryKey = this.getNodeParameter("memoryKey", 0);
    const vectorStoreSingleton = import_MemoryVectorStoreManager.MemoryVectorStoreManager.getInstance(embeddings, this.logger);
    const vectorStoreInstance = await vectorStoreSingleton.getVectorStore(
      `${workflowId}__${memoryKey}`
    );
    return {
      response: (0, import_logWrapper.logWrapper)(vectorStoreInstance, this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VectorStoreInMemoryLoad
});
//# sourceMappingURL=VectorStoreInMemoryLoad.node.js.map