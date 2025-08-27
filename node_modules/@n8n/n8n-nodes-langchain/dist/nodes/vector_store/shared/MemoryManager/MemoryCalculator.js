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
var MemoryCalculator_exports = {};
__export(MemoryCalculator_exports, {
  MemoryCalculator: () => MemoryCalculator
});
module.exports = __toCommonJS(MemoryCalculator_exports);
const FLOAT_SIZE_BYTES = 8;
const CHAR_SIZE_BYTES = 2;
const VECTOR_OVERHEAD_BYTES = 200;
const EMBEDDING_DIMENSIONS = 1536;
const EMBEDDING_SIZE_BYTES = EMBEDDING_DIMENSIONS * FLOAT_SIZE_BYTES;
const AVG_METADATA_SIZE_BYTES = 100;
class MemoryCalculator {
  /**
   * Fast batch size estimation for multiple documents
   */
  estimateBatchSize(documents) {
    if (documents.length === 0) return 0;
    let totalContentSize = 0;
    let totalMetadataSize = 0;
    for (const doc of documents) {
      if (doc.pageContent) {
        totalContentSize += doc.pageContent.length * CHAR_SIZE_BYTES;
      }
      if (doc.metadata) {
        const metadataKeys = Object.keys(doc.metadata).length;
        if (metadataKeys > 0) {
          totalMetadataSize += metadataKeys * AVG_METADATA_SIZE_BYTES;
        }
      }
    }
    const embeddingSize = documents.length * EMBEDDING_SIZE_BYTES;
    const overhead = documents.length * VECTOR_OVERHEAD_BYTES;
    const calculatedSize = totalContentSize + totalMetadataSize + embeddingSize + overhead;
    return Math.ceil(calculatedSize);
  }
  /**
   * Calculate the size of a vector store by examining its contents
   */
  calculateVectorStoreSize(vectorStore) {
    if (!vectorStore.memoryVectors || vectorStore.memoryVectors.length === 0) {
      return 0;
    }
    let storeSize = 0;
    for (const vector of vectorStore.memoryVectors) {
      storeSize += vector.embedding.length * FLOAT_SIZE_BYTES;
      storeSize += vector.content ? vector.content.length * CHAR_SIZE_BYTES : 0;
      if (vector.metadata) {
        const metadataStr = JSON.stringify(vector.metadata);
        storeSize += metadataStr.length * CHAR_SIZE_BYTES;
      }
      storeSize += VECTOR_OVERHEAD_BYTES;
    }
    return Math.ceil(storeSize);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MemoryCalculator
});
//# sourceMappingURL=MemoryCalculator.js.map