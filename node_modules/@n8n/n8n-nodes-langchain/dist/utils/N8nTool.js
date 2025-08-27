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
var N8nTool_exports = {};
__export(N8nTool_exports, {
  N8nTool: () => N8nTool,
  prepareFallbackToolDescription: () => prepareFallbackToolDescription
});
module.exports = __toCommonJS(N8nTool_exports);
var import_tools = require("@langchain/core/tools");
var import_output_parsers = require("langchain/output_parsers");
var import_n8n_workflow = require("n8n-workflow");
var import_zod = require("zod");
const getSimplifiedType = (schema) => {
  if (schema instanceof import_zod.ZodObject) {
    return "object";
  } else if (schema instanceof import_zod.ZodNumber) {
    return "number";
  } else if (schema instanceof import_zod.ZodBoolean) {
    return "boolean";
  } else if (schema instanceof import_zod.ZodNullable || schema instanceof import_zod.ZodOptional) {
    return getSimplifiedType(schema.unwrap());
  }
  return "string";
};
const getParametersDescription = (parameters) => parameters.map(
  ([name, schema]) => `${name}: (description: ${schema.description ?? ""}, type: ${getSimplifiedType(schema)}, required: ${!schema.isOptional()})`
).join(",\n ");
const prepareFallbackToolDescription = (toolDescription, schema) => {
  let description = `${toolDescription}`;
  const toolParameters = Object.entries(schema.shape);
  if (toolParameters.length) {
    description += `
Tool expects valid stringified JSON object with ${toolParameters.length} properties.
Property names with description, type and required status:
${getParametersDescription(toolParameters)}
ALL parameters marked as required must be provided`;
  }
  return description;
};
class N8nTool extends import_tools.DynamicStructuredTool {
  constructor(context, fields) {
    super(fields);
    this.context = context;
  }
  asDynamicTool() {
    const { name, func, schema, context, description } = this;
    const parser = new import_output_parsers.StructuredOutputParser(schema);
    const wrappedFunc = async function(query) {
      let parsedQuery;
      try {
        parsedQuery = await parser.parse(query);
      } catch (e) {
        let dataFromModel;
        try {
          dataFromModel = (0, import_n8n_workflow.jsonParse)(query, { acceptJSObject: true });
        } catch (error) {
          if (Object.keys(schema.shape).length === 1) {
            const parameterName = Object.keys(schema.shape)[0];
            dataFromModel = { [parameterName]: query };
          } else {
            throw new import_n8n_workflow.NodeOperationError(
              context.getNode(),
              `Input is not a valid JSON: ${error.message}`
            );
          }
        }
        parsedQuery = schema.parse(dataFromModel);
      }
      try {
        const result = await func(parsedQuery);
        return result;
      } catch (e) {
        const { index } = context.addInputData(import_n8n_workflow.NodeConnectionTypes.AiTool, [[{ json: { query } }]]);
        void context.addOutputData(import_n8n_workflow.NodeConnectionTypes.AiTool, index, e);
        return e.toString();
      }
    };
    return new import_tools.DynamicTool({
      name,
      description: prepareFallbackToolDescription(description, schema),
      func: wrappedFunc
    });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  N8nTool,
  prepareFallbackToolDescription
});
//# sourceMappingURL=N8nTool.js.map