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
var LmChatGoogleVertex_node_exports = {};
__export(LmChatGoogleVertex_node_exports, {
  LmChatGoogleVertex: () => LmChatGoogleVertex
});
module.exports = __toCommonJS(LmChatGoogleVertex_node_exports);
var import_resource_manager = require("@google-cloud/resource-manager");
var import_google_vertexai = require("@langchain/google-vertexai");
var import_utilities = require("n8n-nodes-base/dist/utils/utilities");
var import_n8n_workflow = require("n8n-workflow");
var import_sharedFields = require("../../../utils/sharedFields");
var import_error_handling = require("./error-handling");
var import_additional_options = require("../gemini-common/additional-options");
var import_n8nLlmFailedAttemptHandler = require("../n8nLlmFailedAttemptHandler");
var import_N8nLlmTracing = require("../N8nLlmTracing");
class LmChatGoogleVertex {
  constructor() {
    this.description = {
      displayName: "Google Vertex Chat Model",
      name: "lmChatGoogleVertex",
      icon: "file:google.svg",
      group: ["transform"],
      version: 1,
      description: "Chat Model Google Vertex",
      defaults: {
        name: "Google Vertex Chat Model"
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
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmchatgooglevertex/"
            }
          ]
        }
      },
      inputs: [],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiLanguageModel],
      outputNames: ["Model"],
      credentials: [
        {
          name: "googleApi",
          required: true
        }
      ],
      properties: [
        (0, import_sharedFields.getConnectionHintNoticeField)([import_n8n_workflow.NodeConnectionTypes.AiChain, import_n8n_workflow.NodeConnectionTypes.AiAgent]),
        {
          displayName: "Project ID",
          name: "projectId",
          type: "resourceLocator",
          default: { mode: "list", value: "" },
          required: true,
          description: "Select or enter your Google Cloud project ID",
          modes: [
            {
              displayName: "From List",
              name: "list",
              type: "list",
              typeOptions: {
                searchListMethod: "gcpProjectsList"
              }
            },
            {
              displayName: "ID",
              name: "id",
              type: "string"
            }
          ]
        },
        {
          displayName: "Model Name",
          name: "modelName",
          type: "string",
          description: 'The model which will generate the completion. <a href="https://cloud.google.com/vertex-ai/generative-ai/docs/learn/models">Learn more</a>.',
          default: "gemini-1.5-flash"
        },
        import_additional_options.additionalOptions
      ]
    };
    this.methods = {
      listSearch: {
        async gcpProjectsList() {
          const results = [];
          const credentials = await this.getCredentials("googleApi");
          const privateKey = (0, import_utilities.formatPrivateKey)(credentials.privateKey);
          const email = credentials.email.trim();
          const client = new import_resource_manager.ProjectsClient({
            credentials: {
              client_email: email,
              private_key: privateKey
            }
          });
          const [projects] = await client.searchProjects();
          for (const project of projects) {
            if (project.projectId) {
              results.push({
                name: project.displayName ?? project.projectId,
                value: project.projectId
              });
            }
          }
          return { results };
        }
      }
    };
  }
  async supplyData(itemIndex) {
    const credentials = await this.getCredentials("googleApi");
    const privateKey = (0, import_utilities.formatPrivateKey)(credentials.privateKey);
    const email = credentials.email.trim();
    const region = credentials.region;
    const modelName = this.getNodeParameter("modelName", itemIndex);
    const projectId = this.getNodeParameter("projectId", itemIndex, "", {
      extractValue: true
    });
    const options = this.getNodeParameter("options", itemIndex, {
      maxOutputTokens: 2048,
      temperature: 0.4,
      topK: 40,
      topP: 0.9
    });
    const safetySettings = this.getNodeParameter(
      "options.safetySettings.values",
      itemIndex,
      null
    );
    try {
      const model = new import_google_vertexai.ChatVertexAI({
        authOptions: {
          projectId,
          credentials: {
            client_email: email,
            private_key: privateKey
          }
        },
        location: region,
        model: modelName,
        topK: options.topK,
        topP: options.topP,
        temperature: options.temperature,
        maxOutputTokens: options.maxOutputTokens,
        safetySettings,
        callbacks: [new import_N8nLlmTracing.N8nLlmTracing(this)],
        // Handle ChatVertexAI invocation errors to provide better error messages
        onFailedAttempt: (0, import_n8nLlmFailedAttemptHandler.makeN8nLlmFailedAttemptHandler)(this, (error) => {
          const customError = (0, import_error_handling.makeErrorFromStatus)(Number(error?.response?.status), {
            modelName
          });
          if (customError) {
            throw new import_n8n_workflow.NodeOperationError(this.getNode(), error, customError);
          }
          throw error;
        })
      });
      return {
        response: model
      };
    } catch (e) {
      if (e?.message?.startsWith("Unable to verify model params")) {
        throw new import_n8n_workflow.NodeOperationError(this.getNode(), e, {
          message: "Unsupported model",
          description: "Only models starting with 'gemini' are supported."
        });
      }
      throw new import_n8n_workflow.NodeOperationError(this.getNode(), e, {
        message: "Invalid options",
        description: e.message
      });
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LmChatGoogleVertex
});
//# sourceMappingURL=LmChatGoogleVertex.node.js.map