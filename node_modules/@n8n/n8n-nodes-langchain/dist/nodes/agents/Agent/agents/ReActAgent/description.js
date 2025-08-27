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
  reActAgentAgentProperties: () => reActAgentAgentProperties
});
module.exports = __toCommonJS(description_exports);
var import_prompt = require("./prompt");
const reActAgentAgentProperties = [
  {
    displayName: "Text",
    name: "text",
    type: "string",
    required: true,
    displayOptions: {
      show: {
        agent: ["reActAgent"],
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
        agent: ["reActAgent"],
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
        agent: ["reActAgent"],
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
        agent: ["reActAgent"]
      }
    },
    default: {},
    placeholder: "Add Option",
    options: [
      {
        displayName: "Human Message Template",
        name: "humanMessageTemplate",
        type: "string",
        default: import_prompt.HUMAN_MESSAGE_TEMPLATE,
        description: "String to use directly as the human message template",
        typeOptions: {
          rows: 6
        }
      },
      {
        displayName: "Prefix Message",
        name: "prefix",
        type: "string",
        default: import_prompt.PREFIX,
        description: "String to put before the list of tools",
        typeOptions: {
          rows: 6
        }
      },
      {
        displayName: "Suffix Message for Chat Model",
        name: "suffixChat",
        type: "string",
        default: import_prompt.SUFFIX_CHAT,
        description: "String to put after the list of tools that will be used if chat model is used",
        typeOptions: {
          rows: 6
        }
      },
      {
        displayName: "Suffix Message for Regular Model",
        name: "suffix",
        type: "string",
        default: import_prompt.SUFFIX,
        description: "String to put after the list of tools that will be used if regular model is used",
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
  reActAgentAgentProperties
});
//# sourceMappingURL=description.js.map