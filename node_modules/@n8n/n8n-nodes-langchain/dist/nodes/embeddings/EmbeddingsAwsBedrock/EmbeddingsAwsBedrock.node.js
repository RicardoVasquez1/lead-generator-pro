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
var EmbeddingsAwsBedrock_node_exports = {};
__export(EmbeddingsAwsBedrock_node_exports, {
  EmbeddingsAwsBedrock: () => EmbeddingsAwsBedrock
});
module.exports = __toCommonJS(EmbeddingsAwsBedrock_node_exports);
var import_aws = require("@langchain/aws");
var import_n8n_workflow = require("n8n-workflow");
var import_logWrapper = require("../../../utils/logWrapper");
var import_sharedFields = require("../../../utils/sharedFields");
class EmbeddingsAwsBedrock {
  constructor() {
    this.description = {
      displayName: "Embeddings AWS Bedrock",
      name: "embeddingsAwsBedrock",
      icon: "file:bedrock.svg",
      credentials: [
        {
          name: "aws",
          required: true
        }
      ],
      group: ["transform"],
      version: 1,
      description: "Use Embeddings AWS Bedrock",
      defaults: {
        name: "Embeddings AWS Bedrock"
      },
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Embeddings"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.embeddingsawsbedrock/"
            }
          ]
        }
      },
      inputs: [],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiEmbedding],
      outputNames: ["Embeddings"],
      requestDefaults: {
        ignoreHttpStatusErrors: true,
        baseURL: '=https://bedrock.{{$credentials?.region ?? "eu-central-1"}}.amazonaws.com'
      },
      properties: [
        (0, import_sharedFields.getConnectionHintNoticeField)([import_n8n_workflow.NodeConnectionTypes.AiVectorStore]),
        {
          displayName: "Model",
          name: "model",
          type: "options",
          description: 'The model which will generate the completion. <a href="https://docs.aws.amazon.com/bedrock/latest/userguide/foundation-models.html">Learn more</a>.',
          typeOptions: {
            loadOptions: {
              routing: {
                request: {
                  method: "GET",
                  url: "/foundation-models?byInferenceType=ON_DEMAND&byOutputModality=EMBEDDING"
                },
                output: {
                  postReceive: [
                    {
                      type: "rootProperty",
                      properties: {
                        property: "modelSummaries"
                      }
                    },
                    {
                      type: "setKeyValue",
                      properties: {
                        name: "={{$responseItem.modelName}}",
                        description: "={{$responseItem.modelArn}}",
                        value: "={{$responseItem.modelId}}"
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
          default: ""
        }
      ]
    };
  }
  async supplyData(itemIndex) {
    const credentials = await this.getCredentials("aws");
    const modelName = this.getNodeParameter("model", itemIndex);
    const embeddings = new import_aws.BedrockEmbeddings({
      region: credentials.region,
      model: modelName,
      maxRetries: 3,
      credentials: {
        secretAccessKey: credentials.secretAccessKey,
        accessKeyId: credentials.accessKeyId,
        sessionToken: credentials.sessionToken
      }
    });
    return {
      response: (0, import_logWrapper.logWrapper)(embeddings, this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EmbeddingsAwsBedrock
});
//# sourceMappingURL=EmbeddingsAwsBedrock.node.js.map