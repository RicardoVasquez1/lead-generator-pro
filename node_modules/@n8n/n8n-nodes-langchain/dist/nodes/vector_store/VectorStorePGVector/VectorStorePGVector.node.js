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
var VectorStorePGVector_node_exports = {};
__export(VectorStorePGVector_node_exports, {
  VectorStorePGVector: () => VectorStorePGVector
});
module.exports = __toCommonJS(VectorStorePGVector_node_exports);
var import_pgvector = require("@langchain/community/vectorstores/pgvector");
var import_transport = require("n8n-nodes-base/dist/nodes/Postgres/transport/index");
var import_sharedFields = require("../../../utils/sharedFields");
var import_createVectorStoreNode = require("../shared/createVectorStoreNode/createVectorStoreNode");
const sharedFields = [
  {
    displayName: "Table Name",
    name: "tableName",
    type: "string",
    default: "n8n_vectors",
    description: "The table name to store the vectors in. If table does not exist, it will be created."
  }
];
const collectionField = {
  displayName: "Collection",
  name: "collection",
  type: "fixedCollection",
  description: "Collection of vectors",
  default: {
    values: {
      useCollection: false,
      collectionName: "n8n",
      collectionTable: "n8n_vector_collections"
    }
  },
  typeOptions: {},
  placeholder: "Add Collection Settings",
  options: [
    {
      name: "values",
      displayName: "Collection Settings",
      values: [
        {
          displayName: "Use Collection",
          name: "useCollection",
          type: "boolean",
          default: false
        },
        {
          displayName: "Collection Name",
          name: "collectionName",
          type: "string",
          default: "n8n",
          required: true,
          displayOptions: { show: { useCollection: [true] } }
        },
        {
          displayName: "Collection Table Name",
          name: "collectionTableName",
          type: "string",
          default: "n8n_vector_collections",
          required: true,
          displayOptions: { show: { useCollection: [true] } }
        }
      ]
    }
  ]
};
const columnNamesField = {
  displayName: "Column Names",
  name: "columnNames",
  type: "fixedCollection",
  description: "The names of the columns in the PGVector table",
  default: {
    values: {
      idColumnName: "id",
      vectorColumnName: "embedding",
      contentColumnName: "text",
      metadataColumnName: "metadata"
    }
  },
  typeOptions: {},
  placeholder: "Set Column Names",
  options: [
    {
      name: "values",
      displayName: "Column Name Settings",
      values: [
        {
          displayName: "ID Column Name",
          name: "idColumnName",
          type: "string",
          default: "id",
          required: true
        },
        {
          displayName: "Vector Column Name",
          name: "vectorColumnName",
          type: "string",
          default: "embedding",
          required: true
        },
        {
          displayName: "Content Column Name",
          name: "contentColumnName",
          type: "string",
          default: "text",
          required: true
        },
        {
          displayName: "Metadata Column Name",
          name: "metadataColumnName",
          type: "string",
          default: "metadata",
          required: true
        }
      ]
    }
  ]
};
const distanceStrategyField = {
  displayName: "Distance Strategy",
  name: "distanceStrategy",
  type: "options",
  default: "cosine",
  description: "The method to calculate the distance between two vectors",
  options: [
    {
      name: "Cosine",
      value: "cosine"
    },
    {
      name: "Inner Product",
      value: "innerProduct"
    },
    {
      name: "Euclidean",
      value: "euclidean"
    }
  ]
};
const insertFields = [
  {
    displayName: "Options",
    name: "options",
    type: "collection",
    placeholder: "Add Option",
    default: {},
    options: [collectionField, columnNamesField]
  }
];
const retrieveFields = [
  {
    displayName: "Options",
    name: "options",
    type: "collection",
    placeholder: "Add Option",
    default: {},
    options: [distanceStrategyField, collectionField, columnNamesField, import_sharedFields.metadataFilterField]
  }
];
class ExtendedPGVectorStore extends import_pgvector.PGVectorStore {
  static async initialize(embeddings, args) {
    const { dimensions, ...rest } = args;
    const postgresqlVectorStore = new this(embeddings, rest);
    await postgresqlVectorStore._initializeClient();
    await postgresqlVectorStore.ensureTableInDatabase(dimensions);
    if (postgresqlVectorStore.collectionTableName) {
      await postgresqlVectorStore.ensureCollectionTableInDatabase();
    }
    return postgresqlVectorStore;
  }
  async similaritySearchVectorWithScore(query, k, filter) {
    const mergedFilter = { ...this.filter, ...filter };
    return await super.similaritySearchVectorWithScore(query, k, mergedFilter);
  }
}
class VectorStorePGVector extends (0, import_createVectorStoreNode.createVectorStoreNode)({
  meta: {
    description: "Work with your data in Postgresql with the PGVector extension",
    icon: "file:postgres.svg",
    displayName: "Postgres PGVector Store",
    docsUrl: "https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.vectorstorepgvector/",
    name: "vectorStorePGVector",
    credentials: [
      {
        name: "postgres",
        required: true,
        testedBy: "postgresConnectionTest"
      }
    ],
    operationModes: ["load", "insert", "retrieve", "retrieve-as-tool"]
  },
  sharedFields,
  insertFields,
  loadFields: retrieveFields,
  retrieveFields,
  async getVectorStoreClient(context, filter, embeddings, itemIndex) {
    const tableName = context.getNodeParameter("tableName", itemIndex, "", {
      extractValue: true
    });
    const credentials = await context.getCredentials("postgres");
    const pgConf = await import_transport.configurePostgres.call(context, credentials);
    const pool = pgConf.db.$pool;
    const config = {
      pool,
      tableName,
      filter
    };
    const collectionOptions = context.getNodeParameter(
      "options.collection.values",
      0,
      {}
    );
    if (collectionOptions?.useCollection) {
      config.collectionName = collectionOptions.collectionName;
      config.collectionTableName = collectionOptions.collectionTableName;
    }
    config.columns = context.getNodeParameter("options.columnNames.values", 0, {
      idColumnName: "id",
      vectorColumnName: "embedding",
      contentColumnName: "text",
      metadataColumnName: "metadata"
    });
    config.distanceStrategy = context.getNodeParameter(
      "options.distanceStrategy",
      0,
      "cosine"
    );
    return await ExtendedPGVectorStore.initialize(embeddings, config);
  },
  async populateVectorStore(context, embeddings, documents, itemIndex) {
    const tableName = context.getNodeParameter("tableName", itemIndex, "", {
      extractValue: true
    });
    const credentials = await context.getCredentials("postgres");
    const pgConf = await import_transport.configurePostgres.call(context, credentials);
    const pool = pgConf.db.$pool;
    const config = {
      pool,
      tableName
    };
    const collectionOptions = context.getNodeParameter(
      "options.collection.values",
      0,
      {}
    );
    if (collectionOptions?.useCollection) {
      config.collectionName = collectionOptions.collectionName;
      config.collectionTableName = collectionOptions.collectionTableName;
    }
    config.columns = context.getNodeParameter("options.columnNames.values", 0, {
      idColumnName: "id",
      vectorColumnName: "embedding",
      contentColumnName: "text",
      metadataColumnName: "metadata"
    });
    const vectorStore = await import_pgvector.PGVectorStore.fromDocuments(documents, embeddings, config);
    vectorStore.client?.release();
  },
  releaseVectorStoreClient(vectorStore) {
    vectorStore.client?.release();
  }
}) {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VectorStorePGVector
});
//# sourceMappingURL=VectorStorePGVector.node.js.map