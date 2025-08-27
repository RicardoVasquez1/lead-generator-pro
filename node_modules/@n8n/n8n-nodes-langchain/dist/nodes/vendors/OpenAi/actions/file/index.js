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
var file_exports = {};
__export(file_exports, {
  deleteFile: () => deleteFile,
  description: () => description,
  list: () => list,
  upload: () => upload
});
module.exports = __toCommonJS(file_exports);
var deleteFile = __toESM(require("./deleteFile.operation"));
var list = __toESM(require("./list.operation"));
var upload = __toESM(require("./upload.operation"));
const description = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    options: [
      {
        name: "Delete a File",
        value: "deleteFile",
        action: "Delete a file",
        description: "Delete a file from the server"
      },
      {
        name: "List Files",
        value: "list",
        action: "List files",
        description: "Returns a list of files that belong to the user's organization"
      },
      {
        name: "Upload a File",
        value: "upload",
        action: "Upload a file",
        description: "Upload a file that can be used across various endpoints"
      }
    ],
    default: "upload",
    displayOptions: {
      show: {
        resource: ["file"]
      }
    }
  },
  ...upload.description,
  ...deleteFile.description,
  ...list.description
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deleteFile,
  description,
  list,
  upload
});
//# sourceMappingURL=index.js.map