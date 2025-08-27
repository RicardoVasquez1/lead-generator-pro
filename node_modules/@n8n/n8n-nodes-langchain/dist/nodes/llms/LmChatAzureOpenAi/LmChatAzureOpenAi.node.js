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
var LmChatAzureOpenAi_node_exports = {};
__export(LmChatAzureOpenAi_node_exports, {
  LmChatAzureOpenAi: () => LmChatAzureOpenAi
});
module.exports = __toCommonJS(LmChatAzureOpenAi_node_exports);
var import_openai = require("@langchain/openai");
var import_n8n_workflow = require("n8n-workflow");
var import_httpProxyAgent = require("../../../utils/httpProxyAgent");
var import_api_key = require("./credentials/api-key");
var import_oauth2 = require("./credentials/oauth2");
var import_properties = require("./properties");
var import_types = require("./types");
var import_n8nLlmFailedAttemptHandler = require("../n8nLlmFailedAttemptHandler");
var import_N8nLlmTracing = require("../N8nLlmTracing");
class LmChatAzureOpenAi {
  constructor() {
    this.description = {
      displayName: "Azure OpenAI Chat Model",
      name: "lmChatAzureOpenAi",
      icon: "file:azure.svg",
      group: ["transform"],
      version: 1,
      description: "For advanced usage with an AI chain",
      defaults: {
        name: "Azure OpenAI Chat Model"
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
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmchatazureopenai/"
            }
          ]
        }
      },
      inputs: [],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiLanguageModel],
      outputNames: ["Model"],
      credentials: [
        {
          name: "azureOpenAiApi",
          required: true,
          displayOptions: {
            show: {
              authentication: [import_types.AuthenticationType.ApiKey]
            }
          }
        },
        {
          name: "azureEntraCognitiveServicesOAuth2Api",
          required: true,
          displayOptions: {
            show: {
              authentication: [import_types.AuthenticationType.EntraOAuth2]
            }
          }
        }
      ],
      properties: import_properties.properties
    };
  }
  async supplyData(itemIndex) {
    try {
      const authenticationMethod = this.getNodeParameter(
        "authentication",
        itemIndex
      );
      const modelName = this.getNodeParameter("model", itemIndex);
      const options = this.getNodeParameter("options", itemIndex, {});
      let modelConfig;
      switch (authenticationMethod) {
        case import_types.AuthenticationType.ApiKey:
          modelConfig = await import_api_key.setupApiKeyAuthentication.call(this, "azureOpenAiApi");
          break;
        case import_types.AuthenticationType.EntraOAuth2:
          modelConfig = await import_oauth2.setupOAuth2Authentication.call(
            this,
            "azureEntraCognitiveServicesOAuth2Api"
          );
          break;
        default:
          throw new import_n8n_workflow.NodeOperationError(this.getNode(), "Invalid authentication method");
      }
      this.logger.info(`Instantiating AzureChatOpenAI model with deployment: ${modelName}`);
      const model = new import_openai.AzureChatOpenAI({
        azureOpenAIApiDeploymentName: modelName,
        ...modelConfig,
        ...options,
        timeout: options.timeout ?? 6e4,
        maxRetries: options.maxRetries ?? 2,
        callbacks: [new import_N8nLlmTracing.N8nLlmTracing(this)],
        configuration: {
          fetchOptions: {
            dispatcher: (0, import_httpProxyAgent.getProxyAgent)()
          }
        },
        modelKwargs: options.responseFormat ? {
          response_format: { type: options.responseFormat }
        } : void 0,
        onFailedAttempt: (0, import_n8nLlmFailedAttemptHandler.makeN8nLlmFailedAttemptHandler)(this)
      });
      this.logger.info(`Azure OpenAI client initialized for deployment: ${modelName}`);
      return {
        response: model
      };
    } catch (error) {
      this.logger.error(`Error in LmChatAzureOpenAi.supplyData: ${error.message}`, error);
      if (error instanceof import_n8n_workflow.NodeOperationError) {
        throw error;
      }
      throw new import_n8n_workflow.NodeOperationError(
        this.getNode(),
        `Failed to initialize Azure OpenAI client: ${error.message}`,
        error
      );
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LmChatAzureOpenAi
});
//# sourceMappingURL=LmChatAzureOpenAi.node.js.map