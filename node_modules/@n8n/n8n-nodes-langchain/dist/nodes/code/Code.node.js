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
var Code_node_exports = {};
__export(Code_node_exports, {
  Code: () => Code,
  vmResolver: () => vmResolver
});
module.exports = __toCommonJS(Code_node_exports);
var import_vm2 = require("@n8n/vm2");
var import_JavaScriptSandbox = require("n8n-nodes-base/dist/nodes/Code/JavaScriptSandbox");
var import_Sandbox = require("n8n-nodes-base/dist/nodes/Code/Sandbox");
var import_utils = require("n8n-nodes-base/dist/nodes/Code/utils");
var import_n8n_workflow = require("n8n-workflow");
var import_logWrapper = require("../../utils/logWrapper");
const { NODE_FUNCTION_ALLOW_BUILTIN: builtIn, NODE_FUNCTION_ALLOW_EXTERNAL: external } = process.env;
const connectorTypes = {
  [import_n8n_workflow.NodeConnectionTypes.AiChain]: "Chain",
  [import_n8n_workflow.NodeConnectionTypes.AiDocument]: "Document",
  [import_n8n_workflow.NodeConnectionTypes.AiEmbedding]: "Embedding",
  [import_n8n_workflow.NodeConnectionTypes.AiLanguageModel]: "Language Model",
  [import_n8n_workflow.NodeConnectionTypes.AiMemory]: "Memory",
  [import_n8n_workflow.NodeConnectionTypes.AiOutputParser]: "Output Parser",
  [import_n8n_workflow.NodeConnectionTypes.AiTextSplitter]: "Text Splitter",
  [import_n8n_workflow.NodeConnectionTypes.AiTool]: "Tool",
  [import_n8n_workflow.NodeConnectionTypes.AiVectorStore]: "Vector Store",
  [import_n8n_workflow.NodeConnectionTypes.Main]: "Main"
};
const defaultCodeExecute = `const { PromptTemplate } = require('@langchain/core/prompts');

const query = 'Tell me a joke';
const prompt = PromptTemplate.fromTemplate(query);

// If you are allowing more than one language model input connection (-1 or
// anything greater than 1), getInputConnectionData returns an array, so you
// will have to change the code below it to deal with that. For example, use
// llm[0] in the chain definition

const llm = await this.getInputConnectionData('ai_languageModel', 0);
let chain = prompt.pipe(llm);
const output = await chain.invoke();
return [ {json: { output } } ];`;
const defaultCodeSupplyData = `const { WikipediaQueryRun } = require( '@langchain/community/tools/wikipedia_query_run');
return new WikipediaQueryRun();`;
const langchainModules = ["langchain", "@langchain/*"];
const vmResolver = (0, import_vm2.makeResolverFromLegacyOptions)({
  external: {
    modules: external ? [...langchainModules, ...external.split(",")] : [...langchainModules],
    transitive: false
  },
  resolve(moduleName, parentDirname) {
    if (moduleName.match(/^langchain\//) ?? moduleName.match(/^@langchain\//)) {
      return require.resolve(`@n8n/n8n-nodes-langchain/node_modules/${moduleName}.cjs`, {
        paths: [parentDirname]
      });
    }
    return;
  },
  builtin: builtIn?.split(",") ?? []
});
function getSandbox(code, options) {
  const itemIndex = options?.itemIndex ?? 0;
  const node = this.getNode();
  const workflowMode = this.getMode();
  const context = import_Sandbox.getSandboxContext.call(this, itemIndex);
  context.addInputData = this.addInputData.bind(this);
  context.addOutputData = this.addOutputData.bind(this);
  context.getInputConnectionData = this.getInputConnectionData.bind(this);
  context.getInputData = this.getInputData.bind(this);
  context.getNode = this.getNode.bind(this);
  context.getExecutionCancelSignal = this.getExecutionCancelSignal.bind(this);
  context.getNodeOutputs = this.getNodeOutputs.bind(this);
  context.executeWorkflow = this.executeWorkflow.bind(this);
  context.getWorkflowDataProxy = this.getWorkflowDataProxy.bind(this);
  context.logger = this.logger;
  if (options?.addItems) {
    context.items = context.$input.all();
  }
  const sandbox = new import_JavaScriptSandbox.JavaScriptSandbox(context, code, this.helpers, {
    resolver: vmResolver
  });
  sandbox.on(
    "output",
    workflowMode === "manual" ? this.sendMessageToUI.bind(this) : (...args) => console.log(`[Workflow "${this.getWorkflow().id}"][Node "${node.name}"]`, ...args)
  );
  return sandbox;
}
class Code {
  constructor() {
    this.description = {
      displayName: "LangChain Code",
      name: "code",
      icon: "fa:code",
      iconColor: "black",
      group: ["transform"],
      version: 1,
      description: "LangChain Code Node",
      defaults: {
        name: "LangChain Code"
      },
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Miscellaneous"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.code/"
            }
          ]
        }
      },
      inputs: `={{ ((values) => { const connectorTypes = ${JSON.stringify(
        connectorTypes
      )}; return values.map(value => { return { type: value.type, required: value.required, maxConnections: value.maxConnections === -1 ? undefined : value.maxConnections, displayName: connectorTypes[value.type] !== 'Main' ? connectorTypes[value.type] : undefined } } ) })($parameter.inputs.input) }}`,
      outputs: `={{ ((values) => { const connectorTypes = ${JSON.stringify(
        connectorTypes
      )}; return values.map(value => { return { type: value.type, displayName: connectorTypes[value.type] !== 'Main' ? connectorTypes[value.type] : undefined } } ) })($parameter.outputs.output) }}`,
      properties: [
        {
          displayName: "Code",
          name: "code",
          placeholder: "Add Code",
          type: "fixedCollection",
          noDataExpression: true,
          default: {},
          options: [
            {
              name: "execute",
              displayName: "Execute",
              values: [
                {
                  displayName: "JavaScript - Execute",
                  name: "code",
                  type: "string",
                  typeOptions: {
                    editor: "jsEditor"
                  },
                  default: defaultCodeExecute,
                  hint: 'This code will only run and return data if a "Main" input & output got created.',
                  noDataExpression: true
                }
              ]
            },
            {
              name: "supplyData",
              displayName: "Supply Data",
              values: [
                {
                  displayName: "JavaScript - Supply Data",
                  name: "code",
                  type: "string",
                  typeOptions: {
                    editor: "jsEditor"
                  },
                  default: defaultCodeSupplyData,
                  hint: 'This code will only run and return data if an output got created which is not "Main".',
                  noDataExpression: true
                }
              ]
            }
          ]
        },
        // TODO: Add links to docs which provide additional information regarding functionality
        {
          displayName: "You can import LangChain and use all available functionality. Debug by using <code>console.log()</code> statements and viewing their output in the browser console.",
          name: "notice",
          type: "notice",
          default: ""
        },
        {
          displayName: "Inputs",
          name: "inputs",
          placeholder: "Add Input",
          type: "fixedCollection",
          noDataExpression: true,
          typeOptions: {
            multipleValues: true,
            sortable: true
          },
          description: "The input to add",
          default: {},
          options: [
            {
              name: "input",
              displayName: "Input",
              values: [
                {
                  displayName: "Type",
                  name: "type",
                  type: "options",
                  options: Object.keys(connectorTypes).map((key) => ({
                    name: connectorTypes[key],
                    value: key
                  })),
                  noDataExpression: true,
                  default: "",
                  required: true,
                  description: "The type of the input"
                },
                {
                  displayName: "Max Connections",
                  name: "maxConnections",
                  type: "number",
                  noDataExpression: true,
                  default: -1,
                  required: true,
                  description: "How many nodes of this type are allowed to be connected. Set it to -1 for unlimited."
                },
                {
                  displayName: "Required",
                  name: "required",
                  type: "boolean",
                  noDataExpression: true,
                  default: false,
                  required: true,
                  description: "Whether the input needs a connection"
                }
              ]
            }
          ]
        },
        {
          displayName: "Outputs",
          name: "outputs",
          placeholder: "Add Output",
          type: "fixedCollection",
          noDataExpression: true,
          typeOptions: {
            multipleValues: true,
            sortable: true
          },
          description: "The output to add",
          default: {},
          options: [
            {
              name: "output",
              displayName: "Output",
              values: [
                {
                  displayName: "Type",
                  name: "type",
                  type: "options",
                  options: Object.keys(connectorTypes).map((key) => ({
                    name: connectorTypes[key],
                    value: key
                  })),
                  noDataExpression: true,
                  default: "",
                  required: true,
                  description: "The type of the input"
                }
              ]
            }
          ]
        }
      ]
    };
  }
  async execute() {
    const itemIndex = 0;
    const code = this.getNodeParameter("code", itemIndex);
    if (!code.execute?.code) {
      throw new import_n8n_workflow.NodeOperationError(
        this.getNode(),
        `No code for "Execute" set on node "${this.getNode().name}`,
        {
          itemIndex
        }
      );
    }
    const sandbox = getSandbox.call(this, code.execute.code, { addItems: true, itemIndex });
    const outputs = this.getNodeOutputs();
    const mainOutputs = outputs.filter(
      (output) => output.type === import_n8n_workflow.NodeConnectionTypes.Main
    );
    const options = { multiOutput: mainOutputs.length !== 1 };
    let items;
    try {
      items = await sandbox.runCodeAllItems(options);
    } catch (error) {
      if (!this.continueOnFail()) throw error;
      items = [{ json: { error: error.message } }];
      if (options.multiOutput) {
        items = [items];
      }
    }
    if (mainOutputs.length === 0) {
      throw new import_n8n_workflow.NodeOperationError(
        this.getNode(),
        'The node does not have a "Main" output set. Please add one.',
        {
          itemIndex
        }
      );
    } else if (!options.multiOutput) {
      for (const item of items) {
        (0, import_utils.standardizeOutput)(item.json);
      }
      return [items];
    } else {
      items.forEach((data) => {
        for (const item of data) {
          (0, import_utils.standardizeOutput)(item.json);
        }
      });
      return items;
    }
  }
  async supplyData(itemIndex) {
    const code = this.getNodeParameter("code", itemIndex);
    if (!code.supplyData?.code) {
      throw new import_n8n_workflow.NodeOperationError(
        this.getNode(),
        `No code for "Supply Data" set on node "${this.getNode().name}`,
        {
          itemIndex
        }
      );
    }
    const sandbox = getSandbox.call(this, code.supplyData.code, { itemIndex });
    const response = await sandbox.runCode();
    return {
      response: (0, import_logWrapper.logWrapper)(response, this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Code,
  vmResolver
});
//# sourceMappingURL=Code.node.js.map