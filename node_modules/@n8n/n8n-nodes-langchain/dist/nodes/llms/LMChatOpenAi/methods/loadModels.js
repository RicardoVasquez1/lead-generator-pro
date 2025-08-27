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
var loadModels_exports = {};
__export(loadModels_exports, {
  searchModels: () => searchModels
});
module.exports = __toCommonJS(loadModels_exports);
var import_openai = __toESM(require("openai"));
var import_httpProxyAgent = require("../../../../utils/httpProxyAgent");
async function searchModels(filter) {
  const credentials = await this.getCredentials("openAiApi");
  const baseURL = this.getNodeParameter("options.baseURL", "") || credentials.url || "https://api.openai.com/v1";
  const openai = new import_openai.default({
    baseURL,
    apiKey: credentials.apiKey,
    fetchOptions: {
      dispatcher: (0, import_httpProxyAgent.getProxyAgent)(baseURL)
    }
  });
  const { data: models = [] } = await openai.models.list();
  const filteredModels = models.filter((model) => {
    const url = baseURL && new URL(baseURL);
    const isCustomAPI = url && url.hostname !== "api.openai.com";
    const isInvalidModel = !isCustomAPI && (model.id.startsWith("babbage") || model.id.startsWith("davinci") || model.id.startsWith("computer-use") || model.id.startsWith("dall-e") || model.id.startsWith("text-embedding") || model.id.startsWith("tts") || model.id.startsWith("whisper") || model.id.startsWith("omni-moderation") || model.id.startsWith("gpt-") && model.id.includes("instruct"));
    if (!filter) return !isInvalidModel;
    return !isInvalidModel && model.id.toLowerCase().includes(filter.toLowerCase());
  });
  filteredModels.sort((a, b) => a.id.localeCompare(b.id));
  return {
    results: filteredModels.map((model) => ({
      name: model.id,
      value: model.id
    }))
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  searchModels
});
//# sourceMappingURL=loadModels.js.map