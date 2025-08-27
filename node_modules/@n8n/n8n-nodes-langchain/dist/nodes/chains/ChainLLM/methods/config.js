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
var config_exports = {};
__export(config_exports, {
  getInputs: () => getInputs,
  nodeProperties: () => nodeProperties
});
module.exports = __toCommonJS(config_exports);
var import_prompts = require("@langchain/core/prompts");
var import_n8n_workflow = require("n8n-workflow");
var import_descriptions = require("../../../../utils/descriptions");
var import_sharedFields = require("../../../../utils/sharedFields");
function getInputs(parameters) {
  const inputs = [
    { displayName: "", type: "main" },
    {
      displayName: "Model",
      maxConnections: 1,
      type: "ai_languageModel",
      required: true
    }
  ];
  const needsFallback = parameters?.needsFallback;
  if (needsFallback === void 0 || needsFallback === true) {
    inputs.push({
      displayName: "Fallback Model",
      maxConnections: 1,
      type: "ai_languageModel",
      required: true
    });
  }
  const hasOutputParser = parameters?.hasOutputParser;
  if (hasOutputParser === void 0 || hasOutputParser === true) {
    inputs.push({
      displayName: "Output Parser",
      type: "ai_outputParser",
      maxConnections: 1,
      required: false
    });
  }
  return inputs;
}
const nodeProperties = [
  (0, import_sharedFields.getTemplateNoticeField)(1978),
  {
    displayName: "Prompt",
    name: "prompt",
    type: "string",
    required: true,
    default: "={{ $json.input }}",
    displayOptions: {
      show: {
        "@version": [1]
      }
    }
  },
  {
    displayName: "Prompt",
    name: "prompt",
    type: "string",
    required: true,
    default: "={{ $json.chat_input }}",
    displayOptions: {
      show: {
        "@version": [1.1, 1.2]
      }
    }
  },
  {
    displayName: "Prompt",
    name: "prompt",
    type: "string",
    required: true,
    default: "={{ $json.chatInput }}",
    displayOptions: {
      show: {
        "@version": [1.3]
      }
    }
  },
  {
    ...import_descriptions.promptTypeOptions,
    displayOptions: {
      hide: {
        "@version": [1, 1.1, 1.2, 1.3]
      }
    }
  },
  {
    ...import_descriptions.textFromPreviousNode,
    displayOptions: { show: { promptType: ["auto"], "@version": [{ _cnd: { gte: 1.5 } }] } }
  },
  {
    displayName: "Prompt (User Message)",
    name: "text",
    type: "string",
    required: true,
    default: "",
    placeholder: "e.g. Hello, how can you help me?",
    typeOptions: {
      rows: 2
    },
    displayOptions: {
      show: {
        promptType: ["define"]
      }
    }
  },
  {
    displayName: "Require Specific Output Format",
    name: "hasOutputParser",
    type: "boolean",
    default: false,
    noDataExpression: true,
    displayOptions: {
      hide: {
        "@version": [1, 1.1, 1.3]
      }
    }
  },
  {
    displayName: "Enable Fallback Model",
    name: "needsFallback",
    type: "boolean",
    default: false,
    noDataExpression: true,
    displayOptions: {
      hide: {
        "@version": [1, 1.1, 1.3]
      }
    }
  },
  {
    displayName: "Chat Messages (if Using a Chat Model)",
    name: "messages",
    type: "fixedCollection",
    typeOptions: {
      multipleValues: true
    },
    default: {},
    placeholder: "Add prompt",
    options: [
      {
        name: "messageValues",
        displayName: "Prompt",
        values: [
          {
            displayName: "Type Name or ID",
            name: "type",
            type: "options",
            options: [
              {
                name: "AI",
                value: import_prompts.AIMessagePromptTemplate.lc_name()
              },
              {
                name: "System",
                value: import_prompts.SystemMessagePromptTemplate.lc_name()
              },
              {
                name: "User",
                value: import_prompts.HumanMessagePromptTemplate.lc_name()
              }
            ],
            default: import_prompts.SystemMessagePromptTemplate.lc_name()
          },
          {
            displayName: "Message Type",
            name: "messageType",
            type: "options",
            displayOptions: {
              show: {
                type: [import_prompts.HumanMessagePromptTemplate.lc_name()]
              }
            },
            options: [
              {
                name: "Text",
                value: "text",
                description: "Simple text message"
              },
              {
                name: "Image (Binary)",
                value: "imageBinary",
                description: "Process the binary input from the previous node"
              },
              {
                name: "Image (URL)",
                value: "imageUrl",
                description: "Process the image from the specified URL"
              }
            ],
            default: "text"
          },
          {
            displayName: "Image Data Field Name",
            name: "binaryImageDataKey",
            type: "string",
            default: "data",
            required: true,
            description: "The name of the field in the chain's input that contains the binary image file to be processed",
            displayOptions: {
              show: {
                messageType: ["imageBinary"]
              }
            }
          },
          {
            displayName: "Image URL",
            name: "imageUrl",
            type: "string",
            default: "",
            required: true,
            description: "URL to the image to be processed",
            displayOptions: {
              show: {
                messageType: ["imageUrl"]
              }
            }
          },
          {
            displayName: "Image Details",
            description: "Control how the model processes the image and generates its textual understanding",
            name: "imageDetail",
            type: "options",
            displayOptions: {
              show: {
                type: [import_prompts.HumanMessagePromptTemplate.lc_name()],
                messageType: ["imageBinary", "imageUrl"]
              }
            },
            options: [
              {
                name: "Auto",
                value: "auto",
                description: "Model will use the auto setting which will look at the image input size and decide if it should use the low or high setting"
              },
              {
                name: "Low",
                value: "low",
                description: "The model will receive a low-res 512px x 512px version of the image, and represent the image with a budget of 65 tokens. This allows the API to return faster responses and consume fewer input tokens for use cases that do not require high detail."
              },
              {
                name: "High",
                value: "high",
                description: "Allows the model to see the low res image and then creates detailed crops of input images as 512px squares based on the input image size. Each of the detailed crops uses twice the token budget (65 tokens) for a total of 129 tokens."
              }
            ],
            default: "auto"
          },
          {
            displayName: "Message",
            name: "message",
            type: "string",
            required: true,
            displayOptions: {
              hide: {
                messageType: ["imageBinary", "imageUrl"]
              }
            },
            default: ""
          }
        ]
      }
    ]
  },
  (0, import_sharedFields.getBatchingOptionFields)({
    show: {
      "@version": [{ _cnd: { gte: 1.7 } }]
    }
  }),
  {
    displayName: `Connect an <a data-action='openSelectiveNodeCreator' data-action-parameter-connectiontype='${import_n8n_workflow.NodeConnectionTypes.AiOutputParser}'>output parser</a> on the canvas to specify the output format you require`,
    name: "notice",
    type: "notice",
    default: "",
    displayOptions: {
      show: {
        hasOutputParser: [true]
      }
    }
  },
  {
    displayName: "Connect an additional language model on the canvas to use it as a fallback if the main model fails",
    name: "fallbackNotice",
    type: "notice",
    default: "",
    displayOptions: {
      show: {
        needsFallback: [true]
      }
    }
  }
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getInputs,
  nodeProperties
});
//# sourceMappingURL=config.js.map