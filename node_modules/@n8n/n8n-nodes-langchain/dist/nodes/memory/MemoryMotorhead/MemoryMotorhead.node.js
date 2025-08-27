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
var MemoryMotorhead_node_exports = {};
__export(MemoryMotorhead_node_exports, {
  MemoryMotorhead: () => MemoryMotorhead
});
module.exports = __toCommonJS(MemoryMotorhead_node_exports);
var import_motorhead_memory = require("@langchain/community/memory/motorhead_memory");
var import_n8n_workflow = require("n8n-workflow");
var import_helpers = require("../../../utils/helpers");
var import_logWrapper = require("../../../utils/logWrapper");
var import_sharedFields = require("../../../utils/sharedFields");
var import_descriptions = require("../descriptions");
class MemoryMotorhead {
  constructor() {
    this.description = {
      displayName: "Motorhead",
      name: "memoryMotorhead",
      icon: "fa:file-export",
      iconColor: "black",
      group: ["transform"],
      version: [1, 1.1, 1.2, 1.3],
      description: "Use Motorhead Memory",
      defaults: {
        name: "Motorhead"
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
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.memorymotorhead/"
            }
          ]
        }
      },
      inputs: [],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiMemory],
      outputNames: ["Memory"],
      credentials: [
        {
          name: "motorheadApi",
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
        (0, import_descriptions.expressionSessionKeyProperty)(1.3),
        import_descriptions.sessionKeyProperty
      ]
    };
  }
  async supplyData(itemIndex) {
    const credentials = await this.getCredentials("motorheadApi");
    const nodeVersion = this.getNode().typeVersion;
    let sessionId;
    if (nodeVersion >= 1.2) {
      sessionId = (0, import_helpers.getSessionId)(this, itemIndex);
    } else {
      sessionId = this.getNodeParameter("sessionId", itemIndex);
    }
    const memory = new import_motorhead_memory.MotorheadMemory({
      sessionId,
      url: `${credentials.host}/motorhead`,
      clientId: credentials.clientId,
      apiKey: credentials.apiKey,
      memoryKey: "chat_history",
      returnMessages: true,
      inputKey: "input",
      outputKey: "output"
    });
    await memory.init();
    return {
      response: (0, import_logWrapper.logWrapper)(memory, this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MemoryMotorhead
});
//# sourceMappingURL=MemoryMotorhead.node.js.map