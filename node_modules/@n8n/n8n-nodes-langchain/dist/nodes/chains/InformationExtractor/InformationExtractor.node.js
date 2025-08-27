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
var InformationExtractor_node_exports = {};
__export(InformationExtractor_node_exports, {
  InformationExtractor: () => InformationExtractor
});
module.exports = __toCommonJS(InformationExtractor_node_exports);
var import_output_parsers = require("langchain/output_parsers");
var import_n8n_workflow = require("n8n-workflow");
var import_descriptions = require("../../../utils/descriptions");
var import_schemaParsing = require("../../../utils/schemaParsing");
var import_sharedFields = require("../../../utils/sharedFields");
var import_constants = require("./constants");
var import_helpers = require("./helpers");
var import_processItem = require("./processItem");
class InformationExtractor {
  constructor() {
    this.description = {
      displayName: "Information Extractor",
      name: "informationExtractor",
      icon: "fa:project-diagram",
      iconColor: "black",
      group: ["transform"],
      version: [1, 1.1, 1.2],
      defaultVersion: 1.2,
      description: "Extract information from text in a structured format",
      codex: {
        alias: ["NER", "parse", "parsing", "JSON", "data extraction", "structured"],
        categories: ["AI"],
        subcategories: {
          AI: ["Chains", "Root Nodes"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.information-extractor/"
            }
          ]
        }
      },
      defaults: {
        name: "Information Extractor"
      },
      inputs: [
        { displayName: "", type: import_n8n_workflow.NodeConnectionTypes.Main },
        {
          displayName: "Model",
          maxConnections: 1,
          type: import_n8n_workflow.NodeConnectionTypes.AiLanguageModel,
          required: true
        }
      ],
      outputs: [import_n8n_workflow.NodeConnectionTypes.Main],
      properties: [
        {
          displayName: "Text",
          name: "text",
          type: "string",
          default: "",
          description: "The text to extract information from",
          typeOptions: {
            rows: 2
          }
        },
        {
          ...import_descriptions.schemaTypeField,
          description: "How to specify the schema for the desired output",
          options: [
            {
              name: "From Attribute Descriptions",
              value: "fromAttributes",
              description: "Extract specific attributes from the text based on types and descriptions"
            },
            ...import_descriptions.schemaTypeField.options
          ],
          default: "fromAttributes"
        },
        {
          ...import_descriptions.jsonSchemaExampleField,
          default: `{
	"state": "California",
	"cities": ["Los Angeles", "San Francisco", "San Diego"]
}`
        },
        (0, import_descriptions.buildJsonSchemaExampleNotice)({
          showExtraProps: {
            "@version": [{ _cnd: { gte: 1.2 } }]
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
          displayName: "Attributes",
          name: "attributes",
          placeholder: "Add Attribute",
          type: "fixedCollection",
          default: {},
          displayOptions: {
            show: {
              schemaType: ["fromAttributes"]
            }
          },
          typeOptions: {
            multipleValues: true
          },
          options: [
            {
              name: "attributes",
              displayName: "Attribute List",
              values: [
                {
                  displayName: "Name",
                  name: "name",
                  type: "string",
                  default: "",
                  description: "Attribute to extract",
                  placeholder: "e.g. company_name",
                  required: true
                },
                {
                  displayName: "Type",
                  name: "type",
                  type: "options",
                  description: "Data type of the attribute",
                  required: true,
                  options: [
                    {
                      name: "Boolean",
                      value: "boolean"
                    },
                    {
                      name: "Date",
                      value: "date"
                    },
                    {
                      name: "Number",
                      value: "number"
                    },
                    {
                      name: "String",
                      value: "string"
                    }
                  ],
                  default: "string"
                },
                {
                  displayName: "Description",
                  name: "description",
                  type: "string",
                  default: "",
                  description: "Describe your attribute",
                  placeholder: "Add description for the attribute",
                  required: true
                },
                {
                  displayName: "Required",
                  name: "required",
                  type: "boolean",
                  default: false,
                  description: "Whether attribute is required",
                  required: true
                }
              ]
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
              displayName: "System Prompt Template",
              name: "systemPromptTemplate",
              type: "string",
              default: import_constants.SYSTEM_PROMPT_TEMPLATE,
              description: "String to use directly as the system prompt template",
              typeOptions: {
                rows: 6
              }
            },
            (0, import_sharedFields.getBatchingOptionFields)({
              show: {
                "@version": [{ _cnd: { gte: 1.1 } }]
              }
            })
          ]
        }
      ]
    };
  }
  async execute() {
    const items = this.getInputData();
    const llm = await this.getInputConnectionData(
      import_n8n_workflow.NodeConnectionTypes.AiLanguageModel,
      0
    );
    const schemaType = this.getNodeParameter("schemaType", 0, "");
    let parser;
    if (schemaType === "fromAttributes") {
      const attributes = this.getNodeParameter(
        "attributes.attributes",
        0,
        []
      );
      if (attributes.length === 0) {
        throw new import_n8n_workflow.NodeOperationError(this.getNode(), "At least one attribute must be specified");
      }
      parser = import_output_parsers.OutputFixingParser.fromLLM(
        llm,
        import_output_parsers.StructuredOutputParser.fromZodSchema((0, import_helpers.makeZodSchemaFromAttributes)(attributes))
      );
    } else {
      let jsonSchema;
      if (schemaType === "fromJson") {
        const jsonExample = this.getNodeParameter("jsonSchemaExample", 0, "");
        const jsonExampleAllFieldsRequired = this.getNode().typeVersion >= 1.2;
        jsonSchema = (0, import_schemaParsing.generateSchemaFromExample)(jsonExample, jsonExampleAllFieldsRequired);
      } else {
        const inputSchema = this.getNodeParameter("inputSchema", 0, "");
        jsonSchema = (0, import_n8n_workflow.jsonParse)(inputSchema);
      }
      const zodSchema = (0, import_schemaParsing.convertJsonSchemaToZod)(jsonSchema);
      parser = import_output_parsers.OutputFixingParser.fromLLM(llm, import_output_parsers.StructuredOutputParser.fromZodSchema(zodSchema));
    }
    const resultData = [];
    const batchSize = this.getNodeParameter("options.batching.batchSize", 0, 5);
    const delayBetweenBatches = this.getNodeParameter(
      "options.batching.delayBetweenBatches",
      0,
      0
    );
    if (this.getNode().typeVersion >= 1.1 && batchSize >= 1) {
      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchPromises = batch.map(async (_item, batchItemIndex) => {
          const itemIndex = i + batchItemIndex;
          return await (0, import_processItem.processItem)(this, itemIndex, llm, parser);
        });
        const batchResults = await Promise.allSettled(batchPromises);
        batchResults.forEach((response, index) => {
          if (response.status === "rejected") {
            const error = response.reason;
            if (this.continueOnFail()) {
              resultData.push({
                json: { error: error.message },
                pairedItem: { item: i + index }
              });
              return;
            } else {
              throw new import_n8n_workflow.NodeOperationError(this.getNode(), error.message);
            }
          }
          const output = response.value;
          resultData.push({ json: { output } });
        });
        if (i + batchSize < items.length && delayBetweenBatches > 0) {
          await (0, import_n8n_workflow.sleep)(delayBetweenBatches);
        }
      }
    } else {
      for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
        try {
          const output = await (0, import_processItem.processItem)(this, itemIndex, llm, parser);
          resultData.push({ json: { output } });
        } catch (error) {
          if (this.continueOnFail()) {
            resultData.push({ json: { error: error.message }, pairedItem: { item: itemIndex } });
            continue;
          }
          throw error;
        }
      }
    }
    return [resultData];
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InformationExtractor
});
//# sourceMappingURL=InformationExtractor.node.js.map