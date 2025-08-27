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
var OutputParserStructured_node_exports = {};
__export(OutputParserStructured_node_exports, {
  OutputParserStructured: () => OutputParserStructured
});
module.exports = __toCommonJS(OutputParserStructured_node_exports);
var import_prompts = require("@langchain/core/prompts");
var import_n8n_workflow = require("n8n-workflow");
var import_descriptions = require("../../../utils/descriptions");
var import_N8nOutputParser = require("../../../utils/output_parsers/N8nOutputParser");
var import_schemaParsing = require("../../../utils/schemaParsing");
var import_sharedFields = require("../../../utils/sharedFields");
var import_prompt = require("./prompt");
class OutputParserStructured {
  constructor() {
    this.description = {
      displayName: "Structured Output Parser",
      name: "outputParserStructured",
      icon: "fa:code",
      iconColor: "black",
      group: ["transform"],
      version: [1, 1.1, 1.2, 1.3],
      defaultVersion: 1.3,
      description: "Return data in a defined JSON format",
      defaults: {
        name: "Structured Output Parser"
      },
      codex: {
        alias: ["json", "zod"],
        categories: ["AI"],
        subcategories: {
          AI: ["Output Parsers"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.outputparserstructured/"
            }
          ]
        }
      },
      inputs: `={{
			((parameters) => {
				if (parameters?.autoFix) {
					return [
						{ displayName: 'Model', maxConnections: 1, type: "${import_n8n_workflow.NodeConnectionTypes.AiLanguageModel}", required: true }
					];
				}

				return [];
			})($parameter)
		}}`,
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiOutputParser],
      outputNames: ["Output Parser"],
      properties: [
        (0, import_sharedFields.getConnectionHintNoticeField)([import_n8n_workflow.NodeConnectionTypes.AiChain, import_n8n_workflow.NodeConnectionTypes.AiAgent]),
        { ...import_descriptions.schemaTypeField, displayOptions: { show: { "@version": [{ _cnd: { gte: 1.2 } }] } } },
        {
          ...import_descriptions.jsonSchemaExampleField,
          default: `{
	"state": "California",
	"cities": ["Los Angeles", "San Francisco", "San Diego"]
}`
        },
        (0, import_descriptions.buildJsonSchemaExampleNotice)({
          showExtraProps: {
            "@version": [{ _cnd: { gte: 1.3 } }]
          }
        }),
        {
          ...import_descriptions.inputSchemaField,
          default: `{
	"type": "object",
	"properties": {
		"state": {
			"type": "string"
		},
		"cities": {
			"type": "array",
			"items": {
				"type": "string"
			}
		}
	}
}`
        },
        {
          displayName: "JSON Schema",
          name: "jsonSchema",
          type: "json",
          description: "JSON Schema to structure and validate the output against",
          default: `{
  "type": "object",
  "properties": {
    "state": {
      "type": "string"
    },
    "cities": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  }
}`,
          typeOptions: {
            rows: 10
          },
          required: true,
          displayOptions: {
            show: {
              "@version": [{ _cnd: { lte: 1.1 } }]
            }
          }
        },
        {
          displayName: "Auto-Fix Format",
          description: "Whether to automatically fix the output when it is not in the correct format. Will cause another LLM call.",
          name: "autoFix",
          type: "boolean",
          default: false
        },
        {
          displayName: "Customize Retry Prompt",
          name: "customizeRetryPrompt",
          type: "boolean",
          displayOptions: {
            show: {
              autoFix: [true]
            }
          },
          default: false,
          description: "Whether to customize the prompt used for retrying the output parsing. If disabled, a default prompt will be used."
        },
        {
          displayName: "Custom Prompt",
          name: "prompt",
          type: "string",
          displayOptions: {
            show: {
              autoFix: [true],
              customizeRetryPrompt: [true]
            }
          },
          default: import_prompt.NAIVE_FIX_PROMPT,
          typeOptions: {
            rows: 10
          },
          hint: 'Should include "{error}", "{instructions}", and "{completion}" placeholders',
          description: 'Prompt template used for fixing the output. Uses placeholders: "{instructions}" for parsing rules, "{completion}" for the failed attempt, and "{error}" for the validation error message.'
        }
      ],
      hints: [
        {
          message: "Fields that use $refs might have the wrong type, since this syntax is not currently supported",
          type: "warning",
          location: "outputPane",
          whenToDisplay: "afterExecution",
          displayCondition: '={{ $parameter["schemaType"] === "manual" && $parameter["inputSchema"]?.includes("$ref") }}'
        }
      ]
    };
  }
  async supplyData(itemIndex) {
    const schemaType = this.getNodeParameter("schemaType", itemIndex, "");
    const jsonExample = this.getNodeParameter("jsonSchemaExample", itemIndex, "");
    let inputSchema;
    const jsonExampleAllFieldsRequired = this.getNode().typeVersion >= 1.3;
    if (this.getNode().typeVersion <= 1.1) {
      inputSchema = this.getNodeParameter("jsonSchema", itemIndex, "");
    } else {
      inputSchema = this.getNodeParameter("inputSchema", itemIndex, "");
    }
    const jsonSchema = schemaType === "fromJson" ? (0, import_schemaParsing.generateSchemaFromExample)(jsonExample, jsonExampleAllFieldsRequired) : (0, import_n8n_workflow.jsonParse)(inputSchema);
    const zodSchema = (0, import_schemaParsing.convertJsonSchemaToZod)(jsonSchema);
    const nodeVersion = this.getNode().typeVersion;
    const autoFix = this.getNodeParameter("autoFix", itemIndex, false);
    let outputParser;
    try {
      outputParser = await import_N8nOutputParser.N8nStructuredOutputParser.fromZodJsonSchema(
        zodSchema,
        nodeVersion,
        this
      );
    } catch (error) {
      throw new import_n8n_workflow.NodeOperationError(
        this.getNode(),
        "Error during parsing of JSON Schema. Please check the schema and try again."
      );
    }
    if (!autoFix) {
      return {
        response: outputParser
      };
    }
    const model = await this.getInputConnectionData(
      import_n8n_workflow.NodeConnectionTypes.AiLanguageModel,
      itemIndex
    );
    const prompt = this.getNodeParameter("prompt", itemIndex, import_prompt.NAIVE_FIX_PROMPT);
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
  OutputParserStructured
});
//# sourceMappingURL=OutputParserStructured.node.js.map