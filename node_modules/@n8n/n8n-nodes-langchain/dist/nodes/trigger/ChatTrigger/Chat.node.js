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
var Chat_node_exports = {};
__export(Chat_node_exports, {
  Chat: () => Chat
});
module.exports = __toCommonJS(Chat_node_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_util = require("./util");
const limitWaitTimeProperties = [
  {
    displayName: "Limit Type",
    name: "limitType",
    type: "options",
    default: "afterTimeInterval",
    description: "Sets the condition for the execution to resume. Can be a specified date or after some time.",
    options: [
      {
        name: "After Time Interval",
        description: "Waits for a certain amount of time",
        value: "afterTimeInterval"
      },
      {
        name: "At Specified Time",
        description: "Waits until the set date and time to continue",
        value: "atSpecifiedTime"
      }
    ]
  },
  {
    displayName: "Amount",
    name: "resumeAmount",
    type: "number",
    displayOptions: {
      show: {
        limitType: ["afterTimeInterval"]
      }
    },
    typeOptions: {
      minValue: 0,
      numberPrecision: 2
    },
    default: 1,
    description: "The time to wait"
  },
  {
    displayName: "Unit",
    name: "resumeUnit",
    type: "options",
    displayOptions: {
      show: {
        limitType: ["afterTimeInterval"]
      }
    },
    options: [
      {
        name: "Minutes",
        value: "minutes"
      },
      {
        name: "Hours",
        value: "hours"
      },
      {
        name: "Days",
        value: "days"
      }
    ],
    default: "hours",
    description: "Unit of the interval value"
  },
  {
    displayName: "Max Date and Time",
    name: "maxDateAndTime",
    type: "dateTime",
    displayOptions: {
      show: {
        limitType: ["atSpecifiedTime"]
      }
    },
    default: "",
    description: "Continue execution after the specified date and time"
  }
];
const limitWaitTimeOption = {
  displayName: "Limit Wait Time",
  name: "limitWaitTime",
  type: "fixedCollection",
  description: "Whether to limit the time this node should wait for a user response before execution resumes",
  default: { values: { limitType: "afterTimeInterval", resumeAmount: 45, resumeUnit: "minutes" } },
  options: [
    {
      displayName: "Values",
      name: "values",
      values: limitWaitTimeProperties
    }
  ],
  displayOptions: {
    show: {
      [`/${import_n8n_workflow.CHAT_WAIT_USER_REPLY}`]: [true]
    }
  }
};
class Chat {
  constructor() {
    this.description = {
      displayName: "Respond to Chat",
      name: "chat",
      icon: "fa:comments",
      iconColor: "black",
      group: ["input"],
      version: 1,
      description: "Send a message to a chat",
      defaults: {
        name: "Respond to Chat"
      },
      codex: {
        categories: ["Core Nodes", "HITL"],
        subcategories: {
          HITL: ["Human in the Loop"]
        },
        alias: ["human", "wait", "hitl"],
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-langchain.chat/"
            }
          ]
        }
      },
      inputs: `={{ (${import_util.configureInputs})($parameter) }}`,
      outputs: [import_n8n_workflow.NodeConnectionTypes.Main],
      properties: [
        {
          displayName: "Verify you're using a chat trigger with the 'Response Mode' option set to 'Using Response Nodes'",
          name: "generalNotice",
          type: "notice",
          default: ""
        },
        {
          displayName: "Message",
          name: "message",
          type: "string",
          default: "",
          required: true,
          typeOptions: {
            rows: 6
          }
        },
        {
          displayName: "Wait for User Reply",
          name: import_n8n_workflow.CHAT_WAIT_USER_REPLY,
          type: "boolean",
          default: true
        },
        {
          displayName: "Options",
          name: "options",
          type: "collection",
          placeholder: "Add Option",
          default: {},
          options: [
            {
              displayName: "Add Memory Input Connection",
              name: "memoryConnection",
              type: "boolean",
              default: false
            },
            limitWaitTimeOption
          ]
        }
      ]
    };
  }
  async onMessage(context, data) {
    const options = context.getNodeParameter("options", 0, {});
    const waitForReply = context.getNodeParameter(import_n8n_workflow.CHAT_WAIT_USER_REPLY, 0, true);
    if (!waitForReply) {
      const inputData = context.getInputData();
      return [inputData];
    }
    if (options.memoryConnection) {
      const memory = await context.getInputConnectionData(import_n8n_workflow.NodeConnectionTypes.AiMemory, 0);
      const message = data.json?.chatInput;
      if (memory && message) {
        await memory.chatHistory.addUserMessage(message);
      }
    }
    return [[data]];
  }
  async execute() {
    const connectedNodes = this.getParentNodes(this.getNode().name, {
      includeNodeParameters: true
    });
    const chatTrigger = connectedNodes.find(
      (node) => node.type === import_n8n_workflow.CHAT_TRIGGER_NODE_TYPE && !node.disabled
    );
    if (!chatTrigger) {
      throw new import_n8n_workflow.NodeOperationError(
        this.getNode(),
        "Workflow must be started from a chat trigger node"
      );
    }
    const parameters = chatTrigger.parameters;
    if (parameters.mode === "webhook") {
      throw new import_n8n_workflow.NodeOperationError(
        this.getNode(),
        '"Embeded chat" is not supported, change the "Mode" in the chat trigger node to the "Hosted Chat"'
      );
    }
    if (parameters.options.responseMode !== "responseNodes") {
      throw new import_n8n_workflow.NodeOperationError(
        this.getNode(),
        '"Response Mode" in the chat trigger node must be set to "Respond Nodes"'
      );
    }
    const message = this.getNodeParameter("message", 0) ?? "";
    const options = this.getNodeParameter("options", 0, {});
    if (options.memoryConnection) {
      const memory = await this.getInputConnectionData(import_n8n_workflow.NodeConnectionTypes.AiMemory, 0);
      if (memory) {
        await memory.chatHistory.addAIChatMessage(message);
      }
    }
    const waitTill = (0, import_util.configureWaitTillDate)(this);
    await this.putExecutionToWait(waitTill);
    return [[{ json: {}, sendMessage: message }]];
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Chat
});
//# sourceMappingURL=Chat.node.js.map