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
var LmCohere_node_exports = {};
__export(LmCohere_node_exports, {
  LmCohere: () => LmCohere
});
module.exports = __toCommonJS(LmCohere_node_exports);
var import_cohere = require("@langchain/cohere");
var import_n8n_workflow = require("n8n-workflow");
var import_sharedFields = require("../../../utils/sharedFields");
var import_n8nLlmFailedAttemptHandler = require("../n8nLlmFailedAttemptHandler");
var import_N8nLlmTracing = require("../N8nLlmTracing");
class LmCohere {
  constructor() {
    this.description = {
      displayName: "Cohere Model",
      name: "lmCohere",
      icon: { light: "file:cohere.svg", dark: "file:cohere.dark.svg" },
      group: ["transform"],
      version: 1,
      description: "Language Model Cohere",
      defaults: {
        name: "Cohere Model"
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
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmcohere/"
            }
          ]
        }
      },
      inputs: [],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiLanguageModel],
      outputNames: ["Model"],
      credentials: [
        {
          name: "cohereApi",
          required: true
        }
      ],
      properties: [
        (0, import_sharedFields.getConnectionHintNoticeField)([import_n8n_workflow.NodeConnectionTypes.AiChain, import_n8n_workflow.NodeConnectionTypes.AiAgent]),
        {
          displayName: "Options",
          name: "options",
          placeholder: "Add Option",
          description: "Additional options to add",
          type: "collection",
          default: {},
          options: [
            {
              displayName: "Maximum Number of Tokens",
              name: "maxTokens",
              default: 250,
              description: "The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 32,768).",
              type: "number",
              typeOptions: {
                maxValue: 32768
              }
            },
            {
              displayName: "Model",
              name: "model",
              type: "string",
              description: "The name of the model to use",
              default: ""
            },
            {
              displayName: "Sampling Temperature",
              name: "temperature",
              default: 0,
              typeOptions: { maxValue: 1, minValue: 0, numberPrecision: 1 },
              description: "Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive.",
              type: "number"
            }
          ]
        }
      ]
    };
  }
  async supplyData(itemIndex) {
    const credentials = await this.getCredentials("cohereApi");
    const options = this.getNodeParameter("options", itemIndex, {});
    const model = new import_cohere.Cohere({
      apiKey: credentials.apiKey,
      ...options,
      callbacks: [new import_N8nLlmTracing.N8nLlmTracing(this)],
      onFailedAttempt: (0, import_n8nLlmFailedAttemptHandler.makeN8nLlmFailedAttemptHandler)(this)
    });
    return {
      response: model
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LmCohere
});
//# sourceMappingURL=LmCohere.node.js.map