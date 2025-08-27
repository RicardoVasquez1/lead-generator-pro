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
var MemoryRedisChat_node_exports = {};
__export(MemoryRedisChat_node_exports, {
  MemoryRedisChat: () => MemoryRedisChat
});
module.exports = __toCommonJS(MemoryRedisChat_node_exports);
var import_redis = require("@langchain/redis");
var import_memory = require("langchain/memory");
var import_n8n_workflow = require("n8n-workflow");
var import_redis2 = require("redis");
var import_helpers = require("../../../utils/helpers");
var import_logWrapper = require("../../../utils/logWrapper");
var import_sharedFields = require("../../../utils/sharedFields");
var import_descriptions = require("../descriptions");
class MemoryRedisChat {
  constructor() {
    this.description = {
      displayName: "Redis Chat Memory",
      name: "memoryRedisChat",
      icon: "file:redis.svg",
      group: ["transform"],
      version: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
      description: "Stores the chat history in Redis.",
      defaults: {
        name: "Redis Chat Memory"
      },
      credentials: [
        {
          name: "redis",
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
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.memoryredischat/"
            }
          ]
        }
      },
      inputs: [],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiMemory],
      outputNames: ["Memory"],
      properties: [
        (0, import_sharedFields.getConnectionHintNoticeField)([import_n8n_workflow.NodeConnectionTypes.AiAgent]),
        {
          displayName: "Session Key",
          name: "sessionKey",
          type: "string",
          default: "chat_history",
          description: "The key to use to store the memory in the workflow data",
          displayOptions: {
            show: {
              "@version": [1]
            }
          }
        },
        {
          displayName: "Session ID",
          name: "sessionKey",
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
        (0, import_descriptions.expressionSessionKeyProperty)(1.4),
        import_descriptions.sessionKeyProperty,
        {
          displayName: "Session Time To Live",
          name: "sessionTTL",
          type: "number",
          default: 0,
          description: "For how long the session should be stored in seconds. If set to 0 it will not expire."
        },
        {
          ...import_descriptions.contextWindowLengthProperty,
          displayOptions: { hide: { "@version": [{ _cnd: { lt: 1.3 } }] } }
        }
      ]
    };
  }
  async supplyData(itemIndex) {
    const credentials = await this.getCredentials("redis");
    const nodeVersion = this.getNode().typeVersion;
    const sessionTTL = this.getNodeParameter("sessionTTL", itemIndex, 0);
    let sessionId;
    if (nodeVersion >= 1.2) {
      sessionId = (0, import_helpers.getSessionId)(this, itemIndex);
    } else {
      sessionId = this.getNodeParameter("sessionKey", itemIndex);
    }
    const redisOptions = {
      socket: {
        host: credentials.host,
        port: credentials.port,
        tls: credentials.ssl === true
      },
      database: credentials.database
    };
    if (credentials.user && nodeVersion >= 1.5) {
      redisOptions.username = credentials.user;
    }
    if (credentials.password) {
      redisOptions.password = credentials.password;
    }
    const client = (0, import_redis2.createClient)({
      ...redisOptions
    });
    client.on("error", async (error) => {
      await client.quit();
      throw new import_n8n_workflow.NodeOperationError(this.getNode(), "Redis Error: " + error.message);
    });
    const redisChatConfig = {
      client,
      sessionId
    };
    if (sessionTTL > 0) {
      redisChatConfig.sessionTTL = sessionTTL;
    }
    const redisChatHistory = new import_redis.RedisChatMessageHistory(redisChatConfig);
    const memClass = this.getNode().typeVersion < 1.3 ? import_memory.BufferMemory : import_memory.BufferWindowMemory;
    const kOptions = this.getNode().typeVersion < 1.3 ? {} : { k: this.getNodeParameter("contextWindowLength", itemIndex) };
    const memory = new memClass({
      memoryKey: "chat_history",
      chatHistory: redisChatHistory,
      returnMessages: true,
      inputKey: "input",
      outputKey: "output",
      ...kOptions
    });
    async function closeFunction() {
      void client.disconnect();
    }
    return {
      closeFunction,
      response: (0, import_logWrapper.logWrapper)(memory, this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MemoryRedisChat
});
//# sourceMappingURL=MemoryRedisChat.node.js.map