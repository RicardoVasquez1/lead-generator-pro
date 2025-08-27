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
var McpTrigger_node_exports = {};
__export(McpTrigger_node_exports, {
  McpTrigger: () => McpTrigger
});
module.exports = __toCommonJS(McpTrigger_node_exports);
var import_error = require("n8n-nodes-base/dist/nodes/Webhook/error");
var import_utils = require("n8n-nodes-base/dist/nodes/Webhook/utils");
var import_n8n_workflow = require("n8n-workflow");
var import_helpers = require("../../../utils/helpers");
var import_McpServer = require("./McpServer");
const MCP_SSE_SETUP_PATH = "sse";
const MCP_SSE_MESSAGES_PATH = "messages";
class McpTrigger extends import_n8n_workflow.Node {
  constructor() {
    super(...arguments);
    this.description = {
      displayName: "MCP Server Trigger",
      name: "mcpTrigger",
      icon: {
        light: "file:../mcp.svg",
        dark: "file:../mcp.dark.svg"
      },
      group: ["trigger"],
      version: [1, 1.1, 2],
      description: "Expose n8n tools as an MCP Server endpoint",
      activationMessage: "You can now connect your MCP Clients to the URL, using SSE or Streamable HTTP transports.",
      defaults: {
        name: "MCP Server Trigger"
      },
      codex: {
        categories: ["AI", "Core Nodes"],
        subcategories: {
          AI: ["Root Nodes", "Model Context Protocol"],
          "Core Nodes": ["Other Trigger Nodes"]
        },
        alias: ["Model Context Protocol", "MCP Server"],
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-langchain.mcptrigger/"
            }
          ]
        }
      },
      triggerPanel: {
        header: "Listen for MCP events",
        executionsHelp: {
          inactive: "This trigger has two modes: test and production.<br /><br /><b>Use test mode while you build your workflow</b>. Click the 'execute step' button, then make an MCP request to the test URL. The executions will show up in the editor.<br /><br /><b>Use production mode to run your workflow automatically</b>. <a data-key='activate'>Activate</a> the workflow, then make requests to the production URL. These executions will show up in the <a data-key='executions'>executions list</a>, but not the editor.",
          active: "This trigger has two modes: test and production.<br /><br /><b>Use test mode while you build your workflow</b>. Click the 'execute step' button, then make an MCP request to the test URL. The executions will show up in the editor.<br /><br /><b>Use production mode to run your workflow automatically</b>. Since your workflow is activated, you can make requests to the production URL. These executions will show up in the <a data-key='executions'>executions list</a>, but not the editor."
        },
        activationHint: "Once you\u2019ve finished building your workflow, run it without having to click this button by using the production URL."
      },
      inputs: [
        {
          type: import_n8n_workflow.NodeConnectionTypes.AiTool,
          displayName: "Tools"
        }
      ],
      outputs: [],
      credentials: [
        {
          // eslint-disable-next-line n8n-nodes-base/node-class-description-credentials-name-unsuffixed
          name: "httpBearerAuth",
          required: true,
          displayOptions: {
            show: {
              authentication: ["bearerAuth"]
            }
          }
        },
        {
          name: "httpHeaderAuth",
          required: true,
          displayOptions: {
            show: {
              authentication: ["headerAuth"]
            }
          }
        }
      ],
      properties: [
        {
          displayName: "Authentication",
          name: "authentication",
          type: "options",
          options: [
            { name: "None", value: "none" },
            { name: "Bearer Auth", value: "bearerAuth" },
            { name: "Header Auth", value: "headerAuth" }
          ],
          default: "none",
          description: "The way to authenticate"
        },
        {
          displayName: "Path",
          name: "path",
          type: "string",
          default: "",
          placeholder: "webhook",
          required: true,
          description: "The base path for this MCP server"
        }
      ],
      webhooks: [
        {
          name: "setup",
          httpMethod: "GET",
          responseMode: "onReceived",
          isFullPath: true,
          path: `={{$parameter["path"]}}{{parseFloat($nodeVersion)<2 ? '/${MCP_SSE_SETUP_PATH}' : ''}}`,
          nodeType: "mcp",
          ndvHideMethod: true,
          ndvHideUrl: false
        },
        {
          name: "default",
          httpMethod: "POST",
          responseMode: "onReceived",
          isFullPath: true,
          path: `={{$parameter["path"]}}{{parseFloat($nodeVersion)<2 ? '/${MCP_SSE_MESSAGES_PATH}' : ''}}`,
          nodeType: "mcp",
          ndvHideMethod: true,
          ndvHideUrl: true
        },
        {
          name: "default",
          httpMethod: "DELETE",
          responseMode: "onReceived",
          isFullPath: true,
          path: '={{$parameter["path"]}}',
          nodeType: "mcp",
          ndvHideMethod: true,
          ndvHideUrl: true
        }
      ]
    };
  }
  async webhook(context) {
    const webhookName = context.getWebhookName();
    const req = context.getRequestObject();
    const resp = context.getResponseObject();
    try {
      await (0, import_utils.validateWebhookAuthentication)(context, "authentication");
    } catch (error) {
      if (error instanceof import_error.WebhookAuthorizationError) {
        resp.writeHead(error.responseCode);
        resp.end(error.message);
        return { noWebhookResponse: true };
      }
      throw error;
    }
    const node = context.getNode();
    const serverName = node.typeVersion > 1 ? (0, import_n8n_workflow.nodeNameToToolName)(node) : "n8n-mcp-server";
    const mcpServerManager = import_McpServer.McpServerManager.instance(context.logger);
    if (webhookName === "setup") {
      const postUrl = node.typeVersion < 2 ? req.path.replace(new RegExp(`/${MCP_SSE_SETUP_PATH}$`), `/${MCP_SSE_MESSAGES_PATH}`) : req.path;
      await mcpServerManager.createServerWithSSETransport(serverName, postUrl, resp);
      return { noWebhookResponse: true };
    } else if (webhookName === "default") {
      if (req.method === "DELETE") {
        await mcpServerManager.handleDeleteRequest(req, resp);
      } else {
        const sessionId = mcpServerManager.getSessionId(req);
        if (sessionId && mcpServerManager.getTransport(sessionId)) {
          const connectedTools = await (0, import_helpers.getConnectedTools)(context, true);
          const wasToolCall = await mcpServerManager.handlePostMessage(req, resp, connectedTools);
          if (wasToolCall) return { noWebhookResponse: true, workflowData: [[{ json: {} }]] };
        } else {
          await mcpServerManager.createServerWithStreamableHTTPTransport(serverName, resp, req);
        }
      }
      return { noWebhookResponse: true };
    }
    return { workflowData: [[{ json: {} }]] };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  McpTrigger
});
//# sourceMappingURL=McpTrigger.node.js.map