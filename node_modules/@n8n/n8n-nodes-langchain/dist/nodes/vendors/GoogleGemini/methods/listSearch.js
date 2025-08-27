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
  audioModelSearch: () => audioModelSearch,
  imageGenerationModelSearch: () => imageGenerationModelSearch,
  modelSearch: () => modelSearch,
  videoGenerationModelSearch: () => videoGenerationModelSearch
});
module.exports = __toCommonJS(listSearch_exports);
var import_transport = require("../transport");
async function baseModelSearch(modelFilter, filter) {
  const response = await import_transport.apiRequest.call(this, "GET", "/v1beta/models", {
    qs: {
      pageSize: 1e3
    }
  });
  let models = response.models.filter((model) => modelFilter(model.name));
  if (filter) {
    models = models.filter((model) => model.name.toLowerCase().includes(filter.toLowerCase()));
  }
  return {
    results: models.map((model) => ({ name: model.name, value: model.name }))
  };
}
async function modelSearch(filter) {
  return await baseModelSearch.call(
    this,
    (model) => !model.includes("embedding") && !model.includes("aqa") && !model.includes("image") && !model.includes("vision") && !model.includes("veo") && !model.includes("audio") && !model.includes("tts"),
    filter
  );
}
async function audioModelSearch(filter) {
  return await baseModelSearch.call(
    this,
    (model) => !model.includes("embedding") && !model.includes("aqa") && !model.includes("image") && !model.includes("vision") && !model.includes("veo") && !model.includes("tts"),
    // we don't have a tts operation
    filter
  );
}
async function imageGenerationModelSearch(filter) {
  return await baseModelSearch.call(
    this,
    (model) => model.includes("imagen") || model.includes("image-generation"),
    filter
  );
}
async function videoGenerationModelSearch(filter) {
  return await baseModelSearch.call(this, (model) => model.includes("veo"), filter);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  audioModelSearch,
  imageGenerationModelSearch,
  modelSearch,
  videoGenerationModelSearch
});
//# sourceMappingURL=listSearch.js.map