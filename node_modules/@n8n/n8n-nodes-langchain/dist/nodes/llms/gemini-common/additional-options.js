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
var additional_options_exports = {};
__export(additional_options_exports, {
  additionalOptions: () => additionalOptions
});
module.exports = __toCommonJS(additional_options_exports);
var import_safety_options = require("./safety-options");
const additionalOptions = {
  displayName: "Options",
  name: "options",
  placeholder: "Add Option",
  description: "Additional options to add",
  type: "collection",
  default: {},
  options: [
    {
      displayName: "Maximum Number of Tokens",
      name: "maxOutputTokens",
      default: 2048,
      description: "The maximum number of tokens to generate in the completion",
      type: "number"
    },
    {
      displayName: "Sampling Temperature",
      name: "temperature",
      default: 0.4,
      typeOptions: { maxValue: 1, minValue: 0, numberPrecision: 1 },
      description: "Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive.",
      type: "number"
    },
    {
      displayName: "Top K",
      name: "topK",
      default: 32,
      typeOptions: { maxValue: 40, minValue: -1, numberPrecision: 1 },
      description: 'Used to remove "long tail" low probability responses. Defaults to -1, which disables it.',
      type: "number"
    },
    {
      displayName: "Top P",
      name: "topP",
      default: 1,
      typeOptions: { maxValue: 1, minValue: 0, numberPrecision: 1 },
      description: "Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered. We generally recommend altering this or temperature but not both.",
      type: "number"
    },
    // Safety Settings
    {
      displayName: "Safety Settings",
      name: "safetySettings",
      type: "fixedCollection",
      typeOptions: { multipleValues: true },
      default: {
        values: {
          category: import_safety_options.harmCategories[0].name,
          threshold: import_safety_options.harmThresholds[0].name
        }
      },
      placeholder: "Add Option",
      options: [
        {
          name: "values",
          displayName: "Values",
          values: [
            {
              displayName: "Safety Category",
              name: "category",
              type: "options",
              description: "The category of harmful content to block",
              default: "HARM_CATEGORY_UNSPECIFIED",
              options: import_safety_options.harmCategories
            },
            {
              displayName: "Safety Threshold",
              name: "threshold",
              type: "options",
              description: "The threshold of harmful content to block",
              default: "HARM_BLOCK_THRESHOLD_UNSPECIFIED",
              options: import_safety_options.harmThresholds
            }
          ]
        }
      ]
    }
  ]
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  additionalOptions
});
//# sourceMappingURL=additional-options.js.map