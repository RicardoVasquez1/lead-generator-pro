"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
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
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var McpServer_exports = {};
__export(McpServer_exports, {
  McpServerManager: () => McpServerManager
});
module.exports = __toCommonJS(McpServer_exports);
var import_server = require("@modelcontextprotocol/sdk/server/index.js");
var import_types = require("@modelcontextprotocol/sdk/types.js");
var import_crypto = require("crypto");
var import_n8n_workflow = require("n8n-workflow");
var import_zod_to_json_schema = require("zod-to-json-schema");
var import_FlushingTransport = require("./FlushingTransport");
var _instance;
function wasToolCall(body) {
  try {
    const message = JSON.parse(body);
    const parsedMessage = import_types.JSONRPCMessageSchema.parse(message);
    return "method" in parsedMessage && "id" in parsedMessage && parsedMessage?.method === import_types.CallToolRequestSchema.shape.method.value;
  } catch {
    return false;
  }
}
function getRequestId(message) {
  try {
    const parsedMessage = import_types.JSONRPCMessageSchema.parse(message);
    return "id" in parsedMessage ? String(parsedMessage.id) : void 0;
  } catch {
    return void 0;
  }
}
const _McpServerManager = class _McpServerManager {
  constructor(logger) {
    this.servers = {};
    this.transports = {};
    this.tools = {};
    this.resolveFunctions = {};
    this.logger = logger;
    this.logger.debug("MCP Server created");
  }
  static instance(logger) {
    if (!__privateGet(_McpServerManager, _instance)) {
      __privateSet(_McpServerManager, _instance, new _McpServerManager(logger));
      logger.debug("Created singleton MCP manager");
    }
    return __privateGet(_McpServerManager, _instance);
  }
  async createServerWithSSETransport(serverName, postUrl, resp) {
    const server = new import_server.Server(
      {
        name: serverName,
        version: "0.1.0"
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );
    const transport = new import_FlushingTransport.FlushingSSEServerTransport(postUrl, resp);
    this.setUpHandlers(server);
    const sessionId = transport.sessionId;
    this.transports[sessionId] = transport;
    this.servers[sessionId] = server;
    resp.on("close", async () => {
      this.logger.debug(`Deleting transport for ${sessionId}`);
      delete this.tools[sessionId];
      delete this.transports[sessionId];
      delete this.servers[sessionId];
    });
    await server.connect(transport);
    if (resp.flush) {
      resp.flush();
    }
  }
  getSessionId(req) {
    return req.query.sessionId ?? req.headers["mcp-session-id"];
  }
  getTransport(sessionId) {
    return this.transports[sessionId];
  }
  async createServerWithStreamableHTTPTransport(serverName, resp, req) {
    const server = new import_server.Server(
      {
        name: serverName,
        version: "0.1.0"
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );
    const transport = new import_FlushingTransport.FlushingStreamableHTTPTransport(
      {
        sessionIdGenerator: () => (0, import_crypto.randomUUID)(),
        onsessioninitialized: (sessionId) => {
          this.logger.debug(`New session initialized: ${sessionId}`);
          transport.onclose = () => {
            this.logger.debug(`Deleting transport for ${sessionId}`);
            delete this.tools[sessionId];
            delete this.transports[sessionId];
            delete this.servers[sessionId];
          };
          this.transports[sessionId] = transport;
          this.servers[sessionId] = server;
        }
      },
      resp
    );
    this.setUpHandlers(server);
    await server.connect(transport);
    await transport.handleRequest(req, resp, req?.body);
    if (resp.flush) {
      resp.flush();
    }
  }
  async handlePostMessage(req, resp, connectedTools) {
    const sessionId = this.getSessionId(req);
    const transport = this.getTransport(sessionId);
    if (sessionId && transport) {
      const message = (0, import_n8n_workflow.jsonParse)(req.rawBody.toString());
      const messageId = getRequestId(message);
      const callId = messageId ? `${sessionId}_${messageId}` : sessionId;
      this.tools[sessionId] = connectedTools;
      try {
        await new Promise(async (resolve) => {
          this.resolveFunctions[callId] = resolve;
          await transport.handleRequest(req, resp, message);
        });
      } finally {
        delete this.resolveFunctions[callId];
      }
    } else {
      this.logger.warn(`No transport found for session ${sessionId}`);
      resp.status(401).send("No transport found for sessionId");
    }
    if (resp.flush) {
      resp.flush();
    }
    return wasToolCall(req.rawBody.toString());
  }
  async handleDeleteRequest(req, resp) {
    const sessionId = this.getSessionId(req);
    if (!sessionId) {
      resp.status(400).send("No sessionId provided");
      return;
    }
    const transport = this.getTransport(sessionId);
    if (transport) {
      if (transport instanceof import_FlushingTransport.FlushingStreamableHTTPTransport) {
        await transport.handleRequest(req, resp);
        return;
      } else {
        resp.status(405).send("Method Not Allowed");
        return;
      }
    }
    resp.status(404).send("Session not found");
  }
  setUpHandlers(server) {
    server.setRequestHandler(
      import_types.ListToolsRequestSchema,
      async (_, extra) => {
        if (!extra.sessionId) {
          throw new import_n8n_workflow.OperationalError("Require a sessionId for the listing of tools");
        }
        return {
          tools: this.tools[extra.sessionId].map((tool) => {
            return {
              name: tool.name,
              description: tool.description,
              // Allow additional properties on tool call input
              inputSchema: (0, import_zod_to_json_schema.zodToJsonSchema)(tool.schema, { removeAdditionalStrategy: "strict" })
            };
          })
        };
      }
    );
    server.setRequestHandler(
      import_types.CallToolRequestSchema,
      async (request, extra) => {
        if (!request.params?.name || !request.params?.arguments) {
          throw new import_n8n_workflow.OperationalError("Require a name and arguments for the tool call");
        }
        if (!extra.sessionId) {
          throw new import_n8n_workflow.OperationalError("Require a sessionId for the tool call");
        }
        const callId = extra.requestId ? `${extra.sessionId}_${extra.requestId}` : extra.sessionId;
        const requestedTool = this.tools[extra.sessionId].find(
          (tool) => tool.name === request.params.name
        );
        if (!requestedTool) {
          throw new import_n8n_workflow.OperationalError("Tool not found");
        }
        try {
          const result = await requestedTool.invoke(request.params.arguments);
          if (this.resolveFunctions[callId]) {
            this.resolveFunctions[callId]();
          } else {
            this.logger.warn(`No resolve function found for ${callId}`);
          }
          this.logger.debug(`Got request for ${requestedTool.name}, and executed it.`);
          if (typeof result === "object") {
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
          }
          if (typeof result === "string") {
            return { content: [{ type: "text", text: result }] };
          }
          return { content: [{ type: "text", text: String(result) }] };
        } catch (error) {
          this.logger.error(`Error while executing Tool ${requestedTool.name}: ${error}`);
          return { isError: true, content: [{ type: "text", text: `Error: ${error.message}` }] };
        }
      }
    );
    server.onclose = () => {
      this.logger.debug("Closing MCP Server");
    };
    server.onerror = (error) => {
      this.logger.error(`MCP Error: ${error}`);
    };
  }
};
_instance = new WeakMap();
__privateAdd(_McpServerManager, _instance);
let McpServerManager = _McpServerManager;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  McpServerManager
});
//# sourceMappingURL=McpServer.js.map