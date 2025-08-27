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
var assistant_exports = {};
__export(assistant_exports, {
  create: () => create,
  deleteAssistant: () => deleteAssistant,
  description: () => description,
  list: () => list,
  message: () => message,
  update: () => update
});
module.exports = __toCommonJS(assistant_exports);
var create = __toESM(require("./create.operation"));
var deleteAssistant = __toESM(require("./deleteAssistant.operation"));
var list = __toESM(require("./list.operation"));
var message = __toESM(require("./message.operation"));
var update = __toESM(require("./update.operation"));
const description = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    options: [
      {
        name: "Create an Assistant",
        value: "create",
        action: "Create an assistant",
        description: "Create a new assistant"
      },
      {
        name: "Delete an Assistant",
        value: "deleteAssistant",
        action: "Delete an assistant",
        description: "Delete an assistant from the account"
      },
      {
        name: "List Assistants",
        value: "list",
        action: "List assistants",
        description: "List assistants in the organization"
      },
      {
        name: "Message an Assistant",
        value: "message",
        action: "Message an assistant",
        description: "Send messages to an assistant"
      },
      {
        name: "Update an Assistant",
        value: "update",
        action: "Update an assistant",
        description: "Update an existing assistant"
      }
    ],
    default: "message",
    displayOptions: {
      show: {
        resource: ["assistant"]
      }
    }
  },
  ...create.description,
  ...deleteAssistant.description,
  ...message.description,
  ...list.description,
  ...update.description
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  create,
  deleteAssistant,
  description,
  list,
  message,
  update
});
//# sourceMappingURL=index.js.map