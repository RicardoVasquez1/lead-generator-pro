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
var ChainLlm_node_exports = {};
__export(ChainLlm_node_exports, {
  ChainLlm: () => ChainLlm
});
module.exports = __toCommonJS(ChainLlm_node_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_N8nOutputParser = require("../../../utils/output_parsers/N8nOutputParser");
var import_methods = require("./methods");
var import_processItem = require("./methods/processItem");
var import_error_handling = require("../../vendors/OpenAi/helpers/error-handling");
class ChainLlm {
  constructor() {
    this.description = {
      displayName: "Basic LLM Chain",
      name: "chainLlm",
      icon: "fa:link",
      iconColor: "black",
      group: ["transform"],
      version: [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7],
      description: "A simple chain to prompt a large language model",
      defaults: {
        name: "Basic LLM Chain",
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
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.chainllm/"
            }
          ]
        }
      },
      inputs: `={{ ((parameter) => { ${import_methods.getInputs.toString()}; return getInputs(parameter) })($parameter) }}`,
      outputs: [import_n8n_workflow.NodeConnectionTypes.Main],
      credentials: [],
      properties: import_methods.nodeProperties
    };
  }
  /**
   * Main execution method for the node
   */
  async execute() {
    this.logger.debug("Executing Basic LLM Chain");
    const items = this.getInputData();
    const returnData = [];
    const outputParser = await (0, import_N8nOutputParser.getOptionalOutputParser)(this);
    const shouldUnwrapObjects = this.getNode().typeVersion >= 1.6 || !!outputParser;
    const batchSize = this.getNodeParameter("batching.batchSize", 0, 5);
    const delayBetweenBatches = this.getNodeParameter(
      "batching.delayBetweenBatches",
      0,
      0
    );
    if (this.getNode().typeVersion >= 1.7 && batchSize > 1) {
      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchPromises = batch.map(async (_item, batchItemIndex) => {
          return await (0, import_processItem.processItem)(this, i + batchItemIndex);
        });
        const batchResults = await Promise.allSettled(batchPromises);
        batchResults.forEach((promiseResult, batchItemIndex) => {
          const itemIndex = i + batchItemIndex;
          if (promiseResult.status === "rejected") {
            const error = promiseResult.reason;
            if (error instanceof import_n8n_workflow.NodeApiError && (0, import_error_handling.isOpenAiError)(error.cause)) {
              const openAiErrorCode = error.cause.error?.code;
              if (openAiErrorCode) {
                const customMessage = (0, import_error_handling.getCustomErrorMessage)(openAiErrorCode);
                if (customMessage) {
                  error.message = customMessage;
                }
              }
            }
            if (this.continueOnFail()) {
              returnData.push({
                json: { error: error.message },
                pairedItem: { item: itemIndex }
              });
              return;
            }
            throw new import_n8n_workflow.NodeOperationError(this.getNode(), error);
          }
          const responses = promiseResult.value;
          responses.forEach((response) => {
            returnData.push({
              json: (0, import_methods.formatResponse)(response, shouldUnwrapObjects)
            });
          });
        });
        if (i + batchSize < items.length && delayBetweenBatches > 0) {
          await (0, import_n8n_workflow.sleep)(delayBetweenBatches);
        }
      }
    } else {
      for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
        try {
          const responses = await (0, import_processItem.processItem)(this, itemIndex);
          responses.forEach((response) => {
            returnData.push({
              json: (0, import_methods.formatResponse)(response, shouldUnwrapObjects)
            });
          });
        } catch (error) {
          if (error instanceof import_n8n_workflow.NodeApiError && (0, import_error_handling.isOpenAiError)(error.cause)) {
            const openAiErrorCode = error.cause.error?.code;
            if (openAiErrorCode) {
              const customMessage = (0, import_error_handling.getCustomErrorMessage)(openAiErrorCode);
              if (customMessage) {
                error.message = customMessage;
              }
            }
          }
          if (this.continueOnFail()) {
            returnData.push({ json: { error: error.message }, pairedItem: { item: itemIndex } });
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
  ChainLlm
});
//# sourceMappingURL=ChainLlm.node.js.map