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
var EmbeddingsGoogleGemini_node_exports = {};
__export(EmbeddingsGoogleGemini_node_exports, {
  EmbeddingsGoogleGemini: () => EmbeddingsGoogleGemini
});
module.exports = __toCommonJS(EmbeddingsGoogleGemini_node_exports);
var import_google_genai = require("@langchain/google-genai");
var import_n8n_workflow = require("n8n-workflow");
var import_logWrapper = require("../../../utils/logWrapper");
var import_sharedFields = require("../../../utils/sharedFields");
class EmbeddingsGoogleGemini {
  constructor() {
    this.description = {
      displayName: "Embeddings Google Gemini",
      name: "embeddingsGoogleGemini",
      icon: "file:google.svg",
      group: ["transform"],
      version: 1,
      description: "Use Google Gemini Embeddings",
      defaults: {
        name: "Embeddings Google Gemini"
      },
      requestDefaults: {
        ignoreHttpStatusErrors: true,
        baseURL: "={{ $credentials.host }}"
      },
      credentials: [
        {
          name: "googlePalmApi",
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
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.embeddingsgooglegemini/"
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
          description: 'The model which will generate the embeddings. <a href="https://developers.generativeai.google/api/rest/generativelanguage/models/list">Learn more</a>.',
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
                        pass: "={{ $responseItem.name.includes('embedding') }}"
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
          default: "models/text-embedding-004"
        }
      ]
    };
  }
  async supplyData(itemIndex) {
    this.logger.debug("Supply data for embeddings Google Gemini");
    const modelName = this.getNodeParameter(
      "modelName",
      itemIndex,
      "models/text-embedding-004"
    );
    const credentials = await this.getCredentials("googlePalmApi");
    const embeddings = new import_google_genai.GoogleGenerativeAIEmbeddings({
      apiKey: credentials.apiKey,
      baseUrl: credentials.host,
      model: modelName
    });
    return {
      response: (0, import_logWrapper.logWrapper)(embeddings, this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EmbeddingsGoogleGemini
});
//# sourceMappingURL=EmbeddingsGoogleGemini.node.js.map