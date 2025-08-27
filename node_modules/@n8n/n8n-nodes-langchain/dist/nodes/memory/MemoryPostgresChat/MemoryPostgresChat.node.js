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
var MemoryPostgresChat_node_exports = {};
__export(MemoryPostgresChat_node_exports, {
  MemoryPostgresChat: () => MemoryPostgresChat
});
module.exports = __toCommonJS(MemoryPostgresChat_node_exports);
var import_postgres = require("@langchain/community/stores/message/postgres");
var import_memory = require("langchain/memory");
var import_transport = require("n8n-nodes-base/dist/nodes/Postgres/transport/index");
var import_credentialTest = require("n8n-nodes-base/dist/nodes/Postgres/v2/methods/credentialTest");
var import_n8n_workflow = require("n8n-workflow");
var import_helpers = require("../../../utils/helpers");
var import_logWrapper = require("../../../utils/logWrapper");
var import_sharedFields = require("../../../utils/sharedFields");
var import_descriptions = require("../descriptions");
class MemoryPostgresChat {
  constructor() {
    this.description = {
      displayName: "Postgres Chat Memory",
      name: "memoryPostgresChat",
      icon: "file:postgres.svg",
      group: ["transform"],
      version: [1, 1.1, 1.2, 1.3],
      description: "Stores the chat history in Postgres table.",
      defaults: {
        name: "Postgres Chat Memory"
      },
      credentials: [
        {
          name: "postgres",
          required: true,
          testedBy: "postgresConnectionTest"
        }
      ],
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Memory"],
          Memory: ["Other memories"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.memorypostgreschat/"
            }
          ]
        }
      },
      inputs: [],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiMemory],
      outputNames: ["Memory"],
      properties: [
        (0, import_sharedFields.getConnectionHintNoticeField)([import_n8n_workflow.NodeConnectionTypes.AiAgent]),
        import_descriptions.sessionIdOption,
        (0, import_descriptions.expressionSessionKeyProperty)(1.2),
        import_descriptions.sessionKeyProperty,
        {
          displayName: "Table Name",
          name: "tableName",
          type: "string",
          default: "n8n_chat_histories",
          description: "The table name to store the chat history in. If table does not exist, it will be created."
        },
        {
          ...import_descriptions.contextWindowLengthProperty,
          displayOptions: { hide: { "@version": [{ _cnd: { lt: 1.1 } }] } }
        }
      ]
    };
    this.methods = {
      credentialTest: {
        postgresConnectionTest: import_credentialTest.postgresConnectionTest
      }
    };
  }
  async supplyData(itemIndex) {
    const credentials = await this.getCredentials("postgres");
    const tableName = this.getNodeParameter("tableName", itemIndex, "n8n_chat_histories");
    const sessionId = (0, import_helpers.getSessionId)(this, itemIndex);
    const pgConf = await import_transport.configurePostgres.call(this, credentials);
    const pool = pgConf.db.$pool;
    const pgChatHistory = new import_postgres.PostgresChatMessageHistory({
      pool,
      sessionId,
      tableName
    });
    const memClass = this.getNode().typeVersion < 1.1 ? import_memory.BufferMemory : import_memory.BufferWindowMemory;
    const kOptions = this.getNode().typeVersion < 1.1 ? {} : { k: this.getNodeParameter("contextWindowLength", itemIndex) };
    const memory = new memClass({
      memoryKey: "chat_history",
      chatHistory: pgChatHistory,
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
  MemoryPostgresChat
});
//# sourceMappingURL=MemoryPostgresChat.node.js.map