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
var EmbeddingsHuggingFaceInference_node_exports = {};
__export(EmbeddingsHuggingFaceInference_node_exports, {
  EmbeddingsHuggingFaceInference: () => EmbeddingsHuggingFaceInference
});
module.exports = __toCommonJS(EmbeddingsHuggingFaceInference_node_exports);
var import_inference = require("@huggingface/inference");
var import_hf = require("@langchain/community/embeddings/hf");
var import_n8n_workflow = require("n8n-workflow");
var import_logWrapper = require("../../../utils/logWrapper");
var import_sharedFields = require("../../../utils/sharedFields");
class EmbeddingsHuggingFaceInference {
  constructor() {
    this.description = {
      displayName: "Embeddings Hugging Face Inference",
      name: "embeddingsHuggingFaceInference",
      icon: "file:huggingface.svg",
      group: ["transform"],
      version: 1,
      description: "Use HuggingFace Inference Embeddings",
      defaults: {
        name: "Embeddings HuggingFace Inference"
      },
      credentials: [
        {
          name: "huggingFaceApi",
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
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.embeddingshuggingfaceinference/"
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
          displayName: "Model Name",
          name: "modelName",
          type: "string",
          default: "sentence-transformers/distilbert-base-nli-mean-tokens",
          description: "The model name to use from HuggingFace library"
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
              displayName: "Custom Inference Endpoint",
              name: "endpointUrl",
              default: "",
              description: "Custom endpoint URL",
              type: "string"
            },
            {
              displayName: "Provider",
              name: "provider",
              type: "options",
              options: import_inference.PROVIDERS_OR_POLICIES.map((value) => ({ value, name: value })),
              default: "auto"
            }
          ]
        }
      ]
    };
  }
  async supplyData(itemIndex) {
    this.logger.debug("Supply data for embeddings HF Inference");
    const model = this.getNodeParameter(
      "modelName",
      itemIndex,
      "sentence-transformers/distilbert-base-nli-mean-tokens"
    );
    const credentials = await this.getCredentials("huggingFaceApi");
    const options = this.getNodeParameter("options", itemIndex, {});
    if ("provider" in options && !isValidHFProviderOrPolicy(options.provider)) {
      throw new import_n8n_workflow.NodeOperationError(this.getNode(), "Unsupported provider");
    }
    const embeddings = new import_hf.HuggingFaceInferenceEmbeddings({
      apiKey: credentials.apiKey,
      model,
      ...options
    });
    return {
      response: (0, import_logWrapper.logWrapper)(embeddings, this)
    };
  }
}
function isValidHFProviderOrPolicy(provider) {
  return typeof provider === "string" && import_inference.PROVIDERS_OR_POLICIES.includes(provider);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EmbeddingsHuggingFaceInference
});
//# sourceMappingURL=EmbeddingsHuggingFaceInference.node.js.map