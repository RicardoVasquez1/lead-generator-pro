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
var import_utils = require("../../helpers/utils");
var import_transport = require("../../transport");
var import_descriptions = require("../descriptions");
const properties = [
  (0, import_descriptions.modelRLC)("videoGenerationModelSearch"),
  {
    displayName: "Prompt",
    name: "prompt",
    type: "string",
    placeholder: "e.g. Panning wide shot of a calico kitten sleeping in the sunshine",
    description: "A text description of the desired video",
    default: "",
    typeOptions: {
      rows: 2
    }
  },
  {
    displayName: "Return As",
    name: "returnAs",
    type: "options",
    options: [
      {
        name: "Video",
        value: "video"
      },
      {
        name: "URL",
        value: "url"
      }
    ],
    description: "Whether to return the video as a binary file or a URL that can be used to download the video later",
    default: "video"
  },
  {
    displayName: "Options",
    name: "options",
    placeholder: "Add Option",
    type: "collection",
    default: {},
    options: [
      {
        displayName: "Number of Videos",
        name: "sampleCount",
        type: "number",
        default: 1,
        description: "How many videos to generate",
        typeOptions: {
          minValue: 1,
          maxValue: 4
        }
      },
      {
        displayName: "Duration (Seconds)",
        name: "durationSeconds",
        type: "number",
        default: 8,
        description: "Length of the generated video in seconds. Supported only by certain models.",
        typeOptions: {
          minValue: 5,
          maxValue: 8
        }
      },
      {
        displayName: "Aspect Ratio",
        name: "aspectRatio",
        type: "options",
        options: [
          {
            name: "Widescreen (16:9)",
            value: "16:9",
            description: "Most common aspect ratio for televisions and monitors"
          },
          {
            name: "Portrait (9:16)",
            value: "9:16",
            description: "Popular for short-form videos like YouTube Shorts"
          }
        ],
        default: "16:9"
      },
      {
        displayName: "Person Generation",
        name: "personGeneration",
        type: "options",
        options: [
          {
            name: "Don't Allow",
            value: "dont_allow",
            description: "Prevent generation of people in the video"
          },
          {
            name: "Allow Adult",
            value: "allow_adult",
            description: "Allow generation of adult people in the video"
          },
          {
            name: "Allow All",
            value: "allow_all",
            description: "Allow generation of all people in the video"
          }
        ],
        default: "dont_allow"
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
    resource: ["video"]
  }
};
const description = (0, import_n8n_workflow.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
  const model = this.getNodeParameter("modelId", i, "", { extractValue: true });
  const prompt = this.getNodeParameter("prompt", i, "");
  const returnAs = this.getNodeParameter("returnAs", i, "video");
  const options = this.getNodeParameter("options", i, {});
  const binaryPropertyOutput = this.getNodeParameter(
    "options.binaryPropertyOutput",
    i,
    "data"
  );
  const credentials = await this.getCredentials("googlePalmApi");
  if (!model.includes("veo")) {
    throw new import_n8n_workflow.NodeOperationError(
      this.getNode(),
      `Model ${model} is not supported for video generation. Please use a Veo model`,
      {
        description: "Video generation is only supported by Veo models"
      }
    );
  }
  const body = {
    instances: [
      {
        prompt
      }
    ],
    parameters: {
      aspectRatio: options.aspectRatio,
      personGeneration: options.personGeneration,
      sampleCount: options.sampleCount ?? 1,
      durationSeconds: options.durationSeconds
    }
  };
  let response = await import_transport.apiRequest.call(this, "POST", `/v1beta/${model}:predictLongRunning`, {
    body
  });
  while (!response.done) {
    await new Promise((resolve) => setTimeout(resolve, 5e3));
    response = await import_transport.apiRequest.call(this, "GET", `/v1beta/${response.name}`);
  }
  if (response.error) {
    throw new import_n8n_workflow.NodeOperationError(this.getNode(), response.error.message, {
      description: "Error generating video"
    });
  }
  if (returnAs === "video") {
    const promises = response.response.generateVideoResponse.generatedSamples.map(
      async (sample) => {
        const { fileContent, mimeType } = await import_utils.downloadFile.call(
          this,
          sample.video.uri,
          "video/mp4",
          {
            key: credentials.apiKey
          }
        );
        const binaryData = await this.helpers.prepareBinaryData(fileContent, "video.mp4", mimeType);
        return {
          binary: { [binaryPropertyOutput]: binaryData },
          json: {
            ...binaryData,
            data: void 0
          },
          pairedItem: { item: i }
        };
      }
    );
    return await Promise.all(promises);
  } else {
    return response.response.generateVideoResponse.generatedSamples.map((sample) => ({
      json: {
        url: sample.video.uri
      },
      pairedItem: { item: i }
    }));
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  description,
  execute
});
//# sourceMappingURL=generate.operation.js.map