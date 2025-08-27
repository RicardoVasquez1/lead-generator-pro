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
var WorkflowToolService_exports = {};
__export(WorkflowToolService_exports, {
  WorkflowToolService: () => WorkflowToolService
});
module.exports = __toCommonJS(WorkflowToolService_exports);
var import_tools = require("@langchain/core/tools");
var import_isArray = __toESM(require("lodash/isArray"));
var import_isObject = __toESM(require("lodash/isObject"));
var manual = __toESM(require("n8n-nodes-base/dist/nodes/Set/v2/manual.mode"));
var import_GenericFunctions = require("n8n-nodes-base/dist/utils/workflowInputsResourceMapping/GenericFunctions");
var import_n8n_workflow = require("n8n-workflow");
var import_zod = require("zod");
function isNodeExecutionData(data) {
  return (0, import_isArray.default)(data) && Boolean(data.length) && (0, import_isObject.default)(data[0]) && "json" in data[0];
}
class WorkflowToolService {
  constructor(baseContext, options) {
    this.baseContext = baseContext;
    this.returnAllItems = false;
    const subWorkflowInputs = this.baseContext.getNode().parameters.workflowInputs;
    this.useSchema = (subWorkflowInputs?.schema ?? []).length > 0;
    this.returnAllItems = options?.returnAllItems ?? false;
  }
  // Creates the tool based on the provided parameters
  async createTool({
    ctx,
    name,
    description,
    itemIndex
  }) {
    const node = ctx.getNode();
    let runIndex = ctx.getNextRunIndex();
    const toolHandler = async (query, runManager) => {
      let maxTries = 1;
      if (node.retryOnFail === true) {
        maxTries = Math.min(5, Math.max(2, node.maxTries ?? 3));
      }
      let waitBetweenTries = 0;
      if (node.retryOnFail === true) {
        waitBetweenTries = Math.min(5e3, Math.max(0, node.waitBetweenTries ?? 1e3));
      }
      let lastError;
      for (let tryIndex = 0; tryIndex < maxTries; tryIndex++) {
        const localRunIndex = runIndex++;
        const context = this.baseContext.cloneWith({
          runIndex: localRunIndex,
          inputData: [[{ json: { query } }]]
        });
        const abortSignal = context.getExecutionCancelSignal?.();
        if (abortSignal?.aborted) {
          return 'There was an error: "Execution was cancelled"';
        }
        if (tryIndex !== 0) {
          lastError = void 0;
          if (waitBetweenTries !== 0) {
            try {
              await (0, import_n8n_workflow.sleepWithAbort)(waitBetweenTries, abortSignal);
            } catch (abortError) {
              return 'There was an error: "Execution was cancelled"';
            }
          }
        }
        try {
          const response = await this.runFunction(context, query, itemIndex, runManager);
          const processedResponse = this.handleToolResponse(response);
          let responseData;
          if (isNodeExecutionData(response)) {
            responseData = response;
          } else {
            const reParsedData = (0, import_n8n_workflow.jsonParse)(processedResponse, {
              fallbackValue: { response: processedResponse }
            });
            responseData = [{ json: reParsedData }];
          }
          let metadata;
          if (this.subExecutionId && this.subWorkflowId) {
            metadata = {
              subExecution: {
                executionId: this.subExecutionId,
                workflowId: this.subWorkflowId
              }
            };
          }
          void context.addOutputData(
            import_n8n_workflow.NodeConnectionTypes.AiTool,
            localRunIndex,
            [responseData],
            metadata
          );
          return processedResponse;
        } catch (error) {
          if (abortSignal?.aborted) {
            return 'There was an error: "Execution was cancelled"';
          }
          const executionError = error;
          lastError = executionError;
          const errorResponse = `There was an error: "${executionError.message}"`;
          const metadata = (0, import_n8n_workflow.parseErrorMetadata)(error);
          void context.addOutputData(
            import_n8n_workflow.NodeConnectionTypes.AiTool,
            localRunIndex,
            executionError,
            metadata
          );
          if (tryIndex === maxTries - 1) {
            return errorResponse;
          }
        }
      }
      return `There was an error: ${lastError?.message ?? "Unknown error"}`;
    };
    return this.useSchema ? await this.createStructuredTool(name, description, toolHandler) : new import_tools.DynamicTool({ name, description, func: toolHandler });
  }
  handleToolResponse(response) {
    if (typeof response === "number") {
      return response.toString();
    }
    if (isNodeExecutionData(response)) {
      return JSON.stringify(
        response.map((item) => item.json),
        null,
        2
      );
    }
    if ((0, import_isObject.default)(response)) {
      return JSON.stringify(response, null, 2);
    }
    if (typeof response !== "string") {
      throw new import_n8n_workflow.NodeOperationError(this.baseContext.getNode(), "Wrong output type returned", {
        description: `The response property should be a string, but it is an ${typeof response}`
      });
    }
    return response;
  }
  /**
   * Executes specified sub-workflow with provided inputs
   */
  async executeSubWorkflow(context, workflowInfo, items, workflowProxy, runManager) {
    let receivedData;
    try {
      receivedData = await context.executeWorkflow(workflowInfo, items, runManager?.getChild(), {
        parentExecution: {
          executionId: workflowProxy.$execution.id,
          workflowId: workflowProxy.$workflow.id
        }
      });
      this.subExecutionId = receivedData.executionId;
    } catch (error) {
      throw new import_n8n_workflow.NodeOperationError(context.getNode(), error);
    }
    let response;
    if (this.returnAllItems) {
      response = receivedData?.data?.[0]?.length ? receivedData.data[0] : void 0;
    } else {
      response = receivedData?.data?.[0]?.[0]?.json;
    }
    if (response === void 0) {
      throw new import_n8n_workflow.NodeOperationError(
        context.getNode(),
        'There was an error: "The workflow did not return a response"'
      );
    }
    return { response, subExecutionId: receivedData.executionId };
  }
  /**
   * Gets the sub-workflow info based on the source and executes it.
   * This function will be called as part of the tool execution (from the toolHandler)
   */
  async runFunction(context, query, itemIndex, runManager) {
    const source = context.getNodeParameter("source", itemIndex);
    const workflowProxy = context.getWorkflowDataProxy(0);
    const { workflowInfo } = await this.getSubWorkflowInfo(
      context,
      source,
      itemIndex,
      workflowProxy
    );
    const rawData = this.prepareRawData(context, query, itemIndex);
    const items = await this.prepareWorkflowItems(context, query, itemIndex, rawData);
    this.subWorkflowId = workflowInfo.id;
    const { response } = await this.executeSubWorkflow(
      context,
      workflowInfo,
      items,
      workflowProxy,
      runManager
    );
    return response;
  }
  /**
   * Gets the sub-workflow info based on the source (database or parameter)
   */
  async getSubWorkflowInfo(context, source, itemIndex, workflowProxy) {
    const workflowInfo = {};
    let subWorkflowId;
    if (source === "database") {
      const { value } = context.getNodeParameter(
        "workflowId",
        itemIndex,
        {}
      );
      workflowInfo.id = value;
      subWorkflowId = workflowInfo.id;
    } else if (source === "parameter") {
      const workflowJson = context.getNodeParameter("workflowJson", itemIndex);
      try {
        workflowInfo.code = JSON.parse(workflowJson);
        subWorkflowId = workflowProxy.$workflow.id;
      } catch (error) {
        throw new import_n8n_workflow.NodeOperationError(
          context.getNode(),
          `The provided workflow is not valid JSON: "${error.message}"`,
          { itemIndex }
        );
      }
    }
    return { workflowInfo, subWorkflowId };
  }
  prepareRawData(context, query, itemIndex) {
    const rawData = { query };
    const workflowFieldsJson = context.getNodeParameter("fields.values", itemIndex, [], {
      rawExpressions: true
    });
    for (const entry of workflowFieldsJson) {
      if (entry.type === "objectValue" && entry.objectValue.startsWith("=")) {
        rawData[entry.name] = entry.objectValue.replace(/^=+/, "");
      }
    }
    return rawData;
  }
  /**
   * Prepares the sub-workflow items for execution
   */
  async prepareWorkflowItems(context, query, itemIndex, rawData) {
    const options = { include: "all" };
    let jsonData = typeof query === "object" ? query : { query };
    if (this.useSchema) {
      const currentWorkflowInputs = import_GenericFunctions.getCurrentWorkflowInputData.call(context);
      jsonData = currentWorkflowInputs[itemIndex].json;
    }
    const newItem = await manual.execute.call(
      context,
      { json: jsonData },
      itemIndex,
      options,
      rawData,
      context.getNode()
    );
    return [newItem];
  }
  /**
   *  Create structured tool by parsing the sub-workflow input schema
   */
  async createStructuredTool(name, description, func) {
    const collectedArguments = await this.extractFromAIParameters();
    if (collectedArguments.length === 0) {
      return new import_tools.DynamicTool({ name, description, func });
    }
    const schema = this.createZodSchema(collectedArguments);
    return new import_tools.DynamicStructuredTool({ schema, name, description, func });
  }
  async extractFromAIParameters() {
    const collectedArguments = [];
    (0, import_n8n_workflow.traverseNodeParameters)(this.baseContext.getNode().parameters, collectedArguments);
    const uniqueArgsMap = /* @__PURE__ */ new Map();
    for (const arg of collectedArguments) {
      uniqueArgsMap.set(arg.key, arg);
    }
    return Array.from(uniqueArgsMap.values());
  }
  createZodSchema(args) {
    const schemaObj = args.reduce((acc, placeholder) => {
      acc[placeholder.key] = (0, import_n8n_workflow.generateZodSchema)(placeholder);
      return acc;
    }, {});
    return import_zod.z.object(schemaObj).required();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WorkflowToolService
});
//# sourceMappingURL=WorkflowToolService.js.map