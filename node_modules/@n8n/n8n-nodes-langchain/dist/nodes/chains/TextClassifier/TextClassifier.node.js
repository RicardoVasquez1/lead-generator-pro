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
var TextClassifier_node_exports = {};
__export(TextClassifier_node_exports, {
  TextClassifier: () => TextClassifier
});
module.exports = __toCommonJS(TextClassifier_node_exports);
var import_output_parsers = require("langchain/output_parsers");
var import_n8n_workflow = require("n8n-workflow");
var import_zod = require("zod");
var import_sharedFields = require("../../../utils/sharedFields");
var import_processItem = require("./processItem");
const SYSTEM_PROMPT_TEMPLATE = "Please classify the text provided by the user into one of the following categories: {categories}, and use the provided formatting instructions below. Don't explain, and only output the json.";
const configuredOutputs = (parameters) => {
  const categories = parameters.categories?.categories ?? [];
  const fallback = parameters.options?.fallback;
  const ret = categories.map((cat) => {
    return { type: "main", displayName: cat.category };
  });
  if (fallback === "other") ret.push({ type: "main", displayName: "Other" });
  return ret;
};
class TextClassifier {
  constructor() {
    this.description = {
      displayName: "Text Classifier",
      name: "textClassifier",
      icon: "fa:tags",
      iconColor: "black",
      group: ["transform"],
      version: [1, 1.1],
      description: "Classify your text into distinct categories",
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Chains", "Root Nodes"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.text-classifier/"
            }
          ]
        }
      },
      defaults: {
        name: "Text Classifier"
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
      outputs: `={{(${configuredOutputs})($parameter)}}`,
      properties: [
        {
          displayName: "Text to Classify",
          name: "inputText",
          type: "string",
          required: true,
          default: "",
          description: "Use an expression to reference data in previous nodes or enter static text",
          typeOptions: {
            rows: 2
          }
        },
        {
          displayName: "Categories",
          name: "categories",
          placeholder: "Add Category",
          type: "fixedCollection",
          default: {},
          typeOptions: {
            multipleValues: true
          },
          options: [
            {
              name: "categories",
              displayName: "Categories",
              values: [
                {
                  displayName: "Category",
                  name: "category",
                  type: "string",
                  default: "",
                  description: "Category to add",
                  required: true
                },
                {
                  displayName: "Description",
                  name: "description",
                  type: "string",
                  default: "",
                  description: "Describe your category if it's not obvious"
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
              displayName: "Allow Multiple Classes To Be True",
              name: "multiClass",
              type: "boolean",
              default: false
            },
            {
              displayName: "When No Clear Match",
              name: "fallback",
              type: "options",
              default: "discard",
              description: "What to do with items that don\u2019t match the categories exactly",
              options: [
                {
                  name: "Discard Item",
                  value: "discard",
                  description: "Ignore the item and drop it from the output"
                },
                {
                  name: "Output on Extra, 'Other' Branch",
                  value: "other",
                  description: "Create a separate output branch called 'Other'"
                }
              ]
            },
            {
              displayName: "System Prompt Template",
              name: "systemPromptTemplate",
              type: "string",
              default: SYSTEM_PROMPT_TEMPLATE,
              description: "String to use directly as the system prompt template",
              typeOptions: {
                rows: 6
              }
            },
            {
              displayName: "Enable Auto-Fixing",
              name: "enableAutoFixing",
              type: "boolean",
              default: true,
              description: "Whether to enable auto-fixing (may trigger an additional LLM call if output is broken)"
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
    const batchSize = this.getNodeParameter("options.batching.batchSize", 0, 5);
    const delayBetweenBatches = this.getNodeParameter(
      "options.batching.delayBetweenBatches",
      0,
      0
    );
    const llm = await this.getInputConnectionData(
      import_n8n_workflow.NodeConnectionTypes.AiLanguageModel,
      0
    );
    const categories = this.getNodeParameter("categories.categories", 0, []);
    if (categories.length === 0) {
      throw new import_n8n_workflow.NodeOperationError(this.getNode(), "At least one category must be defined");
    }
    const options = this.getNodeParameter("options", 0, {});
    const multiClass = options?.multiClass ?? false;
    const fallback = options?.fallback ?? "discard";
    const schemaEntries = categories.map((cat) => [
      cat.category,
      import_zod.z.boolean().describe(
        `Should be true if the input has category "${cat.category}" (description: ${cat.description})`
      )
    ]);
    if (fallback === "other")
      schemaEntries.push([
        "fallback",
        import_zod.z.boolean().describe("Should be true if none of the other categories apply")
      ]);
    const schema = import_zod.z.object(Object.fromEntries(schemaEntries));
    const structuredParser = import_output_parsers.StructuredOutputParser.fromZodSchema(schema);
    const parser = options.enableAutoFixing ? import_output_parsers.OutputFixingParser.fromLLM(llm, structuredParser) : structuredParser;
    const multiClassPrompt = multiClass ? "Categories are not mutually exclusive, and multiple can be true" : "Categories are mutually exclusive, and only one can be true";
    const fallbackPrompt = {
      other: 'If no categories apply, select the "fallback" option.',
      discard: "If there is not a very fitting category, select none of the categories."
    }[fallback];
    const returnData = Array.from(
      { length: categories.length + (fallback === "other" ? 1 : 0) },
      (_) => []
    );
    if (this.getNode().typeVersion >= 1.1 && batchSize > 1) {
      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchPromises = batch.map(async (_item, batchItemIndex) => {
          const itemIndex = i + batchItemIndex;
          const item = items[itemIndex];
          return await (0, import_processItem.processItem)(
            this,
            itemIndex,
            item,
            llm,
            parser,
            categories,
            multiClassPrompt,
            fallbackPrompt
          );
        });
        const batchResults = await Promise.allSettled(batchPromises);
        batchResults.forEach((response, batchItemIndex) => {
          const index = i + batchItemIndex;
          if (response.status === "rejected") {
            const error = response.reason;
            if (this.continueOnFail()) {
              returnData[0].push({
                json: { error: error.message },
                pairedItem: { item: index }
              });
              return;
            } else {
              throw new import_n8n_workflow.NodeOperationError(this.getNode(), error.message);
            }
          } else {
            const output = response.value;
            const item = items[index];
            categories.forEach((cat, idx) => {
              if (output[cat.category]) returnData[idx].push(item);
            });
            if (fallback === "other" && output.fallback)
              returnData[returnData.length - 1].push(item);
          }
        });
        if (i + batchSize < items.length && delayBetweenBatches > 0) {
          await (0, import_n8n_workflow.sleep)(delayBetweenBatches);
        }
      }
    } else {
      for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
        const item = items[itemIndex];
        try {
          const output = await (0, import_processItem.processItem)(
            this,
            itemIndex,
            item,
            llm,
            parser,
            categories,
            multiClassPrompt,
            fallbackPrompt
          );
          categories.forEach((cat, idx) => {
            if (output[cat.category]) returnData[idx].push(item);
          });
          if (fallback === "other" && output.fallback) returnData[returnData.length - 1].push(item);
        } catch (error) {
          if (this.continueOnFail()) {
            returnData[0].push({
              json: { error: error.message },
              pairedItem: { item: itemIndex }
            });
            continue;
          }
          throw error;
        }
      }
    }
    return returnData;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TextClassifier
});
//# sourceMappingURL=TextClassifier.node.js.map