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
var LmChatCohere_node_exports = {};
__export(LmChatCohere_node_exports, {
  LmChatCohere: () => LmChatCohere,
  tokensUsageParser: () => tokensUsageParser
});
module.exports = __toCommonJS(LmChatCohere_node_exports);
var import_cohere = require("@langchain/cohere");
var import_sharedFields = require("../../../utils/sharedFields");
var import_n8nLlmFailedAttemptHandler = require("../n8nLlmFailedAttemptHandler");
var import_N8nLlmTracing = require("../N8nLlmTracing");
function tokensUsageParser(result) {
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  result.generations?.forEach((generationArray) => {
    generationArray.forEach((gen) => {
      const inputTokens = gen.generationInfo?.meta?.tokens?.inputTokens ?? 0;
      const outputTokens = gen.generationInfo?.meta?.tokens?.outputTokens ?? 0;
      totalInputTokens += inputTokens;
      totalOutputTokens += outputTokens;
    });
  });
  return {
    completionTokens: totalOutputTokens,
    promptTokens: totalInputTokens,
    totalTokens: totalInputTokens + totalOutputTokens
  };
}
class LmChatCohere {
  constructor() {
    this.description = {
      displayName: "Cohere Chat Model",
      name: "lmChatCohere",
      icon: { light: "file:cohere.svg", dark: "file:cohere.dark.svg" },
      group: ["transform"],
      version: [1],
      description: "For advanced usage with an AI chain",
      defaults: {
        name: "Cohere Chat Model"
      },
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Language Models", "Root Nodes"],
          "Language Models": ["Chat Models (Recommended)"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmchatcohere/"
            }
          ]
        }
      },
      inputs: [],
      outputs: ["ai_languageModel"],
      outputNames: ["Model"],
      credentials: [
        {
          name: "cohereApi",
          required: true
        }
      ],
      requestDefaults: {
        baseURL: "={{$credentials?.url}}",
        headers: {
          accept: "application/json",
          authorization: "=Bearer {{$credentials?.apiKey}}"
        }
      },
      properties: [
        (0, import_sharedFields.getConnectionHintNoticeField)(["ai_chain", "ai_agent"]),
        {
          displayName: "Model",
          name: "model",
          type: "options",
          description: 'The model which will generate the completion. <a href="https://docs.cohere.com/docs/models">Learn more</a>.',
          typeOptions: {
            loadOptions: {
              routing: {
                request: {
                  method: "GET",
                  url: "/v1/models?page_size=100&endpoint=chat"
                },
                output: {
                  postReceive: [
                    {
                      type: "rootProperty",
                      properties: {
                        property: "models"
                      }
                    },
                    {
                      type: "setKeyValue",
                      properties: {
                        name: "={{$responseItem.name}}",
                        value: "={{$responseItem.name}}",
                        description: "={{$responseItem.description}}"
                      }
                    },
                    {
                      type: "sort",
                      properties: {
                        key: "name"
                      }
                    }
                  ]
                }
              }
            }
          },
          default: "command-a-03-2025"
        },
        {
          displayName: "Options",
          name: "options",
          placeholder: "Add Option",
          description: "Additional options to add",
          type: "collection",
          default: {},
          options: [
            {
              displayName: "Sampling Temperature",
              name: "temperature",
              default: 0.7,
              typeOptions: { maxValue: 2, minValue: 0, numberPrecision: 1 },
              description: "Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive.",
              type: "number"
            },
            {
              displayName: "Max Retries",
              name: "maxRetries",
              default: 2,
              description: "Maximum number of retries to attempt",
              type: "number"
            }
          ]
        }
      ]
    };
  }
  async supplyData(itemIndex) {
    const credentials = await this.getCredentials("cohereApi");
    const modelName = this.getNodeParameter("model", itemIndex);
    const options = this.getNodeParameter("options", itemIndex, {});
    const model = new import_cohere.ChatCohere({
      apiKey: credentials.apiKey,
      model: modelName,
      temperature: options.temperature,
      maxRetries: options.maxRetries ?? 2,
      callbacks: [new import_N8nLlmTracing.N8nLlmTracing(this, { tokensUsageParser })],
      onFailedAttempt: (0, import_n8nLlmFailedAttemptHandler.makeN8nLlmFailedAttemptHandler)(this)
    });
    return {
      response: model
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LmChatCohere,
  tokensUsageParser
});
//# sourceMappingURL=LmChatCohere.node.js.map