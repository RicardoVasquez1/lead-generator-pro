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
var MemoryManager_node_exports = {};
__export(MemoryManager_node_exports, {
  MemoryManager: () => MemoryManager,
  simplifyMessages: () => simplifyMessages
});
module.exports = __toCommonJS(MemoryManager_node_exports);
var import_messages = require("@langchain/core/messages");
var import_n8n_workflow = require("n8n-workflow");
function simplifyMessages(messages) {
  if (messages.length === 0) return [];
  const result = [];
  let index = 0;
  while (index < messages.length) {
    const currentGroup = {};
    do {
      const message = messages[index];
      const messageType = message.getType();
      if (messageType in currentGroup) {
        break;
      }
      currentGroup[messageType] = message.content;
      index++;
    } while (index < messages.length);
    result.push(currentGroup);
  }
  return result;
}
const prepareOutputSetup = (ctx, version, memory) => {
  if (version === 1) {
    return async (i) => {
      const messages = await memory.chatHistory.getMessages();
      const serializedMessages = messages?.map((message) => message.toJSON()) ?? [];
      const executionData = ctx.helpers.constructExecutionMetaData(
        ctx.helpers.returnJsonArray(serializedMessages),
        { itemData: { item: i } }
      );
      return executionData;
    };
  }
  return async (i) => {
    return [
      {
        json: { success: true },
        pairedItem: { item: i }
      }
    ];
  };
};
class MemoryManager {
  constructor() {
    this.description = {
      displayName: "Chat Memory Manager",
      name: "memoryManager",
      icon: "fa:database",
      iconColor: "black",
      group: ["transform"],
      version: [1, 1.1],
      description: "Manage chat messages memory and use it in the workflow",
      defaults: {
        name: "Chat Memory Manager"
      },
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Miscellaneous", "Root Nodes"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.memorymanager/"
            }
          ]
        }
      },
      inputs: [
        {
          displayName: "",
          type: import_n8n_workflow.NodeConnectionTypes.Main
        },
        {
          displayName: "Memory",
          type: import_n8n_workflow.NodeConnectionTypes.AiMemory,
          required: true,
          maxConnections: 1
        }
      ],
      outputs: [
        {
          displayName: "",
          type: import_n8n_workflow.NodeConnectionTypes.Main
        }
      ],
      properties: [
        {
          displayName: "Operation Mode",
          name: "mode",
          type: "options",
          noDataExpression: true,
          default: "load",
          options: [
            {
              name: "Get Many Messages",
              description: "Retrieve chat messages from connected memory",
              value: "load"
            },
            {
              name: "Insert Messages",
              description: "Insert chat messages into connected memory",
              value: "insert"
            },
            {
              name: "Delete Messages",
              description: "Delete chat messages from connected memory",
              value: "delete"
            }
          ]
        },
        {
          displayName: "Insert Mode",
          name: "insertMode",
          type: "options",
          description: "Choose how new messages are inserted into the memory",
          noDataExpression: true,
          default: "insert",
          options: [
            {
              name: "Insert Messages",
              value: "insert",
              description: "Add messages alongside existing ones"
            },
            {
              name: "Override All Messages",
              value: "override",
              description: "Replace the current memory with new messages"
            }
          ],
          displayOptions: {
            show: {
              mode: ["insert"]
            }
          }
        },
        {
          displayName: "Delete Mode",
          name: "deleteMode",
          type: "options",
          description: "How messages are deleted from memory",
          noDataExpression: true,
          default: "lastN",
          options: [
            {
              name: "Last N",
              value: "lastN",
              description: "Delete the last N messages"
            },
            {
              name: "All Messages",
              value: "all",
              description: "Clear all messages from memory"
            }
          ],
          displayOptions: {
            show: {
              mode: ["delete"]
            }
          }
        },
        {
          displayName: "Chat Messages",
          name: "messages",
          description: "Chat messages to insert into memory",
          type: "fixedCollection",
          typeOptions: {
            multipleValues: true
          },
          default: {},
          placeholder: "Add message",
          options: [
            {
              name: "messageValues",
              displayName: "Message",
              values: [
                {
                  displayName: "Type Name or ID",
                  name: "type",
                  type: "options",
                  options: [
                    {
                      name: "AI",
                      value: "ai"
                    },
                    {
                      name: "System",
                      value: "system"
                    },
                    {
                      name: "User",
                      value: "user"
                    }
                  ],
                  default: "system"
                },
                {
                  displayName: "Message",
                  name: "message",
                  type: "string",
                  required: true,
                  default: ""
                },
                {
                  displayName: "Hide Message in Chat",
                  name: "hideFromUI",
                  type: "boolean",
                  required: true,
                  default: false,
                  description: "Whether to hide the message from the chat UI"
                }
              ]
            }
          ],
          displayOptions: {
            show: {
              mode: ["insert"]
            }
          }
        },
        {
          displayName: "Messages Count",
          name: "lastMessagesCount",
          type: "number",
          description: "The amount of last messages to delete",
          default: 2,
          displayOptions: {
            show: {
              mode: ["delete"],
              deleteMode: ["lastN"]
            }
          }
        },
        {
          displayName: "Simplify Output",
          name: "simplifyOutput",
          type: "boolean",
          description: "Whether to simplify the output to only include the sender and the text",
          default: true,
          displayOptions: {
            show: {
              mode: ["load"]
            }
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
              displayName: "Group Messages",
              name: "groupMessages",
              type: "boolean",
              default: true,
              description: "Whether to group messages into a single item or return each message as a separate item"
            }
          ],
          displayOptions: {
            show: {
              mode: ["load"]
            }
          }
        }
      ]
    };
  }
  async execute() {
    const nodeVersion = this.getNode().typeVersion;
    const items = this.getInputData();
    const mode = this.getNodeParameter("mode", 0, "load");
    const memory = await this.getInputConnectionData(
      import_n8n_workflow.NodeConnectionTypes.AiMemory,
      0
    );
    const prepareOutput = prepareOutputSetup(this, nodeVersion, memory);
    const returnData = [];
    for (let i = 0; i < items.length; i++) {
      const messages = await memory.chatHistory.getMessages();
      if (mode === "delete") {
        const deleteMode = this.getNodeParameter("deleteMode", i);
        if (deleteMode === "lastN") {
          const lastMessagesCount = this.getNodeParameter("lastMessagesCount", i);
          if (messages.length >= lastMessagesCount) {
            const newMessages = messages.slice(0, messages.length - lastMessagesCount);
            await memory.chatHistory.clear();
            for (const message of newMessages) {
              await memory.chatHistory.addMessage(message);
            }
          }
        } else {
          await memory.chatHistory.clear();
        }
        returnData.push(...await prepareOutput(i));
      }
      if (mode === "insert") {
        const insertMode = this.getNodeParameter("insertMode", i);
        const messagesToInsert = this.getNodeParameter(
          "messages.messageValues",
          i,
          []
        );
        const templateMapper = {
          ai: import_messages.AIMessage,
          system: import_messages.SystemMessage,
          user: import_messages.HumanMessage
        };
        if (insertMode === "override") {
          await memory.chatHistory.clear();
        }
        for (const message of messagesToInsert) {
          const MessageClass = new templateMapper[message.type](message.message);
          if (message.hideFromUI) {
            MessageClass.additional_kwargs.hideFromUI = true;
          }
          await memory.chatHistory.addMessage(MessageClass);
        }
        returnData.push(...await prepareOutput(i));
      }
      if (mode === "load") {
        const simplifyOutput = this.getNodeParameter("simplifyOutput", i, false);
        const options = this.getNodeParameter("options", i);
        if (simplifyOutput && messages.length && nodeVersion === 1) {
          const groupMessages2 = options.groupMessages;
          const output2 = simplifyMessages(messages);
          return [
            this.helpers.constructExecutionMetaData(
              this.helpers.returnJsonArray(
                groupMessages2 ? [{ messages: output2, messagesCount: output2.length }] : output2
              ),
              { itemData: { item: i } }
            )
          ];
        }
        let groupMessages = true;
        if (options.groupMessages === false) {
          groupMessages = false;
        }
        if (options.groupMessages === void 0 && nodeVersion === 1) {
          groupMessages = false;
        }
        let output = (simplifyOutput ? simplifyMessages(messages) : messages?.map((message) => message.toJSON())) ?? [];
        if (groupMessages) {
          output = [{ messages: output, messagesCount: output.length }];
        }
        const executionData = this.helpers.constructExecutionMetaData(
          this.helpers.returnJsonArray(output),
          { itemData: { item: i } }
        );
        returnData.push(...executionData);
      }
    }
    return [returnData];
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MemoryManager,
  simplifyMessages
});
//# sourceMappingURL=MemoryManager.node.js.map