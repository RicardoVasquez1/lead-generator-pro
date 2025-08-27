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
var LmOllama_node_exports = {};
__export(LmOllama_node_exports, {
  LmOllama: () => LmOllama
});
module.exports = __toCommonJS(LmOllama_node_exports);
var import_ollama = require("@langchain/community/llms/ollama");
var import_n8n_workflow = require("n8n-workflow");
var import_sharedFields = require("../../../utils/sharedFields");
var import_description = require("./description");
var import_n8nLlmFailedAttemptHandler = require("../n8nLlmFailedAttemptHandler");
var import_N8nLlmTracing = require("../N8nLlmTracing");
class LmOllama {
  constructor() {
    this.description = {
      displayName: "Ollama Model",
      name: "lmOllama",
      icon: "file:ollama.svg",
      group: ["transform"],
      version: 1,
      description: "Language Model Ollama",
      defaults: {
        name: "Ollama Model"
      },
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Language Models", "Root Nodes"],
          "Language Models": ["Text Completion Models"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmollama/"
            }
          ]
        }
      },
      inputs: [],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiLanguageModel],
      outputNames: ["Model"],
      ...import_description.ollamaDescription,
      properties: [
        (0, import_sharedFields.getConnectionHintNoticeField)([import_n8n_workflow.NodeConnectionTypes.AiChain, import_n8n_workflow.NodeConnectionTypes.AiAgent]),
        import_description.ollamaModel,
        import_description.ollamaOptions
      ]
    };
  }
  async supplyData(itemIndex) {
    const credentials = await this.getCredentials("ollamaApi");
    const modelName = this.getNodeParameter("model", itemIndex);
    const options = this.getNodeParameter("options", itemIndex, {});
    const headers = credentials.apiKey ? {
      Authorization: `Bearer ${credentials.apiKey}`
    } : void 0;
    const model = new import_ollama.Ollama({
      baseUrl: credentials.baseUrl,
      model: modelName,
      ...options,
      callbacks: [new import_N8nLlmTracing.N8nLlmTracing(this)],
      onFailedAttempt: (0, import_n8nLlmFailedAttemptHandler.makeN8nLlmFailedAttemptHandler)(this),
      headers
    });
    return {
      response: model
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LmOllama
});
//# sourceMappingURL=LmOllama.node.js.map