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
var processItem_exports = {};
__export(processItem_exports, {
  processItem: () => processItem
});
module.exports = __toCommonJS(processItem_exports);
var import_messages = require("@langchain/core/messages");
var import_prompts = require("@langchain/core/prompts");
var import_n8n_workflow = require("n8n-workflow");
var import_tracing = require("../../../utils/tracing");
var import_constants = require("./constants");
async function processItem(ctx, itemIndex, llm, parser) {
  const input = ctx.getNodeParameter("text", itemIndex);
  if (!input?.trim()) {
    throw new import_n8n_workflow.NodeOperationError(ctx.getNode(), `Text for item ${itemIndex} is not defined`, {
      itemIndex
    });
  }
  const inputPrompt = new import_messages.HumanMessage(input);
  const options = ctx.getNodeParameter("options", itemIndex, {});
  const systemPromptTemplate = import_prompts.SystemMessagePromptTemplate.fromTemplate(
    `${options.systemPromptTemplate ?? import_constants.SYSTEM_PROMPT_TEMPLATE}
{format_instructions}`
  );
  const messages = [
    await systemPromptTemplate.format({
      format_instructions: parser.getFormatInstructions()
    }),
    inputPrompt
  ];
  const prompt = import_prompts.ChatPromptTemplate.fromMessages(messages);
  const chain = prompt.pipe(llm).pipe(parser).withConfig((0, import_tracing.getTracingConfig)(ctx));
  return await chain.invoke(messages);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  processItem
});
//# sourceMappingURL=processItem.js.map