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
var ModelSelector_node_exports = {};
__export(ModelSelector_node_exports, {
  ModelSelector: () => ModelSelector
});
module.exports = __toCommonJS(ModelSelector_node_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_helpers = require("./helpers");
var import_N8nLlmTracing = require("../llms/N8nLlmTracing");
var import_N8nNonEstimatingTracing = require("../llms/N8nNonEstimatingTracing");
function getCallbacksArray(callbacks) {
  if (!callbacks) return [];
  if (Array.isArray(callbacks)) {
    return callbacks;
  }
  return callbacks.handlers || [];
}
class ModelSelector {
  constructor() {
    this.description = {
      displayName: "Model Selector",
      name: "modelSelector",
      icon: "fa:map-signs",
      iconColor: "green",
      defaults: {
        name: "Model Selector"
      },
      version: 1,
      group: ["transform"],
      description: "Use this node to select one of the connected models to this node based on workflow data",
      inputs: `={{
				((parameters) => {
					${import_helpers.configuredInputs.toString()};
					return configuredInputs(parameters)
				})($parameter)
			}}`,
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Language Models"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.modelselector/"
            }
          ]
        }
      },
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiLanguageModel],
      requiredInputs: 1,
      properties: [
        import_helpers.numberInputsProperty,
        {
          displayName: "Rules",
          name: "rules",
          placeholder: "Add Rule",
          type: "fixedCollection",
          typeOptions: {
            multipleValues: true,
            sortable: true
          },
          description: "Rules to map workflow data to specific models",
          default: {},
          options: [
            {
              displayName: "Rule",
              name: "rule",
              values: [
                {
                  displayName: "Model",
                  name: "modelIndex",
                  type: "options",
                  description: "Choose model input from the list",
                  default: 1,
                  required: true,
                  placeholder: "Choose model input from the list",
                  typeOptions: {
                    loadOptionsMethod: "getModels"
                  }
                },
                {
                  displayName: "Conditions",
                  name: "conditions",
                  placeholder: "Add Condition",
                  type: "filter",
                  default: {},
                  typeOptions: {
                    filter: {
                      caseSensitive: true,
                      typeValidation: "strict",
                      version: 2
                    }
                  },
                  description: "Conditions that must be met to select this model"
                }
              ]
            }
          ]
        }
      ]
    };
    this.methods = {
      loadOptions: {
        async getModels() {
          const numberInputs = this.getCurrentNodeParameter("numberInputs");
          return Array.from({ length: numberInputs ?? 2 }, (_, i) => ({
            value: i + 1,
            name: `Model ${(i + 1).toString()}`
          }));
        }
      }
    };
  }
  async supplyData(itemIndex) {
    const models = await this.getInputConnectionData(
      import_n8n_workflow.NodeConnectionTypes.AiLanguageModel,
      itemIndex
    );
    if (!models || models.length === 0) {
      throw new import_n8n_workflow.NodeOperationError(this.getNode(), "No models connected", {
        itemIndex,
        description: "No models found in input connections"
      });
    }
    models.reverse();
    const rules = this.getNodeParameter("rules.rule", itemIndex, []);
    if (!rules || rules.length === 0) {
      throw new import_n8n_workflow.NodeOperationError(this.getNode(), "No rules defined", {
        itemIndex,
        description: "At least one rule must be defined to select a model"
      });
    }
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      const modelIndex = rule.modelIndex;
      if (modelIndex <= 0 || modelIndex > models.length) {
        throw new import_n8n_workflow.NodeOperationError(this.getNode(), `Invalid model index ${modelIndex}`, {
          itemIndex,
          description: `Model index must be between 1 and ${models.length}`
        });
      }
      const conditionsMet = this.getNodeParameter(`rules.rule[${i}].conditions`, itemIndex, false, {
        extractValue: true
      });
      if (conditionsMet) {
        const selectedModel = models[modelIndex - 1];
        const originalCallbacks = getCallbacksArray(selectedModel.callbacks);
        for (const currentCallback of originalCallbacks) {
          if (currentCallback instanceof import_N8nLlmTracing.N8nLlmTracing) {
            currentCallback.setParentRunIndex(this.getNextRunIndex());
          }
        }
        const modelSelectorTracing = new import_N8nNonEstimatingTracing.N8nNonEstimatingTracing(this);
        selectedModel.callbacks = [...originalCallbacks, modelSelectorTracing];
        return {
          response: selectedModel
        };
      }
    }
    throw new import_n8n_workflow.NodeOperationError(this.getNode(), "No matching rule found", {
      itemIndex,
      description: "None of the defined rules matched the workflow data"
    });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ModelSelector
});
//# sourceMappingURL=ModelSelector.node.js.map