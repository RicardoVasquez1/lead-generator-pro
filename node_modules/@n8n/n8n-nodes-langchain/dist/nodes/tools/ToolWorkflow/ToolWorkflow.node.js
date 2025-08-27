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
var ToolWorkflow_node_exports = {};
__export(ToolWorkflow_node_exports, {
  ToolWorkflow: () => ToolWorkflow
});
module.exports = __toCommonJS(ToolWorkflow_node_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_ToolWorkflowV1 = require("./v1/ToolWorkflowV1.node");
var import_ToolWorkflowV2 = require("./v2/ToolWorkflowV2.node");
class ToolWorkflow extends import_n8n_workflow.VersionedNodeType {
  constructor() {
    const baseDescription = {
      displayName: "Call n8n Sub-Workflow Tool",
      name: "toolWorkflow",
      icon: "fa:network-wired",
      iconColor: "black",
      group: ["transform"],
      description: "Uses another n8n workflow as a tool. Allows packaging any n8n node(s) as a tool.",
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Tools"],
          Tools: ["Recommended Tools"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolworkflow/"
            }
          ]
        }
      },
      defaultVersion: 2.2
    };
    const nodeVersions = {
      1: new import_ToolWorkflowV1.ToolWorkflowV1(baseDescription),
      1.1: new import_ToolWorkflowV1.ToolWorkflowV1(baseDescription),
      1.2: new import_ToolWorkflowV1.ToolWorkflowV1(baseDescription),
      1.3: new import_ToolWorkflowV1.ToolWorkflowV1(baseDescription),
      2: new import_ToolWorkflowV2.ToolWorkflowV2(baseDescription),
      2.1: new import_ToolWorkflowV2.ToolWorkflowV2(baseDescription),
      2.2: new import_ToolWorkflowV2.ToolWorkflowV2(baseDescription)
    };
    super(nodeVersions, baseDescription);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ToolWorkflow
});
//# sourceMappingURL=ToolWorkflow.node.js.map