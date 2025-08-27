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
  getInputs: () => getInputs
});
module.exports = __toCommonJS(utils_exports);
function getInputs(hasMainInput, hasOutputParser, needsFallback) {
  const getInputData = (inputs) => {
    return inputs.map(({ type, filter, displayName, required }) => {
      const input = {
        type,
        displayName,
        required,
        maxConnections: ["ai_languageModel", "ai_memory", "ai_outputParser"].includes(type) ? 1 : void 0
      };
      if (filter) {
        input.filter = filter;
      }
      return input;
    });
  };
  let specialInputs = [
    {
      type: "ai_languageModel",
      displayName: "Chat Model",
      required: true,
      filter: {
        excludedNodes: [
          "@n8n/n8n-nodes-langchain.lmCohere",
          "@n8n/n8n-nodes-langchain.lmOllama",
          "n8n/n8n-nodes-langchain.lmOpenAi",
          "@n8n/n8n-nodes-langchain.lmOpenHuggingFaceInference"
        ]
      }
    },
    {
      type: "ai_languageModel",
      displayName: "Fallback Model",
      required: true,
      filter: {
        excludedNodes: [
          "@n8n/n8n-nodes-langchain.lmCohere",
          "@n8n/n8n-nodes-langchain.lmOllama",
          "n8n/n8n-nodes-langchain.lmOpenAi",
          "@n8n/n8n-nodes-langchain.lmOpenHuggingFaceInference"
        ]
      }
    },
    {
      displayName: "Memory",
      type: "ai_memory"
    },
    {
      displayName: "Tool",
      type: "ai_tool"
    },
    {
      displayName: "Output Parser",
      type: "ai_outputParser"
    }
  ];
  if (hasOutputParser === false) {
    specialInputs = specialInputs.filter((input) => input.type !== "ai_outputParser");
  }
  if (needsFallback === false) {
    specialInputs = specialInputs.filter((input) => input.displayName !== "Fallback Model");
  }
  const mainInputs = hasMainInput ? ["main"] : [];
  return [...mainInputs, ...getInputData(specialInputs)];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getInputs
});
//# sourceMappingURL=utils.js.map