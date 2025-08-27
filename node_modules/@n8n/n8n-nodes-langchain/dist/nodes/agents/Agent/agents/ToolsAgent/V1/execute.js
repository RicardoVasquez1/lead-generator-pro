"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var execute_exports = {};
__export(execute_exports, {
  toolsAgentExecute: () => toolsAgentExecute
});
module.exports = __toCommonJS(execute_exports);
var import_runnables = require("@langchain/core/runnables");
var import_agents = require("langchain/agents");
var import_omit = __toESM(require("lodash/omit"));
var import_n8n_workflow = require("n8n-workflow");
var import_helpers = require("../../../../../../utils/helpers");
var import_N8nOutputParser = require("../../../../../../utils/output_parsers/N8nOutputParser");
var import_common = require("../common");
var import_prompt = require("../prompt");
async function toolsAgentExecute() {
  this.logger.debug("Executing Tools Agent");
  const returnData = [];
  const items = this.getInputData();
  const outputParser = await (0, import_N8nOutputParser.getOptionalOutputParser)(this);
  const tools = await (0, import_common.getTools)(this, outputParser);
  for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
    try {
      const model = await (0, import_common.getChatModel)(this);
      const memory = await (0, import_common.getOptionalMemory)(this);
      const input = (0, import_helpers.getPromptInputByType)({
        ctx: this,
        i: itemIndex,
        inputKey: "text",
        promptTypeKey: "promptType"
      });
      if (input === void 0) {
        throw new import_n8n_workflow.NodeOperationError(this.getNode(), "The \u201Ctext\u201D parameter is empty.");
      }
      const options = this.getNodeParameter("options", itemIndex, {});
      const messages = await (0, import_common.prepareMessages)(this, itemIndex, {
        systemMessage: options.systemMessage,
        passthroughBinaryImages: options.passthroughBinaryImages ?? true,
        outputParser
      });
      const prompt = (0, import_common.preparePrompt)(messages);
      const agent = (0, import_agents.createToolCallingAgent)({
        llm: model,
        tools,
        prompt,
        streamRunnable: false
      });
      agent.streamRunnable = false;
      const runnableAgent = import_runnables.RunnableSequence.from([
        agent,
        (0, import_common.getAgentStepsParser)(outputParser, memory),
        import_common.fixEmptyContentMessage
      ]);
      const executor = import_agents.AgentExecutor.fromAgentAndTools({
        agent: runnableAgent,
        memory,
        tools,
        returnIntermediateSteps: options.returnIntermediateSteps === true,
        maxIterations: options.maxIterations ?? 10
      });
      const response = await executor.invoke(
        {
          input,
          system_message: options.systemMessage ?? import_prompt.SYSTEM_MESSAGE,
          formatting_instructions: "IMPORTANT: For your response to user, you MUST use the `format_final_json_response` tool with your complete answer formatted according to the required schema. Do not attempt to format the JSON manually - always use this tool. Your response will be rejected if it is not properly formatted through this tool. Only use this tool once you are ready to provide your final answer."
        },
        { signal: this.getExecutionCancelSignal() }
      );
      if (memory && outputParser) {
        const parsedOutput = (0, import_n8n_workflow.jsonParse)(
          response.output
        );
        response.output = parsedOutput?.output ?? parsedOutput;
      }
      const itemResult = {
        json: (0, import_omit.default)(
          response,
          "system_message",
          "formatting_instructions",
          "input",
          "chat_history",
          "agent_scratchpad"
        )
      };
      returnData.push(itemResult);
    } catch (error) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: itemIndex }
        });
        continue;
      }
      throw error;
    }
  }
  return [returnData];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  toolsAgentExecute
});
//# sourceMappingURL=execute.js.map