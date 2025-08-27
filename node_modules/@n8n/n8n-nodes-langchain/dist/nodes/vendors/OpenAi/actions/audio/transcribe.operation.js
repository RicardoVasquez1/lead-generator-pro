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
var transcribe_operation_exports = {};
__export(transcribe_operation_exports, {
  description: () => description,
  execute: () => execute
});
module.exports = __toCommonJS(transcribe_operation_exports);
var import_form_data = __toESM(require("form-data"));
var import_n8n_workflow = require("n8n-workflow");
var import_transport = require("../../transport");
const properties = [
  {
    displayName: "Input Data Field Name",
    name: "binaryPropertyName",
    type: "string",
    default: "data",
    placeholder: "e.g. data",
    hint: "The name of the input field containing the binary file data to be processed",
    description: "Name of the binary property which contains the audio file in one of these formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, or webm"
  },
  {
    displayName: "Options",
    name: "options",
    placeholder: "Add Option",
    type: "collection",
    default: {},
    options: [
      {
        displayName: "Language of the Audio File",
        name: "language",
        type: "string",
        description: 'The language of the input audio. Supplying the input language in <a href="https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes" target="_blank">ISO-639-1</a> format will improve accuracy and latency.',
        default: ""
      },
      {
        displayName: "Output Randomness (Temperature)",
        name: "temperature",
        type: "number",
        default: 0,
        typeOptions: {
          minValue: 0,
          maxValue: 1,
          numberPrecision: 1
        }
      }
    ]
  }
];
const displayOptions = {
  show: {
    operation: ["transcribe"],
    resource: ["audio"]
  }
};
const description = (0, import_n8n_workflow.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
  const model = "whisper-1";
  const binaryPropertyName = this.getNodeParameter("binaryPropertyName", i);
  const options = this.getNodeParameter("options", i, {});
  const formData = new import_form_data.default();
  formData.append("model", model);
  if (options.language) {
    formData.append("language", options.language);
  }
  if (options.temperature) {
    formData.append("temperature", options.temperature.toString());
  }
  const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
  const dataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
  formData.append("file", dataBuffer, {
    filename: binaryData.fileName,
    contentType: binaryData.mimeType
  });
  const response = await import_transport.apiRequest.call(this, "POST", "/audio/transcriptions", {
    option: { formData },
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return [
    {
      json: response,
      pairedItem: { item: i }
    }
  ];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  description,
  execute
});
//# sourceMappingURL=transcribe.operation.js.map