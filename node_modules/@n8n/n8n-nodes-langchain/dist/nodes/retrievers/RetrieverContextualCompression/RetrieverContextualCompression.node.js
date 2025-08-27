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
var RetrieverContextualCompression_node_exports = {};
__export(RetrieverContextualCompression_node_exports, {
  RetrieverContextualCompression: () => RetrieverContextualCompression
});
module.exports = __toCommonJS(RetrieverContextualCompression_node_exports);
var import_contextual_compression = require("langchain/retrievers/contextual_compression");
var import_chain_extract = require("langchain/retrievers/document_compressors/chain_extract");
var import_n8n_workflow = require("n8n-workflow");
var import_logWrapper = require("../../../utils/logWrapper");
class RetrieverContextualCompression {
  constructor() {
    this.description = {
      displayName: "Contextual Compression Retriever",
      name: "retrieverContextualCompression",
      icon: "fa:box-open",
      iconColor: "black",
      group: ["transform"],
      version: 1,
      description: "Enhances document similarity search by contextual compression.",
      defaults: {
        name: "Contextual Compression Retriever"
      },
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Retrievers"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.retrievercontextualcompression/"
            }
          ]
        }
      },
      inputs: [
        {
          displayName: "Model",
          maxConnections: 1,
          type: import_n8n_workflow.NodeConnectionTypes.AiLanguageModel,
          required: true
        },
        {
          displayName: "Retriever",
          maxConnections: 1,
          type: import_n8n_workflow.NodeConnectionTypes.AiRetriever,
          required: true
        }
      ],
      outputs: [
        {
          displayName: "Retriever",
          maxConnections: 1,
          type: import_n8n_workflow.NodeConnectionTypes.AiRetriever
        }
      ],
      properties: []
    };
  }
  async supplyData(itemIndex) {
    this.logger.debug("Supplying data for Contextual Compression Retriever");
    const model = await this.getInputConnectionData(
      import_n8n_workflow.NodeConnectionTypes.AiLanguageModel,
      itemIndex
    );
    const baseRetriever = await this.getInputConnectionData(
      import_n8n_workflow.NodeConnectionTypes.AiRetriever,
      itemIndex
    );
    const baseCompressor = import_chain_extract.LLMChainExtractor.fromLLM(model);
    const retriever = new import_contextual_compression.ContextualCompressionRetriever({
      baseCompressor,
      baseRetriever
    });
    return {
      response: (0, import_logWrapper.logWrapper)(retriever, this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RetrieverContextualCompression
});
//# sourceMappingURL=RetrieverContextualCompression.node.js.map