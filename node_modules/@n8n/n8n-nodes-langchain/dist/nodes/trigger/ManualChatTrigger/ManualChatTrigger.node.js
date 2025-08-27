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
var ManualChatTrigger_node_exports = {};
__export(ManualChatTrigger_node_exports, {
  ManualChatTrigger: () => ManualChatTrigger
});
module.exports = __toCommonJS(ManualChatTrigger_node_exports);
var import_n8n_workflow = require("n8n-workflow");
class ManualChatTrigger {
  constructor() {
    this.description = {
      displayName: "Manual Chat Trigger",
      name: "manualChatTrigger",
      icon: "fa:comments",
      group: ["trigger"],
      version: [1, 1.1],
      description: "Runs the flow on new manual chat message",
      eventTriggerDescription: "",
      maxNodes: 1,
      hidden: true,
      defaults: {
        name: "When chat message received",
        color: "#909298"
      },
      codex: {
        categories: ["Core Nodes"],
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-langchain.chattrigger/"
            }
          ]
        },
        subcategories: {
          "Core Nodes": ["Other Trigger Nodes"]
        }
      },
      inputs: [],
      outputs: [import_n8n_workflow.NodeConnectionTypes.Main],
      properties: [
        {
          displayName: "This node is where a manual chat workflow execution starts. To make one, go back to the canvas and click \u2018Chat\u2019",
          name: "notice",
          type: "notice",
          default: ""
        },
        {
          // eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
          displayName: "Chat and execute workflow",
          name: "openChat",
          type: "button",
          typeOptions: {
            buttonConfig: {
              action: "openChat"
            }
          },
          default: ""
        }
      ]
    };
  }
  async trigger() {
    const manualTriggerFunction = async () => {
      this.emit([this.helpers.returnJsonArray([{}])]);
    };
    return {
      manualTriggerFunction
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ManualChatTrigger
});
//# sourceMappingURL=ManualChatTrigger.node.js.map