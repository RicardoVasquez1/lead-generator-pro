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
var N8nOutputParser_exports = {};
__export(N8nOutputParser_exports, {
  N8nItemListOutputParser: () => import_N8nItemListOutputParser.N8nItemListOutputParser,
  N8nOutputFixingParser: () => import_N8nOutputFixingParser.N8nOutputFixingParser,
  N8nStructuredOutputParser: () => import_N8nStructuredOutputParser.N8nStructuredOutputParser,
  getOptionalOutputParser: () => getOptionalOutputParser
});
module.exports = __toCommonJS(N8nOutputParser_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_N8nItemListOutputParser = require("./N8nItemListOutputParser");
var import_N8nOutputFixingParser = require("./N8nOutputFixingParser");
var import_N8nStructuredOutputParser = require("./N8nStructuredOutputParser");
async function getOptionalOutputParser(ctx, index = 0) {
  let outputParser;
  if (ctx.getNodeParameter("hasOutputParser", 0, true) === true) {
    outputParser = await ctx.getInputConnectionData(
      import_n8n_workflow.NodeConnectionTypes.AiOutputParser,
      index
    );
  }
  return outputParser;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  N8nItemListOutputParser,
  N8nOutputFixingParser,
  N8nStructuredOutputParser,
  getOptionalOutputParser
});
//# sourceMappingURL=N8nOutputParser.js.map