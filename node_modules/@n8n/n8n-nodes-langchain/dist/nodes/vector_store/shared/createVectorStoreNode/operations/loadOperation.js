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
var loadOperation_exports = {};
__export(loadOperation_exports, {
  handleLoadOperation: () => handleLoadOperation
});
module.exports = __toCommonJS(loadOperation_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_helpers = require("../../../../../utils/helpers");
async function handleLoadOperation(context, args, embeddings, itemIndex) {
  const filter = (0, import_helpers.getMetadataFiltersValues)(context, itemIndex);
  const vectorStore = await args.getVectorStoreClient(
    context,
    // We'll pass filter to similaritySearchVectorWithScore instead of getVectorStoreClient
    void 0,
    embeddings,
    itemIndex
  );
  try {
    const prompt = context.getNodeParameter("prompt", itemIndex);
    const topK = context.getNodeParameter("topK", itemIndex, 4);
    const useReranker = context.getNodeParameter("useReranker", itemIndex, false);
    const includeDocumentMetadata = context.getNodeParameter(
      "includeDocumentMetadata",
      itemIndex,
      true
    );
    const embeddedPrompt = await embeddings.embedQuery(prompt);
    let docs = await vectorStore.similaritySearchVectorWithScore(embeddedPrompt, topK, filter);
    if (useReranker && docs.length > 0) {
      const reranker = await context.getInputConnectionData(
        import_n8n_workflow.NodeConnectionTypes.AiReranker,
        0
      );
      const documents = docs.map(([doc]) => doc);
      const rerankedDocuments = await reranker.compressDocuments(documents, prompt);
      docs = rerankedDocuments.map((doc) => {
        const { relevanceScore, ...metadata } = doc.metadata || {};
        return [{ ...doc, metadata }, relevanceScore];
      });
    }
    const serializedDocs = docs.map(([doc, score]) => {
      const document = {
        pageContent: doc.pageContent,
        ...includeDocumentMetadata ? { metadata: doc.metadata } : {}
      };
      return {
        json: { document, score },
        pairedItem: {
          item: itemIndex
        }
      };
    });
    (0, import_helpers.logAiEvent)(context, "ai-vector-store-searched", { query: prompt });
    return serializedDocs;
  } finally {
    args.releaseVectorStoreClient?.(vectorStore);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handleLoadOperation
});
//# sourceMappingURL=loadOperation.js.map