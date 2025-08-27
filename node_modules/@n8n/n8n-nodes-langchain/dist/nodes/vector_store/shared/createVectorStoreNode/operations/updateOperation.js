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
var updateOperation_exports = {};
__export(updateOperation_exports, {
  handleUpdateOperation: () => handleUpdateOperation
});
module.exports = __toCommonJS(updateOperation_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_helpers = require("../../../../../utils/helpers");
var import_N8nJsonLoader = require("../../../../../utils/N8nJsonLoader");
var import_processDocuments = require("../../processDocuments");
var import_utils = require("../utils");
async function handleUpdateOperation(context, args, embeddings) {
  if (!(0, import_utils.isUpdateSupported)(args)) {
    throw new import_n8n_workflow.NodeOperationError(
      context.getNode(),
      "Update operation is not implemented for this Vector Store"
    );
  }
  const items = context.getInputData();
  const loader = new import_N8nJsonLoader.N8nJsonLoader(context);
  const resultData = [];
  for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
    const itemData = items[itemIndex];
    const documentId = context.getNodeParameter("id", itemIndex, "", {
      extractValue: true
    });
    const vectorStore = await args.getVectorStoreClient(context, void 0, embeddings, itemIndex);
    try {
      const { processedDocuments, serializedDocuments } = await (0, import_processDocuments.processDocument)(
        loader,
        itemData,
        itemIndex
      );
      if (processedDocuments?.length !== 1) {
        throw new import_n8n_workflow.NodeOperationError(context.getNode(), "Single document per item expected");
      }
      resultData.push(...serializedDocuments);
      await vectorStore.addDocuments(processedDocuments, {
        ids: [documentId]
      });
      (0, import_helpers.logAiEvent)(context, "ai-vector-store-updated");
    } finally {
      args.releaseVectorStoreClient?.(vectorStore);
    }
  }
  return resultData;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handleUpdateOperation
});
//# sourceMappingURL=updateOperation.js.map