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
var VectorStoreSupabaseInsert_node_exports = {};
__export(VectorStoreSupabaseInsert_node_exports, {
  VectorStoreSupabaseInsert: () => VectorStoreSupabaseInsert
});
module.exports = __toCommonJS(VectorStoreSupabaseInsert_node_exports);
var import_supabase = require("@langchain/community/vectorstores/supabase");
var import_supabase_js = require("@supabase/supabase-js");
var import_n8n_workflow = require("n8n-workflow");
var import_listSearch = require("../shared/createVectorStoreNode/methods/listSearch");
var import_descriptions = require("../shared/descriptions");
var import_processDocuments = require("../shared/processDocuments");
class VectorStoreSupabaseInsert {
  constructor() {
    this.description = {
      displayName: "Supabase: Insert",
      // Vector Store nodes got merged into a single node
      hidden: true,
      name: "vectorStoreSupabaseInsert",
      icon: "file:supabase.svg",
      group: ["transform"],
      version: 1,
      description: "Insert data into Supabase Vector Store index [https://supabase.com/docs/guides/ai/langchain]",
      defaults: {
        name: "Supabase: Insert"
      },
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Vector Stores"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.vectorstoresupabase/"
            }
          ]
        }
      },
      credentials: [
        {
          name: "supabaseApi",
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
        {
          displayName: 'Please refer to the <a href="https://supabase.com/docs/guides/ai/langchain" target="_blank">Supabase documentation</a> for more information on how to setup your database as a Vector Store.',
          name: "setupNotice",
          type: "notice",
          default: ""
        },
        import_descriptions.supabaseTableNameRLC,
        {
          displayName: "Query Name",
          name: "queryName",
          type: "string",
          default: "match_documents",
          required: true,
          description: "Name of the query to use for matching documents"
        },
        {
          displayName: "Specify the document to load in the document loader sub-node",
          name: "notice",
          type: "notice",
          default: ""
        }
      ]
    };
    this.methods = { listSearch: { supabaseTableNameSearch: import_listSearch.supabaseTableNameSearch } };
  }
  async execute() {
    this.logger.debug("Executing data for Supabase Insert Vector Store");
    const items = this.getInputData(0);
    const tableName = this.getNodeParameter("tableName", 0, "", { extractValue: true });
    const queryName = this.getNodeParameter("queryName", 0);
    const credentials = await this.getCredentials("supabaseApi");
    const documentInput = await this.getInputConnectionData(import_n8n_workflow.NodeConnectionTypes.AiDocument, 0);
    const embeddings = await this.getInputConnectionData(
      import_n8n_workflow.NodeConnectionTypes.AiEmbedding,
      0
    );
    const client = (0, import_supabase_js.createClient)(credentials.host, credentials.serviceRole);
    const { processedDocuments, serializedDocuments } = await (0, import_processDocuments.processDocuments)(
      documentInput,
      items
    );
    await import_supabase.SupabaseVectorStore.fromDocuments(processedDocuments, embeddings, {
      client,
      tableName,
      queryName
    });
    return [serializedDocuments];
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VectorStoreSupabaseInsert
});
//# sourceMappingURL=VectorStoreSupabaseInsert.node.js.map