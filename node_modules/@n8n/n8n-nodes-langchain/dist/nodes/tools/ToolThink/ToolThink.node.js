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
var ToolThink_node_exports = {};
__export(ToolThink_node_exports, {
  ToolThink: () => ToolThink
});
module.exports = __toCommonJS(ToolThink_node_exports);
var import_tools = require("langchain/tools");
var import_n8n_workflow = require("n8n-workflow");
var import_logWrapper = require("../../../utils/logWrapper");
var import_sharedFields = require("../../../utils/sharedFields");
const defaultToolDescription = "Use the tool to think about something. It will not obtain new information or change the database, but just append the thought to the log. Use it when complex reasoning or some cache memory is needed.";
class ToolThink {
  constructor() {
    this.description = {
      displayName: "Think Tool",
      name: "toolThink",
      icon: "fa:brain",
      iconColor: "black",
      group: ["transform"],
      version: [1, 1.1],
      description: "Invite the AI agent to do some thinking",
      defaults: {
        name: "Think"
      },
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Tools"],
          Tools: ["Other Tools"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolthink/"
            }
          ]
        }
      },
      inputs: [],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiTool],
      outputNames: ["Tool"],
      properties: [
        (0, import_sharedFields.getConnectionHintNoticeField)([import_n8n_workflow.NodeConnectionTypes.AiAgent]),
        {
          displayName: "Think Tool Description",
          name: "description",
          type: "string",
          default: defaultToolDescription,
          placeholder: "[Describe your thinking tool here, explaining how it will help the AI think]",
          description: "The thinking tool's description",
          typeOptions: {
            rows: 3
          },
          required: true
        }
      ]
    };
  }
  async supplyData(itemIndex) {
    const node = this.getNode();
    const { typeVersion } = node;
    const name = typeVersion === 1 ? "thinking_tool" : (0, import_n8n_workflow.nodeNameToToolName)(node);
    const description = this.getNodeParameter("description", itemIndex);
    const tool = new import_tools.DynamicTool({
      name,
      description,
      func: async (subject) => {
        return subject;
      }
    });
    return {
      response: (0, import_logWrapper.logWrapper)(tool, this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ToolThink
});
//# sourceMappingURL=ToolThink.node.js.map