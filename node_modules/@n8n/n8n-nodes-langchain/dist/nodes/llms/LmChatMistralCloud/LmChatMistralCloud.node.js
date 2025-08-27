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
var LmChatMistralCloud_node_exports = {};
__export(LmChatMistralCloud_node_exports, {
  LmChatMistralCloud: () => LmChatMistralCloud
});
module.exports = __toCommonJS(LmChatMistralCloud_node_exports);
var import_mistralai = require("@langchain/mistralai");
var import_n8n_workflow = require("n8n-workflow");
var import_sharedFields = require("../../../utils/sharedFields");
var import_n8nLlmFailedAttemptHandler = require("../n8nLlmFailedAttemptHandler");
var import_N8nLlmTracing = require("../N8nLlmTracing");
class LmChatMistralCloud {
  constructor() {
    this.description = {
      displayName: "Mistral Cloud Chat Model",
      name: "lmChatMistralCloud",
      icon: "file:mistral.svg",
      group: ["transform"],
      version: 1,
      description: "For advanced usage with an AI chain",
      defaults: {
        name: "Mistral Cloud Chat Model"
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
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmchatmistralcloud/"
            }
          ]
        }
      },
      inputs: [],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiLanguageModel],
      outputNames: ["Model"],
      credentials: [
        {
          name: "mistralCloudApi",
          required: true
        }
      ],
      requestDefaults: {
        ignoreHttpStatusErrors: true,
        baseURL: "https://api.mistral.ai/v1"
      },
      properties: [
        (0, import_sharedFields.getConnectionHintNoticeField)([import_n8n_workflow.NodeConnectionTypes.AiChain, import_n8n_workflow.NodeConnectionTypes.AiAgent]),
        {
          displayName: "Model",
          name: "model",
          type: "options",
          description: 'The model which will generate the completion. <a href="https://docs.mistral.ai/platform/endpoints/">Learn more</a>.',
          typeOptions: {
            loadOptions: {
              routing: {
                request: {
                  method: "GET",
                  url: "/models"
                },
                output: {
                  postReceive: [
                    {
                      type: "rootProperty",
                      properties: {
                        property: "data"
                      }
                    },
                    {
                      type: "filter",
                      properties: {
                        pass: "={{ !$responseItem.id.includes('embed') }}"
                      }
                    },
                    {
                      type: "setKeyValue",
                      properties: {
                        name: "={{ $responseItem.id }}",
                        value: "={{ $responseItem.id }}"
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
          routing: {
            send: {
              type: "body",
              property: "model"
            }
          },
          default: "mistral-small"
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
              displayName: "Maximum Number of Tokens",
              name: "maxTokens",
              default: -1,
              description: "The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 32,768).",
              type: "number",
              typeOptions: {
                maxValue: 32768
              }
            },
            {
              displayName: "Sampling Temperature",
              name: "temperature",
              default: 0.7,
              typeOptions: { maxValue: 1, minValue: 0, numberPrecision: 1 },
              description: "Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive.",
              type: "number"
            },
            {
              displayName: "Max Retries",
              name: "maxRetries",
              default: 2,
              description: "Maximum number of retries to attempt",
              type: "number"
            },
            {
              displayName: "Top P",
              name: "topP",
              default: 1,
              typeOptions: { maxValue: 1, minValue: 0, numberPrecision: 1 },
              description: "Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered. We generally recommend altering this or temperature but not both.",
              type: "number"
            },
            {
              displayName: "Enable Safe Mode",
              name: "safeMode",
              default: false,
              type: "boolean",
              description: "Whether to inject a safety prompt before all conversations"
            },
            {
              displayName: "Random Seed",
              name: "randomSeed",
              default: void 0,
              type: "number",
              description: "The seed to use for random sampling. If set, different calls will generate deterministic results."
            }
          ]
        }
      ]
    };
  }
  async supplyData(itemIndex) {
    const credentials = await this.getCredentials("mistralCloudApi");
    const modelName = this.getNodeParameter("model", itemIndex);
    const options = this.getNodeParameter("options", itemIndex, {
      maxRetries: 2,
      topP: 1,
      temperature: 0.7,
      maxTokens: -1,
      safeMode: false,
      randomSeed: void 0
    });
    const model = new import_mistralai.ChatMistralAI({
      apiKey: credentials.apiKey,
      model: modelName,
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
  LmChatMistralCloud
});
//# sourceMappingURL=LmChatMistralCloud.node.js.map