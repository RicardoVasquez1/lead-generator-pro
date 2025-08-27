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
var EmbeddingsGoogleVertex_node_exports = {};
__export(EmbeddingsGoogleVertex_node_exports, {
  EmbeddingsGoogleVertex: () => EmbeddingsGoogleVertex
});
module.exports = __toCommonJS(EmbeddingsGoogleVertex_node_exports);
var import_resource_manager = require("@google-cloud/resource-manager");
var import_google_vertexai = require("@langchain/google-vertexai");
var import_utilities = require("n8n-nodes-base/dist/utils/utilities");
var import_n8n_workflow = require("n8n-workflow");
var import_logWrapper = require("../../../utils/logWrapper");
var import_sharedFields = require("../../../utils/sharedFields");
class EmbeddingsGoogleVertex {
  constructor() {
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
    this.description = {
      displayName: "Embeddings Google Vertex",
      name: "embeddingsGoogleVertex",
      icon: "file:google.svg",
      group: ["transform"],
      version: 1,
      description: "Use Google Vertex Embeddings",
      defaults: {
        name: "Embeddings Google Vertex"
      },
      requestDefaults: {
        ignoreHttpStatusErrors: true,
        baseURL: "={{ $credentials.host }}"
      },
      credentials: [
        {
          name: "googleApi",
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
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.embeddingsgooglevertex/"
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
          displayName: 'Each model is using different dimensional density for embeddings. Please make sure to use the same dimensionality for your vector store. The default model is using 768-dimensional embeddings. You can find available models <a href="https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/text-embeddings-api">here</a>.',
          name: "notice",
          type: "notice",
          default: ""
        },
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
          description: 'The model which will generate the embeddings. <a href="https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/text-embeddings-api">Learn more</a>.',
          default: "text-embedding-005"
        }
      ]
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
    const embeddings = new import_google_vertexai.VertexAIEmbeddings({
      authOptions: {
        projectId,
        credentials: {
          client_email: email,
          private_key: privateKey
        }
      },
      location: region,
      model: modelName
    });
    return {
      response: (0, import_logWrapper.logWrapper)(embeddings, this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EmbeddingsGoogleVertex
});
//# sourceMappingURL=EmbeddingsGoogleVertex.node.js.map