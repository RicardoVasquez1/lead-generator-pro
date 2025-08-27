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
var insertOperation_exports = {};
__export(insertOperation_exports, {
  handleInsertOperation: () => handleInsertOperation
});
module.exports = __toCommonJS(insertOperation_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_helpers = require("../../../../../utils/helpers");
var import_processDocuments = require("../../processDocuments");
async function handleInsertOperation(context, args, embeddings) {
  const nodeVersion = context.getNode().typeVersion;
  const items = context.getInputData();
  const documentInput = await context.getInputConnectionData(import_n8n_workflow.NodeConnectionTypes.AiDocument, 0);
  const resultData = [];
  const documentsForEmbedding = [];
  for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
    if (context.getExecutionCancelSignal()?.aborted) {
      break;
    }
    const itemData = items[itemIndex];
    const processedDocuments = await (0, import_processDocuments.processDocument)(documentInput, itemData, itemIndex);
    resultData.push(...processedDocuments.serializedDocuments);
    documentsForEmbedding.push(...processedDocuments.processedDocuments);
    if (nodeVersion === 1) {
      await args.populateVectorStore(
        context,
        embeddings,
        processedDocuments.processedDocuments,
        itemIndex
      );
    }
    (0, import_helpers.logAiEvent)(context, "ai-vector-store-populated");
  }
  if (nodeVersion >= 1.1) {
    const embeddingBatchSize = context.getNodeParameter("embeddingBatchSize", 0, 200) ?? 200;
    for (let i = 0; i < documentsForEmbedding.length; i += embeddingBatchSize) {
      const nextBatch = documentsForEmbedding.slice(i, i + embeddingBatchSize);
      await args.populateVectorStore(context, embeddings, nextBatch, 0);
    }
  }
  return resultData;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handleInsertOperation
});
//# sourceMappingURL=insertOperation.js.map