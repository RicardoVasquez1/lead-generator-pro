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
var router_exports = {};
__export(router_exports, {
  router: () => router
});
module.exports = __toCommonJS(router_exports);
var import_n8n_workflow = require("n8n-workflow");
var assistant = __toESM(require("./assistant"));
var audio = __toESM(require("./audio"));
var file = __toESM(require("./file"));
var image = __toESM(require("./image"));
var text = __toESM(require("./text"));
var import_error_handling = require("../helpers/error-handling");
async function router() {
  const returnData = [];
  const items = this.getInputData();
  const resource = this.getNodeParameter("resource", 0);
  const operation = this.getNodeParameter("operation", 0);
  const openAiTypeData = {
    resource,
    operation
  };
  let execute;
  switch (openAiTypeData.resource) {
    case "assistant":
      execute = assistant[openAiTypeData.operation].execute;
      break;
    case "audio":
      execute = audio[openAiTypeData.operation].execute;
      break;
    case "file":
      execute = file[openAiTypeData.operation].execute;
      break;
    case "image":
      execute = image[openAiTypeData.operation].execute;
      break;
    case "text":
      execute = text[openAiTypeData.operation].execute;
      break;
    default:
      throw new import_n8n_workflow.NodeOperationError(
        this.getNode(),
        `The operation "${operation}" is not supported!`
      );
  }
  for (let i = 0; i < items.length; i++) {
    try {
      const responseData = await execute.call(this, i);
      returnData.push(...responseData);
    } catch (error) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
        continue;
      }
      if (error instanceof import_n8n_workflow.NodeApiError) {
        const errorCode = error.cause?.error?.error?.code;
        if (errorCode) {
          const customErrorMessage = (0, import_error_handling.getCustomErrorMessage)(errorCode);
          if (customErrorMessage) {
            error.message = customErrorMessage;
          }
        }
        error.context = {
          itemIndex: i
        };
        throw error;
      }
      throw new import_n8n_workflow.NodeOperationError(this.getNode(), error, {
        itemIndex: i,
        description: error.description
      });
    }
  }
  return [returnData];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  router
});
//# sourceMappingURL=router.js.map