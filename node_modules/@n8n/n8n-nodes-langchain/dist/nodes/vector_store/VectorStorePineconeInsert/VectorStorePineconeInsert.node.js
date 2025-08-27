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
var VectorStorePineconeInsert_node_exports = {};
__export(VectorStorePineconeInsert_node_exports, {
  VectorStorePineconeInsert: () => VectorStorePineconeInsert
});
module.exports = __toCommonJS(VectorStorePineconeInsert_node_exports);
var import_pinecone = require("@langchain/pinecone");
var import_pinecone2 = require("@pinecone-database/pinecone");
var import_n8n_workflow = require("n8n-workflow");
var import_listSearch = require("../shared/createVectorStoreNode/methods/listSearch");
var import_descriptions = require("../shared/descriptions");
var import_processDocuments = require("../shared/processDocuments");
class VectorStorePineconeInsert {
  constructor() {
    this.description = {
      displayName: "Pinecone: Insert",
      hidden: true,
      name: "vectorStorePineconeInsert",
      icon: "file:pinecone.svg",
      group: ["transform"],
      version: 1,
      description: "Insert data into Pinecone Vector Store index",
      defaults: {
        name: "Pinecone: Insert",
        // eslint-disable-next-line n8n-nodes-base/node-class-description-non-core-color-present
        color: "#1321A7"
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
        import_n8n_workflow.NodeConnectionTypes.Main,
        {
          displayName: "Document",
          maxConnections: 1,
          type: import_n8n_workflow.NodeConnectionTypes.AiDocument,
          required: true
        },
        {
          displayName: "Embedding",
          maxConnections: 1,
          type: import_n8n_workflow.NodeConnectionTypes.AiEmbedding,
          required: true
        }
      ],
      outputs: [import_n8n_workflow.NodeConnectionTypes.Main],
      properties: [
        import_descriptions.pineconeIndexRLC,
        {
          displayName: "Pinecone Namespace",
          name: "pineconeNamespace",
          type: "string",
          default: ""
        },
        {
          displayName: "Specify the document to load in the document loader sub-node",
          name: "notice",
          type: "notice",
          default: ""
        },
        {
          displayName: "Clear Namespace",
          name: "clearNamespace",
          type: "boolean",
          default: false,
          description: "Whether to clear the namespace before inserting new data"
        }
      ]
    };
    this.methods = {
      listSearch: {
        pineconeIndexSearch: import_listSearch.pineconeIndexSearch
      }
    };
  }
  async execute() {
    const items = this.getInputData(0);
    this.logger.debug("Executing data for Pinecone Insert Vector Store");
    const namespace = this.getNodeParameter("pineconeNamespace", 0);
    const index = this.getNodeParameter("pineconeIndex", 0, "", { extractValue: true });
    const clearNamespace = this.getNodeParameter("clearNamespace", 0);
    const credentials = await this.getCredentials("pineconeApi");
    const documentInput = await this.getInputConnectionData(import_n8n_workflow.NodeConnectionTypes.AiDocument, 0);
    const embeddings = await this.getInputConnectionData(
      import_n8n_workflow.NodeConnectionTypes.AiEmbedding,
      0
    );
    const client = new import_pinecone2.Pinecone({
      apiKey: credentials.apiKey
    });
    const pineconeIndex = client.Index(index);
    if (namespace && clearNamespace) {
      await pineconeIndex.namespace(namespace).deleteAll();
    }
    const { processedDocuments, serializedDocuments } = await (0, import_processDocuments.processDocuments)(
      documentInput,
      items
    );
    await import_pinecone.PineconeStore.fromDocuments(processedDocuments, embeddings, {
      namespace: namespace || void 0,
      pineconeIndex
    });
    return [serializedDocuments];
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VectorStorePineconeInsert
});
//# sourceMappingURL=VectorStorePineconeInsert.node.js.map