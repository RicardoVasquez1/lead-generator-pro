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
var convertToSchema_exports = {};
__export(convertToSchema_exports, {
  convertObjectBySchema: () => convertObjectBySchema,
  convertValueBySchema: () => convertValueBySchema
});
module.exports = __toCommonJS(convertToSchema_exports);
var import_zod = require("zod");
const convertValueBySchema = (value, schema) => {
  if (!schema || !value) return value;
  if (typeof value === "string") {
    if (schema instanceof import_zod.z.ZodNumber) {
      return Number(value);
    } else if (schema instanceof import_zod.z.ZodBoolean) {
      return value.toLowerCase() === "true";
    } else if (schema instanceof import_zod.z.ZodObject) {
      try {
        const parsed = JSON.parse(value);
        return convertValueBySchema(parsed, schema);
      } catch {
        return value;
      }
    }
  }
  if (schema instanceof import_zod.z.ZodObject && typeof value === "object" && value !== null) {
    const result = {};
    for (const [key, val] of Object.entries(value)) {
      const fieldSchema = schema.shape[key];
      if (fieldSchema) {
        result[key] = convertValueBySchema(val, fieldSchema);
      } else {
        result[key] = val;
      }
    }
    return result;
  }
  return value;
};
const convertObjectBySchema = (obj, schema) => {
  return convertValueBySchema(obj, schema);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  convertObjectBySchema,
  convertValueBySchema
});
//# sourceMappingURL=convertToSchema.js.map