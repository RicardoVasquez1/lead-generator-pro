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
var listSearch_exports = {};
__export(listSearch_exports, {
  modelSearch: () => modelSearch
});
module.exports = __toCommonJS(listSearch_exports);
var import_transport = require("../transport");
async function modelSearch(filter) {
  const response = await import_transport.apiRequest.call(this, "GET", "/v1/models");
  let models = response.data;
  if (filter) {
    models = models.filter((model) => model.id.toLowerCase().includes(filter.toLowerCase()));
  }
  return {
    results: models.map((model) => ({
      name: model.id,
      value: model.id
    }))
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  modelSearch
});
//# sourceMappingURL=listSearch.js.map