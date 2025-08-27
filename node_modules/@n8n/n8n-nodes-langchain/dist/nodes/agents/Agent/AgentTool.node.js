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
var AgentTool_node_exports = {};
__export(AgentTool_node_exports, {
  AgentTool: () => AgentTool
});
module.exports = __toCommonJS(AgentTool_node_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_AgentToolV2 = require("./V2/AgentToolV2.node");
class AgentTool extends import_n8n_workflow.VersionedNodeType {
  constructor() {
    const baseDescription = {
      displayName: "AI Agent Tool",
      name: "agentTool",
      icon: "fa:robot",
      iconColor: "black",
      group: ["transform"],
      description: "Generates an action plan and executes it. Can use external tools.",
      codex: {
        alias: ["LangChain", "Chat", "Conversational", "Plan and Execute", "ReAct", "Tools"],
        categories: ["AI"],
        subcategories: {
          AI: ["Tools"],
          Tools: ["Other Tools"]
        }
      },
      defaultVersion: 2.2
    };
    const nodeVersions = {
      // Should have the same versioning as Agent node
      // because internal agent logic often checks for node version
      2.2: new import_AgentToolV2.AgentToolV2(baseDescription)
    };
    super(nodeVersions, baseDescription);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AgentTool
});
//# sourceMappingURL=AgentTool.node.js.map