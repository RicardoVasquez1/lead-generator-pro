"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var prompt_exports = {};
__export(prompt_exports, {
  description: () => description,
  generate: () => generate,
  improve: () => improve,
  templatize: () => templatize
});
module.exports = __toCommonJS(prompt_exports);
var generate = __toESM(require("./generate.operation"));
var improve = __toESM(require("./improve.operation"));
var templatize = __toESM(require("./templatize.operation"));
const description = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    options: [
      {
        name: "Generate Prompt",
        value: "generate",
        action: "Generate a prompt",
        description: "Generate a prompt for a model"
      },
      {
        name: "Improve Prompt",
        value: "improve",
        action: "Improve a prompt",
        description: "Improve a prompt for a model"
      },
      {
        name: "Templatize Prompt",
        value: "templatize",
        action: "Templatize a prompt",
        description: "Templatize a prompt for a model"
      }
    ],
    default: "generate",
    displayOptions: {
      show: {
        resource: ["prompt"]
      }
    }
  },
  {
    displayName: 'The <a href="https://docs.anthropic.com/en/api/prompt-tools-generate">prompt tools APIs</a> are in a closed research preview. Your organization must request access to use them.',
    name: "experimentalNotice",
    type: "notice",
    default: "",
    displayOptions: {
      show: {
        resource: ["prompt"]
      }
    }
  },
  ...generate.description,
  ...improve.description,
  ...templatize.description
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  description,
  generate,
  improve,
  templatize
});
//# sourceMappingURL=index.js.map