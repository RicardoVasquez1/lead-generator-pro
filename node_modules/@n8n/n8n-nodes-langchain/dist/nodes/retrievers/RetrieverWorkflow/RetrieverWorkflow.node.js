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
var RetrieverWorkflow_node_exports = {};
__export(RetrieverWorkflow_node_exports, {
  RetrieverWorkflow: () => RetrieverWorkflow
});
module.exports = __toCommonJS(RetrieverWorkflow_node_exports);
var import_documents = require("@langchain/core/documents");
var import_retrievers = require("@langchain/core/retrievers");
var manual = __toESM(require("n8n-nodes-base/dist/nodes/Set/v2/manual.mode"));
var import_n8n_workflow = require("n8n-workflow");
var import_logWrapper = require("../../../utils/logWrapper");
function objectToString(obj, level = 0) {
  let result = "";
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === "object" && value !== null) {
      result += `${"  ".repeat(level)}- "${key}":
${objectToString(
        value,
        level + 1
      )}`;
    } else {
      result += `${"  ".repeat(level)}- "${key}": "${value}"
`;
    }
  }
  return result;
}
class RetrieverWorkflow {
  constructor() {
    this.description = {
      displayName: "Workflow Retriever",
      name: "retrieverWorkflow",
      icon: "fa:box-open",
      iconColor: "black",
      group: ["transform"],
      version: [1, 1.1],
      description: "Use an n8n Workflow as Retriever",
      defaults: {
        name: "Workflow Retriever"
      },
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Retrievers"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.retrieverworkflow/"
            }
          ]
        }
      },
      inputs: [],
      outputs: [
        {
          displayName: "Retriever",
          maxConnections: 1,
          type: import_n8n_workflow.NodeConnectionTypes.AiRetriever
        }
      ],
      properties: [
        {
          displayName: 'The workflow will receive "query" as input and the output of the last node will be returned and converted to Documents',
          name: "executeNotice",
          type: "notice",
          default: ""
        },
        {
          displayName: "Source",
          name: "source",
          type: "options",
          options: [
            {
              name: "Database",
              value: "database",
              description: "Load the workflow from the database by ID"
            },
            {
              name: "Parameter",
              value: "parameter",
              description: "Load the workflow from a parameter"
            }
          ],
          default: "database",
          description: "Where to get the workflow to execute from"
        },
        // ----------------------------------
        //         source:database
        // ----------------------------------
        {
          displayName: "Workflow ID",
          name: "workflowId",
          type: "string",
          displayOptions: {
            show: {
              source: ["database"],
              "@version": [{ _cnd: { eq: 1 } }]
            }
          },
          default: "",
          required: true,
          description: "The workflow to execute"
        },
        {
          displayName: "Workflow",
          name: "workflowId",
          type: "workflowSelector",
          displayOptions: {
            show: {
              source: ["database"],
              "@version": [{ _cnd: { gte: 1.1 } }]
            }
          },
          default: "",
          required: true
        },
        // ----------------------------------
        //         source:parameter
        // ----------------------------------
        {
          displayName: "Workflow JSON",
          name: "workflowJson",
          type: "json",
          typeOptions: {
            rows: 10
          },
          displayOptions: {
            show: {
              source: ["parameter"]
            }
          },
          default: "\n\n\n",
          required: true,
          description: "The workflow JSON code to execute"
        },
        // ----------------------------------
        //         For all
        // ----------------------------------
        {
          displayName: "Workflow Values",
          name: "fields",
          placeholder: "Add Value",
          type: "fixedCollection",
          description: "Set the values which should be made available in the workflow",
          typeOptions: {
            multipleValues: true,
            sortable: true
          },
          default: {},
          options: [
            {
              name: "values",
              displayName: "Values",
              values: [
                {
                  displayName: "Name",
                  name: "name",
                  type: "string",
                  default: "",
                  placeholder: "e.g. fieldName",
                  description: "Name of the field to set the value of. Supports dot-notation. Example: data.person[0].name.",
                  requiresDataPath: "single"
                },
                {
                  displayName: "Type",
                  name: "type",
                  type: "options",
                  description: "The field value type",
                  // eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
                  options: [
                    {
                      name: "String",
                      value: "stringValue"
                    },
                    {
                      name: "Number",
                      value: "numberValue"
                    },
                    {
                      name: "Boolean",
                      value: "booleanValue"
                    },
                    {
                      name: "Array",
                      value: "arrayValue"
                    },
                    {
                      name: "Object",
                      value: "objectValue"
                    }
                  ],
                  default: "stringValue"
                },
                {
                  displayName: "Value",
                  name: "stringValue",
                  type: "string",
                  default: "",
                  displayOptions: {
                    show: {
                      type: ["stringValue"]
                    }
                  },
                  validateType: "string",
                  ignoreValidationDuringExecution: true
                },
                {
                  displayName: "Value",
                  name: "numberValue",
                  type: "string",
                  default: "",
                  displayOptions: {
                    show: {
                      type: ["numberValue"]
                    }
                  },
                  validateType: "number",
                  ignoreValidationDuringExecution: true
                },
                {
                  displayName: "Value",
                  name: "booleanValue",
                  type: "options",
                  default: "true",
                  options: [
                    {
                      name: "True",
                      value: "true"
                    },
                    {
                      name: "False",
                      value: "false"
                    }
                  ],
                  displayOptions: {
                    show: {
                      type: ["booleanValue"]
                    }
                  },
                  validateType: "boolean",
                  ignoreValidationDuringExecution: true
                },
                {
                  displayName: "Value",
                  name: "arrayValue",
                  type: "string",
                  default: "",
                  placeholder: "e.g. [ arrayItem1, arrayItem2, arrayItem3 ]",
                  displayOptions: {
                    show: {
                      type: ["arrayValue"]
                    }
                  },
                  validateType: "array",
                  ignoreValidationDuringExecution: true
                },
                {
                  displayName: "Value",
                  name: "objectValue",
                  type: "json",
                  default: "={}",
                  typeOptions: {
                    rows: 2
                  },
                  displayOptions: {
                    show: {
                      type: ["objectValue"]
                    }
                  },
                  validateType: "object",
                  ignoreValidationDuringExecution: true
                }
              ]
            }
          ]
        }
      ]
    };
  }
  async supplyData(itemIndex) {
    const workflowProxy = this.getWorkflowDataProxy(0);
    class WorkflowRetriever extends import_retrievers.BaseRetriever {
      constructor(executeFunctions, fields) {
        super(fields);
        this.executeFunctions = executeFunctions;
        this.lc_namespace = ["n8n-nodes-langchain", "retrievers", "workflow"];
      }
      async _getRelevantDocuments(query, config) {
        const source = this.executeFunctions.getNodeParameter("source", itemIndex);
        const baseMetadata = {
          source: "workflow",
          workflowSource: source
        };
        const workflowInfo = {};
        if (source === "database") {
          const nodeVersion = this.executeFunctions.getNode().typeVersion;
          if (nodeVersion === 1) {
            workflowInfo.id = this.executeFunctions.getNodeParameter(
              "workflowId",
              itemIndex
            );
          } else {
            const { value } = this.executeFunctions.getNodeParameter(
              "workflowId",
              itemIndex,
              {}
            );
            workflowInfo.id = value;
          }
          baseMetadata.workflowId = workflowInfo.id;
        } else if (source === "parameter") {
          const workflowJson = this.executeFunctions.getNodeParameter(
            "workflowJson",
            itemIndex
          );
          try {
            workflowInfo.code = JSON.parse(workflowJson);
          } catch (error) {
            throw new import_n8n_workflow.NodeOperationError(
              this.executeFunctions.getNode(),
              `The provided workflow is not valid JSON: "${error.message}"`,
              {
                itemIndex
              }
            );
          }
          baseMetadata.workflowId = workflowProxy.$workflow.id;
        }
        const rawData = { query };
        const workflowFieldsJson = this.executeFunctions.getNodeParameter(
          "fields.values",
          itemIndex,
          [],
          {
            rawExpressions: true
          }
        );
        for (const entry of workflowFieldsJson) {
          if (entry.type === "objectValue" && entry.objectValue.startsWith("=")) {
            rawData[entry.name] = entry.objectValue.replace(/^=+/, "");
          }
        }
        const options = {
          include: "all"
        };
        const newItem = await manual.execute.call(
          this.executeFunctions,
          { json: { query } },
          itemIndex,
          options,
          rawData,
          this.executeFunctions.getNode()
        );
        const items = [newItem];
        let receivedData;
        try {
          receivedData = await this.executeFunctions.executeWorkflow(
            workflowInfo,
            items,
            config?.getChild(),
            {
              parentExecution: {
                executionId: workflowProxy.$execution.id,
                workflowId: workflowProxy.$workflow.id
              }
            }
          );
        } catch (error) {
          throw new import_n8n_workflow.NodeOperationError(this.executeFunctions.getNode(), error);
        }
        const receivedItems = receivedData.data?.[0] ?? [];
        const returnData = [];
        for (const [index, itemData] of receivedItems.entries()) {
          const pageContent = objectToString(itemData.json);
          returnData.push(
            new import_documents.Document({
              pageContent: `### ${index + 1}. Context data:
${pageContent}`,
              metadata: {
                ...baseMetadata,
                itemIndex: index,
                executionId: receivedData.executionId
              }
            })
          );
        }
        return returnData;
      }
    }
    const retriever = new WorkflowRetriever(this, {});
    return {
      response: (0, import_logWrapper.logWrapper)(retriever, this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RetrieverWorkflow
});
//# sourceMappingURL=RetrieverWorkflow.node.js.map