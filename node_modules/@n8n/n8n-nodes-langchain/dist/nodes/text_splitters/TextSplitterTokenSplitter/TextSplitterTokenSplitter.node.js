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
var TextSplitterTokenSplitter_node_exports = {};
__export(TextSplitterTokenSplitter_node_exports, {
  TextSplitterTokenSplitter: () => TextSplitterTokenSplitter
});
module.exports = __toCommonJS(TextSplitterTokenSplitter_node_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_logWrapper = require("../../../utils/logWrapper");
var import_sharedFields = require("../../../utils/sharedFields");
var import_TokenTextSplitter = require("./TokenTextSplitter");
class TextSplitterTokenSplitter {
  constructor() {
    this.description = {
      displayName: "Token Splitter",
      name: "textSplitterTokenSplitter",
      icon: "fa:grip-lines-vertical",
      iconColor: "black",
      group: ["transform"],
      version: 1,
      description: "Split text into chunks by tokens",
      defaults: {
        name: "Token Splitter"
      },
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Text Splitters"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.textsplittertokensplitter/"
            }
          ]
        }
      },
      inputs: [],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiTextSplitter],
      outputNames: ["Text Splitter"],
      properties: [
        (0, import_sharedFields.getConnectionHintNoticeField)([import_n8n_workflow.NodeConnectionTypes.AiDocument]),
        {
          displayName: "Chunk Size",
          name: "chunkSize",
          type: "number",
          default: 1e3
        },
        {
          displayName: "Chunk Overlap",
          name: "chunkOverlap",
          type: "number",
          default: 0
        }
      ]
    };
  }
  async supplyData(itemIndex) {
    this.logger.debug("Supply Data for Text Splitter");
    const chunkSize = this.getNodeParameter("chunkSize", itemIndex);
    const chunkOverlap = this.getNodeParameter("chunkOverlap", itemIndex);
    const splitter = new import_TokenTextSplitter.TokenTextSplitter({
      chunkSize,
      chunkOverlap,
      allowedSpecial: "all",
      disallowedSpecial: "all",
      encodingName: "cl100k_base",
      keepSeparator: false
    });
    return {
      response: (0, import_logWrapper.logWrapper)(splitter, this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TextSplitterTokenSplitter
});
//# sourceMappingURL=TextSplitterTokenSplitter.node.js.map