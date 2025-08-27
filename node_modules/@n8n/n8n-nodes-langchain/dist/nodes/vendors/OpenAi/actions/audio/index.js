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
var audio_exports = {};
__export(audio_exports, {
  description: () => description,
  generate: () => generate,
  transcribe: () => transcribe,
  translate: () => translate
});
module.exports = __toCommonJS(audio_exports);
var generate = __toESM(require("./generate.operation"));
var transcribe = __toESM(require("./transcribe.operation"));
var translate = __toESM(require("./translate.operation"));
const description = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    options: [
      {
        name: "Generate Audio",
        value: "generate",
        action: "Generate audio",
        description: "Creates audio from a text prompt"
      },
      {
        name: "Transcribe a Recording",
        value: "transcribe",
        action: "Transcribe a recording",
        description: "Transcribes audio into the text"
      },
      {
        name: "Translate a Recording",
        value: "translate",
        action: "Translate a recording",
        description: "Translate audio into the text in the english language"
      }
    ],
    default: "generate",
    displayOptions: {
      show: {
        resource: ["audio"]
      }
    }
  },
  {
    displayName: "OpenAI API limits the size of the audio file to 25 MB",
    name: "fileSizeLimitNotice",
    type: "notice",
    default: " ",
    displayOptions: {
      show: {
        resource: ["audio"],
        operation: ["translate", "transcribe"]
      }
    }
  },
  ...generate.description,
  ...transcribe.description,
  ...translate.description
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  description,
  generate,
  transcribe,
  translate
});
//# sourceMappingURL=index.js.map