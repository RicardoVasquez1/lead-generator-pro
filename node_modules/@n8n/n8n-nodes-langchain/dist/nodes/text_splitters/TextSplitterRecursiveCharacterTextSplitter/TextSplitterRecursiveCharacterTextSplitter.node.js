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
var TextSplitterRecursiveCharacterTextSplitter_node_exports = {};
__export(TextSplitterRecursiveCharacterTextSplitter_node_exports, {
  TextSplitterRecursiveCharacterTextSplitter: () => TextSplitterRecursiveCharacterTextSplitter
});
module.exports = __toCommonJS(TextSplitterRecursiveCharacterTextSplitter_node_exports);
var import_textsplitters = require("@langchain/textsplitters");
var import_n8n_workflow = require("n8n-workflow");
var import_logWrapper = require("../../../utils/logWrapper");
var import_sharedFields = require("../../../utils/sharedFields");
const supportedLanguages = [
  "cpp",
  "go",
  "java",
  "js",
  "php",
  "proto",
  "python",
  "rst",
  "ruby",
  "rust",
  "scala",
  "swift",
  "markdown",
  "latex",
  "html"
];
class TextSplitterRecursiveCharacterTextSplitter {
  constructor() {
    this.description = {
      displayName: "Recursive Character Text Splitter",
      name: "textSplitterRecursiveCharacterTextSplitter",
      icon: "fa:grip-lines-vertical",
      iconColor: "black",
      group: ["transform"],
      version: 1,
      description: "Split text into chunks by characters recursively, recommended for most use cases",
      defaults: {
        name: "Recursive Character Text Splitter"
      },
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Text Splitters"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.textsplitterrecursivecharactertextsplitter/"
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
        },
        {
          displayName: "Options",
          name: "options",
          placeholder: "Add Option",
          description: "Additional options to add",
          type: "collection",
          default: {},
          options: [
            {
              displayName: "Split Code",
              name: "splitCode",
              default: "markdown",
              type: "options",
              options: supportedLanguages.map((lang) => ({ name: lang, value: lang }))
            }
          ]
        }
      ]
    };
  }
  async supplyData(itemIndex) {
    this.logger.debug("Supply Data for Text Splitter");
    const chunkSize = this.getNodeParameter("chunkSize", itemIndex);
    const chunkOverlap = this.getNodeParameter("chunkOverlap", itemIndex);
    const splitCode = this.getNodeParameter(
      "options.splitCode",
      itemIndex,
      null
    );
    const params = {
      // TODO: These are the default values, should we allow the user to change them?
      separators: ["\n\n", "\n", " ", ""],
      chunkSize,
      chunkOverlap,
      keepSeparator: false
    };
    let splitter;
    if (splitCode && supportedLanguages.includes(splitCode)) {
      splitter = import_textsplitters.RecursiveCharacterTextSplitter.fromLanguage(splitCode, params);
    } else {
      splitter = new import_textsplitters.RecursiveCharacterTextSplitter(params);
    }
    return {
      response: (0, import_logWrapper.logWrapper)(splitter, this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TextSplitterRecursiveCharacterTextSplitter
});
//# sourceMappingURL=TextSplitterRecursiveCharacterTextSplitter.node.js.map