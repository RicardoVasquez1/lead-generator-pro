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
var VectorStoreMilvus_node_exports = {};
__export(VectorStoreMilvus_node_exports, {
  VectorStoreMilvus: () => VectorStoreMilvus
});
module.exports = __toCommonJS(VectorStoreMilvus_node_exports);
var import_milvus = require("@langchain/community/vectorstores/milvus");
var import_milvus2_sdk_node = require("@zilliz/milvus2-sdk-node");
var import_createVectorStoreNode = require("../shared/createVectorStoreNode/createVectorStoreNode");
var import_listSearch = require("../shared/createVectorStoreNode/methods/listSearch");
var import_descriptions = require("../shared/descriptions");
const sharedFields = [import_descriptions.milvusCollectionRLC];
const insertFields = [
  {
    displayName: "Options",
    name: "options",
    type: "collection",
    placeholder: "Add Option",
    default: {},
    options: [
      {
        displayName: "Clear Collection",
        name: "clearCollection",
        type: "boolean",
        default: false,
        description: "Whether to clear the collection before inserting new data"
      }
    ]
  }
];
class VectorStoreMilvus extends (0, import_createVectorStoreNode.createVectorStoreNode)({
  meta: {
    displayName: "Milvus Vector Store",
    name: "vectorStoreMilvus",
    description: "Work with your data in Milvus Vector Store",
    icon: { light: "file:milvus-icon-black.svg", dark: "file:milvus-icon-white.svg" },
    docsUrl: "https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.vectorstoremilvus/",
    credentials: [
      {
        name: "milvusApi",
        required: true
      }
    ],
    operationModes: ["load", "insert", "retrieve", "retrieve-as-tool"]
  },
  methods: { listSearch: { milvusCollectionsSearch: import_listSearch.milvusCollectionsSearch } },
  sharedFields,
  insertFields,
  async getVectorStoreClient(context, _filter, embeddings, itemIndex) {
    const collection = context.getNodeParameter("milvusCollection", itemIndex, "", {
      extractValue: true
    });
    const credentials = await context.getCredentials("milvusApi");
    const config = {
      url: credentials.baseUrl,
      username: credentials.username,
      password: credentials.password,
      collectionName: collection
    };
    return await import_milvus.Milvus.fromExistingCollection(embeddings, config);
  },
  async populateVectorStore(context, embeddings, documents, itemIndex) {
    const collection = context.getNodeParameter("milvusCollection", itemIndex, "", {
      extractValue: true
    });
    const options = context.getNodeParameter("options", itemIndex, {});
    const credentials = await context.getCredentials("milvusApi");
    const config = {
      url: credentials.baseUrl,
      username: credentials.username,
      password: credentials.password,
      collectionName: collection
    };
    if (options.clearCollection) {
      const client = new import_milvus2_sdk_node.MilvusClient({
        address: credentials.baseUrl,
        token: `${credentials.username}:${credentials.password}`
      });
      await client.dropCollection({ collection_name: collection });
    }
    await import_milvus.Milvus.fromDocuments(documents, embeddings, config);
  }
}) {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VectorStoreMilvus
});
//# sourceMappingURL=VectorStoreMilvus.node.js.map