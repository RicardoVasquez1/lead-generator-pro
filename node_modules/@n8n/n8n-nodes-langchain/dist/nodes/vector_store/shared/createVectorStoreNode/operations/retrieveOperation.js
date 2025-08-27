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
var retrieveOperation_exports = {};
__export(retrieveOperation_exports, {
  handleRetrieveOperation: () => handleRetrieveOperation
});
module.exports = __toCommonJS(retrieveOperation_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_helpers = require("../../../../../utils/helpers");
var import_logWrapper = require("../../../../../utils/logWrapper");
async function handleRetrieveOperation(context, args, embeddings, itemIndex) {
  const filter = (0, import_helpers.getMetadataFiltersValues)(context, itemIndex);
  const useReranker = context.getNodeParameter("useReranker", itemIndex, false);
  const vectorStore = await args.getVectorStoreClient(context, filter, embeddings, itemIndex);
  let response = vectorStore;
  if (useReranker) {
    const reranker = await context.getInputConnectionData(
      import_n8n_workflow.NodeConnectionTypes.AiReranker,
      0
    );
    response = {
      reranker,
      vectorStore: (0, import_logWrapper.logWrapper)(vectorStore, context)
    };
  } else {
    response = (0, import_logWrapper.logWrapper)(vectorStore, context);
  }
  return {
    response,
    closeFunction: async () => {
      args.releaseVectorStoreClient?.(vectorStore);
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handleRetrieveOperation
});
//# sourceMappingURL=retrieveOperation.js.map