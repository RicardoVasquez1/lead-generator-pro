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
var ToolWikipedia_node_exports = {};
__export(ToolWikipedia_node_exports, {
  ToolWikipedia: () => ToolWikipedia
});
module.exports = __toCommonJS(ToolWikipedia_node_exports);
var import_wikipedia_query_run = require("@langchain/community/tools/wikipedia_query_run");
var import_n8n_workflow = require("n8n-workflow");
var import_logWrapper = require("../../../utils/logWrapper");
var import_sharedFields = require("../../../utils/sharedFields");
class ToolWikipedia {
  constructor() {
    this.description = {
      displayName: "Wikipedia",
      name: "toolWikipedia",
      icon: "file:wikipedia.svg",
      group: ["transform"],
      version: 1,
      description: "Search in Wikipedia",
      defaults: {
        name: "Wikipedia"
      },
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Tools"],
          Tools: ["Other Tools"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolwikipedia/"
            }
          ]
        }
      },
      inputs: [],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiTool],
      outputNames: ["Tool"],
      properties: [(0, import_sharedFields.getConnectionHintNoticeField)([import_n8n_workflow.NodeConnectionTypes.AiAgent])]
    };
  }
  async supplyData() {
    const WikiTool = new import_wikipedia_query_run.WikipediaQueryRun();
    WikiTool.description = "A tool for interacting with and fetching data from the Wikipedia API. The input should always be a string query.";
    return {
      response: (0, import_logWrapper.logWrapper)(WikiTool, this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ToolWikipedia
});
//# sourceMappingURL=ToolWikipedia.node.js.map