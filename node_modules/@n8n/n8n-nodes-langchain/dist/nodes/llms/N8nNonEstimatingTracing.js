"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
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
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var N8nNonEstimatingTracing_exports = {};
__export(N8nNonEstimatingTracing_exports, {
  N8nNonEstimatingTracing: () => N8nNonEstimatingTracing
});
module.exports = __toCommonJS(N8nNonEstimatingTracing_exports);
var import_base = require("@langchain/core/callbacks/base");
var import_pick = __toESM(require("lodash/pick"));
var import_n8n_workflow = require("n8n-workflow");
var import_helpers = require("../../utils/helpers");
var _parentRunIndex;
class N8nNonEstimatingTracing extends import_base.BaseCallbackHandler {
  constructor(executionFunctions, options) {
    super();
    this.executionFunctions = executionFunctions;
    this.name = "N8nNonEstimatingTracing";
    // This flag makes sure that LangChain will wait for the handlers to finish before continuing
    // This is crucial for the handleLLMError handler to work correctly (it should be called before the error is propagated to the root node)
    this.awaitHandlers = true;
    this.connectionType = import_n8n_workflow.NodeConnectionTypes.AiLanguageModel;
    __privateAdd(this, _parentRunIndex);
    /**
     * A map to associate LLM run IDs to run details.
     * Key: Unique identifier for each LLM run (run ID)
     * Value: RunDetails object
     *
     */
    this.runsMap = {};
    this.options = {
      // Default(OpenAI format) parser
      errorDescriptionMapper: (error) => error.description
    };
    this.options = { ...this.options, ...options };
  }
  async handleLLMEnd(output, runId) {
    const runDetails = this.runsMap[runId] ?? { index: Object.keys(this.runsMap).length };
    output.generations = output.generations.map(
      (gen) => gen.map((g) => (0, import_pick.default)(g, ["text", "generationInfo"]))
    );
    const tokenUsageEstimate = {
      completionTokens: 0,
      promptTokens: 0,
      totalTokens: 0
    };
    const response = {
      response: { generations: output.generations }
    };
    response.tokenUsageEstimate = tokenUsageEstimate;
    const parsedMessages = typeof runDetails.messages === "string" ? runDetails.messages : runDetails.messages.map((message) => {
      if (typeof message === "string") return message;
      if (typeof message?.toJSON === "function") return message.toJSON();
      return message;
    });
    const sourceNodeRunIndex = __privateGet(this, _parentRunIndex) !== void 0 ? __privateGet(this, _parentRunIndex) + runDetails.index : void 0;
    this.executionFunctions.addOutputData(
      this.connectionType,
      runDetails.index,
      [[{ json: { ...response } }]],
      void 0,
      sourceNodeRunIndex
    );
    (0, import_helpers.logAiEvent)(this.executionFunctions, "ai-llm-generated-output", {
      messages: parsedMessages,
      options: runDetails.options,
      response
    });
  }
  async handleLLMStart(llm, prompts, runId) {
    const estimatedTokens = 0;
    const sourceNodeRunIndex = __privateGet(this, _parentRunIndex) !== void 0 ? __privateGet(this, _parentRunIndex) + this.executionFunctions.getNextRunIndex() : void 0;
    const options = llm.type === "constructor" ? llm.kwargs : llm;
    const { index } = this.executionFunctions.addInputData(
      this.connectionType,
      [
        [
          {
            json: {
              messages: prompts,
              estimatedTokens,
              options
            }
          }
        ]
      ],
      sourceNodeRunIndex
    );
    this.runsMap[runId] = {
      index,
      options,
      messages: prompts
    };
  }
  async handleLLMError(error, runId, parentRunId) {
    const runDetails = this.runsMap[runId] ?? { index: Object.keys(this.runsMap).length };
    if (typeof error === "object" && error?.hasOwnProperty("headers")) {
      const errorWithHeaders = error;
      Object.keys(errorWithHeaders.headers).forEach((key) => {
        if (!key.startsWith("x-")) {
          delete errorWithHeaders.headers[key];
        }
      });
    }
    if (error instanceof import_n8n_workflow.NodeError) {
      if (this.options.errorDescriptionMapper) {
        error.description = this.options.errorDescriptionMapper(error);
      }
      this.executionFunctions.addOutputData(this.connectionType, runDetails.index, error);
    } else {
      this.executionFunctions.addOutputData(
        this.connectionType,
        runDetails.index,
        new import_n8n_workflow.NodeOperationError(this.executionFunctions.getNode(), error, {
          functionality: "configuration-node"
        })
      );
    }
    (0, import_helpers.logAiEvent)(this.executionFunctions, "ai-llm-errored", {
      error: Object.keys(error).length === 0 ? error.toString() : error,
      runId,
      parentRunId
    });
  }
  // Used to associate subsequent runs with the correct parent run in subnodes of subnodes
  setParentRunIndex(runIndex) {
    __privateSet(this, _parentRunIndex, runIndex);
  }
}
_parentRunIndex = new WeakMap();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  N8nNonEstimatingTracing
});
//# sourceMappingURL=N8nNonEstimatingTracing.js.map