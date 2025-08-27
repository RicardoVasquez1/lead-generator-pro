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
var schemaParsing_exports = {};
__export(schemaParsing_exports, {
  convertJsonSchemaToZod: () => convertJsonSchemaToZod,
  generateSchemaFromExample: () => generateSchemaFromExample,
  throwIfToolSchema: () => throwIfToolSchema
});
module.exports = __toCommonJS(schemaParsing_exports);
var import_json_schema_to_zod = require("@n8n/json-schema-to-zod");
var import_generate_schema = require("generate-schema");
var import_n8n_workflow = require("n8n-workflow");
function makeAllPropertiesRequired(schema) {
  function isPropertySchema(property) {
    return typeof property === "object" && property !== null && "type" in property;
  }
  if (schema.type === "object" && schema.properties) {
    const properties = Object.keys(schema.properties);
    if (properties.length > 0) {
      schema.required = properties;
    }
    for (const key of properties) {
      if (isPropertySchema(schema.properties[key])) {
        makeAllPropertiesRequired(schema.properties[key]);
      }
    }
  }
  if (schema.type === "array" && schema.items && isPropertySchema(schema.items)) {
    schema.items = makeAllPropertiesRequired(schema.items);
  }
  return schema;
}
function generateSchemaFromExample(exampleJsonString, allFieldsRequired = false) {
  const parsedExample = (0, import_n8n_workflow.jsonParse)(exampleJsonString);
  const schema = (0, import_generate_schema.json)(parsedExample);
  if (allFieldsRequired) {
    return makeAllPropertiesRequired(schema);
  }
  return schema;
}
function convertJsonSchemaToZod(schema) {
  return (0, import_json_schema_to_zod.jsonSchemaToZod)(schema);
}
function throwIfToolSchema(ctx, error) {
  if (error?.message?.includes("tool input did not match expected schema")) {
    throw new import_n8n_workflow.NodeOperationError(
      ctx.getNode(),
      `${error.message}.
			This is most likely because some of your tools are configured to require a specific schema. This is not supported by Conversational Agent. Remove the schema from the tool configuration or use Tools agent instead.`
    );
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  convertJsonSchemaToZod,
  generateSchemaFromExample,
  throwIfToolSchema
});
//# sourceMappingURL=schemaParsing.js.map