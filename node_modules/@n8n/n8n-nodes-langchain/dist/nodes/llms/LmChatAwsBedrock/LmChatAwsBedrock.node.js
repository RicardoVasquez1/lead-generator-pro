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
var LmChatAwsBedrock_node_exports = {};
__export(LmChatAwsBedrock_node_exports, {
  LmChatAwsBedrock: () => LmChatAwsBedrock
});
module.exports = __toCommonJS(LmChatAwsBedrock_node_exports);
var import_aws = require("@langchain/aws");
var import_n8n_workflow = require("n8n-workflow");
var import_httpProxyAgent = require("../../../utils/httpProxyAgent");
var import_sharedFields = require("../../../utils/sharedFields");
var import_n8nLlmFailedAttemptHandler = require("../n8nLlmFailedAttemptHandler");
var import_N8nLlmTracing = require("../N8nLlmTracing");
class LmChatAwsBedrock {
  constructor() {
    this.description = {
      displayName: "AWS Bedrock Chat Model",
      name: "lmChatAwsBedrock",
      icon: "file:bedrock.svg",
      group: ["transform"],
      version: [1, 1.1],
      description: "Language Model AWS Bedrock",
      defaults: {
        name: "AWS Bedrock Chat Model"
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
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmchatawsbedrock/"
            }
          ]
        }
      },
      inputs: [],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiLanguageModel],
      outputNames: ["Model"],
      credentials: [
        {
          name: "aws",
          required: true
        }
      ],
      requestDefaults: {
        ignoreHttpStatusErrors: true,
        baseURL: '=https://bedrock.{{$credentials?.region ?? "eu-central-1"}}.amazonaws.com'
      },
      properties: [
        (0, import_sharedFields.getConnectionHintNoticeField)([import_n8n_workflow.NodeConnectionTypes.AiChain, import_n8n_workflow.NodeConnectionTypes.AiChain]),
        {
          displayName: "Model Source",
          name: "modelSource",
          type: "options",
          displayOptions: {
            show: {
              "@version": [{ _cnd: { gte: 1.1 } }]
            }
          },
          options: [
            {
              name: "On-Demand Models",
              value: "onDemand",
              description: "Standard foundation models with on-demand pricing"
            },
            {
              name: "Inference Profiles",
              value: "inferenceProfile",
              description: "Cross-region inference profiles (required for models like Claude Sonnet 4 and others)"
            }
          ],
          default: "onDemand",
          description: "Choose between on-demand foundation models or inference profiles"
        },
        {
          displayName: "Model",
          name: "model",
          type: "options",
          allowArbitraryValues: true,
          // Hide issues when model name is specified in the expression and does not match any of the options
          description: 'The model which will generate the completion. <a href="https://docs.aws.amazon.com/bedrock/latest/userguide/foundation-models.html">Learn more</a>.',
          displayOptions: {
            hide: {
              modelSource: ["inferenceProfile"]
            }
          },
          typeOptions: {
            loadOptionsDependsOn: ["modelSource"],
            loadOptions: {
              routing: {
                request: {
                  method: "GET",
                  url: "/foundation-models?&byOutputModality=TEXT&byInferenceType=ON_DEMAND"
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
        },
        {
          displayName: "Model",
          name: "model",
          type: "options",
          allowArbitraryValues: true,
          description: 'The inference profile which will generate the completion. <a href="https://docs.aws.amazon.com/bedrock/latest/userguide/inference-profiles-use.html">Learn more</a>.',
          displayOptions: {
            show: {
              modelSource: ["inferenceProfile"]
            }
          },
          typeOptions: {
            loadOptionsDependsOn: ["modelSource"],
            loadOptions: {
              routing: {
                request: {
                  method: "GET",
                  url: "/inference-profiles?maxResults=1000"
                },
                output: {
                  postReceive: [
                    {
                      type: "rootProperty",
                      properties: {
                        property: "inferenceProfileSummaries"
                      }
                    },
                    {
                      type: "setKeyValue",
                      properties: {
                        name: "={{$responseItem.inferenceProfileName}}",
                        description: "={{$responseItem.description || $responseItem.inferenceProfileArn}}",
                        value: "={{$responseItem.inferenceProfileId}}"
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
              default: 2e3,
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
    const credentials = await this.getCredentials("aws");
    const modelName = this.getNodeParameter("model", itemIndex);
    const options = this.getNodeParameter("options", itemIndex, {});
    const model = new import_aws.ChatBedrockConverse({
      region: credentials.region,
      model: modelName,
      temperature: options.temperature,
      maxTokens: options.maxTokensToSample,
      clientConfig: {
        httpAgent: (0, import_httpProxyAgent.getProxyAgent)()
      },
      credentials: {
        secretAccessKey: credentials.secretAccessKey,
        accessKeyId: credentials.accessKeyId,
        sessionToken: credentials.sessionToken
      },
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
  LmChatAwsBedrock
});
//# sourceMappingURL=LmChatAwsBedrock.node.js.map