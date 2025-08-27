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
var TextSplitterCharacterTextSplitter_node_exports = {};
__export(TextSplitterCharacterTextSplitter_node_exports, {
  TextSplitterCharacterTextSplitter: () => TextSplitterCharacterTextSplitter
});
module.exports = __toCommonJS(TextSplitterCharacterTextSplitter_node_exports);
var import_textsplitters = require("@langchain/textsplitters");
var import_n8n_workflow = require("n8n-workflow");
var import_logWrapper = require("../../../utils/logWrapper");
var import_sharedFields = require("../../../utils/sharedFields");
class TextSplitterCharacterTextSplitter {
  constructor() {
    this.description = {
      displayName: "Character Text Splitter",
      name: "textSplitterCharacterTextSplitter",
      icon: "fa:grip-lines-vertical",
      iconColor: "black",
      group: ["transform"],
      version: 1,
      description: "Split text into chunks by characters",
      defaults: {
        name: "Character Text Splitter"
      },
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Text Splitters"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.textsplittercharactertextsplitter/"
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
          displayName: "Separator",
          name: "separator",
          type: "string",
          default: ""
        },
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
    const separator = this.getNodeParameter("separator", itemIndex);
    const chunkSize = this.getNodeParameter("chunkSize", itemIndex);
    const chunkOverlap = this.getNodeParameter("chunkOverlap", itemIndex);
    const params = {
      separator,
      chunkSize,
      chunkOverlap,
      keepSeparator: false
    };
    const splitter = new import_textsplitters.CharacterTextSplitter(params);
    return {
      response: (0, import_logWrapper.logWrapper)(splitter, this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TextSplitterCharacterTextSplitter
});
//# sourceMappingURL=TextSplitterCharacterTextSplitter.node.js.map