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
var safety_options_exports = {};
__export(safety_options_exports, {
  harmCategories: () => harmCategories,
  harmThresholds: () => harmThresholds
});
module.exports = __toCommonJS(safety_options_exports);
const harmCategories = [
  {
    value: "HARM_CATEGORY_HARASSMENT",
    name: "HARM_CATEGORY_HARASSMENT",
    description: "Harassment content"
  },
  {
    value: "HARM_CATEGORY_HATE_SPEECH",
    name: "HARM_CATEGORY_HATE_SPEECH",
    description: "Hate speech and content"
  },
  {
    value: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    name: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    description: "Sexually explicit content"
  },
  {
    value: "HARM_CATEGORY_DANGEROUS_CONTENT",
    name: "HARM_CATEGORY_DANGEROUS_CONTENT",
    description: "Dangerous content"
  }
];
const harmThresholds = [
  {
    value: "HARM_BLOCK_THRESHOLD_UNSPECIFIED",
    name: "HARM_BLOCK_THRESHOLD_UNSPECIFIED",
    description: "Threshold is unspecified"
  },
  {
    value: "BLOCK_LOW_AND_ABOVE",
    name: "BLOCK_LOW_AND_ABOVE",
    description: "Content with NEGLIGIBLE will be allowed"
  },
  {
    value: "BLOCK_MEDIUM_AND_ABOVE",
    name: "BLOCK_MEDIUM_AND_ABOVE",
    description: "Content with NEGLIGIBLE and LOW will be allowed"
  },
  {
    value: "BLOCK_ONLY_HIGH",
    name: "BLOCK_ONLY_HIGH",
    description: "Content with NEGLIGIBLE, LOW, and MEDIUM will be allowed"
  },
  {
    value: "BLOCK_NONE",
    name: "BLOCK_NONE",
    description: "All content will be allowed"
  }
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  harmCategories,
  harmThresholds
});
//# sourceMappingURL=safety-options.js.map