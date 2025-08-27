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
var options_exports = {};
__export(options_exports, {
  commonOptions: () => commonOptions
});
module.exports = __toCommonJS(options_exports);
var import_prompt = require("./prompt");
const commonOptions = [
  {
    displayName: "System Message",
    name: "systemMessage",
    type: "string",
    default: import_prompt.SYSTEM_MESSAGE,
    description: "The message that will be sent to the agent before the conversation starts",
    typeOptions: {
      rows: 6
    }
  },
  {
    displayName: "Max Iterations",
    name: "maxIterations",
    type: "number",
    default: 10,
    description: "The maximum number of iterations the agent will run before stopping"
  },
  {
    displayName: "Return Intermediate Steps",
    name: "returnIntermediateSteps",
    type: "boolean",
    default: false,
    description: "Whether or not the output should include intermediate steps the agent took"
  },
  {
    displayName: "Automatically Passthrough Binary Images",
    name: "passthroughBinaryImages",
    type: "boolean",
    default: true,
    description: "Whether or not binary images should be automatically passed through to the agent as image type messages"
  }
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  commonOptions
});
//# sourceMappingURL=options.js.map