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
var MemoryXata_node_exports = {};
__export(MemoryXata_node_exports, {
  MemoryXata: () => MemoryXata
});
module.exports = __toCommonJS(MemoryXata_node_exports);
var import_xata = require("@langchain/community/stores/message/xata");
var import_client = require("@xata.io/client");
var import_memory = require("langchain/memory");
var import_n8n_workflow = require("n8n-workflow");
var import_helpers = require("../../../utils/helpers");
var import_logWrapper = require("../../../utils/logWrapper");
var import_sharedFields = require("../../../utils/sharedFields");
var import_descriptions = require("../descriptions");
class MemoryXata {
  constructor() {
    this.description = {
      displayName: "Xata",
      name: "memoryXata",
      icon: "file:xata.svg",
      group: ["transform"],
      version: [1, 1.1, 1.2, 1.3, 1.4],
      description: "Use Xata Memory",
      defaults: {
        name: "Xata",
        // eslint-disable-next-line n8n-nodes-base/node-class-description-non-core-color-present
        color: "#1321A7"
      },
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Memory"],
          Memory: ["Other memories"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.memoryxata/"
            }
          ]
        }
      },
      inputs: [],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiMemory],
      outputNames: ["Memory"],
      credentials: [
        {
          name: "xataApi",
          required: true
        }
      ],
      properties: [
        (0, import_sharedFields.getConnectionHintNoticeField)([import_n8n_workflow.NodeConnectionTypes.AiAgent]),
        {
          displayName: "Session ID",
          name: "sessionId",
          type: "string",
          required: true,
          default: "",
          displayOptions: {
            show: {
              "@version": [1]
            }
          }
        },
        {
          displayName: "Session ID",
          name: "sessionId",
          type: "string",
          default: "={{ $json.sessionId }}",
          description: "The key to use to store the memory",
          displayOptions: {
            show: {
              "@version": [1.1]
            }
          }
        },
        {
          ...import_descriptions.sessionIdOption,
          displayOptions: {
            show: {
              "@version": [{ _cnd: { gte: 1.2 } }]
            }
          }
        },
        import_descriptions.sessionKeyProperty,
        (0, import_descriptions.expressionSessionKeyProperty)(1.4),
        {
          ...import_descriptions.contextWindowLengthProperty,
          displayOptions: { hide: { "@version": [{ _cnd: { lt: 1.3 } }] } }
        }
      ]
    };
  }
  async supplyData(itemIndex) {
    const credentials = await this.getCredentials("xataApi");
    const nodeVersion = this.getNode().typeVersion;
    let sessionId;
    if (nodeVersion >= 1.2) {
      sessionId = (0, import_helpers.getSessionId)(this, itemIndex);
    } else {
      sessionId = this.getNodeParameter("sessionId", itemIndex);
    }
    const xataClient = new import_client.BaseClient({
      apiKey: credentials.apiKey,
      branch: credentials.branch || "main",
      databaseURL: credentials.databaseEndpoint
    });
    const table = credentials.databaseEndpoint.match(
      /https:\/\/[^.]+\.[^.]+\.xata\.sh\/db\/([^\/:]+)/
    );
    if (table === null) {
      throw new import_n8n_workflow.NodeOperationError(
        this.getNode(),
        "It was not possible to extract the table from the Database Endpoint."
      );
    }
    const chatHistory = new import_xata.XataChatMessageHistory({
      table: table[1],
      sessionId,
      client: xataClient,
      apiKey: credentials.apiKey
    });
    const memClass = this.getNode().typeVersion < 1.3 ? import_memory.BufferMemory : import_memory.BufferWindowMemory;
    const kOptions = this.getNode().typeVersion < 1.3 ? {} : { k: this.getNodeParameter("contextWindowLength", itemIndex) };
    const memory = new memClass({
      chatHistory,
      memoryKey: "chat_history",
      returnMessages: true,
      inputKey: "input",
      outputKey: "output",
      ...kOptions
    });
    return {
      response: (0, import_logWrapper.logWrapper)(memory, this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MemoryXata
});
//# sourceMappingURL=MemoryXata.node.js.map