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
var execute_exports = {};
__export(execute_exports, {
  planAndExecuteAgentExecute: () => planAndExecuteAgentExecute
});
module.exports = __toCommonJS(execute_exports);
var import_prompts = require("@langchain/core/prompts");
var import_plan_and_execute = require("langchain/experimental/plan_and_execute");
var import_n8n_workflow = require("n8n-workflow");
var import_helpers = require("../../../../../utils/helpers");
var import_N8nOutputParser = require("../../../../../utils/output_parsers/N8nOutputParser");
var import_schemaParsing = require("../../../../../utils/schemaParsing");
var import_tracing = require("../../../../../utils/tracing");
var import_utils = require("../utils");
async function planAndExecuteAgentExecute(nodeVersion) {
  this.logger.debug("Executing PlanAndExecute Agent");
  const model = await this.getInputConnectionData(
    import_n8n_workflow.NodeConnectionTypes.AiLanguageModel,
    0
  );
  const tools = await (0, import_helpers.getConnectedTools)(this, nodeVersion >= 1.5, true, true);
  await (0, import_utils.checkForStructuredTools)(tools, this.getNode(), "Plan & Execute Agent");
  const outputParser = await (0, import_N8nOutputParser.getOptionalOutputParser)(this);
  const options = this.getNodeParameter("options", 0, {});
  const agentExecutor = await import_plan_and_execute.PlanAndExecuteAgentExecutor.fromLLMAndTools({
    llm: model,
    tools,
    humanMessageTemplate: options.humanMessageTemplate
  });
  const returnData = [];
  let prompt;
  if (outputParser) {
    const formatInstructions = outputParser.getFormatInstructions();
    prompt = new import_prompts.PromptTemplate({
      template: "{input}\n{formatInstructions}",
      inputVariables: ["input"],
      partialVariables: { formatInstructions }
    });
  }
  const items = this.getInputData();
  for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
    try {
      let input;
      if (this.getNode().typeVersion <= 1.2) {
        input = this.getNodeParameter("text", itemIndex);
      } else {
        input = (0, import_helpers.getPromptInputByType)({
          ctx: this,
          i: itemIndex,
          inputKey: "text",
          promptTypeKey: "promptType"
        });
      }
      if (input === void 0) {
        throw new import_n8n_workflow.NodeOperationError(this.getNode(), "The \u2018text\u2018 parameter is empty.");
      }
      if (prompt) {
        input = (await prompt.invoke({ input })).value;
      }
      const response = await agentExecutor.withConfig((0, import_tracing.getTracingConfig)(this)).invoke({ input, outputParser });
      if (outputParser) {
        response.output = await (0, import_utils.extractParsedOutput)(this, outputParser, response.output);
      }
      returnData.push({ json: response });
    } catch (error) {
      (0, import_schemaParsing.throwIfToolSchema)(this, error);
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: itemIndex } });
        continue;
      }
      throw error;
    }
  }
  return [returnData];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  planAndExecuteAgentExecute
});
//# sourceMappingURL=execute.js.map