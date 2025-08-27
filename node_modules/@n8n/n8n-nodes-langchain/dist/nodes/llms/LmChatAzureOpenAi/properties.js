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
var properties_exports = {};
__export(properties_exports, {
  properties: () => properties
});
module.exports = __toCommonJS(properties_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_sharedFields = require("../../../utils/sharedFields");
var import_types = require("./types");
const properties = [
  // eslint-disable-next-line n8n-nodes-base/node-param-default-missing
  {
    displayName: "Authentication",
    name: "authentication",
    type: "options",
    default: import_types.AuthenticationType.ApiKey,
    options: [
      {
        name: "API Key",
        value: import_types.AuthenticationType.ApiKey
      },
      {
        name: "Azure Entra ID (OAuth2)",
        value: import_types.AuthenticationType.EntraOAuth2
      }
    ]
  },
  (0, import_sharedFields.getConnectionHintNoticeField)([import_n8n_workflow.NodeConnectionTypes.AiChain, import_n8n_workflow.NodeConnectionTypes.AiAgent]),
  {
    displayName: 'If using JSON response format, you must include word "json" in the prompt in your chain or agent. Also, make sure to select latest models released post November 2023.',
    name: "notice",
    type: "notice",
    default: "",
    displayOptions: {
      show: {
        "/options.responseFormat": ["json_object"]
      }
    }
  },
  {
    displayName: "Model (Deployment) Name",
    name: "model",
    type: "string",
    description: "The name of the model(deployment) to use (e.g., gpt-4, gpt-35-turbo)",
    required: true,
    default: ""
  },
  {
    displayName: "Options",
    name: "options",
    placeholder: "Add Option",
    description: "Additional options to add",
    type: "collection",
    default: {},
    options: [
      {
        displayName: "Frequency Penalty",
        name: "frequencyPenalty",
        default: 0,
        typeOptions: { maxValue: 2, minValue: -2, numberPrecision: 1 },
        description: "Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim",
        type: "number"
      },
      {
        displayName: "Maximum Number of Tokens",
        name: "maxTokens",
        default: -1,
        description: "The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 32,768). Use -1 for default.",
        type: "number",
        typeOptions: {
          maxValue: 128e3
        }
      },
      {
        displayName: "Response Format",
        name: "responseFormat",
        default: "text",
        type: "options",
        options: [
          {
            name: "Text",
            value: "text",
            description: "Regular text response"
          },
          {
            name: "JSON",
            value: "json_object",
            description: "Enables JSON mode, which should guarantee the message the model generates is valid JSON"
          }
        ]
      },
      {
        displayName: "Presence Penalty",
        name: "presencePenalty",
        default: 0,
        typeOptions: { maxValue: 2, minValue: -2, numberPrecision: 1 },
        description: "Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics",
        type: "number"
      },
      {
        displayName: "Sampling Temperature",
        name: "temperature",
        default: 0.7,
        typeOptions: { maxValue: 2, minValue: 0, numberPrecision: 1 },
        // Max temp can be 2
        description: "Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive.",
        type: "number"
      },
      {
        displayName: "Timeout (Ms)",
        name: "timeout",
        default: 6e4,
        description: "Maximum amount of time a request is allowed to take in milliseconds",
        type: "number"
      },
      {
        displayName: "Max Retries",
        name: "maxRetries",
        default: 2,
        description: "Maximum number of retries to attempt on failure",
        type: "number"
      },
      {
        displayName: "Top P",
        name: "topP",
        default: 1,
        typeOptions: { maxValue: 1, minValue: 0, numberPrecision: 1 },
        description: "Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered. We generally recommend altering this or temperature but not both.",
        type: "number"
      }
    ]
  }
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  properties
});
//# sourceMappingURL=properties.js.map