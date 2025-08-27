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
var EmbeddingsOllama_node_exports = {};
__export(EmbeddingsOllama_node_exports, {
  EmbeddingsOllama: () => EmbeddingsOllama
});
module.exports = __toCommonJS(EmbeddingsOllama_node_exports);
var import_ollama = require("@langchain/ollama");
var import_n8n_workflow = require("n8n-workflow");
var import_logWrapper = require("../../../utils/logWrapper");
var import_sharedFields = require("../../../utils/sharedFields");
var import_description = require("../../llms/LMOllama/description");
class EmbeddingsOllama {
  constructor() {
    this.description = {
      displayName: "Embeddings Ollama",
      name: "embeddingsOllama",
      icon: "file:ollama.svg",
      group: ["transform"],
      version: 1,
      description: "Use Ollama Embeddings",
      defaults: {
        name: "Embeddings Ollama"
      },
      ...import_description.ollamaDescription,
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Embeddings"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.embeddingsollama/"
            }
          ]
        }
      },
      inputs: [],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiEmbedding],
      outputNames: ["Embeddings"],
      properties: [(0, import_sharedFields.getConnectionHintNoticeField)([import_n8n_workflow.NodeConnectionTypes.AiVectorStore]), import_description.ollamaModel]
    };
  }
  async supplyData(itemIndex) {
    this.logger.debug("Supply data for embeddings Ollama");
    const modelName = this.getNodeParameter("model", itemIndex);
    const credentials = await this.getCredentials("ollamaApi");
    const headers = credentials.apiKey ? {
      Authorization: `Bearer ${credentials.apiKey}`
    } : void 0;
    const embeddings = new import_ollama.OllamaEmbeddings({
      baseUrl: credentials.baseUrl,
      model: modelName,
      headers
    });
    return {
      response: (0, import_logWrapper.logWrapper)(embeddings, this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EmbeddingsOllama
});
//# sourceMappingURL=EmbeddingsOllama.node.js.map