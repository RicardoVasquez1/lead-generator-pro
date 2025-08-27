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
var ToolWorkflowV1_node_exports = {};
__export(ToolWorkflowV1_node_exports, {
  ToolWorkflowV1: () => ToolWorkflowV1
});
module.exports = __toCommonJS(ToolWorkflowV1_node_exports);
var import_tools = require("@langchain/core/tools");
var import_get = __toESM(require("lodash/get"));
var import_isObject = __toESM(require("lodash/isObject"));
var manual = __toESM(require("n8n-nodes-base/dist/nodes/Set/v2/manual.mode"));
var import_n8n_workflow = require("n8n-workflow");
var import_versionDescription = require("./versionDescription");
var import_schemaParsing = require("../../../../utils/schemaParsing");
class ToolWorkflowV1 {
  constructor(baseDescription) {
    this.description = {
      ...baseDescription,
      ...import_versionDescription.versionDescription
    };
  }
  async supplyData(itemIndex) {
    const workflowProxy = this.getWorkflowDataProxy(0);
    const name = this.getNodeParameter("name", itemIndex);
    const description = this.getNodeParameter("description", itemIndex);
    let subExecutionId;
    let subWorkflowId;
    const useSchema = this.getNodeParameter("specifyInputSchema", itemIndex);
    let tool = void 0;
    const runFunction = async (query, runManager) => {
      const source = this.getNodeParameter("source", itemIndex);
      const workflowInfo = {};
      if (source === "database") {
        const nodeVersion = this.getNode().typeVersion;
        if (nodeVersion <= 1.1) {
          workflowInfo.id = this.getNodeParameter("workflowId", itemIndex);
        } else {
          const { value } = this.getNodeParameter(
            "workflowId",
            itemIndex,
            {}
          );
          workflowInfo.id = value;
        }
        subWorkflowId = workflowInfo.id;
      } else if (source === "parameter") {
        const workflowJson = this.getNodeParameter("workflowJson", itemIndex);
        try {
          workflowInfo.code = JSON.parse(workflowJson);
          subWorkflowId = workflowProxy.$workflow.id;
        } catch (error) {
          throw new import_n8n_workflow.NodeOperationError(
            this.getNode(),
            `The provided workflow is not valid JSON: "${error.message}"`,
            {
              itemIndex
            }
          );
        }
      }
      const rawData = { query };
      const workflowFieldsJson = this.getNodeParameter("fields.values", itemIndex, [], {
        rawExpressions: true
      });
      for (const entry of workflowFieldsJson) {
        if (entry.type === "objectValue" && entry.objectValue.startsWith("=")) {
          rawData[entry.name] = entry.objectValue.replace(/^=+/, "");
        }
      }
      const options = {
        include: "all"
      };
      const newItem = await manual.execute.call(
        this,
        { json: { query } },
        itemIndex,
        options,
        rawData,
        this.getNode()
      );
      const items = [newItem];
      let receivedData;
      try {
        receivedData = await this.executeWorkflow(workflowInfo, items, runManager?.getChild(), {
          parentExecution: {
            executionId: workflowProxy.$execution.id,
            workflowId: workflowProxy.$workflow.id
          }
        });
        subExecutionId = receivedData.executionId;
      } catch (error) {
        throw new import_n8n_workflow.NodeOperationError(this.getNode(), error);
      }
      const response = (0, import_get.default)(receivedData, "data[0][0].json");
      if (response === void 0) {
        throw new import_n8n_workflow.NodeOperationError(
          this.getNode(),
          'There was an error: "The workflow did not return a response"'
        );
      }
      return response;
    };
    const toolHandler = async (query, runManager) => {
      const { index } = this.addInputData(import_n8n_workflow.NodeConnectionTypes.AiTool, [[{ json: { query } }]]);
      let response = "";
      let executionError;
      try {
        response = await runFunction(query, runManager);
      } catch (error) {
        executionError = error;
        response = `There was an error: "${error.message}"`;
      }
      if (typeof response === "number") {
        response = response.toString();
      }
      if ((0, import_isObject.default)(response)) {
        response = JSON.stringify(response, null, 2);
      }
      if (typeof response !== "string") {
        executionError = new import_n8n_workflow.NodeOperationError(this.getNode(), "Wrong output type returned", {
          description: `The response property should be a string, but it is an ${typeof response}`
        });
        response = `There was an error: "${executionError.message}"`;
      }
      let metadata;
      if (subExecutionId && subWorkflowId) {
        metadata = {
          subExecution: {
            executionId: subExecutionId,
            workflowId: subWorkflowId
          }
        };
      }
      if (executionError) {
        void this.addOutputData(import_n8n_workflow.NodeConnectionTypes.AiTool, index, executionError, metadata);
      } else {
        const json = (0, import_n8n_workflow.jsonParse)(response, { fallbackValue: { response } });
        void this.addOutputData(import_n8n_workflow.NodeConnectionTypes.AiTool, index, [[{ json }]], metadata);
      }
      return response;
    };
    const functionBase = {
      name,
      description,
      func: toolHandler
    };
    if (useSchema) {
      try {
        const jsonExample = this.getNodeParameter("jsonSchemaExample", itemIndex, "");
        const inputSchema = this.getNodeParameter("inputSchema", itemIndex, "");
        const schemaType = this.getNodeParameter("schemaType", itemIndex);
        const jsonSchema = schemaType === "fromJson" ? (0, import_schemaParsing.generateSchemaFromExample)(jsonExample) : (0, import_n8n_workflow.jsonParse)(inputSchema);
        const zodSchema = (0, import_schemaParsing.convertJsonSchemaToZod)(jsonSchema);
        tool = new import_tools.DynamicStructuredTool({
          schema: zodSchema,
          ...functionBase
        });
      } catch (error) {
        throw new import_n8n_workflow.NodeOperationError(
          this.getNode(),
          "Error during parsing of JSON Schema. \n " + error
        );
      }
    } else {
      tool = new import_tools.DynamicTool(functionBase);
    }
    return {
      response: tool
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ToolWorkflowV1
});
//# sourceMappingURL=ToolWorkflowV1.node.js.map