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
var EmbeddingsAzureOpenAi_node_exports = {};
__export(EmbeddingsAzureOpenAi_node_exports, {
  EmbeddingsAzureOpenAi: () => EmbeddingsAzureOpenAi
});
module.exports = __toCommonJS(EmbeddingsAzureOpenAi_node_exports);
var import_openai = require("@langchain/openai");
var import_n8n_workflow = require("n8n-workflow");
var import_logWrapper = require("../../../utils/logWrapper");
var import_sharedFields = require("../../../utils/sharedFields");
class EmbeddingsAzureOpenAi {
  constructor() {
    this.description = {
      displayName: "Embeddings Azure OpenAI",
      name: "embeddingsAzureOpenAi",
      icon: "file:azure.svg",
      credentials: [
        {
          name: "azureOpenAiApi",
          required: true
        }
      ],
      group: ["transform"],
      version: 1,
      description: "Use Embeddings Azure OpenAI",
      defaults: {
        name: "Embeddings Azure OpenAI"
      },
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Embeddings"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.embeddingsazureopenai/"
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
          displayName: "Model (Deployment) Name",
          name: "model",
          type: "string",
          description: "The name of the model(deployment) to use",
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
            },
            {
              displayName: "Timeout",
              name: "timeout",
              default: -1,
              description: "Maximum amount of time a request is allowed to take in seconds. Set to -1 for no timeout.",
              type: "number"
            },
            {
              displayName: "Dimensions",
              name: "dimensions",
              default: void 0,
              description: "The number of dimensions the resulting output embeddings should have. Only supported in text-embedding-3 and later models.",
              type: "options",
              options: [
                {
                  name: "256",
                  value: 256
                },
                {
                  name: "512",
                  value: 512
                },
                {
                  name: "1024",
                  value: 1024
                },
                {
                  name: "1536",
                  value: 1536
                },
                {
                  name: "3072",
                  value: 3072
                }
              ]
            }
          ]
        }
      ]
    };
  }
  async supplyData(itemIndex) {
    this.logger.debug("Supply data for embeddings");
    const credentials = await this.getCredentials("azureOpenAiApi");
    const modelName = this.getNodeParameter("model", itemIndex);
    const options = this.getNodeParameter("options", itemIndex, {});
    if (options.timeout === -1) {
      options.timeout = void 0;
    }
    const embeddings = new import_openai.AzureOpenAIEmbeddings({
      azureOpenAIApiDeploymentName: modelName,
      // instance name only needed to set base url
      azureOpenAIApiInstanceName: !credentials.endpoint ? credentials.resourceName : void 0,
      azureOpenAIApiKey: credentials.apiKey,
      azureOpenAIApiVersion: credentials.apiVersion,
      // azureOpenAIEndpoint and configuration.baseURL are both ignored here
      // only setting azureOpenAIBasePath worked
      azureOpenAIBasePath: credentials.endpoint ? `${credentials.endpoint}/openai/deployments` : void 0,
      ...options
    });
    return {
      response: (0, import_logWrapper.logWrapper)(embeddings, this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EmbeddingsAzureOpenAi
});
//# sourceMappingURL=EmbeddingsAzureOpenAi.node.js.map