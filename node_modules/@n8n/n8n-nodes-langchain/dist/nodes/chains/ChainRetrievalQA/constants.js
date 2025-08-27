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
  INPUT_TEMPLATE_KEY: () => INPUT_TEMPLATE_KEY,
  LEGACY_INPUT_TEMPLATE_KEY: () => LEGACY_INPUT_TEMPLATE_KEY,
  SYSTEM_PROMPT_TEMPLATE: () => SYSTEM_PROMPT_TEMPLATE,
  systemPromptOption: () => systemPromptOption
});
module.exports = __toCommonJS(constants_exports);
const SYSTEM_PROMPT_TEMPLATE = `You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
----------------
Context: {context}`;
const LEGACY_INPUT_TEMPLATE_KEY = "question";
const INPUT_TEMPLATE_KEY = "input";
const systemPromptOption = {
  displayName: "System Prompt Template",
  name: "systemPromptTemplate",
  type: "string",
  default: SYSTEM_PROMPT_TEMPLATE,
  typeOptions: {
    rows: 6
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  INPUT_TEMPLATE_KEY,
  LEGACY_INPUT_TEMPLATE_KEY,
  SYSTEM_PROMPT_TEMPLATE,
  systemPromptOption
});
//# sourceMappingURL=constants.js.map