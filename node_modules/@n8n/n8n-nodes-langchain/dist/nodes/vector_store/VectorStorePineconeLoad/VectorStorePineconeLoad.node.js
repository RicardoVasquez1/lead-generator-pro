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
var VectorStorePineconeLoad_node_exports = {};
__export(VectorStorePineconeLoad_node_exports, {
  VectorStorePineconeLoad: () => VectorStorePineconeLoad
});
module.exports = __toCommonJS(VectorStorePineconeLoad_node_exports);
var import_pinecone = require("@langchain/pinecone");
var import_pinecone2 = require("@pinecone-database/pinecone");
var import_n8n_workflow = require("n8n-workflow");
var import_helpers = require("../../../utils/helpers");
var import_logWrapper = require("../../../utils/logWrapper");
var import_sharedFields = require("../../../utils/sharedFields");
var import_listSearch = require("../shared/createVectorStoreNode/methods/listSearch");
var import_descriptions = require("../shared/descriptions");
class VectorStorePineconeLoad {
  constructor() {
    this.description = {
      displayName: "Pinecone: Load",
      // Vector Store nodes got merged into a single node
      hidden: true,
      name: "vectorStorePineconeLoad",
      icon: "file:pinecone.svg",
      group: ["transform"],
      version: 1,
      description: "Load data from Pinecone Vector Store index",
      defaults: {
        name: "Pinecone: Load"
      },
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Vector Stores"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.vectorstorepinecone/"
            }
          ]
        }
      },
      credentials: [
        {
          name: "pineconeApi",
          required: true
        }
      ],
      inputs: [
        {
          displayName: "Embedding",
          maxConnections: 1,
          type: import_n8n_workflow.NodeConnectionTypes.AiEmbedding,
          required: true
        }
      ],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiVectorStore],
      outputNames: ["Vector Store"],
      properties: [
        import_descriptions.pineconeIndexRLC,
        {
          displayName: "Pinecone Namespace",
          name: "pineconeNamespace",
          type: "string",
          default: ""
        },
        {
          displayName: "Options",
          name: "options",
          type: "collection",
          placeholder: "Add Option",
          default: {},
          options: [import_sharedFields.metadataFilterField]
        }
      ]
    };
    this.methods = {
      listSearch: {
        pineconeIndexSearch: import_listSearch.pineconeIndexSearch
      }
    };
  }
  async supplyData(itemIndex) {
    this.logger.debug("Supplying data for Pinecone Load Vector Store");
    const namespace = this.getNodeParameter("pineconeNamespace", itemIndex);
    const index = this.getNodeParameter("pineconeIndex", itemIndex, "", {
      extractValue: true
    });
    const credentials = await this.getCredentials("pineconeApi");
    const embeddings = await this.getInputConnectionData(
      import_n8n_workflow.NodeConnectionTypes.AiEmbedding,
      itemIndex
    );
    const client = new import_pinecone2.Pinecone({
      apiKey: credentials.apiKey
    });
    const pineconeIndex = client.Index(index);
    const config = {
      namespace: namespace || void 0,
      pineconeIndex,
      filter: (0, import_helpers.getMetadataFiltersValues)(this, itemIndex)
    };
    const vectorStore = await import_pinecone.PineconeStore.fromExistingIndex(embeddings, config);
    return {
      response: (0, import_logWrapper.logWrapper)(vectorStore, this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VectorStorePineconeLoad
});
//# sourceMappingURL=VectorStorePineconeLoad.node.js.map