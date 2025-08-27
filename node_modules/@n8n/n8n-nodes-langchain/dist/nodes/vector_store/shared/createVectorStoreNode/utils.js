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
var utils_exports = {};
__export(utils_exports, {
  getOperationModeOptions: () => getOperationModeOptions,
  isUpdateSupported: () => isUpdateSupported,
  transformDescriptionForOperationMode: () => transformDescriptionForOperationMode
});
module.exports = __toCommonJS(utils_exports);
var import_constants = require("./constants");
function transformDescriptionForOperationMode(fields, mode) {
  return fields.map((field) => ({
    ...field,
    displayOptions: { show: { mode: Array.isArray(mode) ? mode : [mode] } }
  }));
}
function isUpdateSupported(args) {
  return args.meta.operationModes?.includes("update") ?? false;
}
function getOperationModeOptions(args) {
  const enabledOperationModes = args.meta.operationModes ?? import_constants.DEFAULT_OPERATION_MODES;
  return import_constants.OPERATION_MODE_DESCRIPTIONS.filter(
    ({ value }) => enabledOperationModes.includes(value)
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getOperationModeOptions,
  isUpdateSupported,
  transformDescriptionForOperationMode
});
//# sourceMappingURL=utils.js.map