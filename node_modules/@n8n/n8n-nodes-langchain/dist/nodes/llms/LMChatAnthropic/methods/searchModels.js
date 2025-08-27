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
var searchModels_exports = {};
__export(searchModels_exports, {
  searchModels: () => searchModels
});
module.exports = __toCommonJS(searchModels_exports);
async function searchModels(filter) {
  const credentials = await this.getCredentials("anthropicApi");
  const baseURL = credentials.url ?? "https://api.anthropic.com";
  const response = await this.helpers.httpRequestWithAuthentication.call(this, "anthropicApi", {
    url: `${baseURL}/v1/models`,
    headers: {
      "anthropic-version": "2023-06-01"
    }
  });
  const models = response.data || [];
  let results = [];
  if (filter) {
    for (const model of models) {
      if (model.id.toLowerCase().includes(filter.toLowerCase())) {
        results.push({
          name: model.display_name,
          value: model.id
        });
      }
    }
  } else {
    results = models.map((model) => ({
      name: model.display_name,
      value: model.id
    }));
  }
  results = results.sort((a, b) => {
    const modelA = models.find((m) => m.id === a.value);
    const modelB = models.find((m) => m.id === b.value);
    if (!modelA || !modelB) return 0;
    const dateA = new Date(modelA.created_at);
    const dateB = new Date(modelB.created_at);
    return dateB.getTime() - dateA.getTime();
  });
  return {
    results
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  searchModels
});
//# sourceMappingURL=searchModels.js.map