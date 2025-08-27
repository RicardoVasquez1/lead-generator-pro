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
var VectorStoreSupabase_node_exports = {};
__export(VectorStoreSupabase_node_exports, {
  VectorStoreSupabase: () => VectorStoreSupabase
});
module.exports = __toCommonJS(VectorStoreSupabase_node_exports);
var import_supabase = require("@langchain/community/vectorstores/supabase");
var import_supabase_js = require("@supabase/supabase-js");
var import_n8n_workflow = require("n8n-workflow");
var import_sharedFields = require("../../../utils/sharedFields");
var import_createVectorStoreNode = require("../shared/createVectorStoreNode/createVectorStoreNode");
var import_listSearch = require("../shared/createVectorStoreNode/methods/listSearch");
var import_descriptions = require("../shared/descriptions");
const queryNameField = {
  displayName: "Query Name",
  name: "queryName",
  type: "string",
  default: "match_documents",
  description: "Name of the query to use for matching documents"
};
const sharedFields = [import_descriptions.supabaseTableNameRLC];
const insertFields = [
  {
    displayName: "Options",
    name: "options",
    type: "collection",
    placeholder: "Add Option",
    default: {},
    options: [queryNameField]
  }
];
const retrieveFields = [
  {
    displayName: "Options",
    name: "options",
    type: "collection",
    placeholder: "Add Option",
    default: {},
    options: [queryNameField, import_sharedFields.metadataFilterField]
  }
];
const updateFields = [...insertFields];
class VectorStoreSupabase extends (0, import_createVectorStoreNode.createVectorStoreNode)({
  meta: {
    description: "Work with your data in Supabase Vector Store",
    icon: "file:supabase.svg",
    displayName: "Supabase Vector Store",
    docsUrl: "https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.vectorstoresupabase/",
    name: "vectorStoreSupabase",
    credentials: [
      {
        name: "supabaseApi",
        required: true
      }
    ],
    operationModes: ["load", "insert", "retrieve", "update", "retrieve-as-tool"]
  },
  methods: {
    listSearch: { supabaseTableNameSearch: import_listSearch.supabaseTableNameSearch }
  },
  sharedFields,
  insertFields,
  loadFields: retrieveFields,
  retrieveFields,
  updateFields,
  async getVectorStoreClient(context, filter, embeddings, itemIndex) {
    const tableName = context.getNodeParameter("tableName", itemIndex, "", {
      extractValue: true
    });
    const options = context.getNodeParameter("options", itemIndex, {});
    const credentials = await context.getCredentials("supabaseApi");
    const client = (0, import_supabase_js.createClient)(credentials.host, credentials.serviceRole);
    return await import_supabase.SupabaseVectorStore.fromExistingIndex(embeddings, {
      client,
      tableName,
      queryName: options.queryName ?? "match_documents",
      filter
    });
  },
  async populateVectorStore(context, embeddings, documents, itemIndex) {
    const tableName = context.getNodeParameter("tableName", itemIndex, "", {
      extractValue: true
    });
    const options = context.getNodeParameter("options", itemIndex, {});
    const credentials = await context.getCredentials("supabaseApi");
    const client = (0, import_supabase_js.createClient)(credentials.host, credentials.serviceRole);
    try {
      await import_supabase.SupabaseVectorStore.fromDocuments(documents, embeddings, {
        client,
        tableName,
        queryName: options.queryName ?? "match_documents"
      });
    } catch (error) {
      if (error.message === "Error inserting: undefined 404 Not Found") {
        throw new import_n8n_workflow.NodeOperationError(context.getNode(), `Table ${tableName} not found`, {
          itemIndex,
          description: "Please check that the table exists in your vector store"
        });
      } else {
        throw new import_n8n_workflow.NodeOperationError(context.getNode(), error, {
          itemIndex
        });
      }
    }
  }
}) {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VectorStoreSupabase
});
//# sourceMappingURL=VectorStoreSupabase.node.js.map