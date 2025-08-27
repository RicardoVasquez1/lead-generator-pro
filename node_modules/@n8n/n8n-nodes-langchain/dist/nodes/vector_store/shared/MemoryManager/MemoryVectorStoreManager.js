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
var MemoryVectorStoreManager_exports = {};
__export(MemoryVectorStoreManager_exports, {
  MemoryVectorStoreManager: () => MemoryVectorStoreManager
});
module.exports = __toCommonJS(MemoryVectorStoreManager_exports);
var import_memory = require("langchain/vectorstores/memory");
var import_config = require("./config");
var import_MemoryCalculator = require("./MemoryCalculator");
var import_StoreCleanupService = require("./StoreCleanupService");
const _MemoryVectorStoreManager = class _MemoryVectorStoreManager {
  constructor(embeddings, logger) {
    this.embeddings = embeddings;
    this.logger = logger;
    this.memoryUsageBytes = 0;
    // Inactive TTL cleanup timer
    this.ttlCleanupIntervalId = null;
    this.vectorStoreBuffer = /* @__PURE__ */ new Map();
    this.storeMetadata = /* @__PURE__ */ new Map();
    this.logger = logger;
    const config = (0, import_config.getConfig)();
    this.maxMemorySizeBytes = (0, import_config.mbToBytes)(config.maxMemoryMB);
    this.inactiveTtlMs = (0, import_config.hoursToMs)(config.ttlHours);
    this.memoryCalculator = new import_MemoryCalculator.MemoryCalculator();
    this.cleanupService = new import_StoreCleanupService.StoreCleanupService(
      this.maxMemorySizeBytes,
      this.inactiveTtlMs,
      this.vectorStoreBuffer,
      this.storeMetadata,
      this.handleCleanup.bind(this)
    );
    this.setupTtlCleanup();
  }
  /**
   * Get singleton instance
   */
  static getInstance(embeddings, logger) {
    if (!_MemoryVectorStoreManager.instance) {
      _MemoryVectorStoreManager.instance = new _MemoryVectorStoreManager(embeddings, logger);
    } else {
      _MemoryVectorStoreManager.instance.embeddings = embeddings;
      _MemoryVectorStoreManager.instance.vectorStoreBuffer.forEach((vectorStoreInstance) => {
        vectorStoreInstance.embeddings = embeddings;
      });
    }
    return _MemoryVectorStoreManager.instance;
  }
  /**
   * Set up timer for TTL-based cleanup
   */
  setupTtlCleanup() {
    if (this.inactiveTtlMs <= 0) {
      return;
    }
    const CLEANUP_INTERVAL_MS = 60 * 60 * 1e3;
    if (this.ttlCleanupIntervalId) {
      clearInterval(this.ttlCleanupIntervalId);
    }
    this.ttlCleanupIntervalId = setInterval(() => {
      this.cleanupService.cleanupInactiveStores();
    }, CLEANUP_INTERVAL_MS);
  }
  /**
   * Handle cleanup events from the cleanup service
   */
  handleCleanup(removedKeys, freedBytes, reason) {
    this.memoryUsageBytes -= freedBytes;
    if (reason === "ttl") {
      const ttlHours = Math.round(this.inactiveTtlMs / (60 * 60 * 1e3));
      this.logger.info(
        `TTL cleanup: removed ${removedKeys.length} inactive vector stores (${ttlHours}h TTL) to free ${Math.round(freedBytes / (1024 * 1024))}MB of memory`
      );
    } else {
      this.logger.info(
        `Memory cleanup: removed ${removedKeys.length} oldest vector stores to free ${Math.round(freedBytes / (1024 * 1024))}MB of memory`
      );
    }
  }
  getMemoryKeysList() {
    return Array.from(this.vectorStoreBuffer.keys());
  }
  /**
   * Get or create a vector store by key
   */
  async getVectorStore(memoryKey) {
    let vectorStoreInstance = this.vectorStoreBuffer.get(memoryKey);
    if (!vectorStoreInstance) {
      vectorStoreInstance = await import_memory.MemoryVectorStore.fromExistingIndex(this.embeddings);
      this.vectorStoreBuffer.set(memoryKey, vectorStoreInstance);
      this.storeMetadata.set(memoryKey, {
        size: 0,
        createdAt: /* @__PURE__ */ new Date(),
        lastAccessed: /* @__PURE__ */ new Date()
      });
    } else {
      const metadata = this.storeMetadata.get(memoryKey);
      if (metadata) {
        metadata.lastAccessed = /* @__PURE__ */ new Date();
      }
    }
    return vectorStoreInstance;
  }
  /**
   * Reset a store's metadata when it's cleared
   */
  clearStoreMetadata(memoryKey) {
    const metadata = this.storeMetadata.get(memoryKey);
    if (metadata) {
      this.memoryUsageBytes -= metadata.size;
      metadata.size = 0;
      metadata.lastAccessed = /* @__PURE__ */ new Date();
    }
  }
  /**
   * Get memory usage in bytes
   */
  getMemoryUsage() {
    return this.memoryUsageBytes;
  }
  /**
   * Get memory usage as a formatted string (MB)
   */
  getMemoryUsageFormatted() {
    return `${Math.round(this.memoryUsageBytes / (1024 * 1024))}MB`;
  }
  /**
   * Recalculate memory usage from actual vector store contents
   * This ensures tracking accuracy for large stores
   */
  recalculateMemoryUsage() {
    this.memoryUsageBytes = 0;
    for (const [key, vectorStore] of this.vectorStoreBuffer.entries()) {
      const storeSize = this.memoryCalculator.calculateVectorStoreSize(vectorStore);
      const metadata = this.storeMetadata.get(key);
      if (metadata) {
        metadata.size = storeSize;
        this.memoryUsageBytes += storeSize;
      }
    }
    this.logger.debug(`Recalculated vector store memory: ${this.getMemoryUsageFormatted()}`);
  }
  /**
   * Add documents to a vector store
   */
  async addDocuments(memoryKey, documents, clearStore) {
    if (clearStore) {
      this.clearStoreMetadata(memoryKey);
      this.vectorStoreBuffer.delete(memoryKey);
    }
    const estimatedAddedSize = this.memoryCalculator.estimateBatchSize(documents);
    this.cleanupService.cleanupOldestStores(estimatedAddedSize);
    const vectorStoreInstance = await this.getVectorStore(memoryKey);
    const vectorCountBefore = vectorStoreInstance.memoryVectors?.length || 0;
    await vectorStoreInstance.addDocuments(documents);
    const metadata = this.storeMetadata.get(memoryKey);
    if (metadata) {
      metadata.size += estimatedAddedSize;
      metadata.lastAccessed = /* @__PURE__ */ new Date();
      this.memoryUsageBytes += estimatedAddedSize;
    }
    const vectorCount = vectorStoreInstance.memoryVectors?.length || 0;
    if (vectorCount > 0 && vectorCount % 100 === 0 || documents.length > 20 || vectorCountBefore === 0 && vectorCount > 0) {
      this.recalculateMemoryUsage();
    }
    const maxMemoryMB = this.maxMemorySizeBytes > 0 ? (this.maxMemorySizeBytes / (1024 * 1024)).toFixed(0) : "unlimited";
    this.logger.debug(
      `Vector store memory: ${this.getMemoryUsageFormatted()}/${maxMemoryMB}MB (${vectorCount} vectors in ${this.vectorStoreBuffer.size} stores)`
    );
  }
  /**
   * Get statistics about the vector store memory usage
   */
  getStats() {
    const now = Date.now();
    let inactiveStoreCount = 0;
    this.recalculateMemoryUsage();
    const stats = {
      totalSizeBytes: this.memoryUsageBytes,
      totalSizeMB: Math.round(this.memoryUsageBytes / (1024 * 1024) * 100) / 100,
      percentOfLimit: this.maxMemorySizeBytes > 0 ? Math.round(this.memoryUsageBytes / this.maxMemorySizeBytes * 100) : 0,
      maxMemoryMB: this.maxMemorySizeBytes > 0 ? this.maxMemorySizeBytes / (1024 * 1024) : -1,
      // -1 indicates unlimited
      storeCount: this.vectorStoreBuffer.size,
      inactiveStoreCount: 0,
      ttlHours: this.inactiveTtlMs > 0 ? this.inactiveTtlMs / (60 * 60 * 1e3) : -1,
      // -1 indicates disabled
      stores: {}
    };
    for (const [key, metadata] of this.storeMetadata.entries()) {
      const store = this.vectorStoreBuffer.get(key);
      if (store) {
        const lastAccessedTime = metadata.lastAccessed.getTime();
        const inactiveTimeMs = now - lastAccessedTime;
        const isInactive = this.cleanupService.isStoreInactive(metadata);
        if (isInactive) {
          inactiveStoreCount++;
        }
        stats.stores[key] = {
          sizeBytes: metadata.size,
          sizeMB: Math.round(metadata.size / (1024 * 1024) * 100) / 100,
          percentOfTotal: Math.round(metadata.size / this.memoryUsageBytes * 100) || 0,
          vectors: store.memoryVectors?.length || 0,
          createdAt: metadata.createdAt.toISOString(),
          lastAccessed: metadata.lastAccessed.toISOString(),
          inactive: isInactive,
          inactiveForHours: Math.round(inactiveTimeMs / (60 * 60 * 1e3))
        };
      }
    }
    stats.inactiveStoreCount = inactiveStoreCount;
    return stats;
  }
};
_MemoryVectorStoreManager.instance = null;
let MemoryVectorStoreManager = _MemoryVectorStoreManager;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MemoryVectorStoreManager
});
//# sourceMappingURL=MemoryVectorStoreManager.js.map