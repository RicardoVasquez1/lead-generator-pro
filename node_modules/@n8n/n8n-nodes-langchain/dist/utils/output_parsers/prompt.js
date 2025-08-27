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
var prompt_exports = {};
__export(prompt_exports, {
  NAIVE_FIX_PROMPT: () => NAIVE_FIX_PROMPT,
  NAIVE_FIX_TEMPLATE: () => NAIVE_FIX_TEMPLATE
});
module.exports = __toCommonJS(prompt_exports);
var import_prompts = require("@langchain/core/prompts");
const NAIVE_FIX_TEMPLATE = `Instructions:
--------------
{instructions}
--------------
Completion:
--------------
{completion}
--------------

Above, the Completion did not satisfy the constraints given in the Instructions.
Error:
--------------
{error}
--------------

Please try again. Please only respond with an answer that satisfies the constraints laid out in the Instructions:`;
const NAIVE_FIX_PROMPT = import_prompts.PromptTemplate.fromTemplate(NAIVE_FIX_TEMPLATE);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  NAIVE_FIX_PROMPT,
  NAIVE_FIX_TEMPLATE
});
//# sourceMappingURL=prompt.js.map