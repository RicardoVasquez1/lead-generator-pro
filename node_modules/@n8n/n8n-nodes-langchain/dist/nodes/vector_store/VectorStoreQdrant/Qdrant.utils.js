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
var Qdrant_utils_exports = {};
__export(Qdrant_utils_exports, {
  createQdrantClient: () => createQdrantClient
});
module.exports = __toCommonJS(Qdrant_utils_exports);
var import_js_client_rest = require("@qdrant/js-client-rest");
var import_n8n_workflow = require("n8n-workflow");
function parseQdrantUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return {
      protocol: parsedUrl.protocol,
      host: parsedUrl.hostname,
      port: parsedUrl.port ? parseInt(parsedUrl.port, 10) : parsedUrl.protocol === "https:" ? 443 : 80
    };
  } catch (error) {
    throw new import_n8n_workflow.UserError(
      `Invalid Qdrant URL: ${url}. Please provide a valid URL with protocol (http/https)`
    );
  }
}
function createQdrantClient(credentials) {
  const { protocol, host, port } = parseQdrantUrl(credentials.qdrantUrl);
  const qdrantClient = new import_js_client_rest.QdrantClient({
    host,
    apiKey: credentials.apiKey,
    https: protocol === "https:",
    port
  });
  return qdrantClient;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createQdrantClient
});
//# sourceMappingURL=Qdrant.utils.js.map