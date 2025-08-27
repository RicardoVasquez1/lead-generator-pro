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
var StoreCleanupService_exports = {};
__export(StoreCleanupService_exports, {
  StoreCleanupService: () => StoreCleanupService
});
module.exports = __toCommonJS(StoreCleanupService_exports);
class StoreCleanupService {
  // 5 seconds
  constructor(maxMemorySizeBytes, inactiveTtlMs, vectorStores, storeMetadata, onCleanup) {
    this.maxMemorySizeBytes = maxMemorySizeBytes;
    this.inactiveTtlMs = inactiveTtlMs;
    this.vectorStores = vectorStores;
    this.storeMetadata = storeMetadata;
    this.onCleanup = onCleanup;
    // Cache for oldest stores sorted by creation time
    this.oldestStoreKeys = [];
    this.lastSortTime = 0;
    this.CACHE_TTL_MS = 5e3;
  }
  /**
   * Check if a store has been inactive for longer than the TTL
   */
  isStoreInactive(metadata) {
    if (this.inactiveTtlMs <= 0) {
      return false;
    }
    const now = Date.now();
    const lastAccessedTime = metadata.lastAccessed.getTime();
    return now - lastAccessedTime > this.inactiveTtlMs;
  }
  /**
   * Remove vector stores that haven't been accessed for longer than TTL
   */
  cleanupInactiveStores() {
    if (this.inactiveTtlMs <= 0) {
      return;
    }
    let freedBytes = 0;
    const removedStores = [];
    for (const [key, metadata] of this.storeMetadata.entries()) {
      if (this.isStoreInactive(metadata)) {
        this.vectorStores.delete(key);
        freedBytes += metadata.size;
        removedStores.push(key);
      }
    }
    for (const key of removedStores) {
      this.storeMetadata.delete(key);
    }
    if (removedStores.length > 0) {
      this.oldestStoreKeys = [];
      this.onCleanup(removedStores, freedBytes, "ttl");
    }
  }
  /**
   * Remove the oldest vector stores to free up memory
   */
  cleanupOldestStores(requiredBytes) {
    if (this.maxMemorySizeBytes <= 0) {
      return;
    }
    let currentMemoryUsage = 0;
    for (const metadata of this.storeMetadata.values()) {
      currentMemoryUsage += metadata.size;
    }
    this.cleanupInactiveStores();
    currentMemoryUsage = 0;
    for (const metadata of this.storeMetadata.values()) {
      currentMemoryUsage += metadata.size;
    }
    if (currentMemoryUsage + requiredBytes <= this.maxMemorySizeBytes) {
      return;
    }
    const now = Date.now();
    if (this.oldestStoreKeys.length === 0 || now - this.lastSortTime > this.CACHE_TTL_MS) {
      const stores = [];
      for (const [key, metadata] of this.storeMetadata.entries()) {
        stores.push([key, metadata.createdAt.getTime()]);
      }
      stores.sort((a, b) => a[1] - b[1]);
      this.oldestStoreKeys = stores.map(([key]) => key);
      this.lastSortTime = now;
    }
    let freedBytes = 0;
    const removedStores = [];
    for (const key of this.oldestStoreKeys) {
      if (!this.storeMetadata.has(key)) continue;
      if (currentMemoryUsage - freedBytes + requiredBytes <= this.maxMemorySizeBytes) {
        break;
      }
      const metadata = this.storeMetadata.get(key);
      if (metadata) {
        this.vectorStores.delete(key);
        freedBytes += metadata.size;
        removedStores.push(key);
      }
    }
    for (const key of removedStores) {
      this.storeMetadata.delete(key);
    }
    if (removedStores.length > 0) {
      this.oldestStoreKeys = this.oldestStoreKeys.filter((key) => !removedStores.includes(key));
      this.onCleanup(removedStores, freedBytes, "memory");
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StoreCleanupService
});
//# sourceMappingURL=StoreCleanupService.js.map