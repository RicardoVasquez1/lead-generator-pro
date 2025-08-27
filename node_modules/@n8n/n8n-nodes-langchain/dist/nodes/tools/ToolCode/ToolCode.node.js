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
var ToolCode_node_exports = {};
__export(ToolCode_node_exports, {
  ToolCode: () => ToolCode
});
module.exports = __toCommonJS(ToolCode_node_exports);
var import_tools = require("@langchain/core/tools");
var import_JavaScriptSandbox = require("n8n-nodes-base/dist/nodes/Code/JavaScriptSandbox");
var import_PythonSandbox = require("n8n-nodes-base/dist/nodes/Code/PythonSandbox");
var import_Sandbox = require("n8n-nodes-base/dist/nodes/Code/Sandbox");
var import_n8n_workflow = require("n8n-workflow");
var import_descriptions = require("../../../utils/descriptions");
var import_schemaParsing = require("../../../utils/schemaParsing");
var import_sharedFields = require("../../../utils/sharedFields");
const jsonSchemaExampleField = (0, import_descriptions.buildJsonSchemaExampleField)({
  showExtraProps: { specifyInputSchema: [true] }
});
const jsonSchemaExampleNotice = (0, import_descriptions.buildJsonSchemaExampleNotice)({
  showExtraProps: {
    specifyInputSchema: [true],
    "@version": [{ _cnd: { gte: 1.3 } }]
  }
});
const jsonSchemaField = (0, import_descriptions.buildInputSchemaField)({ showExtraProps: { specifyInputSchema: [true] } });
class ToolCode {
  constructor() {
    this.description = {
      displayName: "Code Tool",
      name: "toolCode",
      icon: "fa:code",
      iconColor: "black",
      group: ["transform"],
      version: [1, 1.1, 1.2, 1.3],
      description: "Write a tool in JS or Python",
      defaults: {
        name: "Code Tool"
      },
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Tools"],
          Tools: ["Recommended Tools"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolcode/"
            }
          ]
        }
      },
      inputs: [],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiTool],
      outputNames: ["Tool"],
      properties: [
        (0, import_sharedFields.getConnectionHintNoticeField)([import_n8n_workflow.NodeConnectionTypes.AiAgent]),
        {
          displayName: 'See an example of a conversational agent with custom tool written in JavaScript <a href="/templates/1963" target="_blank">here</a>.',
          name: "noticeTemplateExample",
          type: "notice",
          default: ""
        },
        {
          displayName: "Name",
          name: "name",
          type: "string",
          default: "",
          placeholder: "My_Tool",
          displayOptions: {
            show: {
              "@version": [1]
            }
          }
        },
        {
          displayName: "Name",
          name: "name",
          type: "string",
          default: "",
          placeholder: "e.g. My_Tool",
          validateType: "string-alphanumeric",
          description: "The name of the function to be called, could contain letters, numbers, and underscores only",
          displayOptions: {
            show: {
              "@version": [1.1]
            }
          }
        },
        {
          displayName: "Description",
          name: "description",
          type: "string",
          default: "",
          placeholder: "Call this tool to get a random color. The input should be a string with comma separted names of colors to exclude.",
          typeOptions: {
            rows: 3
          }
        },
        {
          displayName: "Language",
          name: "language",
          type: "options",
          noDataExpression: true,
          options: [
            {
              name: "JavaScript",
              value: "javaScript"
            },
            {
              name: "Python (Beta)",
              value: "python"
            }
          ],
          default: "javaScript"
        },
        {
          displayName: "JavaScript",
          name: "jsCode",
          type: "string",
          displayOptions: {
            show: {
              language: ["javaScript"]
            }
          },
          typeOptions: {
            editor: "jsEditor"
          },
          default: "// Example: convert the incoming query to uppercase and return it\nreturn query.toUpperCase()",
          // TODO: Add proper text here later
          hint: 'You can access the input the tool receives via the input property "query". The returned value should be a single string.',
          // eslint-disable-next-line n8n-nodes-base/node-param-description-missing-final-period
          description: "E.g. Converts any text to uppercase",
          noDataExpression: true
        },
        {
          displayName: "Python",
          name: "pythonCode",
          type: "string",
          displayOptions: {
            show: {
              language: ["python"]
            }
          },
          typeOptions: {
            editor: "codeNodeEditor",
            // TODO: create a separate `pythonEditor` component
            editorLanguage: "python"
          },
          default: "# Example: convert the incoming query to uppercase and return it\nreturn query.upper()",
          // TODO: Add proper text here later
          hint: 'You can access the input the tool receives via the input property "query". The returned value should be a single string.',
          // eslint-disable-next-line n8n-nodes-base/node-param-description-missing-final-period
          description: "E.g. Converts any text to uppercase",
          noDataExpression: true
        },
        {
          displayName: "Specify Input Schema",
          name: "specifyInputSchema",
          type: "boolean",
          description: "Whether to specify the schema for the function. This would require the LLM to provide the input in the correct format and would validate it against the schema.",
          noDataExpression: true,
          default: false
        },
        { ...import_descriptions.schemaTypeField, displayOptions: { show: { specifyInputSchema: [true] } } },
        jsonSchemaExampleField,
        jsonSchemaExampleNotice,
        jsonSchemaField
      ]
    };
  }
  async supplyData(itemIndex) {
    const node = this.getNode();
    const workflowMode = this.getMode();
    const { typeVersion } = node;
    const name = typeVersion <= 1.1 ? this.getNodeParameter("name", itemIndex) : (0, import_n8n_workflow.nodeNameToToolName)(node);
    const description = this.getNodeParameter("description", itemIndex);
    const useSchema = this.getNodeParameter("specifyInputSchema", itemIndex);
    const language = this.getNodeParameter("language", itemIndex);
    let code = "";
    if (language === "javaScript") {
      code = this.getNodeParameter("jsCode", itemIndex);
    } else {
      code = this.getNodeParameter("pythonCode", itemIndex);
    }
    const getSandbox = (query, index = 0) => {
      const context = import_Sandbox.getSandboxContext.call(this, index);
      context.query = query;
      let sandbox;
      if (language === "javaScript") {
        sandbox = new import_JavaScriptSandbox.JavaScriptSandbox(context, code, this.helpers);
      } else {
        sandbox = new import_PythonSandbox.PythonSandbox(context, code, this.helpers);
      }
      sandbox.on(
        "output",
        workflowMode === "manual" ? this.sendMessageToUI.bind(this) : (...args) => console.log(`[Workflow "${this.getWorkflow().id}"][Node "${node.name}"]`, ...args)
      );
      return sandbox;
    };
    const runFunction = async (query) => {
      const sandbox = getSandbox(query, itemIndex);
      return await sandbox.runCode();
    };
    const toolHandler = async (query) => {
      const { index } = this.addInputData(import_n8n_workflow.NodeConnectionTypes.AiTool, [[{ json: { query } }]]);
      let response = "";
      let executionError;
      try {
        response = await runFunction(query);
      } catch (error) {
        executionError = new import_n8n_workflow.NodeOperationError(this.getNode(), error);
        response = `There was an error: "${executionError.message}"`;
      }
      if (typeof response === "number") {
        response = response.toString();
      }
      if (typeof response !== "string") {
        executionError = new import_n8n_workflow.NodeOperationError(this.getNode(), "Wrong output type returned", {
          description: `The response property should be a string, but it is an ${typeof response}`
        });
        response = `There was an error: "${executionError.message}"`;
      }
      if (executionError) {
        void this.addOutputData(import_n8n_workflow.NodeConnectionTypes.AiTool, index, executionError);
      } else {
        void this.addOutputData(import_n8n_workflow.NodeConnectionTypes.AiTool, index, [[{ json: { response } }]]);
      }
      return response;
    };
    const commonToolOptions = {
      name,
      description,
      func: toolHandler
    };
    let tool = void 0;
    if (useSchema) {
      try {
        const jsonExample = this.getNodeParameter("jsonSchemaExample", itemIndex, "");
        const inputSchema = this.getNodeParameter("inputSchema", itemIndex, "");
        const schemaType = this.getNodeParameter("schemaType", itemIndex);
        const jsonSchema = schemaType === "fromJson" ? (0, import_schemaParsing.generateSchemaFromExample)(jsonExample, this.getNode().typeVersion >= 1.3) : (0, import_n8n_workflow.jsonParse)(inputSchema);
        const zodSchema = (0, import_schemaParsing.convertJsonSchemaToZod)(jsonSchema);
        tool = new import_tools.DynamicStructuredTool({
          schema: zodSchema,
          ...commonToolOptions
        });
      } catch (error) {
        throw new import_n8n_workflow.NodeOperationError(
          this.getNode(),
          "Error during parsing of JSON Schema. \n " + error
        );
      }
    } else {
      tool = new import_tools.DynamicTool(commonToolOptions);
    }
    return {
      response: tool
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ToolCode
});
//# sourceMappingURL=ToolCode.node.js.map