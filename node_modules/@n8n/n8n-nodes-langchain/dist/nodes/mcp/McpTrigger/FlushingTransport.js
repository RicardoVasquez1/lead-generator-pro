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
var FlushingTransport_exports = {};
__export(FlushingTransport_exports, {
  FlushingSSEServerTransport: () => FlushingSSEServerTransport,
  FlushingStreamableHTTPTransport: () => FlushingStreamableHTTPTransport
});
module.exports = __toCommonJS(FlushingTransport_exports);
var import_sse = require("@modelcontextprotocol/sdk/server/sse.js");
var import_streamableHttp = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
class FlushingSSEServerTransport extends import_sse.SSEServerTransport {
  constructor(_endpoint, response) {
    super(_endpoint, response);
    this.response = response;
  }
  async send(message) {
    await super.send(message);
    this.response.flush();
  }
  async handleRequest(req, resp, message) {
    await super.handlePostMessage(req, resp, message);
    this.response.flush();
  }
}
class FlushingStreamableHTTPTransport extends import_streamableHttp.StreamableHTTPServerTransport {
  constructor(options, response) {
    super(options);
    this.response = response;
  }
  async send(message) {
    await super.send(message);
    this.response.flush();
  }
  async handleRequest(req, resp, parsedBody) {
    await super.handleRequest(req, resp, parsedBody);
    this.response.flush();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FlushingSSEServerTransport,
  FlushingStreamableHTTPTransport
});
//# sourceMappingURL=FlushingTransport.js.map