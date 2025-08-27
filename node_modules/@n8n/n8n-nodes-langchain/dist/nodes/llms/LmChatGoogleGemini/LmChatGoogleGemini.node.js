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
var LmChatGoogleGemini_node_exports = {};
__export(LmChatGoogleGemini_node_exports, {
  LmChatGoogleGemini: () => LmChatGoogleGemini
});
module.exports = __toCommonJS(LmChatGoogleGemini_node_exports);
var import_google_genai = require("@langchain/google-genai");
var import_n8n_workflow = require("n8n-workflow");
var import_sharedFields = require("../../../utils/sharedFields");
var import_additional_options = require("../gemini-common/additional-options");
var import_n8nLlmFailedAttemptHandler = require("../n8nLlmFailedAttemptHandler");
var import_N8nLlmTracing = require("../N8nLlmTracing");
function errorDescriptionMapper(error) {
  if (error.description?.includes("properties: should be non-empty for OBJECT type")) {
    return 'Google Gemini requires at least one <a href="https://docs.n8n.io/advanced-ai/examples/using-the-fromai-function/" target="_blank">dynamic parameter</a> when using tools';
  }
  return error.description ?? "Unknown error";
}
class LmChatGoogleGemini {
  constructor() {
    this.description = {
      displayName: "Google Gemini Chat Model",
      name: "lmChatGoogleGemini",
      icon: "file:google.svg",
      group: ["transform"],
      version: 1,
      description: "Chat Model Google Gemini",
      defaults: {
        name: "Google Gemini Chat Model"
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
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmchatgooglegemini/"
            }
          ]
        }
      },
      inputs: [],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiLanguageModel],
      outputNames: ["Model"],
      credentials: [
        {
          name: "googlePalmApi",
          required: true
        }
      ],
      requestDefaults: {
        ignoreHttpStatusErrors: true,
        baseURL: "={{ $credentials.host }}"
      },
      properties: [
        (0, import_sharedFields.getConnectionHintNoticeField)([import_n8n_workflow.NodeConnectionTypes.AiChain, import_n8n_workflow.NodeConnectionTypes.AiAgent]),
        {
          displayName: "Model",
          name: "modelName",
          type: "options",
          description: 'The model which will generate the completion. <a href="https://developers.generativeai.google/api/rest/generativelanguage/models/list">Learn more</a>.',
          typeOptions: {
            loadOptions: {
              routing: {
                request: {
                  method: "GET",
                  url: "/v1beta/models"
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
                      type: "filter",
                      properties: {
                        pass: "={{ !$responseItem.name.includes('embedding') }}"
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
          routing: {
            send: {
              type: "body",
              property: "model"
            }
          },
          default: "models/gemini-2.5-flash"
        },
        import_additional_options.additionalOptions
      ]
    };
  }
  async supplyData(itemIndex) {
    const credentials = await this.getCredentials("googlePalmApi");
    const modelName = this.getNodeParameter("modelName", itemIndex);
    const options = this.getNodeParameter("options", itemIndex, {
      maxOutputTokens: 1024,
      temperature: 0.7,
      topK: 40,
      topP: 0.9
    });
    const safetySettings = this.getNodeParameter(
      "options.safetySettings.values",
      itemIndex,
      null
    );
    const model = new import_google_genai.ChatGoogleGenerativeAI({
      apiKey: credentials.apiKey,
      baseUrl: credentials.host,
      model: modelName,
      topK: options.topK,
      topP: options.topP,
      temperature: options.temperature,
      maxOutputTokens: options.maxOutputTokens,
      safetySettings,
      callbacks: [new import_N8nLlmTracing.N8nLlmTracing(this, { errorDescriptionMapper })],
      onFailedAttempt: (0, import_n8nLlmFailedAttemptHandler.makeN8nLlmFailedAttemptHandler)(this)
    });
    return {
      response: model
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LmChatGoogleGemini
});
//# sourceMappingURL=LmChatGoogleGemini.node.js.map