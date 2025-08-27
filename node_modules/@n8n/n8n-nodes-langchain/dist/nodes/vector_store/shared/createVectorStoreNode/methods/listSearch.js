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
var listSearch_exports = {};
__export(listSearch_exports, {
  milvusCollectionsSearch: () => milvusCollectionsSearch,
  pineconeIndexSearch: () => pineconeIndexSearch,
  qdrantCollectionsSearch: () => qdrantCollectionsSearch,
  supabaseTableNameSearch: () => supabaseTableNameSearch,
  weaviateCollectionsSearch: () => weaviateCollectionsSearch
});
module.exports = __toCommonJS(listSearch_exports);
var import_pinecone = require("@pinecone-database/pinecone");
var import_milvus2_sdk_node = require("@zilliz/milvus2-sdk-node");
var import_n8n_workflow = require("n8n-workflow");
var import_Qdrant = require("../../../VectorStoreQdrant/Qdrant.utils");
var import_Weaviate = require("../../../VectorStoreWeaviate/Weaviate.utils");
async function pineconeIndexSearch() {
  const credentials = await this.getCredentials("pineconeApi");
  const client = new import_pinecone.Pinecone({
    apiKey: credentials.apiKey
  });
  const indexes = await client.listIndexes();
  const results = (indexes.indexes ?? []).map((index) => ({
    name: index.name,
    value: index.name
  }));
  return { results };
}
async function supabaseTableNameSearch() {
  const credentials = await this.getCredentials("supabaseApi");
  const results = [];
  if (typeof credentials.host !== "string") {
    throw new import_n8n_workflow.ApplicationError("Expected Supabase credentials host to be a string");
  }
  const { paths } = await this.helpers.requestWithAuthentication.call(this, "supabaseApi", {
    headers: {
      Prefer: "return=representation"
    },
    method: "GET",
    uri: `${credentials.host}/rest/v1/`,
    json: true
  });
  for (const path of Object.keys(paths)) {
    if (path === "/") continue;
    results.push({
      name: path.replace("/", ""),
      value: path.replace("/", "")
    });
  }
  return { results };
}
async function qdrantCollectionsSearch() {
  const credentials = await this.getCredentials("qdrantApi");
  const client = (0, import_Qdrant.createQdrantClient)(credentials);
  const response = await client.getCollections();
  const results = response.collections.map((collection) => ({
    name: collection.name,
    value: collection.name
  }));
  return { results };
}
async function milvusCollectionsSearch() {
  const credentials = await this.getCredentials("milvusApi");
  const client = new import_milvus2_sdk_node.MilvusClient({
    address: credentials.baseUrl,
    token: `${credentials.username}:${credentials.password}`
  });
  const response = await client.listCollections();
  const results = response.data.map((collection) => ({
    name: collection.name,
    value: collection.name
  }));
  return { results };
}
async function weaviateCollectionsSearch() {
  const credentials = await this.getCredentials("weaviateApi");
  const client = await (0, import_Weaviate.createWeaviateClient)(credentials);
  const collections = await client.collections.listAll();
  const results = collections.map((collection) => ({
    name: collection.name,
    value: collection.name
  }));
  return { results };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  milvusCollectionsSearch,
  pineconeIndexSearch,
  qdrantCollectionsSearch,
  supabaseTableNameSearch,
  weaviateCollectionsSearch
});
//# sourceMappingURL=listSearch.js.map