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
var versionDescription_exports = {};
__export(versionDescription_exports, {
  versionDescription: () => versionDescription
});
module.exports = __toCommonJS(versionDescription_exports);
var import_n8n_workflow = require("n8n-workflow");
var assistant = __toESM(require("./assistant"));
var audio = __toESM(require("./audio"));
var file = __toESM(require("./file"));
var image = __toESM(require("./image"));
var text = __toESM(require("./text"));
const prettifyOperation = (resource, operation) => {
  if (operation === "deleteAssistant") {
    return "Delete Assistant";
  }
  if (operation === "deleteFile") {
    return "Delete File";
  }
  if (operation === "classify") {
    return "Classify Text";
  }
  if (operation === "message" && resource === "text") {
    return "Message Model";
  }
  const capitalize = (str) => {
    const chars = str.split("");
    chars[0] = chars[0].toUpperCase();
    return chars.join("");
  };
  if (["transcribe", "translate"].includes(operation)) {
    resource = "recording";
  }
  if (operation === "list") {
    resource = resource + "s";
  }
  return `${capitalize(operation)} ${capitalize(resource)}`;
};
const configureNodeInputs = (resource, operation, hideTools, memory) => {
  if (resource === "assistant" && operation === "message") {
    const inputs = [
      { type: "main" },
      { type: "ai_tool", displayName: "Tools" }
    ];
    if (memory !== "threadId") {
      inputs.push({ type: "ai_memory", displayName: "Memory", maxConnections: 1 });
    }
    return inputs;
  }
  if (resource === "text" && operation === "message") {
    if (hideTools === "hide") {
      return ["main"];
    }
    return [{ type: "main" }, { type: "ai_tool", displayName: "Tools" }];
  }
  return ["main"];
};
const versionDescription = {
  displayName: "OpenAI",
  name: "openAi",
  icon: { light: "file:openAi.svg", dark: "file:openAi.dark.svg" },
  group: ["transform"],
  version: [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8],
  subtitle: `={{(${prettifyOperation})($parameter.resource, $parameter.operation)}}`,
  description: "Message an assistant or GPT, analyze images, generate audio, etc.",
  defaults: {
    name: "OpenAI"
  },
  codex: {
    alias: ["LangChain", "ChatGPT", "DallE", "whisper", "audio", "transcribe", "tts", "assistant"],
    categories: ["AI"],
    subcategories: {
      AI: ["Agents", "Miscellaneous", "Root Nodes"]
    },
    resources: {
      primaryDocumentation: [
        {
          url: "https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai/"
        }
      ]
    }
  },
  inputs: `={{(${configureNodeInputs})($parameter.resource, $parameter.operation, $parameter.hideTools, $parameter.memory ?? undefined)}}`,
  outputs: [import_n8n_workflow.NodeConnectionTypes.Main],
  credentials: [
    {
      name: "openAiApi",
      required: true
    }
  ],
  properties: [
    {
      displayName: "Resource",
      name: "resource",
      type: "options",
      noDataExpression: true,
      // eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
      options: [
        {
          name: "Assistant",
          value: "assistant"
        },
        {
          name: "Text",
          value: "text"
        },
        {
          name: "Image",
          value: "image"
        },
        {
          name: "Audio",
          value: "audio"
        },
        {
          name: "File",
          value: "file"
        }
      ],
      default: "text"
    },
    ...assistant.description,
    ...audio.description,
    ...file.description,
    ...image.description,
    ...text.description
  ]
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  versionDescription
});
//# sourceMappingURL=versionDescription.js.map