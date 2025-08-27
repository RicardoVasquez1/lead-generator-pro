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
var VectorStoreWeaviate_node_exports = {};
__export(VectorStoreWeaviate_node_exports, {
  VectorStoreWeaviate: () => VectorStoreWeaviate
});
module.exports = __toCommonJS(VectorStoreWeaviate_node_exports);
var import_weaviate = require("@langchain/weaviate");
var import_Weaviate = require("./Weaviate.utils");
var import_createVectorStoreNode = require("../shared/createVectorStoreNode/createVectorStoreNode");
var import_listSearch = require("../shared/createVectorStoreNode/methods/listSearch");
var import_descriptions = require("../shared/descriptions");
class ExtendedWeaviateVectorStore extends import_weaviate.WeaviateStore {
  static async fromExistingCollection(embeddings, args, defaultFilter) {
    if (defaultFilter) {
      ExtendedWeaviateVectorStore.defaultFilter = defaultFilter;
    }
    return await super.fromExistingIndex(embeddings, args);
  }
  async similaritySearchVectorWithScore(query, k, filter) {
    filter = filter ?? ExtendedWeaviateVectorStore.defaultFilter;
    if (filter) {
      const composedFilter = (0, import_Weaviate.parseCompositeFilter)(filter);
      return await super.similaritySearchVectorWithScore(query, k, composedFilter);
    } else {
      return await super.similaritySearchVectorWithScore(query, k, void 0);
    }
  }
}
const sharedFields = [import_descriptions.weaviateCollectionRLC];
const shared_options = [
  {
    displayName: "Tenant Name",
    name: "tenant",
    type: "string",
    default: void 0,
    validateType: "string",
    description: "Tenant Name. Collection must have been created with tenant support enabled."
  },
  {
    displayName: "Text Key",
    name: "textKey",
    type: "string",
    default: "text",
    validateType: "string",
    description: "The key in the document that contains the embedded text"
  },
  {
    displayName: "Skip Init Checks",
    name: "skip_init_checks",
    type: "boolean",
    default: false,
    validateType: "boolean",
    description: "Whether to skip init checks while instantiating the client"
  },
  {
    displayName: "Init Timeout",
    name: "timeout_init",
    type: "number",
    default: 2,
    validateType: "number",
    description: "Number of timeout seconds for initial checks"
  },
  {
    displayName: "Insert Timeout",
    name: "timeout_insert",
    type: "number",
    default: 90,
    validateType: "number",
    description: "Number of timeout seconds for inserts"
  },
  {
    displayName: "Query Timeout",
    name: "timeout_query",
    type: "number",
    default: 30,
    validateType: "number",
    description: "Number of timeout seconds for queries"
  },
  {
    displayName: "GRPC Proxy",
    name: "proxy_grpc",
    type: "string",
    default: void 0,
    validateType: "string",
    description: "Proxy to use for GRPC"
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
      ...shared_options,
      {
        displayName: "Clear Data",
        name: "clearStore",
        type: "boolean",
        default: false,
        description: "Whether to clear the Collection/Tenant before inserting new data"
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
        displayName: "Search Filters",
        name: "searchFilterJson",
        type: "json",
        typeOptions: {
          rows: 5
        },
        default: '{\n  "OR": [\n    {\n        "path": ["pdf_info_Author"],\n        "operator": "Equal",\n        "valueString": "Elis"\n    },\n    {\n        "path": ["pdf_info_Author"],\n        "operator": "Equal",\n        "valueString": "Pinnacle"\n    }    \n  ]\n}',
        validateType: "object",
        description: 'Filter pageContent or metadata using this <a href="https://weaviate.io/" target="_blank">filtering syntax</a>'
      },
      {
        displayName: "Metadata Keys",
        name: "metadataKeys",
        type: "string",
        default: "source,page",
        validateType: "string",
        description: "Select the metadata to retrieve along the content"
      },
      ...shared_options
    ]
  }
];
class VectorStoreWeaviate extends (0, import_createVectorStoreNode.createVectorStoreNode)({
  meta: {
    displayName: "Weaviate Vector Store",
    name: "vectorStoreWeaviate",
    description: "Work with your data in a Weaviate Cluster",
    icon: "file:weaviate.svg",
    docsUrl: "https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.vectorstoreweaviate/",
    credentials: [
      {
        name: "weaviateApi",
        required: true
      }
    ]
  },
  methods: {
    listSearch: { weaviateCollectionsSearch: import_listSearch.weaviateCollectionsSearch }
  },
  loadFields: retrieveFields,
  insertFields,
  sharedFields,
  retrieveFields,
  async getVectorStoreClient(context, filter, embeddings, itemIndex) {
    const collection = context.getNodeParameter("weaviateCollection", itemIndex, "", {
      extractValue: true
    });
    const options = context.getNodeParameter("options", itemIndex, {});
    const credentials = await context.getCredentials("weaviateApi");
    const timeout = {
      query: options.timeout_query,
      init: options.timeout_init,
      insert: options.timeout_insert
    };
    const proxies = {
      grpc: options.proxy_grpc
    };
    const client = await (0, import_Weaviate.createWeaviateClient)(
      credentials,
      timeout,
      proxies,
      options.skip_init_checks
    );
    const metadataKeys = options.metadataKeys ? options.metadataKeys.split(",") : [];
    const config = {
      client,
      indexName: collection,
      tenant: options.tenant ? options.tenant : void 0,
      textKey: options.textKey ? options.textKey : "text",
      metadataKeys
    };
    const validFilter = filter && Object.keys(filter).length > 0 ? filter : void 0;
    return await ExtendedWeaviateVectorStore.fromExistingCollection(
      embeddings,
      config,
      validFilter
    );
  },
  async populateVectorStore(context, embeddings, documents, itemIndex) {
    const collectionName = context.getNodeParameter("weaviateCollection", itemIndex, "", {
      extractValue: true
    });
    const options = context.getNodeParameter("options", itemIndex, {});
    const credentials = await context.getCredentials("weaviateApi");
    const metadataKeys = options.metadataKeys ? options.metadataKeys.split(",") : [];
    const client = await (0, import_Weaviate.createWeaviateClient)(credentials);
    const config = {
      client,
      indexName: collectionName,
      tenant: options.tenant ? options.tenant : void 0,
      textKey: options.textKey ? options.textKey : "text",
      metadataKeys
    };
    if (options.clearStore) {
      if (!options.tenant) {
        await client.collections.delete(collectionName);
      } else {
        const collection = client.collections.get(collectionName);
        await collection.tenants.remove([{ name: options.tenant }]);
      }
    }
    await import_weaviate.WeaviateStore.fromDocuments(documents, embeddings, config);
  }
}) {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VectorStoreWeaviate
});
//# sourceMappingURL=VectorStoreWeaviate.node.js.map