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
var helpers_exports = {};
__export(helpers_exports, {
  makeZodSchemaFromAttributes: () => makeZodSchemaFromAttributes
});
module.exports = __toCommonJS(helpers_exports);
var import_zod = require("zod");
function makeAttributeSchema(attributeDefinition, required = true) {
  let schema;
  if (attributeDefinition.type === "string") {
    schema = import_zod.z.string();
  } else if (attributeDefinition.type === "number") {
    schema = import_zod.z.number();
  } else if (attributeDefinition.type === "boolean") {
    schema = import_zod.z.boolean();
  } else if (attributeDefinition.type === "date") {
    schema = import_zod.z.string().date();
  } else {
    schema = import_zod.z.unknown();
  }
  if (!required) {
    schema = schema.optional();
  }
  return schema.describe(attributeDefinition.description);
}
function makeZodSchemaFromAttributes(attributes) {
  const schemaEntries = attributes.map((attr) => [
    attr.name,
    makeAttributeSchema(attr, attr.required)
  ]);
  return import_zod.z.object(Object.fromEntries(schemaEntries));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  makeZodSchemaFromAttributes
});
//# sourceMappingURL=helpers.js.map