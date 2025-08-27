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
var OpenAiAssistant_node_exports = {};
__export(OpenAiAssistant_node_exports, {
  OpenAiAssistant: () => OpenAiAssistant
});
module.exports = __toCommonJS(OpenAiAssistant_node_exports);
var import_agents = require("langchain/agents");
var import_openai_assistant = require("langchain/experimental/openai_assistant");
var import_n8n_workflow = require("n8n-workflow");
var import_openai = require("openai");
var import_helpers = require("../../../utils/helpers");
var import_tracing = require("../../../utils/tracing");
var import_utils = require("./utils");
class OpenAiAssistant {
  constructor() {
    this.description = {
      displayName: "OpenAI Assistant",
      name: "openAiAssistant",
      hidden: true,
      icon: "fa:robot",
      group: ["transform"],
      version: [1, 1.1],
      description: "Utilizes Assistant API from Open AI.",
      subtitle: "Open AI Assistant",
      defaults: {
        name: "OpenAI Assistant",
        color: "#404040"
      },
      codex: {
        alias: ["LangChain"],
        categories: ["AI"],
        subcategories: {
          AI: ["Agents", "Root Nodes"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.openaiassistant/"
            }
          ]
        }
      },
      inputs: [
        { type: import_n8n_workflow.NodeConnectionTypes.Main },
        { type: import_n8n_workflow.NodeConnectionTypes.AiTool, displayName: "Tools" }
      ],
      outputs: [import_n8n_workflow.NodeConnectionTypes.Main],
      credentials: [
        {
          name: "openAiApi",
          required: true
        }
      ],
      requestDefaults: {
        ignoreHttpStatusErrors: true,
        baseURL: '={{ $parameter.options?.baseURL?.split("/").slice(0,-1).join("/") || "https://api.openai.com" }}'
      },
      properties: [
        {
          displayName: "Operation",
          name: "mode",
          type: "options",
          noDataExpression: true,
          default: "existing",
          options: [
            {
              name: "Use New Assistant",
              value: "new"
            },
            {
              name: "Use Existing Assistant",
              value: "existing"
            }
          ]
        },
        {
          displayName: "Name",
          name: "name",
          type: "string",
          default: "",
          required: true,
          displayOptions: {
            show: {
              "/mode": ["new"]
            }
          }
        },
        {
          displayName: "Instructions",
          name: "instructions",
          type: "string",
          description: "How the Assistant and model should behave or respond",
          default: "",
          typeOptions: {
            rows: 5
          },
          displayOptions: {
            show: {
              "/mode": ["new"]
            }
          }
        },
        {
          displayName: "Model",
          name: "model",
          type: "options",
          description: 'The model which will be used to power the assistant. <a href="https://beta.openai.com/docs/models/overview">Learn more</a>. The Retrieval tool requires gpt-3.5-turbo-1106 and gpt-4-1106-preview models.',
          required: true,
          displayOptions: {
            show: {
              "/mode": ["new"]
            }
          },
          typeOptions: {
            loadOptions: {
              routing: {
                request: {
                  method: "GET",
                  url: '={{ $parameter.options?.baseURL?.split("/").slice(-1).pop() || "v1"  }}/models'
                },
                output: {
                  postReceive: [
                    {
                      type: "rootProperty",
                      properties: {
                        property: "data"
                      }
                    },
                    {
                      type: "filter",
                      properties: {
                        pass: "={{ $responseItem.id.startsWith('gpt-') && !$responseItem.id.includes('instruct') }}"
                      }
                    },
                    {
                      type: "setKeyValue",
                      properties: {
                        name: "={{$responseItem.id}}",
                        value: "={{$responseItem.id}}"
                      }
                    },
                    {
                      type: "sort",
                      properties: {
                        key: "name"
                      }
                    }
                  ]
                }
              }
            }
          },
          routing: {
            send: {
              type: "body",
              property: "model"
            }
          },
          default: "gpt-3.5-turbo-1106"
        },
        {
          displayName: "Assistant",
          name: "assistantId",
          type: "options",
          noDataExpression: true,
          displayOptions: {
            show: {
              "/mode": ["existing"]
            }
          },
          description: 'The assistant to use. <a href="https://beta.openai.com/docs/assistants/overview">Learn more</a>.',
          typeOptions: {
            loadOptions: {
              routing: {
                request: {
                  method: "GET",
                  headers: {
                    "OpenAI-Beta": "assistants=v1"
                  },
                  url: '={{ $parameter.options?.baseURL?.split("/").slice(-1).pop() || "v1"  }}/assistants'
                },
                output: {
                  postReceive: [
                    {
                      type: "rootProperty",
                      properties: {
                        property: "data"
                      }
                    },
                    {
                      type: "setKeyValue",
                      properties: {
                        name: "={{$responseItem.name}}",
                        value: "={{$responseItem.id}}",
                        description: "={{$responseItem.model}}"
                      }
                    },
                    {
                      type: "sort",
                      properties: {
                        key: "name"
                      }
                    }
                  ]
                }
              }
            }
          },
          routing: {
            send: {
              type: "body",
              property: "assistant"
            }
          },
          required: true,
          default: ""
        },
        {
          displayName: "Text",
          name: "text",
          type: "string",
          required: true,
          default: "={{ $json.chat_input }}",
          displayOptions: {
            show: {
              "@version": [1]
            }
          }
        },
        {
          displayName: "Text",
          name: "text",
          type: "string",
          required: true,
          default: "={{ $json.chatInput }}",
          displayOptions: {
            show: {
              "@version": [1.1]
            }
          }
        },
        {
          displayName: "OpenAI Tools",
          name: "nativeTools",
          type: "multiOptions",
          default: [],
          options: [
            {
              name: "Code Interpreter",
              value: "code_interpreter"
            },
            {
              name: "Knowledge Retrieval",
              value: "retrieval"
            }
          ]
        },
        {
          displayName: "Connect your own custom tools to this node on the canvas",
          name: "noticeTools",
          type: "notice",
          default: ""
        },
        {
          displayName: 'Upload files for retrieval using the <a href="https://platform.openai.com/playground" target="_blank">OpenAI website<a/>',
          name: "noticeTools",
          type: "notice",
          typeOptions: {
            noticeTheme: "info"
          },
          displayOptions: { show: { "/nativeTools": ["retrieval"] } },
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
              type: "string"
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
            }
          ]
        }
      ]
    };
  }
  async execute() {
    const nodeVersion = this.getNode().typeVersion;
    const tools = await (0, import_helpers.getConnectedTools)(this, nodeVersion > 1, false);
    const credentials = await this.getCredentials("openAiApi");
    const items = this.getInputData();
    const returnData = [];
    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      try {
        const input = this.getNodeParameter("text", itemIndex);
        const assistantId = this.getNodeParameter("assistantId", itemIndex, "");
        const nativeTools = this.getNodeParameter("nativeTools", itemIndex, []);
        const options = this.getNodeParameter("options", itemIndex, {});
        if (input === void 0) {
          throw new import_n8n_workflow.NodeOperationError(this.getNode(), "The \u2018text\u2018 parameter is empty.");
        }
        const client = new import_openai.OpenAI({
          apiKey: credentials.apiKey,
          maxRetries: options.maxRetries ?? 2,
          timeout: options.timeout ?? 1e4,
          baseURL: options.baseURL
        });
        let agent;
        const nativeToolsParsed = nativeTools.map((tool) => ({ type: tool }));
        const transformedConnectedTools = tools?.map(import_utils.formatToOpenAIAssistantTool) ?? [];
        const newTools = [...transformedConnectedTools, ...nativeToolsParsed];
        if (assistantId) {
          agent = new import_openai_assistant.OpenAIAssistantRunnable({ assistantId, client, asAgent: true });
          await client.beta.assistants.update(assistantId, {
            tools: newTools
          });
        } else {
          const name = this.getNodeParameter("name", itemIndex, "");
          const instructions = this.getNodeParameter("instructions", itemIndex, "");
          const model = this.getNodeParameter("model", itemIndex, "gpt-3.5-turbo-1106");
          agent = await import_openai_assistant.OpenAIAssistantRunnable.createAssistant({
            model,
            client,
            instructions,
            name,
            tools: newTools,
            asAgent: true
          });
        }
        const agentExecutor = import_agents.AgentExecutor.fromAgentAndTools({
          agent,
          tools
        });
        const response = await agentExecutor.withConfig((0, import_tracing.getTracingConfig)(this)).invoke({
          content: input,
          signal: this.getExecutionCancelSignal(),
          timeout: options.timeout ?? 1e4
        });
        returnData.push({ json: response });
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: error.message }, pairedItem: { item: itemIndex } });
          continue;
        }
        throw error;
      }
    }
    return [returnData];
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  OpenAiAssistant
});
//# sourceMappingURL=OpenAiAssistant.node.js.map