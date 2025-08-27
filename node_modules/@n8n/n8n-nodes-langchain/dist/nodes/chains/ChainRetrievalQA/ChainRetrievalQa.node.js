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
var ChainRetrievalQa_node_exports = {};
__export(ChainRetrievalQa_node_exports, {
  ChainRetrievalQa: () => ChainRetrievalQa
});
module.exports = __toCommonJS(ChainRetrievalQa_node_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_descriptions = require("../../../utils/descriptions");
var import_sharedFields = require("../../../utils/sharedFields");
var import_constants = require("./constants");
var import_processItem = require("./processItem");
class ChainRetrievalQa {
  constructor() {
    this.description = {
      displayName: "Question and Answer Chain",
      name: "chainRetrievalQa",
      icon: "fa:link",
      iconColor: "black",
      group: ["transform"],
      version: [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6],
      description: "Answer questions about retrieved documents",
      defaults: {
        name: "Question and Answer Chain",
        color: "#909298"
      },
      codex: {
        alias: ["LangChain"],
        categories: ["AI"],
        subcategories: {
          AI: ["Chains", "Root Nodes"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.chainretrievalqa/"
            }
          ]
        }
      },
      inputs: [
        import_n8n_workflow.NodeConnectionTypes.Main,
        {
          displayName: "Model",
          maxConnections: 1,
          type: import_n8n_workflow.NodeConnectionTypes.AiLanguageModel,
          required: true
        },
        {
          displayName: "Retriever",
          maxConnections: 1,
          type: import_n8n_workflow.NodeConnectionTypes.AiRetriever,
          required: true
        }
      ],
      outputs: [import_n8n_workflow.NodeConnectionTypes.Main],
      credentials: [],
      properties: [
        (0, import_sharedFields.getTemplateNoticeField)(1960),
        {
          displayName: "Query",
          name: "query",
          type: "string",
          required: true,
          default: "={{ $json.input }}",
          displayOptions: {
            show: {
              "@version": [1]
            }
          }
        },
        {
          displayName: "Query",
          name: "query",
          type: "string",
          required: true,
          default: "={{ $json.chat_input }}",
          displayOptions: {
            show: {
              "@version": [1.1]
            }
          }
        },
        {
          displayName: "Query",
          name: "query",
          type: "string",
          required: true,
          default: "={{ $json.chatInput }}",
          displayOptions: {
            show: {
              "@version": [1.2]
            }
          }
        },
        {
          ...import_descriptions.promptTypeOptions,
          displayOptions: {
            hide: {
              "@version": [{ _cnd: { lte: 1.2 } }]
            }
          }
        },
        {
          ...import_descriptions.textFromPreviousNode,
          displayOptions: { show: { promptType: ["auto"], "@version": [{ _cnd: { gte: 1.4 } }] } }
        },
        {
          displayName: "Prompt (User Message)",
          name: "text",
          type: "string",
          required: true,
          default: "",
          placeholder: "e.g. Hello, how can you help me?",
          typeOptions: {
            rows: 2
          },
          displayOptions: {
            show: {
              promptType: ["define"]
            }
          }
        },
        {
          displayName: "Options",
          name: "options",
          type: "collection",
          default: {},
          placeholder: "Add Option",
          options: [
            {
              ...import_constants.systemPromptOption,
              description: `Template string used for the system prompt. This should include the variable \`{context}\` for the provided context. For text completion models, you should also include the variable \`{${import_constants.LEGACY_INPUT_TEMPLATE_KEY}}\` for the user\u2019s query.`,
              displayOptions: {
                show: {
                  "@version": [{ _cnd: { lt: 1.5 } }]
                }
              }
            },
            {
              ...import_constants.systemPromptOption,
              description: `Template string used for the system prompt. This should include the variable \`{context}\` for the provided context. For text completion models, you should also include the variable \`{${import_constants.INPUT_TEMPLATE_KEY}}\` for the user\u2019s query.`,
              displayOptions: {
                show: {
                  "@version": [{ _cnd: { gte: 1.5 } }]
                }
              }
            },
            (0, import_sharedFields.getBatchingOptionFields)({
              show: {
                "@version": [{ _cnd: { gte: 1.6 } }]
              }
            })
          ]
        }
      ]
    };
  }
  async execute() {
    this.logger.debug("Executing Retrieval QA Chain");
    const items = this.getInputData();
    const returnData = [];
    const batchSize = this.getNodeParameter("options.batching.batchSize", 0, 5);
    const delayBetweenBatches = this.getNodeParameter(
      "options.batching.delayBetweenBatches",
      0,
      0
    );
    if (this.getNode().typeVersion >= 1.6 && batchSize >= 1) {
      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchPromises = batch.map(async (_item, batchItemIndex) => {
          return await (0, import_processItem.processItem)(this, i + batchItemIndex);
        });
        const batchResults = await Promise.allSettled(batchPromises);
        batchResults.forEach((response, index) => {
          if (response.status === "rejected") {
            const error = response.reason;
            if (this.continueOnFail()) {
              const metadata = (0, import_n8n_workflow.parseErrorMetadata)(error);
              returnData.push({
                json: { error: error.message },
                pairedItem: { item: index },
                metadata
              });
              return;
            } else {
              throw error;
            }
          }
          const output = response.value;
          const answer = output.answer;
          if (this.getNode().typeVersion >= 1.5) {
            returnData.push({ json: { response: answer } });
          } else {
            returnData.push({ json: { response: { text: answer } } });
          }
        });
        if (i + batchSize < items.length && delayBetweenBatches > 0) {
          await (0, import_n8n_workflow.sleep)(delayBetweenBatches);
        }
      }
    } else {
      for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
        try {
          const response = await (0, import_processItem.processItem)(this, itemIndex);
          const answer = response.answer;
          if (this.getNode().typeVersion >= 1.5) {
            returnData.push({ json: { response: answer } });
          } else {
            returnData.push({ json: { response: { text: answer } } });
          }
        } catch (error) {
          if (this.continueOnFail()) {
            const metadata = (0, import_n8n_workflow.parseErrorMetadata)(error);
            returnData.push({
              json: { error: error.message },
              pairedItem: { item: itemIndex },
              metadata
            });
            continue;
          }
          throw error;
        }
      }
    }
    return [returnData];
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ChainRetrievalQa
});
//# sourceMappingURL=ChainRetrievalQa.node.js.map