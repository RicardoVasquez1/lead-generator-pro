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
var N8nStructuredOutputParser_exports = {};
__export(N8nStructuredOutputParser_exports, {
  N8nStructuredOutputParser: () => N8nStructuredOutputParser
});
module.exports = __toCommonJS(N8nStructuredOutputParser_exports);
var import_output_parsers = require("langchain/output_parsers");
var import_get = __toESM(require("lodash/get"));
var import_n8n_workflow = require("n8n-workflow");
var import_zod = require("zod");
var import_helpers = require("../helpers");
const STRUCTURED_OUTPUT_KEY = "__structured__output";
const STRUCTURED_OUTPUT_OBJECT_KEY = "__structured__output__object";
const STRUCTURED_OUTPUT_ARRAY_KEY = "__structured__output__array";
class N8nStructuredOutputParser extends import_output_parsers.StructuredOutputParser {
  constructor(context, zodSchema) {
    super(zodSchema);
    this.context = context;
    this.lc_namespace = ["langchain", "output_parsers", "structured"];
  }
  async parse(text, _callbacks, errorMapper) {
    const { index } = this.context.addInputData(import_n8n_workflow.NodeConnectionTypes.AiOutputParser, [
      [{ json: { action: "parse", text } }]
    ]);
    try {
      const jsonString = text.includes("```") ? text.split(/```(?:json)?/)[1] : text;
      const json = JSON.parse(jsonString.trim());
      const parsed = await this.schema.parseAsync(json);
      let result = (0, import_get.default)(parsed, [STRUCTURED_OUTPUT_KEY, STRUCTURED_OUTPUT_OBJECT_KEY]) ?? (0, import_get.default)(parsed, [STRUCTURED_OUTPUT_KEY, STRUCTURED_OUTPUT_ARRAY_KEY]) ?? (0, import_get.default)(parsed, STRUCTURED_OUTPUT_KEY) ?? parsed;
      result = (0, import_helpers.unwrapNestedOutput)(result);
      (0, import_helpers.logAiEvent)(this.context, "ai-output-parsed", { text, response: result });
      this.context.addOutputData(import_n8n_workflow.NodeConnectionTypes.AiOutputParser, index, [
        [{ json: { action: "parse", response: result } }]
      ]);
      return result;
    } catch (e) {
      const nodeError = new import_n8n_workflow.NodeOperationError(
        this.context.getNode(),
        "Model output doesn't fit required format",
        {
          description: "To continue the execution when this happens, change the 'On Error' parameter in the root node's settings"
        }
      );
      if (e instanceof SyntaxError) {
        nodeError.context.outputParserFailReason = "Invalid JSON in model output";
      } else if (typeof text === "string" && text.trim() === "{}" || e instanceof import_zod.z.ZodError && e.issues?.[0] && e.issues?.[0].code === "invalid_type" && e.issues?.[0].path?.[0] === "output" && e.issues?.[0].expected === "object" && e.issues?.[0].received === "undefined") {
        nodeError.context.outputParserFailReason = "Model output wrapper is an empty object";
      } else if (e instanceof import_zod.z.ZodError) {
        nodeError.context.outputParserFailReason = "Model output does not match the expected schema";
      }
      (0, import_helpers.logAiEvent)(this.context, "ai-output-parsed", {
        text,
        response: e.message ?? e
      });
      this.context.addOutputData(import_n8n_workflow.NodeConnectionTypes.AiOutputParser, index, nodeError);
      if (errorMapper) {
        throw errorMapper(e);
      }
      throw nodeError;
    }
  }
  static async fromZodJsonSchema(zodSchema, nodeVersion, context) {
    let returnSchema;
    if (nodeVersion === 1) {
      returnSchema = import_zod.z.object({
        [STRUCTURED_OUTPUT_KEY]: import_zod.z.object({
          [STRUCTURED_OUTPUT_OBJECT_KEY]: zodSchema.optional(),
          [STRUCTURED_OUTPUT_ARRAY_KEY]: import_zod.z.array(zodSchema).optional()
        }).describe(
          `Wrapper around the output data. It can only contain ${STRUCTURED_OUTPUT_OBJECT_KEY} or ${STRUCTURED_OUTPUT_ARRAY_KEY} but never both.`
        ).refine(
          (data) => {
            return Boolean(data[STRUCTURED_OUTPUT_OBJECT_KEY]) !== Boolean(data[STRUCTURED_OUTPUT_ARRAY_KEY]);
          },
          {
            message: "One and only one of __structured__output__object and __structured__output__array should be present.",
            path: [STRUCTURED_OUTPUT_KEY]
          }
        )
      });
    } else if (nodeVersion < 1.3) {
      returnSchema = import_zod.z.object({
        output: zodSchema.optional()
      });
    } else {
      returnSchema = import_zod.z.object({
        output: zodSchema
      });
    }
    return new N8nStructuredOutputParser(context, returnSchema);
  }
  getSchema() {
    return this.schema;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  N8nStructuredOutputParser
});
//# sourceMappingURL=N8nStructuredOutputParser.js.map