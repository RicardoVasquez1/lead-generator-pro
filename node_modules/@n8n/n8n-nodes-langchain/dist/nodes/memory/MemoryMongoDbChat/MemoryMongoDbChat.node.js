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
var MemoryMongoDbChat_node_exports = {};
__export(MemoryMongoDbChat_node_exports, {
  MemoryMongoDbChat: () => MemoryMongoDbChat
});
module.exports = __toCommonJS(MemoryMongoDbChat_node_exports);
var import_mongodb = require("@langchain/mongodb");
var import_memory = require("langchain/memory");
var import_mongodb2 = require("mongodb");
var import_n8n_workflow = require("n8n-workflow");
var import_helpers = require("../../../utils/helpers");
var import_logWrapper = require("../../../utils/logWrapper");
var import_sharedFields = require("../../../utils/sharedFields");
var import_descriptions = require("../descriptions");
class MemoryMongoDbChat {
  constructor() {
    this.description = {
      displayName: "MongoDB Chat Memory",
      name: "memoryMongoDbChat",
      icon: "file:mongodb.svg",
      group: ["transform"],
      version: [1],
      description: "Stores the chat history in MongoDB collection.",
      defaults: {
        name: "MongoDB Chat Memory"
      },
      credentials: [
        {
          name: "mongoDb",
          required: true
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
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.memorymongochat/"
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
        (0, import_descriptions.expressionSessionKeyProperty)(1),
        import_descriptions.sessionKeyProperty,
        {
          displayName: "Collection Name",
          name: "collectionName",
          type: "string",
          default: "n8n_chat_histories",
          description: "The collection name to store the chat history in. If collection does not exist, it will be created."
        },
        {
          displayName: "Database Name",
          name: "databaseName",
          type: "string",
          default: "",
          description: "The database name to store the chat history in. If not provided, the database from credentials will be used."
        },
        import_descriptions.contextWindowLengthProperty
      ]
    };
  }
  async supplyData(itemIndex) {
    const credentials = await this.getCredentials("mongoDb");
    const collectionName = this.getNodeParameter(
      "collectionName",
      itemIndex,
      "n8n_chat_histories"
    );
    const databaseName = this.getNodeParameter("databaseName", itemIndex, "");
    const sessionId = (0, import_helpers.getSessionId)(this, itemIndex);
    let connectionString;
    let dbName;
    if (credentials.configurationType === "connectionString") {
      connectionString = credentials.connectionString;
      dbName = databaseName || credentials.database;
    } else {
      const host = credentials.host;
      const port = credentials.port;
      const user = credentials.user ? encodeURIComponent(credentials.user) : "";
      const password = credentials.password ? encodeURIComponent(credentials.password) : "";
      const authString = user && password ? `${user}:${password}@` : "";
      const tls = credentials.tls;
      connectionString = `mongodb://${authString}${host}:${port}/?appname=n8n`;
      if (tls) {
        connectionString += "&ssl=true";
      }
      dbName = databaseName || credentials.database;
    }
    if (!dbName) {
      throw new import_n8n_workflow.NodeOperationError(
        this.getNode(),
        "Database name must be provided either in credentials or in node parameters"
      );
    }
    try {
      const client = new import_mongodb2.MongoClient(connectionString);
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
      const mongoDBChatHistory = new import_mongodb.MongoDBChatMessageHistory({
        collection,
        sessionId
      });
      const memory = new import_memory.BufferWindowMemory({
        memoryKey: "chat_history",
        chatHistory: mongoDBChatHistory,
        returnMessages: true,
        inputKey: "input",
        outputKey: "output",
        k: this.getNodeParameter("contextWindowLength", itemIndex, 5)
      });
      async function closeFunction() {
        await client.close();
      }
      return {
        closeFunction,
        response: (0, import_logWrapper.logWrapper)(memory, this)
      };
    } catch (error) {
      throw new import_n8n_workflow.NodeOperationError(this.getNode(), `MongoDB connection error: ${error.message}`);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MemoryMongoDbChat
});
//# sourceMappingURL=MemoryMongoDbChat.node.js.map