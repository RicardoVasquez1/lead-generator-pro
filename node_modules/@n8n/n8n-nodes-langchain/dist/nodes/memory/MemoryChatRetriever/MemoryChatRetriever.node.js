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
var MemoryChatRetriever_node_exports = {};
__export(MemoryChatRetriever_node_exports, {
  MemoryChatRetriever: () => MemoryChatRetriever
});
module.exports = __toCommonJS(MemoryChatRetriever_node_exports);
var import_n8n_workflow = require("n8n-workflow");
function simplifyMessages(messages) {
  const chunkedMessages = [];
  for (let i = 0; i < messages.length; i += 2) {
    chunkedMessages.push([messages[i], messages[i + 1]]);
  }
  const transformedMessages = chunkedMessages.map((exchange) => {
    const simplified = {
      [exchange[0]._getType()]: exchange[0].content
    };
    if (exchange[1]) {
      simplified[exchange[1]._getType()] = exchange[1].content;
    }
    return {
      json: simplified
    };
  });
  return transformedMessages;
}
class MemoryChatRetriever {
  constructor() {
    this.description = {
      displayName: "Chat Messages Retriever",
      name: "memoryChatRetriever",
      icon: "fa:database",
      iconColor: "black",
      group: ["transform"],
      hidden: true,
      version: 1,
      description: "Retrieve chat messages from memory and use them in the workflow",
      defaults: {
        name: "Chat Messages Retriever"
      },
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Miscellaneous"]
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
        import_n8n_workflow.NodeConnectionTypes.Main,
        {
          displayName: "Memory",
          maxConnections: 1,
          type: import_n8n_workflow.NodeConnectionTypes.AiMemory,
          required: true
        }
      ],
      outputs: [import_n8n_workflow.NodeConnectionTypes.Main],
      properties: [
        {
          displayName: "This node is deprecated. Use 'Chat Memory Manager' node instead.",
          type: "notice",
          default: "",
          name: "deprecatedNotice"
        },
        {
          displayName: "Simplify Output",
          name: "simplifyOutput",
          type: "boolean",
          description: "Whether to simplify the output to only include the sender and the text",
          default: true
        }
      ]
    };
  }
  async execute() {
    this.logger.debug("Executing Chat Memory Retriever");
    const memory = await this.getInputConnectionData(import_n8n_workflow.NodeConnectionTypes.AiMemory, 0);
    const simplifyOutput = this.getNodeParameter("simplifyOutput", 0);
    const messages = await memory?.chatHistory.getMessages();
    if (simplifyOutput && messages) {
      return [simplifyMessages(messages)];
    }
    const serializedMessages = messages?.map((message) => {
      const serializedMessage = message.toJSON();
      return { json: serializedMessage };
    }) ?? [];
    return [serializedMessages];
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MemoryChatRetriever
});
//# sourceMappingURL=MemoryChatRetriever.node.js.map