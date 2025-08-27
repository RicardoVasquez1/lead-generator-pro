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
var ToolSearXng_node_exports = {};
__export(ToolSearXng_node_exports, {
  ToolSearXng: () => ToolSearXng
});
module.exports = __toCommonJS(ToolSearXng_node_exports);
var import_searxng_search = require("@langchain/community/tools/searxng_search");
var import_n8n_workflow = require("n8n-workflow");
var import_logWrapper = require("../../../utils/logWrapper");
var import_sharedFields = require("../../../utils/sharedFields");
class ToolSearXng {
  constructor() {
    this.description = {
      displayName: "SearXNG",
      name: "toolSearXng",
      icon: "file:searXng.svg",
      group: ["transform"],
      version: 1,
      description: "Search in SearXNG",
      defaults: {
        name: "SearXNG"
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
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolsearxng"
            }
          ]
        }
      },
      inputs: [],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiTool],
      outputNames: ["Tool"],
      credentials: [
        {
          name: "searXngApi",
          required: true
        }
      ],
      properties: [
        (0, import_sharedFields.getConnectionHintNoticeField)([import_n8n_workflow.NodeConnectionTypes.AiAgent]),
        {
          displayName: "Options",
          name: "options",
          type: "collection",
          placeholder: "Add Option",
          default: {},
          options: [
            {
              displayName: "Number of Results",
              name: "numResults",
              type: "number",
              default: 10
            },
            {
              displayName: "Search Page Number",
              name: "pageNumber",
              type: "number",
              default: 1
            },
            {
              displayName: "Language",
              name: "language",
              type: "string",
              default: "en",
              description: 'Defines the language to use. It\'s a two-letter language code. (e.g., `en` for English, `es` for Spanish, or `fr` for French). Head to <a href="https://docs.searxng.org/user/search-syntax.html#select-language">SearXNG search syntax page</a> for more info.'
            },
            {
              displayName: "Safe Search",
              name: "safesearch",
              type: "options",
              options: [
                {
                  name: "None",
                  value: 0
                },
                {
                  name: "Moderate",
                  value: 1
                },
                {
                  name: "Strict",
                  value: 2
                }
              ],
              default: 0,
              description: "Filter search results of engines which support safe search"
            }
          ]
        }
      ]
    };
  }
  async supplyData(itemIndex) {
    const credentials = await this.getCredentials("searXngApi");
    const options = this.getNodeParameter("options", itemIndex);
    const tool = new import_searxng_search.SearxngSearch({
      apiBase: credentials.apiUrl,
      headers: {
        Accept: "application/json"
      },
      params: options
    });
    return {
      response: (0, import_logWrapper.logWrapper)(tool, this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ToolSearXng
});
//# sourceMappingURL=ToolSearXng.node.js.map