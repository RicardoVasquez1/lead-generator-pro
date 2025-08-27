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
  DEFAULT_PROMPT_TEMPLATE: () => DEFAULT_PROMPT_TEMPLATE,
  REFINE_PROMPT_TEMPLATE: () => REFINE_PROMPT_TEMPLATE
});
module.exports = __toCommonJS(prompt_exports);
const REFINE_PROMPT_TEMPLATE = `Your job is to produce a final summary
We have provided an existing summary up to a certain point: "{existing_answer}"
We have the opportunity to refine the existing summary
(only if needed) with some more context below.
------------
"{text}"
------------

Given the new context, refine the original summary
If the context isn't useful, return the original summary.

REFINED SUMMARY:`;
const DEFAULT_PROMPT_TEMPLATE = `Write a concise summary of the following:


"{text}"


CONCISE SUMMARY:`;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DEFAULT_PROMPT_TEMPLATE,
  REFINE_PROMPT_TEMPLATE
});
//# sourceMappingURL=prompt.js.map