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
var ToolWolframAlpha_node_exports = {};
__export(ToolWolframAlpha_node_exports, {
  ToolWolframAlpha: () => ToolWolframAlpha
});
module.exports = __toCommonJS(ToolWolframAlpha_node_exports);
var import_wolframalpha = require("@langchain/community/tools/wolframalpha");
var import_n8n_workflow = require("n8n-workflow");
var import_logWrapper = require("../../../utils/logWrapper");
var import_sharedFields = require("../../../utils/sharedFields");
class ToolWolframAlpha {
  constructor() {
    this.description = {
      displayName: "Wolfram|Alpha",
      name: "toolWolframAlpha",
      icon: "file:wolfram-alpha.svg",
      group: ["transform"],
      version: 1,
      description: "Connects to WolframAlpha's computational intelligence engine.",
      defaults: {
        name: "Wolfram Alpha"
      },
      credentials: [
        {
          name: "wolframAlphaApi",
          required: true
        }
      ],
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Tools"],
          Tools: ["Other Tools"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolwolframalpha/"
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
    const credentials = await this.getCredentials("wolframAlphaApi");
    return {
      response: (0, import_logWrapper.logWrapper)(new import_wolframalpha.WolframAlphaTool({ appid: credentials.appId }), this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ToolWolframAlpha
});
//# sourceMappingURL=ToolWolframAlpha.node.js.map