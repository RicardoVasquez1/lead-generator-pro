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
var ToolSerpApi_node_exports = {};
__export(ToolSerpApi_node_exports, {
  ToolSerpApi: () => ToolSerpApi
});
module.exports = __toCommonJS(ToolSerpApi_node_exports);
var import_serpapi = require("@langchain/community/tools/serpapi");
var import_n8n_workflow = require("n8n-workflow");
var import_logWrapper = require("../../../utils/logWrapper");
var import_sharedFields = require("../../../utils/sharedFields");
class ToolSerpApi {
  constructor() {
    this.description = {
      displayName: "SerpApi (Google Search)",
      name: "toolSerpApi",
      icon: "file:serpApi.svg",
      group: ["transform"],
      version: 1,
      description: "Search in Google using SerpAPI",
      defaults: {
        name: "SerpAPI"
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
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolserpapi/"
            }
          ]
        }
      },
      inputs: [],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiTool],
      outputNames: ["Tool"],
      credentials: [
        {
          name: "serpApi",
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
              displayName: "Country",
              name: "gl",
              type: "string",
              default: "us",
              description: 'Defines the country to use for search. Head to <a href="https://serpapi.com/google-countries">Google countries page</a> for a full list of supported countries.'
            },
            {
              displayName: "Device",
              name: "device",
              type: "options",
              options: [
                {
                  name: "Desktop",
                  value: "desktop"
                },
                {
                  name: "Mobile",
                  value: "mobile"
                },
                {
                  name: "Tablet",
                  value: "tablet"
                }
              ],
              default: "desktop",
              description: "Device to use to get the results"
            },
            {
              displayName: "Explicit Array",
              name: "no_cache",
              type: "boolean",
              default: false,
              description: "Whether to force SerpApi to fetch the Google results even if a cached version is already present. Cache expires after 1h. Cached searches are free, and are not counted towards your searches per month."
            },
            {
              displayName: "Google Domain",
              name: "google_domain",
              type: "string",
              default: "google.com",
              description: 'Defines the domain to use for search. Head to <a href="https://serpapi.com/google-domains">Google domains page</a> for a full list of supported domains.'
            },
            {
              displayName: "Language",
              name: "hl",
              type: "string",
              default: "en",
              description: 'Defines the language to use. It\'s a two-letter language code. (e.g., `en` for English, `es` for Spanish, or `fr` for French). Head to <a href="https://serpapi.com/google-languages">Google languages page</a> for a full list of supported languages.'
            }
          ]
        }
      ]
    };
  }
  async supplyData(itemIndex) {
    const credentials = await this.getCredentials("serpApi");
    const options = this.getNodeParameter("options", itemIndex);
    return {
      response: (0, import_logWrapper.logWrapper)(new import_serpapi.SerpAPI(credentials.apiKey, options), this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ToolSerpApi
});
//# sourceMappingURL=ToolSerpApi.node.js.map