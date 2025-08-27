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
var ToolExecutor_node_exports = {};
__export(ToolExecutor_node_exports, {
  ToolExecutor: () => ToolExecutor
});
module.exports = __toCommonJS(ToolExecutor_node_exports);
var import_tools = require("@langchain/core/tools");
var import_n8n_workflow = require("n8n-workflow");
var import_executeTool = require("./utils/executeTool");
class ToolExecutor {
  constructor() {
    this.description = {
      displayName: "Tool Executor",
      name: "toolExecutor",
      version: 1,
      defaults: {
        name: "Tool Executor"
      },
      hidden: true,
      inputs: [import_n8n_workflow.NodeConnectionTypes.Main, import_n8n_workflow.NodeConnectionTypes.AiTool],
      outputs: [import_n8n_workflow.NodeConnectionTypes.Main],
      properties: [
        {
          displayName: "Query",
          name: "query",
          type: "json",
          default: "{}",
          description: "Parameters to pass to the tool as JSON or string"
        },
        {
          displayName: "Tool Name",
          name: "toolName",
          type: "string",
          default: "",
          description: "Name of the tool to execute if the connected tool is a toolkit"
        }
      ],
      group: ["transform"],
      description: "Node to execute tools without an AI Agent"
    };
  }
  async execute() {
    const query = this.getNodeParameter("query", 0, {});
    const toolName = this.getNodeParameter("toolName", 0, "");
    let parsedQuery;
    try {
      parsedQuery = typeof query === "string" ? JSON.parse(query) : query;
    } catch (error) {
      parsedQuery = query;
    }
    const resultData = [];
    const toolInputs = await this.getInputConnectionData(import_n8n_workflow.NodeConnectionTypes.AiTool, 0);
    if (!toolInputs || !Array.isArray(toolInputs)) {
      throw new import_n8n_workflow.NodeOperationError(this.getNode(), "No tool inputs found");
    }
    try {
      for (const tool of toolInputs) {
        if (tool && typeof tool.getTools === "function") {
          const toolsInToolkit = tool.getTools();
          for (const toolkitTool of toolsInToolkit) {
            if (toolkitTool instanceof import_tools.Tool || toolkitTool instanceof import_tools.StructuredTool) {
              if (toolName === toolkitTool.name) {
                const result = await (0, import_executeTool.executeTool)(toolkitTool, parsedQuery);
                resultData.push(result);
              }
            }
          }
        } else {
          if (!toolName || toolName === tool.name) {
            const result = await (0, import_executeTool.executeTool)(tool, parsedQuery);
            resultData.push(result);
          }
        }
      }
    } catch (error) {
      throw new import_n8n_workflow.NodeOperationError(
        this.getNode(),
        `Error executing tool: ${error.message}`
      );
    }
    return [resultData];
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ToolExecutor
});
//# sourceMappingURL=ToolExecutor.node.js.map