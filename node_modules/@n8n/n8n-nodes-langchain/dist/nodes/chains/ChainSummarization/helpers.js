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
var helpers_exports = {};
__export(helpers_exports, {
  getChainPromptsArgs: () => getChainPromptsArgs
});
module.exports = __toCommonJS(helpers_exports);
var import_prompts = require("@langchain/core/prompts");
function getChainPromptsArgs(type, options) {
  const chainArgs = {
    type
  };
  if (type === "map_reduce") {
    const mapReduceArgs = chainArgs;
    if (options.combineMapPrompt) {
      mapReduceArgs.combineMapPrompt = new import_prompts.PromptTemplate({
        template: options.combineMapPrompt,
        inputVariables: ["text"]
      });
    }
    if (options.prompt) {
      mapReduceArgs.combinePrompt = new import_prompts.PromptTemplate({
        template: options.prompt,
        inputVariables: ["text"]
      });
    }
  }
  if (type === "stuff") {
    const stuffArgs = chainArgs;
    if (options.prompt) {
      stuffArgs.prompt = new import_prompts.PromptTemplate({
        template: options.prompt,
        inputVariables: ["text"]
      });
    }
  }
  if (type === "refine") {
    const refineArgs = chainArgs;
    if (options.refinePrompt) {
      refineArgs.refinePrompt = new import_prompts.PromptTemplate({
        template: options.refinePrompt,
        inputVariables: ["existing_answer", "text"]
      });
    }
    if (options.refineQuestionPrompt) {
      refineArgs.questionPrompt = new import_prompts.PromptTemplate({
        template: options.refineQuestionPrompt,
        inputVariables: ["text"]
      });
    }
  }
  return chainArgs;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getChainPromptsArgs
});
//# sourceMappingURL=helpers.js.map