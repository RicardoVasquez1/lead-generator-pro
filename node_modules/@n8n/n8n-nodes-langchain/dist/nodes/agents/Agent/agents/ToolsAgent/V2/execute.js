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
var import_node_assert = __toESM(require("node:assert"));
var import_helpers = require("../../../../../../utils/helpers");
var import_N8nOutputParser = require("../../../../../../utils/output_parsers/N8nOutputParser");
var import_common = require("../common");
var import_prompt = require("../prompt");
function createAgentExecutor(model, tools, prompt, options, outputParser, memory, fallbackModel) {
  const agent = (0, import_agents.createToolCallingAgent)({
    llm: model,
    tools,
    prompt,
    streamRunnable: false
  });
  let fallbackAgent;
  if (fallbackModel) {
    fallbackAgent = (0, import_agents.createToolCallingAgent)({
      llm: fallbackModel,
      tools,
      prompt,
      streamRunnable: false
    });
  }
  const runnableAgent = import_runnables.RunnableSequence.from([
    fallbackAgent ? agent.withFallbacks([fallbackAgent]) : agent,
    (0, import_common.getAgentStepsParser)(outputParser, memory),
    import_common.fixEmptyContentMessage
  ]);
  runnableAgent.singleAction = false;
  runnableAgent.streamRunnable = false;
  return import_agents.AgentExecutor.fromAgentAndTools({
    agent: runnableAgent,
    memory,
    tools,
    returnIntermediateSteps: options.returnIntermediateSteps === true,
    maxIterations: options.maxIterations ?? 10
  });
}
async function processEventStream(ctx, eventStream, itemIndex, returnIntermediateSteps = false) {
  const agentResult = {
    output: ""
  };
  if (returnIntermediateSteps) {
    agentResult.intermediateSteps = [];
  }
  ctx.sendChunk("begin", itemIndex);
  for await (const event of eventStream) {
    switch (event.event) {
      case "on_chat_model_stream":
        const chunk = event.data?.chunk;
        if (chunk?.content) {
          const chunkContent = chunk.content;
          let chunkText = "";
          if (Array.isArray(chunkContent)) {
            for (const message of chunkContent) {
              chunkText += message?.text;
            }
          } else if (typeof chunkContent === "string") {
            chunkText = chunkContent;
          }
          ctx.sendChunk("item", itemIndex, chunkText);
          agentResult.output += chunkText;
        }
        break;
      case "on_chat_model_end":
        if (returnIntermediateSteps && event.data) {
          const chatModelData = event.data;
          const output = chatModelData.output;
          if (output?.tool_calls && output.tool_calls.length > 0) {
            for (const toolCall of output.tool_calls) {
              agentResult.intermediateSteps.push({
                action: {
                  tool: toolCall.name,
                  toolInput: toolCall.args,
                  log: output.content || `Calling ${toolCall.name} with input: ${JSON.stringify(toolCall.args)}`,
                  messageLog: [output],
                  // Include the full LLM response
                  toolCallId: toolCall.id,
                  type: toolCall.type
                }
              });
            }
          }
        }
        break;
      case "on_tool_end":
        if (returnIntermediateSteps && event.data && agentResult.intermediateSteps.length > 0) {
          const toolData = event.data;
          const matchingStep = agentResult.intermediateSteps.find(
            (step) => !step.observation && step.action.tool === event.name
          );
          if (matchingStep) {
            matchingStep.observation = toolData.output;
          }
        }
        break;
      default:
        break;
    }
  }
  ctx.sendChunk("end", itemIndex);
  return agentResult;
}
async function toolsAgentExecute() {
  this.logger.debug("Executing Tools Agent V2");
  const returnData = [];
  const items = this.getInputData();
  const batchSize = this.getNodeParameter("options.batching.batchSize", 0, 1);
  const delayBetweenBatches = this.getNodeParameter(
    "options.batching.delayBetweenBatches",
    0,
    0
  );
  const needsFallback = this.getNodeParameter("needsFallback", 0, false);
  const memory = await (0, import_common.getOptionalMemory)(this);
  const model = await (0, import_common.getChatModel)(this, 0);
  (0, import_node_assert.default)(model, "Please connect a model to the Chat Model input");
  const fallbackModel = needsFallback ? await (0, import_common.getChatModel)(this, 1) : null;
  if (needsFallback && !fallbackModel) {
    throw new import_n8n_workflow.NodeOperationError(
      this.getNode(),
      "Please connect a model to the Fallback Model input or disable the fallback option"
    );
  }
  const enableStreaming = this.getNodeParameter("options.enableStreaming", 0, true);
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchPromises = batch.map(async (_item, batchItemIndex) => {
      const itemIndex = i + batchItemIndex;
      const input = (0, import_helpers.getPromptInputByType)({
        ctx: this,
        i: itemIndex,
        inputKey: "text",
        promptTypeKey: "promptType"
      });
      if (input === void 0) {
        throw new import_n8n_workflow.NodeOperationError(this.getNode(), 'The "text" parameter is empty.');
      }
      const outputParser2 = await (0, import_N8nOutputParser.getOptionalOutputParser)(this, itemIndex);
      const tools = await (0, import_common.getTools)(this, outputParser2);
      const options = this.getNodeParameter("options", itemIndex, {});
      const messages = await (0, import_common.prepareMessages)(this, itemIndex, {
        systemMessage: options.systemMessage,
        passthroughBinaryImages: options.passthroughBinaryImages ?? true,
        outputParser: outputParser2
      });
      const prompt = (0, import_common.preparePrompt)(messages);
      const executor = createAgentExecutor(
        model,
        tools,
        prompt,
        options,
        outputParser2,
        memory,
        fallbackModel
      );
      const invokeParams = {
        input,
        system_message: options.systemMessage ?? import_prompt.SYSTEM_MESSAGE,
        formatting_instructions: "IMPORTANT: For your response to user, you MUST use the `format_final_json_response` tool with your complete answer formatted according to the required schema. Do not attempt to format the JSON manually - always use this tool. Your response will be rejected if it is not properly formatted through this tool. Only use this tool once you are ready to provide your final answer."
      };
      const executeOptions = { signal: this.getExecutionCancelSignal() };
      const isStreamingAvailable = "isStreaming" in this ? this.isStreaming?.() : void 0;
      if ("isStreaming" in this && enableStreaming && isStreamingAvailable && this.getNode().typeVersion >= 2.1) {
        const chatHistory = await memory?.chatHistory.getMessages();
        const eventStream = executor.streamEvents(
          {
            ...invokeParams,
            chat_history: chatHistory ?? void 0
          },
          {
            version: "v2",
            ...executeOptions
          }
        );
        return await processEventStream(
          this,
          eventStream,
          itemIndex,
          options.returnIntermediateSteps
        );
      } else {
        return await executor.invoke(invokeParams, executeOptions);
      }
    });
    const batchResults = await Promise.allSettled(batchPromises);
    const outputParser = await (0, import_N8nOutputParser.getOptionalOutputParser)(this, 0);
    batchResults.forEach((result, index) => {
      const itemIndex = i + index;
      if (result.status === "rejected") {
        const error = result.reason;
        if (this.continueOnFail()) {
          returnData.push({
            json: { error: error.message },
            pairedItem: { item: itemIndex }
          });
          return;
        } else {
          throw new import_n8n_workflow.NodeOperationError(this.getNode(), error);
        }
      }
      const response = result.value;
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
        ),
        pairedItem: { item: itemIndex }
      };
      returnData.push(itemResult);
    });
    if (i + batchSize < items.length && delayBetweenBatches > 0) {
      await (0, import_n8n_workflow.sleep)(delayBetweenBatches);
    }
  }
  return [returnData];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  toolsAgentExecute
});
//# sourceMappingURL=execute.js.map