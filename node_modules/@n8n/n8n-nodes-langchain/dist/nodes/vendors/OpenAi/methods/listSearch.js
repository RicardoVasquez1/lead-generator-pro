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
  assistantSearch: () => assistantSearch,
  fileSearch: () => fileSearch,
  imageModelSearch: () => imageModelSearch,
  modelSearch: () => modelSearch
});
module.exports = __toCommonJS(listSearch_exports);
var import_transport = require("../transport");
async function fileSearch(filter) {
  const { data } = await import_transport.apiRequest.call(this, "GET", "/files");
  if (filter) {
    const results = [];
    for (const file of data || []) {
      if (file.filename?.toLowerCase().includes(filter.toLowerCase())) {
        results.push({
          name: file.filename,
          value: file.id
        });
      }
    }
    return {
      results
    };
  } else {
    return {
      results: (data || []).map((file) => ({
        name: file.filename,
        value: file.id
      }))
    };
  }
}
const getModelSearch = (filterCondition) => async (ctx, filter) => {
  let { data } = await import_transport.apiRequest.call(ctx, "GET", "/models");
  data = data?.filter((model) => filterCondition(model));
  let results = [];
  if (filter) {
    for (const model of data || []) {
      if (model.id?.toLowerCase().includes(filter.toLowerCase())) {
        results.push({
          name: model.id.toUpperCase(),
          value: model.id
        });
      }
    }
  } else {
    results = (data || []).map((model) => ({
      name: model.id.toUpperCase(),
      value: model.id
    }));
  }
  results = results.sort((a, b) => a.name.localeCompare(b.name));
  return {
    results
  };
};
async function modelSearch(filter) {
  const credentials = await this.getCredentials("openAiApi");
  const url = credentials.url && new URL(credentials.url);
  const isCustomAPI = url && !["api.openai.com", "ai-assistant.n8n.io"].includes(url.hostname);
  return await getModelSearch(
    (model) => !isCustomAPI && !(model.id.startsWith("babbage") || model.id.startsWith("davinci") || model.id.startsWith("computer-use") || model.id.startsWith("dall-e") || model.id.startsWith("text-embedding") || model.id.startsWith("tts") || model.id.startsWith("whisper") || model.id.startsWith("omni-moderation") || model.id.startsWith("gpt-") && model.id.includes("instruct"))
  )(this, filter);
}
async function imageModelSearch(filter) {
  return await getModelSearch(
    (model) => model.id.includes("vision") || model.id.includes("gpt-4o")
  )(this, filter);
}
async function assistantSearch(filter, paginationToken) {
  const { data, has_more, last_id } = await import_transport.apiRequest.call(this, "GET", "/assistants", {
    headers: {
      "OpenAI-Beta": "assistants=v2"
    },
    qs: {
      limit: 100,
      after: paginationToken
    }
  });
  if (has_more) {
    paginationToken = last_id;
  } else {
    paginationToken = void 0;
  }
  if (filter) {
    const results = [];
    for (const assistant of data || []) {
      if (assistant.name?.toLowerCase().includes(filter.toLowerCase())) {
        results.push({
          name: assistant.name,
          value: assistant.id
        });
      }
    }
    return {
      results
    };
  } else {
    return {
      results: (data || []).map((assistant) => ({
        name: assistant.name ?? assistant.id,
        value: assistant.id
      })),
      paginationToken
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assistantSearch,
  fileSearch,
  imageModelSearch,
  modelSearch
});
//# sourceMappingURL=listSearch.js.map