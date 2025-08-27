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
var responseFormatter_exports = {};
__export(responseFormatter_exports, {
  formatResponse: () => formatResponse
});
module.exports = __toCommonJS(responseFormatter_exports);
function formatResponse(response, returnUnwrappedObject) {
  if (typeof response === "string") {
    return {
      text: response.trim()
    };
  }
  if (Array.isArray(response)) {
    return {
      data: response
    };
  }
  if (response instanceof Object) {
    if (returnUnwrappedObject) {
      return response;
    }
    return {
      text: JSON.stringify(response)
    };
  }
  return {
    response: {
      text: response
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  formatResponse
});
//# sourceMappingURL=responseFormatter.js.map