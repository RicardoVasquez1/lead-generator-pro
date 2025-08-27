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
var ChainSummarization_node_exports = {};
__export(ChainSummarization_node_exports, {
  ChainSummarization: () => ChainSummarization
});
module.exports = __toCommonJS(ChainSummarization_node_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_ChainSummarizationV1 = require("./V1/ChainSummarizationV1.node");
var import_ChainSummarizationV2 = require("./V2/ChainSummarizationV2.node");
class ChainSummarization extends import_n8n_workflow.VersionedNodeType {
  constructor() {
    const baseDescription = {
      displayName: "Summarization Chain",
      name: "chainSummarization",
      icon: "fa:link",
      iconColor: "black",
      group: ["transform"],
      description: "Transforms text into a concise summary",
      codex: {
        alias: ["LangChain"],
        categories: ["AI"],
        subcategories: {
          AI: ["Chains", "Root Nodes"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.chainsummarization/"
            }
          ]
        }
      },
      defaultVersion: 2.1
    };
    const nodeVersions = {
      1: new import_ChainSummarizationV1.ChainSummarizationV1(baseDescription),
      2: new import_ChainSummarizationV2.ChainSummarizationV2(baseDescription),
      2.1: new import_ChainSummarizationV2.ChainSummarizationV2(baseDescription)
    };
    super(nodeVersions, baseDescription);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ChainSummarization
});
//# sourceMappingURL=ChainSummarization.node.js.map