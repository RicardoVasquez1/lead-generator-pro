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
var OutputParserItemList_node_exports = {};
__export(OutputParserItemList_node_exports, {
  OutputParserItemList: () => OutputParserItemList
});
module.exports = __toCommonJS(OutputParserItemList_node_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_N8nItemListOutputParser = require("../../../utils/output_parsers/N8nItemListOutputParser");
var import_sharedFields = require("../../../utils/sharedFields");
class OutputParserItemList {
  constructor() {
    this.description = {
      displayName: "Item List Output Parser",
      name: "outputParserItemList",
      icon: "fa:bars",
      iconColor: "black",
      group: ["transform"],
      version: 1,
      description: "Return the results as separate items",
      defaults: {
        name: "Item List Output Parser"
      },
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Output Parsers"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.outputparseritemlist/"
            }
          ]
        }
      },
      inputs: [],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiOutputParser],
      outputNames: ["Output Parser"],
      properties: [
        (0, import_sharedFields.getConnectionHintNoticeField)([import_n8n_workflow.NodeConnectionTypes.AiChain, import_n8n_workflow.NodeConnectionTypes.AiAgent]),
        {
          displayName: "Options",
          name: "options",
          type: "collection",
          placeholder: "Add Option",
          default: {},
          options: [
            {
              displayName: "Number Of Items",
              name: "numberOfItems",
              type: "number",
              default: -1,
              description: "Defines how many items should be returned maximally. If set to -1, there is no limit."
            },
            // For that to be easily possible the metadata would have to be returned and be able to be read.
            // Would also be possible with a wrapper but that would be even more hacky and the output types
            // would not be correct anymore.
            // {
            // 	displayName: 'Parse Output',
            // 	name: 'parseOutput',
            // 	type: 'boolean',
            // 	default: true,
            // 	description: 'Whether the output should be automatically be parsed or left RAW',
            // },
            {
              displayName: "Separator",
              name: "separator",
              type: "string",
              default: "\\n",
              description: "Defines the separator that should be used to split the results into separate items. Defaults to a new line but can be changed depending on the data that should be returned."
            }
          ]
        }
      ]
    };
  }
  async supplyData(itemIndex) {
    const options = this.getNodeParameter("options", itemIndex, {});
    const parser = new import_N8nItemListOutputParser.N8nItemListOutputParser(options);
    return {
      response: parser
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  OutputParserItemList
});
//# sourceMappingURL=OutputParserItemList.node.js.map