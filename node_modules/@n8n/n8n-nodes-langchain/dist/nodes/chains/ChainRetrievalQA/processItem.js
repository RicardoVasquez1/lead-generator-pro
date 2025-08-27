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
var import_prompts = require("@langchain/core/prompts");
var import_combine_documents = require("langchain/chains/combine_documents");
var import_retrieval = require("langchain/chains/retrieval");
var import_n8n_workflow = require("n8n-workflow");
var import_helpers = require("../../../utils/helpers");
var import_tracing = require("../../../utils/tracing");
var import_constants = require("./constants");
const processItem = async (ctx, itemIndex) => {
  const model = await ctx.getInputConnectionData(
    import_n8n_workflow.NodeConnectionTypes.AiLanguageModel,
    0
  );
  const retriever = await ctx.getInputConnectionData(
    import_n8n_workflow.NodeConnectionTypes.AiRetriever,
    0
  );
  let query;
  if (ctx.getNode().typeVersion <= 1.2) {
    query = ctx.getNodeParameter("query", itemIndex);
  } else {
    query = (0, import_helpers.getPromptInputByType)({
      ctx,
      i: itemIndex,
      inputKey: "text",
      promptTypeKey: "promptType"
    });
  }
  if (query === void 0) {
    throw new import_n8n_workflow.NodeOperationError(ctx.getNode(), "The \u2018query\u2018 parameter is empty.");
  }
  const options = ctx.getNodeParameter("options", itemIndex, {});
  let templateText = options.systemPromptTemplate ?? import_constants.SYSTEM_PROMPT_TEMPLATE;
  if (ctx.getNode().typeVersion < 1.5) {
    templateText = templateText.replace(
      `{${import_constants.LEGACY_INPUT_TEMPLATE_KEY}}`,
      `{${import_constants.INPUT_TEMPLATE_KEY}}`
    );
  }
  let promptTemplate;
  if ((0, import_helpers.isChatInstance)(model)) {
    const messages = [
      import_prompts.SystemMessagePromptTemplate.fromTemplate(templateText),
      import_prompts.HumanMessagePromptTemplate.fromTemplate("{input}")
    ];
    promptTemplate = import_prompts.ChatPromptTemplate.fromMessages(messages);
  } else {
    const questionSuffix = options.systemPromptTemplate === void 0 ? "\n\nQuestion: {input}\nAnswer:" : "";
    promptTemplate = new import_prompts.PromptTemplate({
      template: templateText + questionSuffix,
      inputVariables: ["context", "input"]
    });
  }
  const combineDocsChain = await (0, import_combine_documents.createStuffDocumentsChain)({
    llm: model,
    prompt: promptTemplate
  });
  const retrievalChain = await (0, import_retrieval.createRetrievalChain)({
    combineDocsChain,
    retriever
  });
  const tracingConfig = (0, import_tracing.getTracingConfig)(ctx);
  return await retrievalChain.withConfig(tracingConfig).invoke({ input: query }, { signal: ctx.getExecutionCancelSignal() });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  processItem
});
//# sourceMappingURL=processItem.js.map