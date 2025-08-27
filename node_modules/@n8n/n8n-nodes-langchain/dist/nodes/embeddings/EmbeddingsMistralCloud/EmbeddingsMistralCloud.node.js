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
var EmbeddingsMistralCloud_node_exports = {};
__export(EmbeddingsMistralCloud_node_exports, {
  EmbeddingsMistralCloud: () => EmbeddingsMistralCloud
});
module.exports = __toCommonJS(EmbeddingsMistralCloud_node_exports);
var import_mistralai = require("@langchain/mistralai");
var import_n8n_workflow = require("n8n-workflow");
var import_logWrapper = require("../../../utils/logWrapper");
var import_sharedFields = require("../../../utils/sharedFields");
class EmbeddingsMistralCloud {
  constructor() {
    this.description = {
      displayName: "Embeddings Mistral Cloud",
      name: "embeddingsMistralCloud",
      icon: "file:mistral.svg",
      credentials: [
        {
          name: "mistralCloudApi",
          required: true
        }
      ],
      group: ["transform"],
      version: 1,
      description: "Use Embeddings Mistral Cloud",
      defaults: {
        name: "Embeddings Mistral Cloud"
      },
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Embeddings"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.embeddingsmistralcloud/"
            }
          ]
        }
      },
      inputs: [],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiEmbedding],
      outputNames: ["Embeddings"],
      requestDefaults: {
        ignoreHttpStatusErrors: true,
        baseURL: "https://api.mistral.ai/v1"
      },
      properties: [
        (0, import_sharedFields.getConnectionHintNoticeField)([import_n8n_workflow.NodeConnectionTypes.AiVectorStore]),
        {
          displayName: "Model",
          name: "model",
          type: "options",
          description: 'The model which will compute the embeddings. <a href="https://docs.mistral.ai/platform/endpoints/">Learn more</a>.',
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
                        pass: "={{ $responseItem.id.includes('embed') }}"
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
          default: "mistral-embed"
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
              displayName: "Batch Size",
              name: "batchSize",
              default: 512,
              typeOptions: { maxValue: 2048 },
              description: "Maximum number of documents to send in each request",
              type: "number"
            },
            {
              displayName: "Strip New Lines",
              name: "stripNewLines",
              default: true,
              description: "Whether to strip new lines from the input text",
              type: "boolean"
            }
          ]
        }
      ]
    };
  }
  async supplyData(itemIndex) {
    const credentials = await this.getCredentials("mistralCloudApi");
    const modelName = this.getNodeParameter("model", itemIndex);
    const options = this.getNodeParameter(
      "options",
      itemIndex,
      {}
    );
    const embeddings = new import_mistralai.MistralAIEmbeddings({
      apiKey: credentials.apiKey,
      model: modelName,
      ...options
    });
    return {
      response: (0, import_logWrapper.logWrapper)(embeddings, this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EmbeddingsMistralCloud
});
//# sourceMappingURL=EmbeddingsMistralCloud.node.js.map