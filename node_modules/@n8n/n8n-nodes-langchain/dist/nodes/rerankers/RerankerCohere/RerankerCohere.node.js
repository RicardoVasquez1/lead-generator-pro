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
var RerankerCohere_node_exports = {};
__export(RerankerCohere_node_exports, {
  RerankerCohere: () => RerankerCohere
});
module.exports = __toCommonJS(RerankerCohere_node_exports);
var import_cohere = require("@langchain/cohere");
var import_n8n_workflow = require("n8n-workflow");
var import_logWrapper = require("../../../utils/logWrapper");
class RerankerCohere {
  constructor() {
    this.description = {
      displayName: "Reranker Cohere",
      name: "rerankerCohere",
      icon: { light: "file:cohere.svg", dark: "file:cohere.dark.svg" },
      group: ["transform"],
      version: 1,
      description: "Use Cohere Reranker to reorder documents after retrieval from a vector store by relevance to the given query.",
      defaults: {
        name: "Reranker Cohere"
      },
      requestDefaults: {
        ignoreHttpStatusErrors: true,
        baseURL: "={{ $credentials.host }}"
      },
      credentials: [
        {
          name: "cohereApi",
          required: true
        }
      ],
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Rerankers"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.rerankercohere/"
            }
          ]
        }
      },
      inputs: [],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiReranker],
      outputNames: ["Reranker"],
      properties: [
        {
          displayName: "Model",
          name: "modelName",
          type: "options",
          description: 'The model that should be used to rerank the documents. <a href="https://docs.cohere.com/docs/models">Learn more</a>.',
          default: "rerank-v3.5",
          options: [
            {
              name: "rerank-v3.5",
              value: "rerank-v3.5"
            },
            {
              name: "rerank-english-v3.0",
              value: "rerank-english-v3.0"
            },
            {
              name: "rerank-multilingual-v3.0",
              value: "rerank-multilingual-v3.0"
            }
          ]
        },
        {
          displayName: "Top N",
          name: "topN",
          type: "number",
          description: "The maximum number of documents to return after reranking",
          default: 3
        }
      ]
    };
  }
  async supplyData(itemIndex) {
    this.logger.debug("Supply data for reranking Cohere");
    const modelName = this.getNodeParameter("modelName", itemIndex, "rerank-v3.5");
    const topN = this.getNodeParameter("topN", itemIndex, 3);
    const credentials = await this.getCredentials("cohereApi");
    const reranker = new import_cohere.CohereRerank({
      apiKey: credentials.apiKey,
      model: modelName,
      topN
    });
    return {
      response: (0, import_logWrapper.logWrapper)(reranker, this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RerankerCohere
});
//# sourceMappingURL=RerankerCohere.node.js.map