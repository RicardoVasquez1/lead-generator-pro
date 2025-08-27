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
var MemoryBufferWindow_node_exports = {};
__export(MemoryBufferWindow_node_exports, {
  MemoryBufferWindow: () => MemoryBufferWindow
});
module.exports = __toCommonJS(MemoryBufferWindow_node_exports);
var import_memory = require("langchain/memory");
var import_n8n_workflow = require("n8n-workflow");
var import_helpers = require("../../../utils/helpers");
var import_logWrapper = require("../../../utils/logWrapper");
var import_sharedFields = require("../../../utils/sharedFields");
var import_descriptions = require("../descriptions");
class MemoryChatBufferSingleton {
  constructor() {
    this.memoryBuffer = /* @__PURE__ */ new Map();
  }
  static getInstance() {
    if (!MemoryChatBufferSingleton.instance) {
      MemoryChatBufferSingleton.instance = new MemoryChatBufferSingleton();
    }
    return MemoryChatBufferSingleton.instance;
  }
  async getMemory(sessionKey, memoryParams) {
    await this.cleanupStaleBuffers();
    let memoryInstance = this.memoryBuffer.get(sessionKey);
    if (memoryInstance) {
      memoryInstance.last_accessed = /* @__PURE__ */ new Date();
    } else {
      const newMemory = new import_memory.BufferWindowMemory(memoryParams);
      memoryInstance = {
        buffer: newMemory,
        created: /* @__PURE__ */ new Date(),
        last_accessed: /* @__PURE__ */ new Date()
      };
      this.memoryBuffer.set(sessionKey, memoryInstance);
    }
    return memoryInstance.buffer;
  }
  async cleanupStaleBuffers() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1e3);
    for (const [key, memoryInstance] of this.memoryBuffer.entries()) {
      if (memoryInstance.last_accessed < oneHourAgo) {
        await this.memoryBuffer.get(key)?.buffer.clear();
        this.memoryBuffer.delete(key);
      }
    }
  }
}
class MemoryBufferWindow {
  constructor() {
    this.description = {
      displayName: "Simple Memory",
      name: "memoryBufferWindow",
      icon: "fa:database",
      iconColor: "black",
      group: ["transform"],
      version: [1, 1.1, 1.2, 1.3],
      description: "Stores in n8n memory, so no credentials required",
      defaults: {
        name: "Simple Memory"
      },
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Memory"],
          Memory: ["For beginners"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.memorybufferwindow/"
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
        (0, import_descriptions.expressionSessionKeyProperty)(1.3),
        import_descriptions.sessionKeyProperty,
        import_descriptions.contextWindowLengthProperty
      ]
    };
  }
  async supplyData(itemIndex) {
    const contextWindowLength = this.getNodeParameter("contextWindowLength", itemIndex);
    const workflowId = this.getWorkflow().id;
    const memoryInstance = MemoryChatBufferSingleton.getInstance();
    const nodeVersion = this.getNode().typeVersion;
    let sessionId;
    if (nodeVersion >= 1.2) {
      sessionId = (0, import_helpers.getSessionId)(this, itemIndex);
    } else {
      sessionId = this.getNodeParameter("sessionKey", itemIndex);
    }
    const memory = await memoryInstance.getMemory(`${workflowId}__${sessionId}`, {
      k: contextWindowLength,
      inputKey: "input",
      memoryKey: "chat_history",
      outputKey: "output",
      returnMessages: true
    });
    return {
      response: (0, import_logWrapper.logWrapper)(memory, this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MemoryBufferWindow
});
//# sourceMappingURL=MemoryBufferWindow.node.js.map