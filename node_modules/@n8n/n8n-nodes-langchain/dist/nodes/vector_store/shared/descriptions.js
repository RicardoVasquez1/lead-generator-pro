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
var descriptions_exports = {};
__export(descriptions_exports, {
  milvusCollectionRLC: () => milvusCollectionRLC,
  pineconeIndexRLC: () => pineconeIndexRLC,
  qdrantCollectionRLC: () => qdrantCollectionRLC,
  supabaseTableNameRLC: () => supabaseTableNameRLC,
  weaviateCollectionRLC: () => weaviateCollectionRLC
});
module.exports = __toCommonJS(descriptions_exports);
const pineconeIndexRLC = {
  displayName: "Pinecone Index",
  name: "pineconeIndex",
  type: "resourceLocator",
  default: { mode: "list", value: "" },
  required: true,
  modes: [
    {
      displayName: "From List",
      name: "list",
      type: "list",
      typeOptions: {
        searchListMethod: "pineconeIndexSearch"
      }
    },
    {
      displayName: "ID",
      name: "id",
      type: "string"
    }
  ]
};
const supabaseTableNameRLC = {
  displayName: "Table Name",
  name: "tableName",
  type: "resourceLocator",
  default: { mode: "list", value: "" },
  required: true,
  modes: [
    {
      displayName: "From List",
      name: "list",
      type: "list",
      typeOptions: {
        searchListMethod: "supabaseTableNameSearch"
      }
    },
    {
      displayName: "ID",
      name: "id",
      type: "string"
    }
  ]
};
const qdrantCollectionRLC = {
  displayName: "Qdrant Collection",
  name: "qdrantCollection",
  type: "resourceLocator",
  default: { mode: "list", value: "" },
  required: true,
  modes: [
    {
      displayName: "From List",
      name: "list",
      type: "list",
      typeOptions: {
        searchListMethod: "qdrantCollectionsSearch"
      }
    },
    {
      displayName: "ID",
      name: "id",
      type: "string"
    }
  ]
};
const milvusCollectionRLC = {
  displayName: "Milvus Collection",
  name: "milvusCollection",
  type: "resourceLocator",
  default: { mode: "list", value: "" },
  required: true,
  modes: [
    {
      displayName: "From List",
      name: "list",
      type: "list",
      typeOptions: {
        searchListMethod: "milvusCollectionsSearch"
      }
    },
    {
      displayName: "ID",
      name: "id",
      type: "string"
    }
  ]
};
const weaviateCollectionRLC = {
  displayName: "Weaviate Collection",
  name: "weaviateCollection",
  type: "resourceLocator",
  default: { mode: "list", value: "" },
  required: true,
  modes: [
    {
      displayName: "From List",
      name: "list",
      type: "list",
      typeOptions: {
        searchListMethod: "weaviateCollectionsSearch"
      }
    },
    {
      displayName: "ID",
      name: "id",
      type: "string"
    }
  ]
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  milvusCollectionRLC,
  pineconeIndexRLC,
  qdrantCollectionRLC,
  supabaseTableNameRLC,
  weaviateCollectionRLC
});
//# sourceMappingURL=descriptions.js.map