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
var chainExecutor_exports = {};
__export(chainExecutor_exports, {
  NaiveJsonOutputParser: () => NaiveJsonOutputParser,
  executeChain: () => executeChain,
  getOutputParserForLLM: () => getOutputParserForLLM,
  isModelInThinkingMode: () => isModelInThinkingMode,
  isModelWithFormat: () => isModelWithFormat,
  isModelWithResponseFormat: () => isModelWithResponseFormat
});
module.exports = __toCommonJS(chainExecutor_exports);
var import_output_parsers = require("@langchain/core/output_parsers");
var import_tracing = require("../../../../utils/tracing");
var import_promptUtils = require("./promptUtils");
class NaiveJsonOutputParser extends import_output_parsers.JsonOutputParser {
  async parse(text) {
    try {
      const directParsed = JSON.parse(text);
      return directParsed;
    } catch (e) {
      return await super.parse(text);
    }
  }
}
function isModelWithResponseFormat(llm) {
  return "modelKwargs" in llm && !!llm.modelKwargs && typeof llm.modelKwargs === "object" && "response_format" in llm.modelKwargs;
}
function isModelInThinkingMode(llm) {
  return "lc_kwargs" in llm && "invocationKwargs" in llm.lc_kwargs && typeof llm.lc_kwargs.invocationKwargs === "object" && "thinking" in llm.lc_kwargs.invocationKwargs && llm.lc_kwargs.invocationKwargs.thinking.type === "enabled";
}
function isModelWithFormat(llm) {
  return "format" in llm && typeof llm.format !== "undefined";
}
function getOutputParserForLLM(llm) {
  if (isModelWithResponseFormat(llm) && llm.modelKwargs?.response_format?.type === "json_object") {
    return new NaiveJsonOutputParser();
  }
  if (isModelWithFormat(llm) && llm.format === "json") {
    return new NaiveJsonOutputParser();
  }
  if (isModelInThinkingMode(llm)) {
    return new NaiveJsonOutputParser();
  }
  return new import_output_parsers.StringOutputParser();
}
async function executeSimpleChain({
  context,
  llm,
  query,
  prompt,
  fallbackLlm
}) {
  const outputParser = getOutputParserForLLM(llm);
  let model;
  if (fallbackLlm) {
    model = llm.withFallbacks([fallbackLlm]);
  } else {
    model = llm;
  }
  const chain = prompt.pipe(model).pipe(outputParser).withConfig((0, import_tracing.getTracingConfig)(context));
  const response = await chain.invoke({
    query,
    signal: context.getExecutionCancelSignal()
  });
  return [response];
}
async function executeChain({
  context,
  itemIndex,
  query,
  llm,
  outputParser,
  messages,
  fallbackLlm
}) {
  if (!outputParser) {
    const promptTemplate = await (0, import_promptUtils.createPromptTemplate)({
      context,
      itemIndex,
      llm,
      messages,
      query
    });
    return await executeSimpleChain({
      context,
      llm,
      query,
      prompt: promptTemplate,
      fallbackLlm
    });
  }
  const formatInstructions = outputParser.getFormatInstructions();
  const promptWithInstructions = await (0, import_promptUtils.createPromptTemplate)({
    context,
    itemIndex,
    llm,
    messages,
    formatInstructions,
    query
  });
  const chain = promptWithInstructions.pipe(llm).pipe(outputParser).withConfig((0, import_tracing.getTracingConfig)(context));
  const response = await chain.invoke({ query }, { signal: context.getExecutionCancelSignal() });
  return Array.isArray(response) ? response : [response];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  NaiveJsonOutputParser,
  executeChain,
  getOutputParserForLLM,
  isModelInThinkingMode,
  isModelWithFormat,
  isModelWithResponseFormat
});
//# sourceMappingURL=chainExecutor.js.map