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
var constants_exports = {};
__export(constants_exports, {
  MODELS_NOT_SUPPORT_FUNCTION_CALLS: () => MODELS_NOT_SUPPORT_FUNCTION_CALLS
});
module.exports = __toCommonJS(constants_exports);
const MODELS_NOT_SUPPORT_FUNCTION_CALLS = [
  "gpt-3.5-turbo-16k-0613",
  "dall-e-3",
  "text-embedding-3-large",
  "dall-e-2",
  "whisper-1",
  "tts-1-hd-1106",
  "tts-1-hd",
  "gpt-4-0314",
  "text-embedding-3-small",
  "gpt-4-32k-0314",
  "gpt-3.5-turbo-0301",
  "gpt-4-vision-preview",
  "gpt-3.5-turbo-16k",
  "gpt-3.5-turbo-instruct-0914",
  "tts-1",
  "davinci-002",
  "gpt-3.5-turbo-instruct",
  "babbage-002",
  "tts-1-1106",
  "text-embedding-ada-002"
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MODELS_NOT_SUPPORT_FUNCTION_CALLS
});
//# sourceMappingURL=constants.js.map