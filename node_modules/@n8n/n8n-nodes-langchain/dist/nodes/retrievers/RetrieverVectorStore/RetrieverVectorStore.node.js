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
var RetrieverVectorStore_node_exports = {};
__export(RetrieverVectorStore_node_exports, {
  RetrieverVectorStore: () => RetrieverVectorStore
});
module.exports = __toCommonJS(RetrieverVectorStore_node_exports);
var import_vectorstores = require("@langchain/core/vectorstores");
var import_contextual_compression = require("langchain/retrievers/contextual_compression");
var import_n8n_workflow = require("n8n-workflow");
var import_logWrapper = require("../../../utils/logWrapper");
class RetrieverVectorStore {
  constructor() {
    this.description = {
      displayName: "Vector Store Retriever",
      name: "retrieverVectorStore",
      icon: "fa:box-open",
      iconColor: "black",
      group: ["transform"],
      version: 1,
      description: "Use a Vector Store as Retriever",
      defaults: {
        name: "Vector Store Retriever"
      },
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Retrievers"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.retrievervectorstore/"
            }
          ]
        }
      },
      inputs: [
        {
          displayName: "Vector Store",
          maxConnections: 1,
          type: import_n8n_workflow.NodeConnectionTypes.AiVectorStore,
          required: true
        }
      ],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiRetriever],
      outputNames: ["Retriever"],
      properties: [
        {
          displayName: "Limit",
          name: "topK",
          type: "number",
          default: 4,
          description: "The maximum number of results to return"
        }
      ]
    };
  }
  async supplyData(itemIndex) {
    this.logger.debug("Supplying data for Vector Store Retriever");
    const topK = this.getNodeParameter("topK", itemIndex, 4);
    const vectorStore = await this.getInputConnectionData(
      import_n8n_workflow.NodeConnectionTypes.AiVectorStore,
      itemIndex
    );
    let retriever = null;
    if (vectorStore instanceof import_vectorstores.VectorStore) {
      retriever = vectorStore.asRetriever(topK);
    } else {
      retriever = new import_contextual_compression.ContextualCompressionRetriever({
        baseCompressor: vectorStore.reranker,
        baseRetriever: vectorStore.vectorStore.asRetriever(topK)
      });
    }
    return {
      response: (0, import_logWrapper.logWrapper)(retriever, this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RetrieverVectorStore
});
//# sourceMappingURL=RetrieverVectorStore.node.js.map