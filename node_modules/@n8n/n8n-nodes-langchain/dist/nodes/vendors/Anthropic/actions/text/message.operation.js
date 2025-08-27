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
var message_operation_exports = {};
__export(message_operation_exports, {
  description: () => description,
  execute: () => execute
});
module.exports = __toCommonJS(message_operation_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_zod_to_json_schema = __toESM(require("zod-to-json-schema"));
var import_helpers = require("../../../../../utils/helpers");
var import_utils = require("../../helpers/utils");
var import_transport = require("../../transport");
var import_descriptions = require("../descriptions");
const properties = [
  import_descriptions.modelRLC,
  {
    displayName: "Messages",
    name: "messages",
    type: "fixedCollection",
    typeOptions: {
      sortable: true,
      multipleValues: true
    },
    placeholder: "Add Message",
    default: { values: [{ content: "", role: "user" }] },
    options: [
      {
        displayName: "Values",
        name: "values",
        values: [
          {
            displayName: "Prompt",
            name: "content",
            type: "string",
            description: "The content of the message to be sent",
            default: "",
            placeholder: "e.g. Hello, how can you help me?",
            typeOptions: {
              rows: 2
            }
          },
          {
            displayName: "Role",
            name: "role",
            type: "options",
            description: "Role in shaping the model's response, it tells the model how it should behave and interact with the user",
            options: [
              {
                name: "User",
                value: "user",
                description: "Send a message as a user and get a response from the model"
              },
              {
                name: "Assistant",
                value: "assistant",
                description: "Tell the model to adopt a specific tone or personality"
              }
            ],
            default: "user"
          }
        ]
      }
    ]
  },
  {
    displayName: "Add Attachments",
    name: "addAttachments",
    type: "boolean",
    default: false,
    description: "Whether to add attachments to the message"
  },
  {
    displayName: "Attachments Input Type",
    name: "attachmentsInputType",
    type: "options",
    default: "url",
    description: "The type of input to use for the attachments",
    options: [
      {
        name: "URL(s)",
        value: "url"
      },
      {
        name: "Binary File(s)",
        value: "binary"
      }
    ],
    displayOptions: {
      show: {
        addAttachments: [true]
      }
    }
  },
  {
    displayName: "Attachment URL(s)",
    name: "attachmentsUrls",
    type: "string",
    default: "",
    placeholder: "e.g. https://example.com/image.png",
    description: "URL(s) of the file(s) to attach, multiple URLs can be added separated by comma",
    displayOptions: {
      show: {
        addAttachments: [true],
        attachmentsInputType: ["url"]
      }
    }
  },
  {
    displayName: "Attachment Input Data Field Name(s)",
    name: "binaryPropertyName",
    type: "string",
    default: "data",
    placeholder: "e.g. data",
    description: "Name of the binary field(s) which contains the file(s) to attach, multiple field names can be added separated by comma",
    displayOptions: {
      show: {
        addAttachments: [true],
        attachmentsInputType: ["binary"]
      }
    }
  },
  {
    displayName: "Simplify Output",
    name: "simplify",
    type: "boolean",
    default: true,
    description: "Whether to return a simplified version of the response instead of the raw data"
  },
  {
    displayName: "Options",
    name: "options",
    placeholder: "Add Option",
    type: "collection",
    default: {},
    options: [
      {
        displayName: "Include Merged Response",
        name: "includeMergedResponse",
        type: "boolean",
        default: false,
        description: "Whether to include a single output string merging all text parts of the response"
      },
      {
        displayName: "System Message",
        name: "system",
        type: "string",
        default: "",
        placeholder: "e.g. You are a helpful assistant"
      },
      {
        displayName: "Code Execution",
        name: "codeExecution",
        type: "boolean",
        default: false,
        description: "Whether to enable code execution. Not supported by all models."
      },
      {
        displayName: "Web Search",
        name: "webSearch",
        type: "boolean",
        default: false,
        description: "Whether to enable web search"
      },
      {
        displayName: "Web Search Max Uses",
        name: "maxUses",
        type: "number",
        default: 5,
        description: "The maximum number of web search uses per request",
        typeOptions: {
          minValue: 0,
          numberPrecision: 0
        }
      },
      {
        displayName: "Web Search Allowed Domains",
        name: "allowedDomains",
        type: "string",
        default: "",
        description: 'Comma-separated list of domains to search. Only domains in this list will be searched. Conflicts with "Web Search Blocked Domains".',
        placeholder: "e.g. google.com, wikipedia.org"
      },
      {
        displayName: "Web Search Blocked Domains",
        name: "blockedDomains",
        type: "string",
        default: "",
        description: 'Comma-separated list of domains to block from search. Conflicts with "Web Search Allowed Domains".',
        placeholder: "e.g. google.com, wikipedia.org"
      },
      {
        displayName: "Maximum Number of Tokens",
        name: "maxTokens",
        default: 1024,
        description: "The maximum number of tokens to generate in the completion",
        type: "number",
        typeOptions: {
          minValue: 1,
          numberPrecision: 0
        }
      },
      {
        displayName: "Output Randomness (Temperature)",
        name: "temperature",
        default: 1,
        description: "Controls the randomness of the output. Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive",
        type: "number",
        typeOptions: {
          minValue: 0,
          maxValue: 1,
          numberPrecision: 1
        }
      },
      {
        displayName: "Output Randomness (Top P)",
        name: "topP",
        default: 0.7,
        description: "The maximum cumulative probability of tokens to consider when sampling",
        type: "number",
        typeOptions: {
          minValue: 0,
          maxValue: 1,
          numberPrecision: 1
        }
      },
      {
        displayName: "Output Randomness (Top K)",
        name: "topK",
        default: 5,
        description: "The maximum number of tokens to consider when sampling",
        type: "number",
        typeOptions: {
          minValue: 0,
          numberPrecision: 0
        }
      },
      {
        displayName: "Max Tool Calls Iterations",
        name: "maxToolsIterations",
        type: "number",
        default: 15,
        description: "The maximum number of tool iteration cycles the LLM will run before stopping. A single iteration can contain multiple tool calls. Set to 0 for no limit",
        typeOptions: {
          minValue: 0,
          numberPrecision: 0
        }
      }
    ]
  }
];
const displayOptions = {
  show: {
    operation: ["message"],
    resource: ["text"]
  }
};
const description = (0, import_n8n_workflow.updateDisplayOptions)(displayOptions, properties);
function getFileTypeOrThrow(mimeType) {
  if (mimeType?.startsWith("image/")) {
    return "image";
  }
  if (mimeType === "application/pdf") {
    return "document";
  }
  throw new import_n8n_workflow.NodeOperationError(
    this.getNode(),
    `Unsupported file type: ${mimeType}. Only images and PDFs are supported.`
  );
}
async function execute(i) {
  const model = this.getNodeParameter("modelId", i, "", { extractValue: true });
  const messages = this.getNodeParameter("messages.values", i, []);
  const addAttachments = this.getNodeParameter("addAttachments", i, false);
  const simplify = this.getNodeParameter("simplify", i, true);
  const options = this.getNodeParameter("options", i, {});
  const { tools, connectedTools } = await getTools.call(this, options);
  if (addAttachments) {
    if (options.codeExecution) {
      await addCodeAttachmentsToMessages.call(this, i, messages);
    } else {
      await addRegularAttachmentsToMessages.call(this, i, messages);
    }
  }
  const body = {
    model,
    messages,
    tools,
    max_tokens: options.maxTokens ?? 1024,
    system: options.system,
    temperature: options.temperature,
    top_p: options.topP,
    top_k: options.topK
  };
  let response = await import_transport.apiRequest.call(this, "POST", "/v1/messages", {
    body,
    enableAnthropicBetas: { codeExecution: options.codeExecution }
  });
  const maxToolsIterations = this.getNodeParameter("options.maxToolsIterations", i, 15);
  const abortSignal = this.getExecutionCancelSignal();
  let currentIteration = 0;
  let pauseTurns = 0;
  while (true) {
    if (abortSignal?.aborted) {
      break;
    }
    if (response.stop_reason === "tool_use") {
      if (maxToolsIterations > 0 && currentIteration >= maxToolsIterations) {
        break;
      }
      messages.push({
        role: "assistant",
        content: response.content
      });
      await handleToolUse.call(this, response, messages, connectedTools);
      currentIteration++;
    } else if (response.stop_reason === "pause_turn") {
      if (pauseTurns >= 3) {
        break;
      }
      messages.push({
        role: "assistant",
        content: response.content
      });
      pauseTurns++;
    } else {
      break;
    }
    response = await import_transport.apiRequest.call(this, "POST", "/v1/messages", {
      body,
      enableAnthropicBetas: { codeExecution: options.codeExecution }
    });
  }
  const mergedResponse = options.includeMergedResponse ? response.content.filter((c) => c.type === "text").map((c) => c.text).join("") : void 0;
  if (simplify) {
    return [
      {
        json: {
          content: response.content,
          merged_response: mergedResponse
        },
        pairedItem: { item: i }
      }
    ];
  }
  return [
    {
      json: { ...response, merged_response: mergedResponse },
      pairedItem: { item: i }
    }
  ];
}
async function getTools(options) {
  let connectedTools = [];
  const nodeInputs = this.getNodeInputs();
  if (nodeInputs.some((i) => i.type === "ai_tool")) {
    connectedTools = await (0, import_helpers.getConnectedTools)(this, true);
  }
  const tools = connectedTools.map((t) => ({
    type: "custom",
    name: t.name,
    input_schema: (0, import_zod_to_json_schema.default)(t.schema),
    description: t.description
  }));
  if (options.codeExecution) {
    tools.push({
      type: "code_execution_20250522",
      name: "code_execution"
    });
  }
  if (options.webSearch) {
    const allowedDomains = options.allowedDomains ? (0, import_utils.splitByComma)(options.allowedDomains) : void 0;
    const blockedDomains = options.blockedDomains ? (0, import_utils.splitByComma)(options.blockedDomains) : void 0;
    tools.push({
      type: "web_search_20250305",
      name: "web_search",
      max_uses: options.maxUses,
      allowed_domains: allowedDomains,
      blocked_domains: blockedDomains
    });
  }
  return { tools, connectedTools };
}
async function addCodeAttachmentsToMessages(i, messages) {
  const inputType = this.getNodeParameter("attachmentsInputType", i, "url");
  const baseUrl = await import_utils.getBaseUrl.call(this);
  const fileUrlPrefix = `${baseUrl}/v1/files/`;
  let content;
  if (inputType === "url") {
    const urls = this.getNodeParameter("attachmentsUrls", i, "");
    const promises = (0, import_utils.splitByComma)(urls).map(async (url) => {
      if (url.startsWith(fileUrlPrefix)) {
        return url.replace(fileUrlPrefix, "");
      } else {
        const { fileContent, mimeType } = await import_utils.downloadFile.call(this, url);
        const response = await import_utils.uploadFile.call(this, fileContent, mimeType);
        return response.id;
      }
    });
    const fileIds = await Promise.all(promises);
    content = fileIds.map((fileId) => ({
      type: "container_upload",
      file_id: fileId
    }));
  } else {
    const binaryPropertyNames = this.getNodeParameter("binaryPropertyName", i, "data");
    const promises = (0, import_utils.splitByComma)(binaryPropertyNames).map(async (binaryPropertyName) => {
      const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
      const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
      const response = await import_utils.uploadFile.call(this, buffer, binaryData.mimeType);
      return response.id;
    });
    const fileIds = await Promise.all(promises);
    content = fileIds.map((fileId) => ({
      type: "container_upload",
      file_id: fileId
    }));
  }
  messages.push({
    role: "user",
    content
  });
}
async function addRegularAttachmentsToMessages(i, messages) {
  const inputType = this.getNodeParameter("attachmentsInputType", i, "url");
  const baseUrl = await import_utils.getBaseUrl.call(this);
  const fileUrlPrefix = `${baseUrl}/v1/files/`;
  let content;
  if (inputType === "url") {
    const urls = this.getNodeParameter("attachmentsUrls", i, "");
    const promises = (0, import_utils.splitByComma)(urls).map(async (url) => {
      if (url.startsWith(fileUrlPrefix)) {
        const response = await import_transport.apiRequest.call(this, "GET", "", {
          option: { url }
        });
        const type = getFileTypeOrThrow.call(this, response.mime_type);
        return {
          type,
          source: {
            type: "file",
            file_id: url.replace(fileUrlPrefix, "")
          }
        };
      } else {
        const response = await this.helpers.httpRequest.call(this, {
          url,
          method: "HEAD",
          returnFullResponse: true
        });
        const mimeType = (0, import_utils.getMimeType)(response.headers["content-type"]);
        const type = getFileTypeOrThrow.call(this, mimeType);
        return {
          type,
          source: {
            type: "url",
            url
          }
        };
      }
    });
    content = await Promise.all(promises);
  } else {
    const binaryPropertyNames = this.getNodeParameter("binaryPropertyName", i, "data");
    const promises = (0, import_utils.splitByComma)(binaryPropertyNames).map(async (binaryPropertyName) => {
      const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
      const type = getFileTypeOrThrow.call(this, binaryData.mimeType);
      const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
      const fileBase64 = buffer.toString("base64");
      return {
        type,
        source: {
          type: "base64",
          media_type: binaryData.mimeType,
          data: fileBase64
        }
      };
    });
    content = await Promise.all(promises);
  }
  messages.push({
    role: "user",
    content
  });
}
async function handleToolUse(response, messages, connectedTools) {
  const toolCalls = response.content.filter((c) => c.type === "tool_use");
  if (!toolCalls.length) {
    return;
  }
  const toolResults = {
    role: "user",
    content: []
  };
  for (const toolCall of toolCalls) {
    let toolResponse;
    for (const connectedTool of connectedTools) {
      if (connectedTool.name === toolCall.name) {
        toolResponse = await connectedTool.invoke(toolCall.input);
      }
    }
    toolResults.content.push({
      type: "tool_result",
      tool_use_id: toolCall.id,
      content: typeof toolResponse === "object" ? JSON.stringify(toolResponse) : toolResponse ?? ""
    });
  }
  messages.push(toolResults);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  description,
  execute
});
//# sourceMappingURL=message.operation.js.map