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
var retrieveAsToolOperation_exports = {};
__export(retrieveAsToolOperation_exports, {
  handleRetrieveAsToolOperation: () => handleRetrieveAsToolOperation
});
module.exports = __toCommonJS(retrieveAsToolOperation_exports);
var import_tools = require("langchain/tools");
var import_n8n_workflow = require("n8n-workflow");
var import_helpers = require("../../../../../utils/helpers");
var import_n8n_workflow2 = require("n8n-workflow");
var import_logWrapper = require("../../../../../utils/logWrapper");
async function handleRetrieveAsToolOperation(context, args, embeddings, itemIndex) {
  const toolDescription = context.getNodeParameter("toolDescription", itemIndex);
  const node = context.getNode();
  const { typeVersion } = node;
  const toolName = typeVersion < 1.3 ? context.getNodeParameter("toolName", itemIndex) : (0, import_n8n_workflow2.nodeNameToToolName)(node);
  const topK = context.getNodeParameter("topK", itemIndex, 4);
  const useReranker = context.getNodeParameter("useReranker", itemIndex, false);
  const includeDocumentMetadata = context.getNodeParameter(
    "includeDocumentMetadata",
    itemIndex,
    true
  );
  const filter = (0, import_helpers.getMetadataFiltersValues)(context, itemIndex);
  const vectorStoreTool = new import_tools.DynamicTool({
    name: toolName,
    description: toolDescription,
    func: async (input) => {
      const vectorStore = await args.getVectorStoreClient(
        context,
        void 0,
        embeddings,
        itemIndex
      );
      try {
        const embeddedPrompt = await embeddings.embedQuery(input);
        let documents = await vectorStore.similaritySearchVectorWithScore(
          embeddedPrompt,
          topK,
          filter
        );
        if (useReranker && documents.length > 0) {
          const reranker = await context.getInputConnectionData(
            import_n8n_workflow.NodeConnectionTypes.AiReranker,
            0
          );
          const docs = documents.map(([doc]) => doc);
          const rerankedDocuments = await reranker.compressDocuments(docs, input);
          documents = rerankedDocuments.map((doc) => {
            const { relevanceScore, ...metadata } = doc.metadata;
            return [{ ...doc, metadata }, relevanceScore];
          });
        }
        return documents.map((document) => {
          if (includeDocumentMetadata) {
            return { type: "text", text: JSON.stringify(document[0]) };
          }
          return {
            type: "text",
            text: JSON.stringify({ pageContent: document[0].pageContent })
          };
        }).filter((document) => !!document);
      } finally {
        args.releaseVectorStoreClient?.(vectorStore);
      }
    }
  });
  return {
    response: (0, import_logWrapper.logWrapper)(vectorStoreTool, context)
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handleRetrieveAsToolOperation
});
//# sourceMappingURL=retrieveAsToolOperation.js.map