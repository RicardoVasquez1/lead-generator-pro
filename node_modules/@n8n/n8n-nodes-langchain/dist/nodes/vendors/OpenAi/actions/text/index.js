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
var text_exports = {};
__export(text_exports, {
  classify: () => classify,
  description: () => description,
  message: () => message
});
module.exports = __toCommonJS(text_exports);
var classify = __toESM(require("./classify.operation"));
var message = __toESM(require("./message.operation"));
const description = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    options: [
      {
        name: "Message a Model",
        value: "message",
        action: "Message a model",
        // eslint-disable-next-line n8n-nodes-base/node-param-description-excess-final-period
        description: "Create a completion with GPT 3, 4, etc."
      },
      {
        name: "Classify Text for Violations",
        value: "classify",
        action: "Classify text for violations",
        description: "Check whether content complies with usage policies"
      }
    ],
    default: "message",
    displayOptions: {
      show: {
        resource: ["text"]
      }
    }
  },
  ...classify.description,
  ...message.description
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  classify,
  description,
  message
});
//# sourceMappingURL=index.js.map