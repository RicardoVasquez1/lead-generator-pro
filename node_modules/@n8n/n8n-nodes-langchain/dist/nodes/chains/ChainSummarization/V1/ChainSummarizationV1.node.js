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
var ChainSummarizationV1_node_exports = {};
__export(ChainSummarizationV1_node_exports, {
  ChainSummarizationV1: () => ChainSummarizationV1
});
module.exports = __toCommonJS(ChainSummarizationV1_node_exports);
var import_prompts = require("@langchain/core/prompts");
var import_chains = require("langchain/chains");
var import_n8n_workflow = require("n8n-workflow");
var import_N8nBinaryLoader = require("../../../../utils/N8nBinaryLoader");
var import_N8nJsonLoader = require("../../../../utils/N8nJsonLoader");
var import_sharedFields = require("../../../../utils/sharedFields");
var import_prompt = require("../prompt");
class ChainSummarizationV1 {
  constructor(baseDescription) {
    this.description = {
      ...baseDescription,
      version: 1,
      defaults: {
        name: "Summarization Chain",
        color: "#909298"
      },
      inputs: [
        import_n8n_workflow.NodeConnectionTypes.Main,
        {
          displayName: "Model",
          maxConnections: 1,
          type: import_n8n_workflow.NodeConnectionTypes.AiLanguageModel,
          required: true
        },
        {
          displayName: "Document",
          maxConnections: 1,
          type: import_n8n_workflow.NodeConnectionTypes.AiDocument,
          required: true
        }
      ],
      outputs: [import_n8n_workflow.NodeConnectionTypes.Main],
      credentials: [],
      properties: [
        (0, import_sharedFields.getTemplateNoticeField)(1951),
        {
          displayName: "Type",
          name: "type",
          type: "options",
          description: "The type of summarization to run",
          default: "map_reduce",
          options: [
            {
              name: "Map Reduce (Recommended)",
              value: "map_reduce",
              description: "Summarize each document (or chunk) individually, then summarize those summaries"
            },
            {
              name: "Refine",
              value: "refine",
              description: "Summarize the first document (or chunk). Then update that summary based on the next document (or chunk), and repeat."
            },
            {
              name: "Stuff",
              value: "stuff",
              description: "Pass all documents (or chunks) at once. Ideal for small datasets."
            }
          ]
        },
        {
          displayName: "Options",
          name: "options",
          type: "collection",
          default: {},
          placeholder: "Add Option",
          options: [
            {
              displayName: "Final Prompt to Combine",
              name: "combineMapPrompt",
              type: "string",
              hint: "The prompt to combine individual summaries",
              displayOptions: {
                show: {
                  "/type": ["map_reduce"]
                }
              },
              default: import_prompt.DEFAULT_PROMPT_TEMPLATE,
              typeOptions: {
                rows: 6
              }
            },
            {
              displayName: "Individual Summary Prompt",
              name: "prompt",
              type: "string",
              default: import_prompt.DEFAULT_PROMPT_TEMPLATE,
              hint: "The prompt to summarize an individual document (or chunk)",
              displayOptions: {
                show: {
                  "/type": ["map_reduce"]
                }
              },
              typeOptions: {
                rows: 6
              }
            },
            {
              displayName: "Prompt",
              name: "prompt",
              type: "string",
              default: import_prompt.DEFAULT_PROMPT_TEMPLATE,
              displayOptions: {
                show: {
                  "/type": ["stuff"]
                }
              },
              typeOptions: {
                rows: 6
              }
            },
            {
              displayName: "Subsequent (Refine) Prompt",
              name: "refinePrompt",
              type: "string",
              displayOptions: {
                show: {
                  "/type": ["refine"]
                }
              },
              default: import_prompt.REFINE_PROMPT_TEMPLATE,
              hint: "The prompt to refine the summary based on the next document (or chunk)",
              typeOptions: {
                rows: 6
              }
            },
            {
              displayName: "Initial Prompt",
              name: "refineQuestionPrompt",
              type: "string",
              displayOptions: {
                show: {
                  "/type": ["refine"]
                }
              },
              default: import_prompt.DEFAULT_PROMPT_TEMPLATE,
              hint: "The prompt for the first document (or chunk)",
              typeOptions: {
                rows: 6
              }
            }
          ]
        }
      ]
    };
  }
  async execute() {
    this.logger.debug("Executing Vector Store QA Chain");
    const type = this.getNodeParameter("type", 0);
    const model = await this.getInputConnectionData(
      import_n8n_workflow.NodeConnectionTypes.AiLanguageModel,
      0
    );
    const documentInput = await this.getInputConnectionData(import_n8n_workflow.NodeConnectionTypes.AiDocument, 0);
    const options = this.getNodeParameter("options", 0, {});
    const chainArgs = {
      type
    };
    if (type === "map_reduce") {
      const mapReduceArgs = chainArgs;
      if (options.combineMapPrompt) {
        mapReduceArgs.combineMapPrompt = new import_prompts.PromptTemplate({
          template: options.combineMapPrompt,
          inputVariables: ["text"]
        });
      }
      if (options.prompt) {
        mapReduceArgs.combinePrompt = new import_prompts.PromptTemplate({
          template: options.prompt,
          inputVariables: ["text"]
        });
      }
    }
    if (type === "stuff") {
      const stuffArgs = chainArgs;
      if (options.prompt) {
        stuffArgs.prompt = new import_prompts.PromptTemplate({
          template: options.prompt,
          inputVariables: ["text"]
        });
      }
    }
    if (type === "refine") {
      const refineArgs = chainArgs;
      if (options.refinePrompt) {
        refineArgs.refinePrompt = new import_prompts.PromptTemplate({
          template: options.refinePrompt,
          inputVariables: ["existing_answer", "text"]
        });
      }
      if (options.refineQuestionPrompt) {
        refineArgs.questionPrompt = new import_prompts.PromptTemplate({
          template: options.refineQuestionPrompt,
          inputVariables: ["text"]
        });
      }
    }
    const chain = (0, import_chains.loadSummarizationChain)(model, chainArgs);
    const items = this.getInputData();
    const returnData = [];
    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      let processedDocuments;
      if (documentInput instanceof import_N8nJsonLoader.N8nJsonLoader || documentInput instanceof import_N8nBinaryLoader.N8nBinaryLoader) {
        processedDocuments = await documentInput.processItem(items[itemIndex], itemIndex);
      } else {
        processedDocuments = documentInput;
      }
      const response = await chain.call({
        input_documents: processedDocuments
      });
      returnData.push({ json: { response } });
    }
    return [returnData];
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ChainSummarizationV1
});
//# sourceMappingURL=ChainSummarizationV1.node.js.map