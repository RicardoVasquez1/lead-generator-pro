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
var analyze_operation_exports = {};
__export(analyze_operation_exports, {
  description: () => description,
  execute: () => execute
});
module.exports = __toCommonJS(analyze_operation_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_baseAnalyze = require("../../helpers/baseAnalyze");
var import_descriptions = require("../descriptions");
const properties = [
  (0, import_descriptions.modelRLC)("modelSearch"),
  {
    displayName: "Text Input",
    name: "text",
    type: "string",
    placeholder: "e.g. What's in this image?",
    default: "What's in this image?",
    typeOptions: {
      rows: 2
    }
  },
  {
    displayName: "Input Type",
    name: "inputType",
    type: "options",
    default: "url",
    options: [
      {
        name: "Image URL(s)",
        value: "url"
      },
      {
        name: "Binary File(s)",
        value: "binary"
      }
    ]
  },
  {
    displayName: "URL(s)",
    name: "imageUrls",
    type: "string",
    placeholder: "e.g. https://example.com/image.png",
    description: "URL(s) of the image(s) to analyze, multiple URLs can be added separated by comma",
    default: "",
    displayOptions: {
      show: {
        inputType: ["url"]
      }
    }
  },
  {
    displayName: "Input Data Field Name(s)",
    name: "binaryPropertyName",
    type: "string",
    default: "data",
    placeholder: "e.g. data",
    hint: "The name of the input field containing the binary file data to be processed",
    description: "Name of the binary field(s) which contains the image(s), separate multiple field names with commas",
    displayOptions: {
      show: {
        inputType: ["binary"]
      }
    }
  },
  {
    displayName: "Simplify Output",
    name: "simplify",
    type: "boolean",
    default: true,
    description: "Whether to simplify the response or not"
  },
  {
    displayName: "Options",
    name: "options",
    placeholder: "Add Option",
    type: "collection",
    default: {},
    options: [
      {
        displayName: "Length of Description (Max Tokens)",
        description: "Fewer tokens will result in shorter, less detailed image description",
        name: "maxOutputTokens",
        type: "number",
        default: 300,
        typeOptions: {
          minValue: 1
        }
      }
    ]
  }
];
const displayOptions = {
  show: {
    operation: ["analyze"],
    resource: ["image"]
  }
};
const description = (0, import_n8n_workflow.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
  return await import_baseAnalyze.baseAnalyze.call(this, i, "imageUrls", "image/png");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  description,
  execute
});
//# sourceMappingURL=analyze.operation.js.map