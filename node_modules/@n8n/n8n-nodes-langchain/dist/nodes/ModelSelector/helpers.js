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
var helpers_exports = {};
__export(helpers_exports, {
  configuredInputs: () => configuredInputs,
  numberInputsProperty: () => numberInputsProperty
});
module.exports = __toCommonJS(helpers_exports);
const numberInputsProperty = {
  displayName: "Number of Inputs",
  name: "numberInputs",
  type: "options",
  noDataExpression: true,
  default: 2,
  options: [
    {
      name: "2",
      value: 2
    },
    {
      name: "3",
      value: 3
    },
    {
      name: "4",
      value: 4
    },
    {
      name: "5",
      value: 5
    },
    {
      name: "6",
      value: 6
    },
    {
      name: "7",
      value: 7
    },
    {
      name: "8",
      value: 8
    },
    {
      name: "9",
      value: 9
    },
    {
      name: "10",
      value: 10
    }
  ],
  validateType: "number",
  description: "The number of data inputs you want to merge. The node waits for all connected inputs to be executed."
};
function configuredInputs(parameters) {
  return Array.from({ length: parameters.numberInputs || 2 }, (_, i) => ({
    type: "ai_languageModel",
    displayName: `Model ${(i + 1).toString()}`,
    required: true,
    maxConnections: 1
  }));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  configuredInputs,
  numberInputsProperty
});
//# sourceMappingURL=helpers.js.map