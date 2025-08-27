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
var N8nOutputFixingParser_exports = {};
__export(N8nOutputFixingParser_exports, {
  N8nOutputFixingParser: () => N8nOutputFixingParser
});
module.exports = __toCommonJS(N8nOutputFixingParser_exports);
var import_output_parsers = require("@langchain/core/output_parsers");
var import_n8n_workflow = require("n8n-workflow");
var import_helpers = require("../helpers");
class N8nOutputFixingParser extends import_output_parsers.BaseOutputParser {
  constructor(context, model, outputParser, fixPromptTemplate) {
    super();
    this.context = context;
    this.model = model;
    this.outputParser = outputParser;
    this.fixPromptTemplate = fixPromptTemplate;
    this.lc_namespace = ["langchain", "output_parsers", "fix"];
  }
  getRetryChain() {
    return this.fixPromptTemplate.pipe(this.model);
  }
  /**
   * Attempts to parse the completion string using the output parser.
   * If the initial parse fails, it tries to fix the output using a retry chain.
   * @param completion The string to be parsed
   * @returns The parsed response
   * @throws Error if both parsing attempts fail
   */
  async parse(completion, callbacks) {
    const { index } = this.context.addInputData(import_n8n_workflow.NodeConnectionTypes.AiOutputParser, [
      [{ json: { action: "parse", text: completion } }]
    ]);
    try {
      const response = await this.outputParser.parse(completion, callbacks, (e) => {
        if (e instanceof import_output_parsers.OutputParserException) {
          return e;
        }
        return new import_output_parsers.OutputParserException(e.message, completion);
      });
      (0, import_helpers.logAiEvent)(this.context, "ai-output-parsed", { text: completion, response });
      this.context.addOutputData(import_n8n_workflow.NodeConnectionTypes.AiOutputParser, index, [
        [{ json: { action: "parse", response } }]
      ]);
      return response;
    } catch (error) {
      if (!(error instanceof import_output_parsers.OutputParserException)) {
        throw error;
      }
      try {
        const result = await this.getRetryChain().invoke({
          completion,
          error: error.message,
          instructions: this.getFormatInstructions()
        });
        const resultText = result.content.toString();
        const parsed = await this.outputParser.parse(resultText, callbacks);
        this.context.addOutputData(import_n8n_workflow.NodeConnectionTypes.AiOutputParser, index, [
          [{ json: { action: "parse", response: parsed } }]
        ]);
        return parsed;
      } catch (autoParseError) {
        this.context.addOutputData(import_n8n_workflow.NodeConnectionTypes.AiOutputParser, index, autoParseError);
        throw autoParseError;
      }
    }
  }
  /**
   * Method to get the format instructions for the parser.
   * @returns The format instructions for the parser.
   */
  getFormatInstructions() {
    return this.outputParser.getFormatInstructions();
  }
  getSchema() {
    return this.outputParser.schema;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  N8nOutputFixingParser
});
//# sourceMappingURL=N8nOutputFixingParser.js.map