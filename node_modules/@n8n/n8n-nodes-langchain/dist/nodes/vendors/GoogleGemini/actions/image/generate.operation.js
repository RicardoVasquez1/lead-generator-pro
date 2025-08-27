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
var generate_operation_exports = {};
__export(generate_operation_exports, {
  description: () => description,
  execute: () => execute
});
module.exports = __toCommonJS(generate_operation_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_transport = require("../../transport");
var import_descriptions = require("../descriptions");
const properties = [
  (0, import_descriptions.modelRLC)("imageGenerationModelSearch"),
  {
    displayName: "Prompt",
    name: "prompt",
    type: "string",
    placeholder: "e.g. A cute cat eating a dinosaur",
    description: "A text description of the desired image(s)",
    default: "",
    typeOptions: {
      rows: 2
    }
  },
  {
    displayName: "Options",
    name: "options",
    placeholder: "Add Option",
    type: "collection",
    default: {},
    options: [
      {
        displayName: "Number of Images",
        name: "sampleCount",
        default: 1,
        description: "Number of images to generate. Not supported by Gemini models, supported by Imagen models.",
        type: "number",
        typeOptions: {
          minValue: 1
        }
      },
      {
        displayName: "Put Output in Field",
        name: "binaryPropertyOutput",
        type: "string",
        default: "data",
        hint: "The name of the output field to put the binary file data in"
      }
    ]
  }
];
const displayOptions = {
  show: {
    operation: ["generate"],
    resource: ["image"]
  }
};
const description = (0, import_n8n_workflow.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
  const model = this.getNodeParameter("modelId", i, "", { extractValue: true });
  const prompt = this.getNodeParameter("prompt", i, "");
  const binaryPropertyOutput = this.getNodeParameter(
    "options.binaryPropertyOutput",
    i,
    "data"
  );
  if (model.includes("gemini")) {
    const generationConfig = {
      responseModalities: ["IMAGE", "TEXT"]
    };
    const body = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      generationConfig
    };
    const response = await import_transport.apiRequest.call(this, "POST", `/v1beta/${model}:generateContent`, {
      body
    });
    const promises = response.candidates.map(async (candidate) => {
      const imagePart = candidate.content.parts.find((part) => "inlineData" in part);
      const buffer = Buffer.from(imagePart?.inlineData.data ?? "", "base64");
      const binaryData = await this.helpers.prepareBinaryData(
        buffer,
        "image.png",
        imagePart?.inlineData.mimeType
      );
      return {
        binary: {
          [binaryPropertyOutput]: binaryData
        },
        json: {
          ...binaryData,
          data: void 0
        },
        pairedItem: { item: i }
      };
    });
    return await Promise.all(promises);
  } else if (model.includes("imagen")) {
    const sampleCount = this.getNodeParameter("options.sampleCount", i, 1);
    const body = {
      instances: [
        {
          prompt
        }
      ],
      parameters: {
        sampleCount
      }
    };
    const response = await import_transport.apiRequest.call(this, "POST", `/v1beta/${model}:predict`, {
      body
    });
    const promises = response.predictions.map(async (prediction) => {
      const buffer = Buffer.from(prediction.bytesBase64Encoded ?? "", "base64");
      const binaryData = await this.helpers.prepareBinaryData(
        buffer,
        "image.png",
        prediction.mimeType
      );
      return {
        binary: {
          [binaryPropertyOutput]: binaryData
        },
        json: {
          ...binaryData,
          data: void 0
        },
        pairedItem: { item: i }
      };
    });
    return await Promise.all(promises);
  }
  throw new import_n8n_workflow.NodeOperationError(
    this.getNode(),
    `Model ${model} is not supported for image generation`,
    {
      description: "Please check the model ID and try again."
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  description,
  execute
});
//# sourceMappingURL=generate.operation.js.map