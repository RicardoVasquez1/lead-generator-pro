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
var improve_operation_exports = {};
__export(improve_operation_exports, {
  description: () => description,
  execute: () => execute
});
module.exports = __toCommonJS(improve_operation_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_transport = require("../../transport");
const properties = [
  {
    displayName: "Messages",
    name: "messages",
    type: "fixedCollection",
    typeOptions: {
      sortable: true,
      multipleValues: true
    },
    description: "Messages that constitute the prompt to be improved",
    placeholder: "Add Message",
    default: { values: [{ content: "", role: "user" }] },
    options: [
      {
        displayName: "Values",
        name: "values",
        values: [
          {
            displayName: "Prompt",
            name: "content",
            type: "string",
            description: "The content of the message to be sent",
            default: "",
            placeholder: "e.g. Concise instructions for a meal prep service",
            typeOptions: {
              rows: 2
            }
          },
          {
            displayName: "Role",
            name: "role",
            type: "options",
            description: "Role in shaping the model's response, it tells the model how it should behave and interact with the user",
            options: [
              {
                name: "User",
                value: "user",
                description: "Send a message as a user and get a response from the model"
              },
              {
                name: "Assistant",
                value: "assistant",
                description: "Tell the model to adopt a specific tone or personality"
              }
            ],
            default: "user"
          }
        ]
      }
    ]
  },
  {
    displayName: "Simplify Output",
    name: "simplify",
    type: "boolean",
    default: true,
    description: "Whether to return a simplified version of the response instead of the raw data"
  },
  {
    displayName: "Options",
    name: "options",
    placeholder: "Add Option",
    type: "collection",
    default: {},
    options: [
      {
        displayName: "System Message",
        name: "system",
        type: "string",
        description: "The existing system prompt to incorporate, if any",
        default: "",
        placeholder: "e.g. You are a professional meal prep chef"
      },
      {
        displayName: "Feedback",
        name: "feedback",
        type: "string",
        description: "Feedback for improving the prompt",
        default: "",
        placeholder: "e.g. Make it more detailed and include cooking times"
      }
    ]
  }
];
const displayOptions = {
  show: {
    operation: ["improve"],
    resource: ["prompt"]
  }
};
const description = (0, import_n8n_workflow.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
  const messages = this.getNodeParameter("messages.values", i, []);
  const simplify = this.getNodeParameter("simplify", i, true);
  const options = this.getNodeParameter("options", i, {});
  const body = {
    messages,
    system: options.system,
    feedback: options.feedback
  };
  const response = await import_transport.apiRequest.call(this, "POST", "/v1/experimental/improve_prompt", {
    body,
    enableAnthropicBetas: { promptTools: true }
  });
  if (simplify) {
    return [
      {
        json: {
          messages: response.messages,
          system: response.system
        },
        pairedItem: { item: i }
      }
    ];
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
//# sourceMappingURL=improve.operation.js.map