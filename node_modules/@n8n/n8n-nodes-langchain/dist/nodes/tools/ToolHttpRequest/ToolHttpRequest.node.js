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
var ToolHttpRequest_node_exports = {};
__export(ToolHttpRequest_node_exports, {
  ToolHttpRequest: () => ToolHttpRequest
});
module.exports = __toCommonJS(ToolHttpRequest_node_exports);
var import_tools = require("@langchain/core/tools");
var import_n8n_workflow = require("n8n-workflow");
var import_N8nTool = require("../../../utils/N8nTool");
var import_sharedFields = require("../../../utils/sharedFields");
var import_descriptions = require("./descriptions");
var import_utils = require("./utils");
class ToolHttpRequest {
  constructor() {
    this.description = {
      displayName: "HTTP Request Tool",
      name: "toolHttpRequest",
      icon: { light: "file:httprequest.svg", dark: "file:httprequest.dark.svg" },
      group: ["output"],
      version: [1, 1.1],
      description: "Makes an HTTP request and returns the response data",
      subtitle: "={{ $parameter.toolDescription }}",
      defaults: {
        name: "HTTP Request"
      },
      credentials: [],
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Tools"],
          Tools: ["Recommended Tools"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolhttprequest/"
            }
          ]
        }
      },
      // Replaced by a `usableAsTool` version of the standalone HttpRequest node
      hidden: true,
      inputs: [],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiTool],
      outputNames: ["Tool"],
      properties: [
        (0, import_sharedFields.getConnectionHintNoticeField)([import_n8n_workflow.NodeConnectionTypes.AiAgent]),
        {
          displayName: "Description",
          name: "toolDescription",
          type: "string",
          description: "Explain to LLM what this tool does, better description would allow LLM to produce expected result",
          placeholder: "e.g. Get the current weather in the requested city",
          default: "",
          typeOptions: {
            rows: 3
          }
        },
        {
          displayName: "Method",
          name: "method",
          type: "options",
          options: [
            {
              name: "DELETE",
              value: "DELETE"
            },
            {
              name: "GET",
              value: "GET"
            },
            {
              name: "PATCH",
              value: "PATCH"
            },
            {
              name: "POST",
              value: "POST"
            },
            {
              name: "PUT",
              value: "PUT"
            }
          ],
          default: "GET"
        },
        {
          displayName: "Tip: You can use a {placeholder} for any part of the request to be filled by the model. Provide more context about them in the placeholders section",
          name: "placeholderNotice",
          type: "notice",
          default: ""
        },
        {
          displayName: "URL",
          name: "url",
          type: "string",
          default: "",
          required: true,
          placeholder: "e.g. http://www.example.com/{path}"
        },
        ...import_descriptions.authenticationProperties,
        //----------------------------------------------------------------
        {
          displayName: "Send Query Parameters",
          name: "sendQuery",
          type: "boolean",
          default: false,
          noDataExpression: true,
          description: "Whether the request has query params or not"
        },
        {
          ...import_descriptions.specifyBySelector,
          displayName: "Specify Query Parameters",
          name: "specifyQuery",
          displayOptions: {
            show: {
              sendQuery: [true]
            }
          }
        },
        {
          ...import_descriptions.parametersCollection,
          displayName: "Query Parameters",
          name: "parametersQuery",
          displayOptions: {
            show: {
              sendQuery: [true],
              specifyQuery: ["keypair"]
            }
          }
        },
        {
          ...import_descriptions.jsonInput,
          name: "jsonQuery",
          displayOptions: {
            show: {
              sendQuery: [true],
              specifyQuery: ["json"]
            }
          }
        },
        //----------------------------------------------------------------
        {
          displayName: "Send Headers",
          name: "sendHeaders",
          type: "boolean",
          default: false,
          noDataExpression: true,
          description: "Whether the request has headers or not"
        },
        {
          ...import_descriptions.specifyBySelector,
          displayName: "Specify Headers",
          name: "specifyHeaders",
          displayOptions: {
            show: {
              sendHeaders: [true]
            }
          }
        },
        {
          ...import_descriptions.parametersCollection,
          displayName: "Header Parameters",
          name: "parametersHeaders",
          displayOptions: {
            show: {
              sendHeaders: [true],
              specifyHeaders: ["keypair"]
            }
          }
        },
        {
          ...import_descriptions.jsonInput,
          name: "jsonHeaders",
          displayOptions: {
            show: {
              sendHeaders: [true],
              specifyHeaders: ["json"]
            }
          }
        },
        //----------------------------------------------------------------
        {
          displayName: "Send Body",
          name: "sendBody",
          type: "boolean",
          default: false,
          noDataExpression: true,
          description: "Whether the request has body or not"
        },
        {
          ...import_descriptions.specifyBySelector,
          displayName: "Specify Body",
          name: "specifyBody",
          displayOptions: {
            show: {
              sendBody: [true]
            }
          }
        },
        {
          ...import_descriptions.parametersCollection,
          displayName: "Body Parameters",
          name: "parametersBody",
          displayOptions: {
            show: {
              sendBody: [true],
              specifyBody: ["keypair"]
            }
          }
        },
        {
          ...import_descriptions.jsonInput,
          name: "jsonBody",
          displayOptions: {
            show: {
              sendBody: [true],
              specifyBody: ["json"]
            }
          }
        },
        //----------------------------------------------------------------
        import_descriptions.placeholderDefinitionsCollection,
        ...import_descriptions.optimizeResponseProperties
      ]
    };
  }
  async supplyData(itemIndex) {
    const name = this.getNode().name.replace(/ /g, "_");
    try {
      (0, import_n8n_workflow.tryToParseAlphanumericString)(name);
    } catch (error) {
      throw new import_n8n_workflow.NodeOperationError(
        this.getNode(),
        "The name of this tool is not a valid alphanumeric string",
        {
          itemIndex,
          description: "Only alphanumeric characters and underscores are allowed in the tool's name, and the name cannot start with a number"
        }
      );
    }
    const toolDescription = this.getNodeParameter("toolDescription", itemIndex);
    const sendQuery = this.getNodeParameter("sendQuery", itemIndex, false);
    const sendHeaders = this.getNodeParameter("sendHeaders", itemIndex, false);
    const sendBody = this.getNodeParameter("sendBody", itemIndex, false);
    const requestOptions = {
      method: this.getNodeParameter("method", itemIndex, "GET"),
      url: this.getNodeParameter("url", itemIndex),
      qs: {},
      headers: {
        // FIXME: This is a workaround to prevent the node from sending a default User-Agent (`n8n`) when the header is not set.
        //  Needs to be replaced with a proper fix after NODE-1777 is resolved
        "User-Agent": void 0
      },
      body: {},
      // We will need a full response object later to extract the headers and check the response's content type.
      returnFullResponse: true
    };
    const authentication = this.getNodeParameter("authentication", itemIndex, "none");
    if (authentication !== "none") {
      const domain = new URL(requestOptions.url).hostname;
      if (domain.includes("{") && domain.includes("}")) {
        throw new import_n8n_workflow.NodeOperationError(
          this.getNode(),
          "Can't use a placeholder for the domain when using authentication",
          {
            itemIndex,
            description: "This is for security reasons, to prevent the model accidentally sending your credentials to an unauthorized domain"
          }
        );
      }
    }
    const httpRequest = await (0, import_utils.configureHttpRequestFunction)(this, authentication, itemIndex);
    const optimizeResponse = (0, import_utils.configureResponseOptimizer)(this, itemIndex);
    const rawRequestOptions = {
      qs: "",
      headers: "",
      body: ""
    };
    const placeholdersDefinitions = this.getNodeParameter(
      "placeholderDefinitions.values",
      itemIndex,
      []
    ).map((p) => {
      if (p.name.startsWith("{") && p.name.endsWith("}")) {
        p.name = p.name.slice(1, -1);
      }
      return p;
    });
    const toolParameters = [];
    toolParameters.push(
      ...(0, import_utils.extractParametersFromText)(placeholdersDefinitions, requestOptions.url, "path")
    );
    if (sendQuery) {
      (0, import_utils.updateParametersAndOptions)({
        ctx: this,
        itemIndex,
        toolParameters,
        placeholdersDefinitions,
        requestOptions,
        rawRequestOptions,
        requestOptionsProperty: "qs",
        inputTypePropertyName: "specifyQuery",
        jsonPropertyName: "jsonQuery",
        parametersPropertyName: "parametersQuery.values"
      });
    }
    if (sendHeaders) {
      (0, import_utils.updateParametersAndOptions)({
        ctx: this,
        itemIndex,
        toolParameters,
        placeholdersDefinitions,
        requestOptions,
        rawRequestOptions,
        requestOptionsProperty: "headers",
        inputTypePropertyName: "specifyHeaders",
        jsonPropertyName: "jsonHeaders",
        parametersPropertyName: "parametersHeaders.values"
      });
    }
    if (sendBody) {
      (0, import_utils.updateParametersAndOptions)({
        ctx: this,
        itemIndex,
        toolParameters,
        placeholdersDefinitions,
        requestOptions,
        rawRequestOptions,
        requestOptionsProperty: "body",
        inputTypePropertyName: "specifyBody",
        jsonPropertyName: "jsonBody",
        parametersPropertyName: "parametersBody.values"
      });
    }
    for (const placeholder of placeholdersDefinitions) {
      if (!toolParameters.find((parameter) => parameter.name === placeholder.name)) {
        throw new import_n8n_workflow.NodeOperationError(
          this.getNode(),
          `Misconfigured placeholder '${placeholder.name}'`,
          {
            itemIndex,
            description: "This placeholder is defined in the 'Placeholder Definitions' but isn't used anywhere. Either remove the definition, or add the placeholder to a part of the request."
          }
        );
      }
    }
    const func = (0, import_utils.configureToolFunction)(
      this,
      itemIndex,
      toolParameters,
      requestOptions,
      rawRequestOptions,
      httpRequest,
      optimizeResponse
    );
    let tool;
    if (this.getNode().typeVersion >= 1.1) {
      const schema = (0, import_utils.makeToolInputSchema)(toolParameters);
      tool = new import_N8nTool.N8nTool(this, {
        name,
        description: toolDescription,
        func,
        schema
      });
    } else {
      const description = (0, import_utils.prepareToolDescription)(toolDescription, toolParameters);
      tool = new import_tools.DynamicTool({ name, description, func });
    }
    return {
      response: tool
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ToolHttpRequest
});
//# sourceMappingURL=ToolHttpRequest.node.js.map