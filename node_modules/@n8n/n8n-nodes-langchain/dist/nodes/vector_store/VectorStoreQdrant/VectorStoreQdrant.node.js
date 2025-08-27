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
var VectorStoreQdrant_node_exports = {};
__export(VectorStoreQdrant_node_exports, {
  VectorStoreQdrant: () => VectorStoreQdrant
});
module.exports = __toCommonJS(VectorStoreQdrant_node_exports);
var import_qdrant = require("@langchain/qdrant");
var import_Qdrant = require("./Qdrant.utils");
var import_createVectorStoreNode = require("../shared/createVectorStoreNode/createVectorStoreNode");
var import_listSearch = require("../shared/createVectorStoreNode/methods/listSearch");
var import_descriptions = require("../shared/descriptions");
const _ExtendedQdrantVectorStore = class _ExtendedQdrantVectorStore extends import_qdrant.QdrantVectorStore {
  static async fromExistingCollection(embeddings, args, defaultFilter = {}) {
    _ExtendedQdrantVectorStore.defaultFilter = defaultFilter;
    return await super.fromExistingCollection(embeddings, args);
  }
  async similaritySearch(query, k, filter, callbacks) {
    const mergedFilter = { ..._ExtendedQdrantVectorStore.defaultFilter, ...filter };
    return await super.similaritySearch(query, k, mergedFilter, callbacks);
  }
};
_ExtendedQdrantVectorStore.defaultFilter = {};
let ExtendedQdrantVectorStore = _ExtendedQdrantVectorStore;
const sharedFields = [import_descriptions.qdrantCollectionRLC];
const insertFields = [
  {
    displayName: "Options",
    name: "options",
    type: "collection",
    placeholder: "Add Option",
    default: {},
    options: [
      {
        displayName: "Collection Config",
        name: "collectionConfig",
        type: "json",
        default: "",
        description: 'JSON options for creating a collection. <a href="https://qdrant.tech/documentation/concepts/collections">Learn more</a>.'
      }
    ]
  }
];
const retrieveFields = [
  {
    displayName: "Options",
    name: "options",
    type: "collection",
    placeholder: "Add Option",
    default: {},
    options: [
      {
        displayName: "Search Filter",
        name: "searchFilterJson",
        type: "json",
        typeOptions: {
          rows: 5
        },
        default: '{\n  "should": [\n    {\n      "key": "metadata.batch",\n      "match": {\n        "value": 12345\n      }\n    }\n  ]\n}',
        validateType: "object",
        description: 'Filter pageContent or metadata using this <a href="https://qdrant.tech/documentation/concepts/filtering/" target="_blank">filtering syntax</a>'
      }
    ]
  }
];
class VectorStoreQdrant extends (0, import_createVectorStoreNode.createVectorStoreNode)({
  meta: {
    displayName: "Qdrant Vector Store",
    name: "vectorStoreQdrant",
    description: "Work with your data in a Qdrant collection",
    icon: "file:qdrant.svg",
    docsUrl: "https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.vectorstoreqdrant/",
    credentials: [
      {
        name: "qdrantApi",
        required: true
      }
    ]
  },
  methods: { listSearch: { qdrantCollectionsSearch: import_listSearch.qdrantCollectionsSearch } },
  loadFields: retrieveFields,
  insertFields,
  sharedFields,
  retrieveFields,
  async getVectorStoreClient(context, filter, embeddings, itemIndex) {
    const collection = context.getNodeParameter("qdrantCollection", itemIndex, "", {
      extractValue: true
    });
    const credentials = await context.getCredentials("qdrantApi");
    const client = (0, import_Qdrant.createQdrantClient)(credentials);
    const config = {
      client,
      collectionName: collection
    };
    return await ExtendedQdrantVectorStore.fromExistingCollection(embeddings, config, filter);
  },
  async populateVectorStore(context, embeddings, documents, itemIndex) {
    const collectionName = context.getNodeParameter("qdrantCollection", itemIndex, "", {
      extractValue: true
    });
    const { collectionConfig } = context.getNodeParameter("options", itemIndex, {});
    const credentials = await context.getCredentials("qdrantApi");
    const client = (0, import_Qdrant.createQdrantClient)(credentials);
    const config = {
      client,
      collectionName,
      collectionConfig
    };
    await import_qdrant.QdrantVectorStore.fromDocuments(documents, embeddings, config);
  }
}) {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VectorStoreQdrant
});
//# sourceMappingURL=VectorStoreQdrant.node.js.map