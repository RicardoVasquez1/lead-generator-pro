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
var description_exports = {};
__export(description_exports, {
  openAiFunctionsAgentProperties: () => openAiFunctionsAgentProperties
});
module.exports = __toCommonJS(description_exports);
var import_prompt = require("./prompt");
const openAiFunctionsAgentProperties = [
  {
    displayName: "Text",
    name: "text",
    type: "string",
    required: true,
    displayOptions: {
      show: {
        agent: ["openAiFunctionsAgent"],
        "@version": [1]
      }
    },
    default: "={{ $json.input }}"
  },
  {
    displayName: "Text",
    name: "text",
    type: "string",
    required: true,
    displayOptions: {
      show: {
        agent: ["openAiFunctionsAgent"],
        "@version": [1.1]
      }
    },
    default: "={{ $json.chat_input }}"
  },
  {
    displayName: "Text",
    name: "text",
    type: "string",
    required: true,
    displayOptions: {
      show: {
        agent: ["openAiFunctionsAgent"],
        "@version": [1.2]
      }
    },
    default: "={{ $json.chatInput }}"
  },
  {
    displayName: "Options",
    name: "options",
    type: "collection",
    displayOptions: {
      show: {
        agent: ["openAiFunctionsAgent"]
      }
    },
    default: {},
    placeholder: "Add Option",
    options: [
      {
        displayName: "System Message",
        name: "systemMessage",
        type: "string",
        default: import_prompt.SYSTEM_MESSAGE,
        description: "The message that will be sent to the agent before the conversation starts",
        typeOptions: {
          rows: 6
        }
      },
      {
        displayName: "Max Iterations",
        name: "maxIterations",
        type: "number",
        default: 10,
        description: "The maximum number of iterations the agent will run before stopping"
      },
      {
        displayName: "Return Intermediate Steps",
        name: "returnIntermediateSteps",
        type: "boolean",
        default: false,
        description: "Whether or not the output should include intermediate steps the agent took"
      }
    ]
  }
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  openAiFunctionsAgentProperties
});
//# sourceMappingURL=description.js.map