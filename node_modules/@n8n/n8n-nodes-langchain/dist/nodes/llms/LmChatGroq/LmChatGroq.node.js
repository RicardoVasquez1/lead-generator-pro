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
var LmChatGroq_node_exports = {};
__export(LmChatGroq_node_exports, {
  LmChatGroq: () => LmChatGroq
});
module.exports = __toCommonJS(LmChatGroq_node_exports);
var import_groq = require("@langchain/groq");
var import_n8n_workflow = require("n8n-workflow");
var import_httpProxyAgent = require("../../../utils/httpProxyAgent");
var import_sharedFields = require("../../../utils/sharedFields");
var import_n8nLlmFailedAttemptHandler = require("../n8nLlmFailedAttemptHandler");
var import_N8nLlmTracing = require("../N8nLlmTracing");
class LmChatGroq {
  constructor() {
    this.description = {
      displayName: "Groq Chat Model",
      name: "lmChatGroq",
      icon: "file:groq.svg",
      group: ["transform"],
      version: 1,
      description: "Language Model Groq",
      defaults: {
        name: "Groq Chat Model"
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
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmchatgroq/"
            }
          ]
        }
      },
      inputs: [],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiLanguageModel],
      outputNames: ["Model"],
      credentials: [
        {
          name: "groqApi",
          required: true
        }
      ],
      requestDefaults: {
        baseURL: "https://api.groq.com/openai/v1"
      },
      properties: [
        (0, import_sharedFields.getConnectionHintNoticeField)([import_n8n_workflow.NodeConnectionTypes.AiChain, import_n8n_workflow.NodeConnectionTypes.AiChain]),
        {
          displayName: "Model",
          name: "model",
          type: "options",
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
                        pass: '={{ $responseItem.active === true && $responseItem.object === "model" }}'
                      }
                    },
                    {
                      type: "setKeyValue",
                      properties: {
                        name: "={{$responseItem.id}}",
                        value: "={{$responseItem.id}}"
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
          description: 'The model which will generate the completion. <a href="https://console.groq.com/docs/models">Learn more</a>.',
          default: "llama3-8b-8192"
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
              name: "maxTokensToSample",
              default: 4096,
              description: "The maximum number of tokens to generate in the completion",
              type: "number"
            },
            {
              displayName: "Sampling Temperature",
              name: "temperature",
              default: 0.7,
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
    const credentials = await this.getCredentials("groqApi");
    const modelName = this.getNodeParameter("model", itemIndex);
    const options = this.getNodeParameter("options", itemIndex, {});
    const model = new import_groq.ChatGroq({
      apiKey: credentials.apiKey,
      model: modelName,
      maxTokens: options.maxTokensToSample,
      temperature: options.temperature,
      callbacks: [new import_N8nLlmTracing.N8nLlmTracing(this)],
      httpAgent: (0, import_httpProxyAgent.getProxyAgent)("https://api.groq.com/openai/v1"),
      onFailedAttempt: (0, import_n8nLlmFailedAttemptHandler.makeN8nLlmFailedAttemptHandler)(this)
    });
    return {
      response: model
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LmChatGroq
});
//# sourceMappingURL=LmChatGroq.node.js.map