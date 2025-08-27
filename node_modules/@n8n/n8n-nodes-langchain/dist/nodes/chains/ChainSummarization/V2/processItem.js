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
var import_textsplitters = require("@langchain/textsplitters");
var import_chains = require("langchain/chains");
var import_n8n_workflow = require("n8n-workflow");
var import_N8nBinaryLoader = require("../../../../utils/N8nBinaryLoader");
var import_N8nJsonLoader = require("../../../../utils/N8nJsonLoader");
var import_tracing = require("../../../../utils/tracing");
var import_helpers = require("../helpers");
async function processItem(ctx, itemIndex, item, operationMode, chunkingMode) {
  const model = await ctx.getInputConnectionData(
    import_n8n_workflow.NodeConnectionTypes.AiLanguageModel,
    0
  );
  const summarizationMethodAndPrompts = ctx.getNodeParameter(
    "options.summarizationMethodAndPrompts.values",
    itemIndex,
    {}
  );
  const chainArgs = (0, import_helpers.getChainPromptsArgs)(
    summarizationMethodAndPrompts.summarizationMethod ?? "map_reduce",
    summarizationMethodAndPrompts
  );
  const chain = (0, import_chains.loadSummarizationChain)(model, chainArgs);
  let processedDocuments;
  if (operationMode === "documentLoader") {
    const documentInput = await ctx.getInputConnectionData(import_n8n_workflow.NodeConnectionTypes.AiDocument, 0);
    const isN8nLoader = documentInput instanceof import_N8nJsonLoader.N8nJsonLoader || documentInput instanceof import_N8nBinaryLoader.N8nBinaryLoader;
    processedDocuments = isN8nLoader ? await documentInput.processItem(item, itemIndex) : documentInput;
    return await chain.withConfig((0, import_tracing.getTracingConfig)(ctx)).invoke({
      input_documents: processedDocuments
    });
  } else if (["nodeInputJson", "nodeInputBinary"].includes(operationMode)) {
    let textSplitter;
    switch (chunkingMode) {
      // In simple mode we use recursive character splitter with default settings
      case "simple":
        const chunkSize = ctx.getNodeParameter("chunkSize", itemIndex, 1e3);
        const chunkOverlap = ctx.getNodeParameter("chunkOverlap", itemIndex, 200);
        textSplitter = new import_textsplitters.RecursiveCharacterTextSplitter({ chunkOverlap, chunkSize });
        break;
      // In advanced mode user can connect text splitter node so we just retrieve it
      case "advanced":
        textSplitter = await ctx.getInputConnectionData(import_n8n_workflow.NodeConnectionTypes.AiTextSplitter, 0);
        break;
      default:
        break;
    }
    let processor;
    if (operationMode === "nodeInputBinary") {
      const binaryDataKey = ctx.getNodeParameter(
        "options.binaryDataKey",
        itemIndex,
        "data"
      );
      processor = new import_N8nBinaryLoader.N8nBinaryLoader(ctx, "options.", binaryDataKey, textSplitter);
    } else {
      processor = new import_N8nJsonLoader.N8nJsonLoader(ctx, "options.", textSplitter);
    }
    const processedItem = await processor.processItem(item, itemIndex);
    return await chain.invoke(
      {
        input_documents: processedItem
      },
      { signal: ctx.getExecutionCancelSignal() }
    );
  }
  return void 0;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  processItem
});
//# sourceMappingURL=processItem.js.map