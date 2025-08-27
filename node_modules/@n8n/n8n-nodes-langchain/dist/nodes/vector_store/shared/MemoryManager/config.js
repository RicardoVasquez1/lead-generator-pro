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
var config_exports = {};
__export(config_exports, {
  getConfig: () => getConfig,
  hoursToMs: () => hoursToMs,
  mbToBytes: () => mbToBytes
});
module.exports = __toCommonJS(config_exports);
const DEFAULT_MAX_MEMORY_MB = -1;
const DEFAULT_INACTIVE_TTL_HOURS = -1;
function getConfig() {
  let maxMemoryMB = DEFAULT_MAX_MEMORY_MB;
  if (process.env.N8N_VECTOR_STORE_MAX_MEMORY) {
    const parsed = parseInt(process.env.N8N_VECTOR_STORE_MAX_MEMORY, 10);
    if (!isNaN(parsed)) {
      maxMemoryMB = parsed;
    }
  }
  let ttlHours = DEFAULT_INACTIVE_TTL_HOURS;
  if (process.env.N8N_VECTOR_STORE_TTL_HOURS) {
    const parsed = parseInt(process.env.N8N_VECTOR_STORE_TTL_HOURS, 10);
    if (!isNaN(parsed)) {
      ttlHours = parsed;
    }
  }
  return {
    maxMemoryMB,
    ttlHours
  };
}
function mbToBytes(mb) {
  if (mb <= 0) return -1;
  return mb * 1024 * 1024;
}
function hoursToMs(hours) {
  if (hours <= 0) return -1;
  return hours * 60 * 60 * 1e3;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getConfig,
  hoursToMs,
  mbToBytes
});
//# sourceMappingURL=config.js.map