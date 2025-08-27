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
var image_exports = {};
__export(image_exports, {
  analyze: () => analyze,
  description: () => description,
  generate: () => generate
});
module.exports = __toCommonJS(image_exports);
var analyze = __toESM(require("./analyze.operation"));
var generate = __toESM(require("./generate.operation"));
const description = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    options: [
      {
        name: "Analyze Image",
        value: "analyze",
        action: "Analyze image",
        description: "Take in images and answer questions about them"
      },
      {
        name: "Generate an Image",
        value: "generate",
        action: "Generate an image",
        description: "Creates an image from a text prompt"
      }
    ],
    default: "generate",
    displayOptions: {
      show: {
        resource: ["image"]
      }
    }
  },
  ...generate.description,
  ...analyze.description
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  analyze,
  description,
  generate
});
//# sourceMappingURL=index.js.map