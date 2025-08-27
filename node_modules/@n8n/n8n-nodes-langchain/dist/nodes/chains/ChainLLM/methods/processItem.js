"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var processItem_exports = {};
__export(processItem_exports, {
  processItem: () => processItem
});
module.exports = __toCommonJS(processItem_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_node_assert = __toESM(require("node:assert"));
var import_helpers = require("../../../../utils/helpers");
var import_N8nOutputParser = require("../../../../utils/output_parsers/N8nOutputParser");
var import_chainExecutor = require("./chainExecutor");
async function getChatModel(ctx, index = 0) {
  const connectedModels = await ctx.getInputConnectionData(import_n8n_workflow.NodeConnectionTypes.AiLanguageModel, 0);
  let model;
  if (Array.isArray(connectedModels) && index !== void 0) {
    if (connectedModels.length <= index) {
      return void 0;
    }
    const reversedModels = [...connectedModels].reverse();
    model = reversedModels[index];
  } else {
    model = connectedModels;
  }
  return model;
}
const processItem = async (ctx, itemIndex) => {
  const needsFallback = ctx.getNodeParameter("needsFallback", 0, false);
  const llm = await getChatModel(ctx, 0);
  (0, import_node_assert.default)(llm, "Please connect a model to the Chat Model input");
  const fallbackLlm = needsFallback ? await getChatModel(ctx, 1) : null;
  if (needsFallback && !fallbackLlm) {
    throw new import_n8n_workflow.NodeOperationError(
      ctx.getNode(),
      "Please connect a model to the Fallback Model input or disable the fallback option"
    );
  }
  const outputParser = await (0, import_N8nOutputParser.getOptionalOutputParser)(ctx, itemIndex);
  let prompt;
  if (ctx.getNode().typeVersion <= 1.3) {
    prompt = ctx.getNodeParameter("prompt", itemIndex);
  } else {
    prompt = (0, import_helpers.getPromptInputByType)({
      ctx,
      i: itemIndex,
      inputKey: "text",
      promptTypeKey: "promptType"
    });
  }
  if (prompt === void 0) {
    throw new import_n8n_workflow.NodeOperationError(ctx.getNode(), "The 'prompt' parameter is empty.");
  }
  const messages = ctx.getNodeParameter(
    "messages.messageValues",
    itemIndex,
    []
  );
  return await (0, import_chainExecutor.executeChain)({
    context: ctx,
    itemIndex,
    query: prompt,
    llm,
    outputParser,
    messages,
    fallbackLlm
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  processItem
});
//# sourceMappingURL=processItem.js.map