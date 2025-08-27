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
var VectorStoreSupabaseLoad_node_exports = {};
__export(VectorStoreSupabaseLoad_node_exports, {
  VectorStoreSupabaseLoad: () => VectorStoreSupabaseLoad
});
module.exports = __toCommonJS(VectorStoreSupabaseLoad_node_exports);
var import_supabase = require("@langchain/community/vectorstores/supabase");
var import_supabase_js = require("@supabase/supabase-js");
var import_n8n_workflow = require("n8n-workflow");
var import_helpers = require("../../../utils/helpers");
var import_logWrapper = require("../../../utils/logWrapper");
var import_sharedFields = require("../../../utils/sharedFields");
var import_listSearch = require("../shared/createVectorStoreNode/methods/listSearch");
var import_descriptions = require("../shared/descriptions");
class VectorStoreSupabaseLoad {
  constructor() {
    this.description = {
      displayName: "Supabase: Load",
      name: "vectorStoreSupabaseLoad",
      icon: "file:supabase.svg",
      // Vector Store nodes got merged into a single node
      hidden: true,
      group: ["transform"],
      version: 1,
      description: "Load data from Supabase Vector Store index",
      defaults: {
        name: "Supabase: Load"
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
        {
          displayName: "Embedding",
          maxConnections: 1,
          type: import_n8n_workflow.NodeConnectionTypes.AiEmbedding,
          required: true
        }
      ],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiVectorStore],
      outputNames: ["Vector Store"],
      properties: [
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
          displayName: "Options",
          name: "options",
          type: "collection",
          placeholder: "Add Option",
          default: {},
          options: [import_sharedFields.metadataFilterField]
        }
      ]
    };
    this.methods = { listSearch: { supabaseTableNameSearch: import_listSearch.supabaseTableNameSearch } };
  }
  async supplyData(itemIndex) {
    this.logger.debug("Supply Supabase Load Vector Store");
    const tableName = this.getNodeParameter("tableName", itemIndex, "", {
      extractValue: true
    });
    const queryName = this.getNodeParameter("queryName", itemIndex);
    const credentials = await this.getCredentials("supabaseApi");
    const embeddings = await this.getInputConnectionData(
      import_n8n_workflow.NodeConnectionTypes.AiEmbedding,
      0
    );
    const client = (0, import_supabase_js.createClient)(credentials.host, credentials.serviceRole);
    const config = {
      client,
      tableName,
      queryName,
      filter: (0, import_helpers.getMetadataFiltersValues)(this, itemIndex)
    };
    const vectorStore = await import_supabase.SupabaseVectorStore.fromExistingIndex(embeddings, config);
    return {
      response: (0, import_logWrapper.logWrapper)(vectorStore, this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VectorStoreSupabaseLoad
});
//# sourceMappingURL=VectorStoreSupabaseLoad.node.js.map