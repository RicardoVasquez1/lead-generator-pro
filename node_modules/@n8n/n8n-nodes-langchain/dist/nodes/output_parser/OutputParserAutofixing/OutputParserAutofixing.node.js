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
var OutputParserAutofixing_node_exports = {};
__export(OutputParserAutofixing_node_exports, {
  OutputParserAutofixing: () => OutputParserAutofixing
});
module.exports = __toCommonJS(OutputParserAutofixing_node_exports);
var import_prompts = require("@langchain/core/prompts");
var import_n8n_workflow = require("n8n-workflow");
var import_N8nOutputParser = require("../../../utils/output_parsers/N8nOutputParser");
var import_sharedFields = require("../../../utils/sharedFields");
var import_prompt = require("./prompt");
class OutputParserAutofixing {
  constructor() {
    this.description = {
      displayName: "Auto-fixing Output Parser",
      name: "outputParserAutofixing",
      icon: "fa:tools",
      iconColor: "black",
      group: ["transform"],
      version: 1,
      description: "Deprecated, use structured output parser",
      defaults: {
        name: "Auto-fixing Output Parser"
      },
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Output Parsers"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.outputparserautofixing/"
            }
          ]
        }
      },
      inputs: [
        {
          displayName: "Model",
          maxConnections: 1,
          type: import_n8n_workflow.NodeConnectionTypes.AiLanguageModel,
          required: true
        },
        {
          displayName: "Output Parser",
          maxConnections: 1,
          required: true,
          type: import_n8n_workflow.NodeConnectionTypes.AiOutputParser
        }
      ],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiOutputParser],
      outputNames: ["Output Parser"],
      properties: [
        {
          displayName: "This node wraps another output parser. If the first one fails it calls an LLM to fix the format",
          name: "info",
          type: "notice",
          default: ""
        },
        (0, import_sharedFields.getConnectionHintNoticeField)([import_n8n_workflow.NodeConnectionTypes.AiChain, import_n8n_workflow.NodeConnectionTypes.AiAgent]),
        {
          displayName: "Options",
          name: "options",
          type: "collection",
          placeholder: "Add Option",
          default: {},
          options: [
            {
              displayName: "Retry Prompt",
              name: "prompt",
              type: "string",
              default: import_prompt.NAIVE_FIX_PROMPT,
              typeOptions: {
                rows: 10
              },
              hint: 'Should include "{error}", "{instructions}", and "{completion}" placeholders',
              description: 'Prompt template used for fixing the output. Uses placeholders: "{instructions}" for parsing rules, "{completion}" for the failed attempt, and "{error}" for the validation error message.'
            }
          ]
        }
      ]
    };
  }
  async supplyData(itemIndex) {
    const model = await this.getInputConnectionData(
      import_n8n_workflow.NodeConnectionTypes.AiLanguageModel,
      itemIndex
    );
    const outputParser = await this.getInputConnectionData(
      import_n8n_workflow.NodeConnectionTypes.AiOutputParser,
      itemIndex
    );
    const prompt = this.getNodeParameter("options.prompt", itemIndex, import_prompt.NAIVE_FIX_PROMPT);
    if (prompt.length === 0 || !prompt.includes("{error}")) {
      throw new import_n8n_workflow.NodeOperationError(
        this.getNode(),
        "Auto-fixing parser prompt has to contain {error} placeholder"
      );
    }
    const parser = new import_N8nOutputParser.N8nOutputFixingParser(
      this,
      model,
      outputParser,
      import_prompts.PromptTemplate.fromTemplate(prompt)
    );
    return {
      response: parser
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  OutputParserAutofixing
});
//# sourceMappingURL=OutputParserAutofixing.node.js.map