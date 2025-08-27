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
var transcribe_operation_exports = {};
__export(transcribe_operation_exports, {
  description: () => description,
  execute: () => execute
});
module.exports = __toCommonJS(transcribe_operation_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_utils = require("../../helpers/utils");
var import_transport = require("../../transport");
var import_descriptions = require("../descriptions");
const properties = [
  (0, import_descriptions.modelRLC)("audioModelSearch"),
  {
    displayName: "Input Type",
    name: "inputType",
    type: "options",
    default: "url",
    options: [
      {
        name: "Audio URL(s)",
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
    name: "audioUrls",
    type: "string",
    placeholder: "e.g. https://example.com/audio.mp3",
    description: "URL(s) of the audio(s) to transcribe, multiple URLs can be added separated by comma",
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
    description: "Name of the binary field(s) which contains the audio(s), seperate multiple field names with commas",
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
    type: "collection",
    default: {},
    options: [
      {
        displayName: "Start Time",
        name: "startTime",
        type: "string",
        default: "",
        description: "The start time of the audio in MM:SS or HH:MM:SS format",
        placeholder: "e.g. 00:15"
      },
      {
        displayName: "End Time",
        name: "endTime",
        type: "string",
        default: "",
        description: "The end time of the audio in MM:SS or HH:MM:SS format",
        placeholder: "e.g. 02:15"
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
  const model = this.getNodeParameter("modelId", i, "", { extractValue: true });
  const inputType = this.getNodeParameter("inputType", i, "url");
  const simplify = this.getNodeParameter("simplify", i, true);
  const options = this.getNodeParameter("options", i, {});
  let contents;
  if (inputType === "url") {
    const urls = this.getNodeParameter("audioUrls", i, "");
    const filesDataPromises = urls.split(",").map((url) => url.trim()).filter((url) => url).map(async (url) => {
      if (url.startsWith("https://generativelanguage.googleapis.com")) {
        const { mimeType } = await import_transport.apiRequest.call(this, "GET", "", {
          option: { url }
        });
        return { fileUri: url, mimeType };
      } else {
        const { fileContent, mimeType } = await import_utils.downloadFile.call(this, url, "audio/mpeg");
        return await import_utils.uploadFile.call(this, fileContent, mimeType);
      }
    });
    const filesData = await Promise.all(filesDataPromises);
    contents = [
      {
        role: "user",
        parts: filesData.map((fileData) => ({
          fileData
        }))
      }
    ];
  } else {
    const binaryPropertyNames = this.getNodeParameter("binaryPropertyName", i, "data");
    const promises = binaryPropertyNames.split(",").map((binaryPropertyName) => binaryPropertyName.trim()).filter((binaryPropertyName) => binaryPropertyName).map(async (binaryPropertyName) => {
      const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
      const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
      return await import_utils.uploadFile.call(this, buffer, binaryData.mimeType);
    });
    const filesData = await Promise.all(promises);
    contents = [
      {
        role: "user",
        parts: filesData.map((fileData) => ({
          fileData
        }))
      }
    ];
  }
  const text = `Generate a transcript of the speech${options.startTime ? ` from ${options.startTime}` : ""}${options.endTime ? ` to ${options.endTime}` : ""}`;
  contents[0].parts.push({ text });
  const body = {
    contents
  };
  const response = await import_transport.apiRequest.call(this, "POST", `/v1beta/${model}:generateContent`, {
    body
  });
  if (simplify) {
    return response.candidates.map((candidate) => ({
      json: candidate,
      pairedItem: { item: i }
    }));
  }
  return [
    {
      json: { ...response },
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