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
var processDocuments_exports = {};
__export(processDocuments_exports, {
  processDocument: () => processDocument,
  processDocuments: () => processDocuments
});
module.exports = __toCommonJS(processDocuments_exports);
var import_N8nBinaryLoader = require("../../../utils/N8nBinaryLoader");
var import_N8nJsonLoader = require("../../../utils/N8nJsonLoader");
async function processDocuments(documentInput, inputItems) {
  let processedDocuments;
  if (documentInput instanceof import_N8nJsonLoader.N8nJsonLoader || documentInput instanceof import_N8nBinaryLoader.N8nBinaryLoader) {
    processedDocuments = await documentInput.processAll(inputItems);
  } else {
    processedDocuments = documentInput;
  }
  const serializedDocuments = processedDocuments.map(({ metadata, pageContent }) => ({
    json: { metadata, pageContent }
  }));
  return {
    processedDocuments,
    serializedDocuments
  };
}
async function processDocument(documentInput, inputItem, itemIndex) {
  let processedDocuments;
  if (documentInput instanceof import_N8nJsonLoader.N8nJsonLoader || documentInput instanceof import_N8nBinaryLoader.N8nBinaryLoader) {
    processedDocuments = await documentInput.processItem(inputItem, itemIndex);
  } else {
    processedDocuments = documentInput;
  }
  const serializedDocuments = processedDocuments.map(({ metadata, pageContent }) => ({
    json: { metadata, pageContent },
    pairedItem: {
      item: itemIndex
    }
  }));
  return {
    processedDocuments,
    serializedDocuments
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  processDocument,
  processDocuments
});
//# sourceMappingURL=processDocuments.js.map