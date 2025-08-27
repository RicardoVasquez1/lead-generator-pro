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
var VectorStoreInMemory_node_exports = {};
__export(VectorStoreInMemory_node_exports, {
  VectorStoreInMemory: () => VectorStoreInMemory
});
module.exports = __toCommonJS(VectorStoreInMemory_node_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_createVectorStoreNode = require("../shared/createVectorStoreNode/createVectorStoreNode");
var import_MemoryVectorStoreManager = require("../shared/MemoryManager/MemoryVectorStoreManager");
const warningBanner = {
  displayName: '<strong>For experimental use only</strong>: Data is stored in memory and will be lost if n8n restarts. Data may also be cleared if available memory gets low, and is accessible to all users of this instance. <a href="https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.vectorstoreinmemory/">More info</a>',
  name: "notice",
  type: "notice",
  default: ""
};
const insertFields = [
  {
    displayName: "Clear Store",
    name: "clearStore",
    type: "boolean",
    default: false,
    description: "Whether to clear the store before inserting new data"
  },
  warningBanner
];
const DEFAULT_MEMORY_KEY = "vector_store_key";
function getMemoryKey(context, itemIndex) {
  const node = context.getNode();
  if (node.typeVersion <= 1.1) {
    const memoryKeyParam = context.getNodeParameter("memoryKey", itemIndex);
    const workflowId = context.getWorkflow().id;
    return `${workflowId}__${memoryKeyParam}`;
  } else {
    const memoryKeyParam = context.getNodeParameter("memoryKey", itemIndex);
    return memoryKeyParam.value;
  }
}
class VectorStoreInMemory extends (0, import_createVectorStoreNode.createVectorStoreNode)({
  meta: {
    displayName: "Simple Vector Store",
    name: "vectorStoreInMemory",
    description: "The easiest way to experiment with vector stores, without external setup.",
    icon: "fa:database",
    iconColor: "black",
    docsUrl: "https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.vectorstoreinmemory/",
    categories: ["AI"],
    subcategories: {
      AI: ["Vector Stores", "Tools", "Root Nodes"],
      "Vector Stores": ["For Beginners"],
      Tools: ["Other Tools"]
    }
  },
  sharedFields: [
    {
      displayName: "Memory Key",
      name: "memoryKey",
      type: "string",
      default: DEFAULT_MEMORY_KEY,
      description: "The key to use to store the vector memory in the workflow data. The key will be prefixed with the workflow ID to avoid collisions.",
      displayOptions: {
        show: {
          "@version": [{ _cnd: { lte: 1.1 } }]
        }
      }
    },
    {
      displayName: "Memory Key",
      name: "memoryKey",
      type: "resourceLocator",
      required: true,
      default: { mode: "list", value: DEFAULT_MEMORY_KEY },
      description: "The key to use to store the vector memory in the workflow data. These keys are shared between workflows.",
      displayOptions: {
        show: {
          "@version": [{ _cnd: { gte: 1.2 } }]
        }
      },
      modes: [
        {
          displayName: "From List",
          name: "list",
          type: "list",
          typeOptions: {
            searchListMethod: "vectorStoresSearch",
            searchable: true,
            allowNewResource: {
              label: "resourceLocator.mode.list.addNewResource.vectorStoreInMemory",
              defaultName: DEFAULT_MEMORY_KEY,
              method: "createVectorStore"
            }
          }
        },
        {
          displayName: "Manual",
          name: "id",
          type: "string",
          placeholder: DEFAULT_MEMORY_KEY
        }
      ]
    }
  ],
  methods: {
    listSearch: {
      async vectorStoresSearch(filter) {
        const vectorStoreSingleton = import_MemoryVectorStoreManager.MemoryVectorStoreManager.getInstance(
          {},
          // Real Embeddings are provided when executing the node
          this.logger
        );
        const searchOptions = vectorStoreSingleton.getMemoryKeysList().map((key) => {
          return {
            name: key,
            value: key
          };
        });
        let results = searchOptions;
        if (filter) {
          results = results.filter((option) => option.name.includes(filter));
        }
        return {
          results
        };
      }
    },
    actionHandler: {
      async createVectorStore(payload) {
        if (!payload || typeof payload === "string") {
          throw new import_n8n_workflow.ApplicationError("Invalid payload type");
        }
        const { name } = payload;
        const vectorStoreSingleton = import_MemoryVectorStoreManager.MemoryVectorStoreManager.getInstance(
          {},
          // Real Embeddings are provided when executing the node
          this.logger
        );
        const memoryKey = name ? name : DEFAULT_MEMORY_KEY;
        await vectorStoreSingleton.getVectorStore(memoryKey);
        return memoryKey;
      }
    }
  },
  insertFields,
  loadFields: [warningBanner],
  retrieveFields: [warningBanner],
  async getVectorStoreClient(context, _filter, embeddings, itemIndex) {
    const memoryKey = getMemoryKey(context, itemIndex);
    const vectorStoreSingleton = import_MemoryVectorStoreManager.MemoryVectorStoreManager.getInstance(embeddings, context.logger);
    return await vectorStoreSingleton.getVectorStore(memoryKey);
  },
  async populateVectorStore(context, embeddings, documents, itemIndex) {
    const memoryKey = getMemoryKey(context, itemIndex);
    const clearStore = context.getNodeParameter("clearStore", itemIndex);
    const vectorStoreInstance = import_MemoryVectorStoreManager.MemoryVectorStoreManager.getInstance(embeddings, context.logger);
    await vectorStoreInstance.addDocuments(memoryKey, documents, clearStore);
  }
}) {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VectorStoreInMemory
});
//# sourceMappingURL=VectorStoreInMemory.node.js.map