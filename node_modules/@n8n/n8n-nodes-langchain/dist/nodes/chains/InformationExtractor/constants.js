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
var constants_exports = {};
__export(constants_exports, {
  SYSTEM_PROMPT_TEMPLATE: () => SYSTEM_PROMPT_TEMPLATE
});
module.exports = __toCommonJS(constants_exports);
const SYSTEM_PROMPT_TEMPLATE = `You are an expert extraction algorithm.
Only extract relevant information from the text.
If you do not know the value of an attribute asked to extract, you may omit the attribute's value.`;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SYSTEM_PROMPT_TEMPLATE
});
//# sourceMappingURL=constants.js.map