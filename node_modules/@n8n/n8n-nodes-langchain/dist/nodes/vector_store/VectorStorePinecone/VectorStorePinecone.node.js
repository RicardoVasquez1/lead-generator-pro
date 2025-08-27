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
var VectorStorePinecone_node_exports = {};
__export(VectorStorePinecone_node_exports, {
  VectorStorePinecone: () => VectorStorePinecone
});
module.exports = __toCommonJS(VectorStorePinecone_node_exports);
var import_pinecone = require("@langchain/pinecone");
var import_pinecone2 = require("@pinecone-database/pinecone");
var import_n8n_workflow = require("n8n-workflow");
var import_sharedFields = require("../../../utils/sharedFields");
var import_createVectorStoreNode = require("../shared/createVectorStoreNode/createVectorStoreNode");
var import_listSearch = require("../shared/createVectorStoreNode/methods/listSearch");
var import_descriptions = require("../shared/descriptions");
const sharedFields = [import_descriptions.pineconeIndexRLC];
const pineconeNamespaceField = {
  displayName: "Pinecone Namespace",
  name: "pineconeNamespace",
  type: "string",
  description: "Partition the records in an index into namespaces. Queries and other operations are then limited to one namespace, so different requests can search different subsets of your index.",
  default: ""
};
const retrieveFields = [
  {
    displayName: "Options",
    name: "options",
    type: "collection",
    placeholder: "Add Option",
    default: {},
    options: [pineconeNamespaceField, import_sharedFields.metadataFilterField]
  }
];
const insertFields = [
  {
    displayName: "Options",
    name: "options",
    type: "collection",
    placeholder: "Add Option",
    default: {},
    options: [
      {
        displayName: "Clear Namespace",
        name: "clearNamespace",
        type: "boolean",
        default: false,
        description: "Whether to clear the namespace before inserting new data"
      },
      pineconeNamespaceField
    ]
  }
];
class VectorStorePinecone extends (0, import_createVectorStoreNode.createVectorStoreNode)({
  meta: {
    displayName: "Pinecone Vector Store",
    name: "vectorStorePinecone",
    description: "Work with your data in Pinecone Vector Store",
    icon: { light: "file:pinecone.svg", dark: "file:pinecone.dark.svg" },
    docsUrl: "https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.vectorstorepinecone/",
    credentials: [
      {
        name: "pineconeApi",
        required: true
      }
    ],
    operationModes: ["load", "insert", "retrieve", "update", "retrieve-as-tool"]
  },
  methods: { listSearch: { pineconeIndexSearch: import_listSearch.pineconeIndexSearch } },
  retrieveFields,
  loadFields: retrieveFields,
  insertFields,
  sharedFields,
  async getVectorStoreClient(context, filter, embeddings, itemIndex) {
    const index = context.getNodeParameter("pineconeIndex", itemIndex, "", {
      extractValue: true
    });
    const options = context.getNodeParameter("options", itemIndex, {});
    const credentials = await context.getCredentials("pineconeApi");
    const client = new import_pinecone2.Pinecone({
      apiKey: credentials.apiKey
    });
    const pineconeIndex = client.Index(index);
    const config = {
      namespace: options.pineconeNamespace ?? void 0,
      pineconeIndex,
      filter
    };
    return await import_pinecone.PineconeStore.fromExistingIndex(embeddings, config);
  },
  async populateVectorStore(context, embeddings, documents, itemIndex) {
    const index = context.getNodeParameter("pineconeIndex", itemIndex, "", {
      extractValue: true
    });
    const options = context.getNodeParameter("options", itemIndex, {});
    const credentials = await context.getCredentials("pineconeApi");
    const client = new import_pinecone2.Pinecone({
      apiKey: credentials.apiKey
    });
    const indexes = ((await client.listIndexes()).indexes ?? []).map((i) => i.name);
    if (!indexes.includes(index)) {
      throw new import_n8n_workflow.NodeOperationError(context.getNode(), `Index ${index} not found`, {
        itemIndex,
        description: "Please check that the index exists in your vector store"
      });
    }
    const pineconeIndex = client.Index(index);
    if (options.pineconeNamespace && options.clearNamespace) {
      const namespace = pineconeIndex.namespace(options.pineconeNamespace);
      try {
        await namespace.deleteAll();
      } catch (error) {
        context.logger.info(`Namespace ${options.pineconeNamespace} does not exist yet`);
      }
    }
    await import_pinecone.PineconeStore.fromDocuments(documents, embeddings, {
      namespace: options.pineconeNamespace ?? void 0,
      pineconeIndex
    });
  }
}) {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VectorStorePinecone
});
//# sourceMappingURL=VectorStorePinecone.node.js.map