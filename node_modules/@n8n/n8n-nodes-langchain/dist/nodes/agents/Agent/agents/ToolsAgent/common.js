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
var common_exports = {};
__export(common_exports, {
  extractBinaryMessages: () => extractBinaryMessages,
  fixEmptyContentMessage: () => fixEmptyContentMessage,
  getAgentStepsParser: () => getAgentStepsParser,
  getChatModel: () => getChatModel,
  getOptionalMemory: () => getOptionalMemory,
  getOutputParserSchema: () => getOutputParserSchema,
  getTools: () => getTools,
  handleAgentFinishOutput: () => handleAgentFinishOutput,
  handleParsedStepOutput: () => handleParsedStepOutput,
  prepareMessages: () => prepareMessages,
  preparePrompt: () => preparePrompt
});
module.exports = __toCommonJS(common_exports);
var import_messages = require("@langchain/core/messages");
var import_prompts = require("@langchain/core/prompts");
var import_tools = require("langchain/tools");
var import_n8n_workflow = require("n8n-workflow");
var import_zod = require("zod");
var import_helpers = require("../../../../../utils/helpers");
function getOutputParserSchema(outputParser) {
  const schema = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    outputParser.getSchema() ?? import_zod.z.object({ text: import_zod.z.string() })
  );
  return schema;
}
async function extractBinaryMessages(ctx, itemIndex) {
  const binaryData = ctx.getInputData()?.[itemIndex]?.binary ?? {};
  const binaryMessages = await Promise.all(
    Object.values(binaryData).filter((data) => data.mimeType.startsWith("image/")).map(async (data) => {
      let binaryUrlString;
      if (data.id) {
        const binaryBuffer = await ctx.helpers.binaryToBuffer(
          await ctx.helpers.getBinaryStream(data.id)
        );
        binaryUrlString = `data:${data.mimeType};base64,${Buffer.from(binaryBuffer).toString(
          import_n8n_workflow.BINARY_ENCODING
        )}`;
      } else {
        binaryUrlString = data.data.includes("base64") ? data.data : `data:${data.mimeType};base64,${data.data}`;
      }
      return {
        type: "image_url",
        image_url: {
          url: binaryUrlString
        }
      };
    })
  );
  return new import_messages.HumanMessage({
    content: [...binaryMessages]
  });
}
function fixEmptyContentMessage(steps) {
  if (!Array.isArray(steps)) return steps;
  steps.forEach((step) => {
    if ("messageLog" in step && step.messageLog !== void 0) {
      if (Array.isArray(step.messageLog)) {
        step.messageLog.forEach((message) => {
          if ("content" in message && Array.isArray(message.content)) {
            message.content.forEach((content) => {
              if (content.input === "") {
                content.input = {};
              }
            });
          }
        });
      }
    }
  });
  return steps;
}
function handleAgentFinishOutput(steps) {
  const agentFinishSteps = steps;
  if (agentFinishSteps.returnValues) {
    const isMultiOutput = Array.isArray(agentFinishSteps.returnValues?.output);
    if (isMultiOutput) {
      const multiOutputSteps = agentFinishSteps.returnValues.output;
      const isTextOnly = multiOutputSteps.every((output) => "text" in output);
      if (isTextOnly) {
        agentFinishSteps.returnValues.output = multiOutputSteps.map((output) => output.text).join("\n").trim();
      }
      return agentFinishSteps;
    }
  }
  return agentFinishSteps;
}
function handleParsedStepOutput(output, memory) {
  return {
    returnValues: memory ? { output: JSON.stringify(output) } : output,
    log: "Final response formatted"
  };
}
const getAgentStepsParser = (outputParser, memory) => async (steps) => {
  if (Array.isArray(steps)) {
    const responseParserTool = steps.find((step) => step.tool === "format_final_json_response");
    if (responseParserTool && outputParser) {
      const toolInput = responseParserTool.toolInput;
      const parserInput = toolInput instanceof Object ? JSON.stringify(toolInput) : toolInput;
      const returnValues = await outputParser.parse(parserInput);
      return handleParsedStepOutput(returnValues, memory);
    }
  }
  if (outputParser && typeof steps === "object" && steps.returnValues) {
    const finalResponse = steps.returnValues;
    let parserInput;
    if (finalResponse instanceof Object) {
      if ("output" in finalResponse) {
        try {
          parserInput = JSON.stringify({ output: (0, import_n8n_workflow.jsonParse)(finalResponse.output) });
        } catch (error) {
          parserInput = finalResponse.output;
        }
      } else {
        parserInput = JSON.stringify(finalResponse);
      }
    } else {
      parserInput = finalResponse;
    }
    const returnValues = await outputParser.parse(parserInput);
    return handleParsedStepOutput(returnValues, memory);
  }
  return handleAgentFinishOutput(steps);
};
async function getChatModel(ctx, index = 0) {
  const connectedModels = await ctx.getInputConnectionData(import_n8n_workflow.NodeConnectionTypes.AiLanguageModel, 0);
  let model;
  if (Array.isArray(connectedModels) && index !== void 0) {
    if (connectedModels.length <= index) {
      return void 0;
    }
    const reversedModels = [...connectedModels].reverse();
    model = reversedModels[index];
  } else {
    model = connectedModels;
  }
  if (!(0, import_helpers.isChatInstance)(model) || !model.bindTools) {
    throw new import_n8n_workflow.NodeOperationError(
      ctx.getNode(),
      "Tools Agent requires Chat Model which supports Tools calling"
    );
  }
  return model;
}
async function getOptionalMemory(ctx) {
  return await ctx.getInputConnectionData(import_n8n_workflow.NodeConnectionTypes.AiMemory, 0);
}
async function getTools(ctx, outputParser) {
  const tools = await (0, import_helpers.getConnectedTools)(ctx, true, false);
  if (outputParser) {
    const schema = getOutputParserSchema(outputParser);
    const structuredOutputParserTool = new import_tools.DynamicStructuredTool({
      schema,
      name: "format_final_json_response",
      description: "Use this tool to format your final response to the user in a structured JSON format. This tool validates your output against a schema to ensure it meets the required format. ONLY use this tool when you have completed all necessary reasoning and are ready to provide your final answer. Do not use this tool for intermediate steps or for asking questions. The output from this tool will be directly returned to the user.",
      // We do not use a function here because we intercept the output with the parser.
      func: async () => ""
    });
    tools.push(structuredOutputParserTool);
  }
  return tools;
}
async function prepareMessages(ctx, itemIndex, options) {
  const useSystemMessage = options.systemMessage ?? ctx.getNode().typeVersion < 1.9;
  const messages = [];
  if (useSystemMessage) {
    messages.push([
      "system",
      `{system_message}${options.outputParser ? "\n\n{formatting_instructions}" : ""}`
    ]);
  } else if (options.outputParser) {
    messages.push(["system", "{formatting_instructions}"]);
  }
  messages.push(["placeholder", "{chat_history}"], ["human", "{input}"]);
  const hasBinaryData = ctx.getInputData()?.[itemIndex]?.binary !== void 0;
  if (hasBinaryData && options.passthroughBinaryImages) {
    const binaryMessage = await extractBinaryMessages(ctx, itemIndex);
    if (binaryMessage.content.length !== 0) {
      messages.push(binaryMessage);
    } else {
      ctx.logger.debug("Not attaching binary message, since its content was empty");
    }
  }
  messages.push(["placeholder", "{agent_scratchpad}"]);
  return messages;
}
function preparePrompt(messages) {
  return import_prompts.ChatPromptTemplate.fromMessages(messages);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  extractBinaryMessages,
  fixEmptyContentMessage,
  getAgentStepsParser,
  getChatModel,
  getOptionalMemory,
  getOutputParserSchema,
  getTools,
  handleAgentFinishOutput,
  handleParsedStepOutput,
  prepareMessages,
  preparePrompt
});
//# sourceMappingURL=common.js.map