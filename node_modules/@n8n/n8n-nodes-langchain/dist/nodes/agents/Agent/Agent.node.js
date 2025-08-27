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
var Agent_node_exports = {};
__export(Agent_node_exports, {
  Agent: () => Agent
});
module.exports = __toCommonJS(Agent_node_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_AgentV1 = require("./V1/AgentV1.node");
var import_AgentV2 = require("./V2/AgentV2.node");
class Agent extends import_n8n_workflow.VersionedNodeType {
  constructor() {
    const baseDescription = {
      displayName: "AI Agent",
      name: "agent",
      icon: "fa:robot",
      iconColor: "black",
      group: ["transform"],
      description: "Generates an action plan and executes it. Can use external tools.",
      codex: {
        alias: ["LangChain", "Chat", "Conversational", "Plan and Execute", "ReAct", "Tools"],
        categories: ["AI"],
        subcategories: {
          AI: ["Agents", "Root Nodes"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/"
            }
          ]
        }
      },
      defaultVersion: 2.2
    };
    const nodeVersions = {
      1: new import_AgentV1.AgentV1(baseDescription),
      1.1: new import_AgentV1.AgentV1(baseDescription),
      1.2: new import_AgentV1.AgentV1(baseDescription),
      1.3: new import_AgentV1.AgentV1(baseDescription),
      1.4: new import_AgentV1.AgentV1(baseDescription),
      1.5: new import_AgentV1.AgentV1(baseDescription),
      1.6: new import_AgentV1.AgentV1(baseDescription),
      1.7: new import_AgentV1.AgentV1(baseDescription),
      1.8: new import_AgentV1.AgentV1(baseDescription),
      1.9: new import_AgentV1.AgentV1(baseDescription),
      2: new import_AgentV2.AgentV2(baseDescription),
      2.1: new import_AgentV2.AgentV2(baseDescription),
      2.2: new import_AgentV2.AgentV2(baseDescription)
      // IMPORTANT Reminder to update AgentTool
    };
    super(nodeVersions, baseDescription);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Agent
});
//# sourceMappingURL=Agent.node.js.map