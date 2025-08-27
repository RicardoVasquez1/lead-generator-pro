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
var ToolVectorStore_node_exports = {};
__export(ToolVectorStore_node_exports, {
  ToolVectorStore: () => ToolVectorStore
});
module.exports = __toCommonJS(ToolVectorStore_node_exports);
var import_chains = require("langchain/chains");
var import_tools = require("langchain/tools");
var import_n8n_workflow = require("n8n-workflow");
var import_logWrapper = require("../../../utils/logWrapper");
var import_sharedFields = require("../../../utils/sharedFields");
class ToolVectorStore {
  constructor() {
    this.description = {
      displayName: "Vector Store Question Answer Tool",
      name: "toolVectorStore",
      icon: "fa:database",
      iconColor: "black",
      group: ["transform"],
      version: [1, 1.1],
      description: "Answer questions with a vector store",
      defaults: {
        name: "Answer questions with a vector store"
      },
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Tools"],
          Tools: ["Other Tools"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolvectorstore/"
            }
          ]
        }
      },
      inputs: [
        {
          displayName: "Vector Store",
          maxConnections: 1,
          type: import_n8n_workflow.NodeConnectionTypes.AiVectorStore,
          required: true
        },
        {
          displayName: "Model",
          maxConnections: 1,
          type: import_n8n_workflow.NodeConnectionTypes.AiLanguageModel,
          required: true
        }
      ],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiTool],
      outputNames: ["Tool"],
      properties: [
        (0, import_sharedFields.getConnectionHintNoticeField)([import_n8n_workflow.NodeConnectionTypes.AiAgent]),
        {
          displayName: "Data Name",
          name: "name",
          type: "string",
          default: "",
          placeholder: "e.g. users_info",
          validateType: "string-alphanumeric",
          description: "Name of the data in vector store. This will be used to fill this tool description: Useful for when you need to answer questions about [name]. Whenever you need information about [data description], you should ALWAYS use this. Input should be a fully formed question.",
          displayOptions: {
            show: {
              "@version": [1]
            }
          }
        },
        {
          displayName: "Description of Data",
          name: "description",
          type: "string",
          default: "",
          placeholder: "[Describe your data here, e.g. a user's name, email, etc.]",
          description: "Describe the data in vector store. This will be used to fill this tool description: Useful for when you need to answer questions about [name]. Whenever you need information about [data description], you should ALWAYS use this. Input should be a fully formed question.",
          typeOptions: {
            rows: 3
          }
        },
        {
          displayName: "Limit",
          name: "topK",
          type: "number",
          default: 4,
          description: "The maximum number of results to return"
        }
      ]
    };
  }
  async supplyData(itemIndex) {
    const node = this.getNode();
    const { typeVersion } = node;
    const name = typeVersion <= 1 ? this.getNodeParameter("name", itemIndex) : (0, import_n8n_workflow.nodeNameToToolName)(node);
    const toolDescription = this.getNodeParameter("description", itemIndex);
    const topK = this.getNodeParameter("topK", itemIndex, 4);
    const vectorStore = await this.getInputConnectionData(
      import_n8n_workflow.NodeConnectionTypes.AiVectorStore,
      itemIndex
    );
    const llm = await this.getInputConnectionData(
      import_n8n_workflow.NodeConnectionTypes.AiLanguageModel,
      0
    );
    const description = import_tools.VectorStoreQATool.getDescription(name, toolDescription);
    const vectorStoreTool = new import_tools.VectorStoreQATool(name, description, {
      llm,
      vectorStore
    });
    vectorStoreTool.chain = import_chains.VectorDBQAChain.fromLLM(llm, vectorStore, {
      k: topK
    });
    return {
      response: (0, import_logWrapper.logWrapper)(vectorStoreTool, this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ToolVectorStore
});
//# sourceMappingURL=ToolVectorStore.node.js.map