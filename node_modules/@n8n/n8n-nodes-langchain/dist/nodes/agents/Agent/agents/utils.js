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
var utils_exports = {};
__export(utils_exports, {
  checkForStructuredTools: () => checkForStructuredTools,
  extractParsedOutput: () => extractParsedOutput
});
module.exports = __toCommonJS(utils_exports);
var import_n8n_workflow = require("n8n-workflow");
async function extractParsedOutput(ctx, outputParser, output) {
  const parsedOutput = await outputParser.parse(output);
  if (ctx.getNode().typeVersion <= 1.6) {
    return parsedOutput;
  }
  return parsedOutput?.output ?? parsedOutput;
}
async function checkForStructuredTools(tools, node, currentAgentType) {
  const dynamicStructuredTools = tools.filter(
    (tool) => tool.constructor.name === "DynamicStructuredTool"
  );
  if (dynamicStructuredTools.length > 0) {
    const getToolName = (tool) => `"${tool.name}"`;
    throw new import_n8n_workflow.NodeOperationError(
      node,
      `The selected tools are not supported by "${currentAgentType}", please use "Tools Agent" instead`,
      {
        itemIndex: 0,
        description: `Incompatible connected tools: ${dynamicStructuredTools.map(getToolName).join(", ")}`
      }
    );
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  checkForStructuredTools,
  extractParsedOutput
});
//# sourceMappingURL=utils.js.map