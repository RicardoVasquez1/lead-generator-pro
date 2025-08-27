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
var import_agents = require("langchain/agents");
var import_openai_assistant = require("langchain/experimental/openai_assistant");
var import_omit = __toESM(require("lodash/omit"));
var import_n8n_workflow = require("n8n-workflow");
var import_openai = require("openai");
var import_descriptions = require("../../../../../utils/descriptions");
var import_helpers = require("../../../../../utils/helpers");
var import_tracing = require("../../../../../utils/tracing");
var import_utils = require("../../helpers/utils");
var import_descriptions2 = require("../descriptions");
const properties = [
  import_descriptions2.assistantRLC,
  {
    ...import_descriptions.promptTypeOptions,
    name: "prompt"
  },
  {
    displayName: "Prompt (User Message)",
    name: "text",
    type: "string",
    default: "",
    placeholder: "e.g. Hello, how can you help me?",
    typeOptions: {
      rows: 2
    },
    displayOptions: {
      show: {
        prompt: ["define"]
      }
    }
  },
  {
    displayName: "Memory",
    name: "memory",
    type: "options",
    options: [
      {
        name: "Use memory connector",
        value: "connector",
        description: "Connect one of the supported memory nodes"
      },
      {
        // eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
        name: "Use thread ID",
        value: "threadId",
        description: "Specify the ID of the thread to continue"
      }
    ],
    displayOptions: {
      show: {
        "@version": [{ _cnd: { gte: 1.6 } }]
      }
    },
    default: "connector"
  },
  {
    displayName: "Thread ID",
    name: "threadId",
    type: "string",
    default: "",
    placeholder: "",
    description: "The ID of the thread to continue, a new thread will be created if not specified",
    hint: "If the thread ID is empty or undefined a new thread will be created and included in the response",
    displayOptions: {
      show: {
        "@version": [{ _cnd: { gte: 1.6 } }],
        memory: ["threadId"]
      }
    }
  },
  {
    displayName: "Connect your own custom n8n tools to this node on the canvas",
    name: "noticeTools",
    type: "notice",
    default: ""
  },
  {
    displayName: "Options",
    name: "options",
    placeholder: "Add Option",
    description: "Additional options to add",
    type: "collection",
    default: {},
    options: [
      {
        displayName: "Base URL",
        name: "baseURL",
        default: "https://api.openai.com/v1",
        description: "Override the default base URL for the API",
        type: "string",
        displayOptions: {
          hide: {
            "@version": [{ _cnd: { gte: 1.8 } }]
          }
        }
      },
      {
        displayName: "Max Retries",
        name: "maxRetries",
        default: 2,
        description: "Maximum number of retries to attempt",
        type: "number"
      },
      {
        displayName: "Timeout",
        name: "timeout",
        default: 1e4,
        description: "Maximum amount of time a request is allowed to take in milliseconds",
        type: "number"
      },
      {
        displayName: "Preserve Original Tools",
        name: "preserveOriginalTools",
        type: "boolean",
        default: true,
        description: "Whether to preserve the original tools of the assistant after the execution of this node, otherwise the tools will be replaced with the connected tools, if any, default is true",
        displayOptions: {
          show: {
            "@version": [{ _cnd: { gte: 1.3 } }]
          }
        }
      }
    ]
  }
];
const displayOptions = {
  show: {
    operation: ["message"],
    resource: ["assistant"]
  }
};
const description = (0, import_n8n_workflow.updateDisplayOptions)(displayOptions, properties);
const mapChatMessageToThreadMessage = (message) => ({
  role: message._getType() === "ai" ? "assistant" : "user",
  content: message.content.toString()
});
async function execute(i) {
  const credentials = await this.getCredentials("openAiApi");
  const nodeVersion = this.getNode().typeVersion;
  const prompt = this.getNodeParameter("prompt", i);
  let input;
  if (prompt === "auto") {
    input = this.evaluateExpression('{{ $json["chatInput"] }}', i);
  } else {
    input = this.getNodeParameter("text", i);
  }
  if (input === void 0) {
    throw new import_n8n_workflow.NodeOperationError(this.getNode(), "No prompt specified", {
      description: "Expected to find the prompt in an input field called 'chatInput' (this is what the chat trigger node outputs). To use something else, change the 'Prompt' parameter"
    });
  }
  const assistantId = this.getNodeParameter("assistantId", i, "", { extractValue: true });
  const options = this.getNodeParameter("options", i, {});
  const baseURL = options.baseURL ?? credentials.url;
  const client = new import_openai.OpenAI({
    apiKey: credentials.apiKey,
    maxRetries: options.maxRetries ?? 2,
    timeout: options.timeout ?? 1e4,
    baseURL
  });
  const agent = new import_openai_assistant.OpenAIAssistantRunnable({ assistantId, client, asAgent: true });
  const tools = await (0, import_helpers.getConnectedTools)(this, nodeVersion > 1, false);
  let assistantTools;
  if (tools.length) {
    const transformedConnectedTools = tools?.map(import_utils.formatToOpenAIAssistantTool) ?? [];
    const nativeToolsParsed = [];
    assistantTools = (await client.beta.assistants.retrieve(assistantId)).tools;
    const useCodeInterpreter = assistantTools.some((tool) => tool.type === "code_interpreter");
    if (useCodeInterpreter) {
      nativeToolsParsed.push({
        type: "code_interpreter"
      });
    }
    const useRetrieval = assistantTools.some((tool) => tool.type === "file_search");
    if (useRetrieval) {
      nativeToolsParsed.push({
        type: "file_search"
      });
    }
    await client.beta.assistants.update(assistantId, {
      tools: [...nativeToolsParsed, ...transformedConnectedTools]
    });
  }
  const agentExecutor = import_agents.AgentExecutor.fromAgentAndTools({
    agent,
    tools: tools ?? []
  });
  const useMemoryConnector = nodeVersion >= 1.6 && this.getNodeParameter("memory", i) === "connector";
  const memory = useMemoryConnector || nodeVersion < 1.6 ? await this.getInputConnectionData(import_n8n_workflow.NodeConnectionTypes.AiMemory, 0) : void 0;
  const threadId = nodeVersion >= 1.6 && !useMemoryConnector ? this.getNodeParameter("threadId", i) : void 0;
  const chainValues = {
    content: input,
    signal: this.getExecutionCancelSignal(),
    timeout: options.timeout ?? 1e4
  };
  let thread;
  if (memory) {
    const chatMessages = await (0, import_utils.getChatMessages)(memory);
    if (chatMessages.length) {
      const first32Messages = chatMessages.slice(0, 32);
      const mappedMessages = first32Messages.map(mapChatMessageToThreadMessage);
      thread = await client.beta.threads.create({ messages: mappedMessages });
      const overLimitMessages = chatMessages.slice(32).map(mapChatMessageToThreadMessage);
      for (const message of overLimitMessages) {
        await client.beta.threads.messages.create(thread.id, message);
      }
      chainValues.threadId = thread.id;
    }
  } else if (threadId) {
    chainValues.threadId = threadId;
  }
  let filteredResponse = {};
  try {
    const response = await agentExecutor.withConfig((0, import_tracing.getTracingConfig)(this)).invoke(chainValues);
    if (memory) {
      await memory.saveContext({ input }, { output: response.output });
      if (response.threadId && response.runId) {
        const threadRun = await client.beta.threads.runs.retrieve(response.runId, {
          thread_id: response.threadId
        });
        response.usage = threadRun.usage;
      }
    }
    if (options.preserveOriginalTools !== false && nodeVersion >= 1.3 && (assistantTools ?? [])?.length) {
      await client.beta.assistants.update(assistantId, {
        tools: assistantTools
      });
    }
    filteredResponse = (0, import_omit.default)(response, ["signal", "timeout", "content", "runId"]);
  } catch (error) {
    if (!(error instanceof import_n8n_workflow.ApplicationError)) {
      throw new import_n8n_workflow.NodeOperationError(this.getNode(), error.message, { itemIndex: i });
    }
  }
  return [{ json: filteredResponse, pairedItem: { item: i } }];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  description,
  execute
});
//# sourceMappingURL=message.operation.js.map