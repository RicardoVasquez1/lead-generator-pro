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
var RetrieverMultiQuery_node_exports = {};
__export(RetrieverMultiQuery_node_exports, {
  RetrieverMultiQuery: () => RetrieverMultiQuery
});
module.exports = __toCommonJS(RetrieverMultiQuery_node_exports);
var import_multi_query = require("langchain/retrievers/multi_query");
var import_n8n_workflow = require("n8n-workflow");
var import_logWrapper = require("../../../utils/logWrapper");
class RetrieverMultiQuery {
  constructor() {
    this.description = {
      displayName: "MultiQuery Retriever",
      name: "retrieverMultiQuery",
      icon: "fa:box-open",
      iconColor: "black",
      group: ["transform"],
      version: 1,
      description: "Automates prompt tuning, generates diverse queries and expands document pool for enhanced retrieval.",
      defaults: {
        name: "MultiQuery Retriever"
      },
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Retrievers"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.retrievermultiquery/"
            }
          ]
        }
      },
      inputs: [
        {
          displayName: "Model",
          maxConnections: 1,
          type: import_n8n_workflow.NodeConnectionTypes.AiLanguageModel,
          required: true
        },
        {
          displayName: "Retriever",
          maxConnections: 1,
          type: import_n8n_workflow.NodeConnectionTypes.AiRetriever,
          required: true
        }
      ],
      outputs: [
        {
          displayName: "Retriever",
          maxConnections: 1,
          type: import_n8n_workflow.NodeConnectionTypes.AiRetriever
        }
      ],
      properties: [
        {
          displayName: "Options",
          name: "options",
          placeholder: "Add Option",
          description: "Additional options to add",
          type: "collection",
          default: {},
          options: [
            {
              displayName: "Query Count",
              name: "queryCount",
              default: 3,
              typeOptions: { minValue: 1 },
              description: "Number of different versions of the given question to generate",
              type: "number"
            }
          ]
        }
      ]
    };
  }
  async supplyData(itemIndex) {
    this.logger.debug("Supplying data for MultiQuery Retriever");
    const options = this.getNodeParameter("options", itemIndex, {});
    const model = await this.getInputConnectionData(
      import_n8n_workflow.NodeConnectionTypes.AiLanguageModel,
      itemIndex
    );
    const baseRetriever = await this.getInputConnectionData(
      import_n8n_workflow.NodeConnectionTypes.AiRetriever,
      itemIndex
    );
    const retriever = import_multi_query.MultiQueryRetriever.fromLLM({
      llm: model,
      retriever: baseRetriever,
      ...options
    });
    return {
      response: (0, import_logWrapper.logWrapper)(retriever, this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RetrieverMultiQuery
});
//# sourceMappingURL=RetrieverMultiQuery.node.js.map