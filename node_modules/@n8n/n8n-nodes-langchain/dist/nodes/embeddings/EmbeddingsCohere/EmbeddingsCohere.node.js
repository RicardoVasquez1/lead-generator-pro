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
var EmbeddingsCohere_node_exports = {};
__export(EmbeddingsCohere_node_exports, {
  EmbeddingsCohere: () => EmbeddingsCohere
});
module.exports = __toCommonJS(EmbeddingsCohere_node_exports);
var import_cohere = require("@langchain/cohere");
var import_n8n_workflow = require("n8n-workflow");
var import_logWrapper = require("../../../utils/logWrapper");
var import_sharedFields = require("../../../utils/sharedFields");
class EmbeddingsCohere {
  constructor() {
    this.description = {
      displayName: "Embeddings Cohere",
      name: "embeddingsCohere",
      icon: { light: "file:cohere.svg", dark: "file:cohere.dark.svg" },
      group: ["transform"],
      version: 1,
      description: "Use Cohere Embeddings",
      defaults: {
        name: "Embeddings Cohere"
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
          AI: ["Embeddings"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.embeddingscohere/"
            }
          ]
        }
      },
      inputs: [],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiEmbedding],
      outputNames: ["Embeddings"],
      properties: [
        (0, import_sharedFields.getConnectionHintNoticeField)([import_n8n_workflow.NodeConnectionTypes.AiVectorStore]),
        {
          displayName: "Each model is using different dimensional density for embeddings. Please make sure to use the same dimensionality for your vector store. The default model is using 768-dimensional embeddings.",
          name: "notice",
          type: "notice",
          default: ""
        },
        {
          displayName: "Model",
          name: "modelName",
          type: "options",
          description: 'The model which will generate the embeddings. <a href="https://docs.cohere.com/docs/models">Learn more</a>.',
          default: "embed-english-v2.0",
          options: [
            {
              name: "Embed-English-Light-v2.0 (1024 Dimensions)",
              value: "embed-english-light-v2.0"
            },
            {
              name: "Embed-English-Light-v3.0 (384 Dimensions)",
              value: "embed-english-light-v3.0"
            },
            {
              name: "Embed-English-v2.0 (4096 Dimensions)",
              value: "embed-english-v2.0"
            },
            {
              name: "Embed-English-v3.0 (1024 Dimensions)",
              value: "embed-english-v3.0"
            },
            {
              name: "Embed-Multilingual-Light-v3.0 (384 Dimensions)",
              value: "embed-multilingual-light-v3.0"
            },
            {
              name: "Embed-Multilingual-v2.0 (768 Dimensions)",
              value: "embed-multilingual-v2.0"
            },
            {
              name: "Embed-Multilingual-v3.0 (1024 Dimensions)",
              value: "embed-multilingual-v3.0"
            }
          ]
        }
      ]
    };
  }
  async supplyData(itemIndex) {
    this.logger.debug("Supply data for embeddings Cohere");
    const modelName = this.getNodeParameter("modelName", itemIndex, "embed-english-v2.0");
    const credentials = await this.getCredentials("cohereApi");
    const embeddings = new import_cohere.CohereEmbeddings({
      apiKey: credentials.apiKey,
      model: modelName
    });
    return {
      response: (0, import_logWrapper.logWrapper)(embeddings, this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EmbeddingsCohere
});
//# sourceMappingURL=EmbeddingsCohere.node.js.map