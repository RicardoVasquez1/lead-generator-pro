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
var descriptions_exports = {};
__export(descriptions_exports, {
  assistantRLC: () => assistantRLC,
  modelRLC: () => modelRLC
});
module.exports = __toCommonJS(descriptions_exports);
const modelRLC = (searchListMethod = "modelSearch") => ({
  displayName: "Model",
  name: "modelId",
  type: "resourceLocator",
  default: { mode: "list", value: "" },
  required: true,
  modes: [
    {
      displayName: "From List",
      name: "list",
      type: "list",
      typeOptions: {
        searchListMethod,
        searchable: true
      }
    },
    {
      displayName: "ID",
      name: "id",
      type: "string",
      placeholder: "e.g. gpt-4"
    }
  ]
});
const assistantRLC = {
  displayName: "Assistant",
  name: "assistantId",
  type: "resourceLocator",
  description: 'Assistant to respond to the message. You can add, modify or remove assistants in the <a href="https://platform.openai.com/playground?mode=assistant" target="_blank">playground</a>.',
  default: { mode: "list", value: "" },
  required: true,
  modes: [
    {
      displayName: "From List",
      name: "list",
      type: "list",
      typeOptions: {
        searchListMethod: "assistantSearch",
        searchable: true
      }
    },
    {
      displayName: "ID",
      name: "id",
      type: "string",
      placeholder: "e.g. asst_abc123"
    }
  ]
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assistantRLC,
  modelRLC
});
//# sourceMappingURL=descriptions.js.map