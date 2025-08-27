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
var AgentToolV2_node_exports = {};
__export(AgentToolV2_node_exports, {
  AgentToolV2: () => AgentToolV2
});
module.exports = __toCommonJS(AgentToolV2_node_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_descriptions = require("../../../../utils/descriptions");
var import_utils = require("./utils");
var import_description = require("../agents/ToolsAgent/V2/description");
var import_execute = require("../agents/ToolsAgent/V2/execute");
class AgentToolV2 {
  constructor(baseDescription) {
    this.description = {
      ...baseDescription,
      version: [2.2],
      defaults: {
        name: "AI Agent Tool",
        color: "#404040"
      },
      inputs: `={{
				((hasOutputParser, needsFallback) => {
					${import_utils.getInputs.toString()};
					return getInputs(false, hasOutputParser, needsFallback)
				})($parameter.hasOutputParser === undefined || $parameter.hasOutputParser === true, $parameter.needsFallback !== undefined && $parameter.needsFallback === true)
			}}`,
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiTool],
      properties: [
        import_descriptions.toolDescription,
        {
          ...import_descriptions.textInput
        },
        {
          displayName: "Require Specific Output Format",
          name: "hasOutputParser",
          type: "boolean",
          default: false,
          noDataExpression: true
        },
        {
          displayName: `Connect an <a data-action='openSelectiveNodeCreator' data-action-parameter-connectiontype='${import_n8n_workflow.NodeConnectionTypes.AiOutputParser}'>output parser</a> on the canvas to specify the output format you require`,
          name: "notice",
          type: "notice",
          default: "",
          displayOptions: {
            show: {
              hasOutputParser: [true]
            }
          }
        },
        {
          displayName: "Enable Fallback Model",
          name: "needsFallback",
          type: "boolean",
          default: false,
          noDataExpression: true,
          displayOptions: {
            show: {
              "@version": [{ _cnd: { gte: 2.1 } }]
            }
          }
        },
        {
          displayName: "Connect an additional language model on the canvas to use it as a fallback if the main model fails",
          name: "fallbackNotice",
          type: "notice",
          default: "",
          displayOptions: {
            show: {
              needsFallback: [true]
            }
          }
        },
        ...(0, import_description.getToolsAgentProperties)({ withStreaming: false })
      ]
    };
  }
  // Automatically wrapped as a tool
  async execute() {
    return await import_execute.toolsAgentExecute.call(this);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AgentToolV2
});
//# sourceMappingURL=AgentToolV2.node.js.map