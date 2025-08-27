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
var descriptions_exports = {};
__export(descriptions_exports, {
  buildInputSchemaField: () => buildInputSchemaField,
  buildJsonSchemaExampleField: () => buildJsonSchemaExampleField,
  buildJsonSchemaExampleNotice: () => buildJsonSchemaExampleNotice,
  inputSchemaField: () => inputSchemaField,
  jsonSchemaExampleField: () => jsonSchemaExampleField,
  promptTypeOptions: () => promptTypeOptions,
  schemaTypeField: () => schemaTypeField,
  textFromPreviousNode: () => textFromPreviousNode,
  textInput: () => textInput,
  toolDescription: () => toolDescription
});
module.exports = __toCommonJS(descriptions_exports);
const schemaTypeField = {
  displayName: "Schema Type",
  name: "schemaType",
  type: "options",
  noDataExpression: true,
  options: [
    {
      name: "Generate From JSON Example",
      value: "fromJson",
      description: "Generate a schema from an example JSON object"
    },
    {
      name: "Define using JSON Schema",
      value: "manual",
      description: "Define the JSON schema manually"
    }
  ],
  default: "fromJson",
  description: "How to specify the schema for the function"
};
const buildJsonSchemaExampleField = (props) => ({
  displayName: "JSON Example",
  name: "jsonSchemaExample",
  type: "json",
  default: `{
	"some_input": "some_value"
}`,
  noDataExpression: true,
  typeOptions: {
    rows: 10
  },
  displayOptions: {
    show: {
      ...props?.showExtraProps,
      schemaType: ["fromJson"]
    }
  },
  description: "Example JSON object to use to generate the schema"
});
const buildJsonSchemaExampleNotice = (props) => ({
  displayName: "All properties will be required. To make them optional, use the 'JSON Schema' schema type instead",
  name: "notice",
  type: "notice",
  default: "",
  displayOptions: {
    show: {
      ...props?.showExtraProps,
      schemaType: ["fromJson"]
    }
  }
});
const jsonSchemaExampleField = buildJsonSchemaExampleField();
const buildInputSchemaField = (props) => ({
  displayName: "Input Schema",
  name: "inputSchema",
  type: "json",
  default: `{
"type": "object",
"properties": {
	"some_input": {
		"type": "string",
		"description": "Some input to the function"
		}
	}
}`,
  noDataExpression: false,
  typeOptions: {
    rows: 10
  },
  displayOptions: {
    show: {
      ...props?.showExtraProps,
      schemaType: ["manual"]
    }
  },
  description: "Schema to use for the function",
  hint: 'Use <a target="_blank" href="https://json-schema.org/">JSON Schema</a> format (<a target="_blank" href="https://json-schema.org/learn/miscellaneous-examples.html">examples</a>). $refs syntax is currently not supported.'
});
const inputSchemaField = buildInputSchemaField();
const promptTypeOptions = {
  displayName: "Source for Prompt (User Message)",
  name: "promptType",
  type: "options",
  options: [
    {
      name: "Connected Chat Trigger Node",
      value: "auto",
      description: "Looks for an input field called 'chatInput' that is coming from a directly connected Chat Trigger"
    },
    {
      name: "Define below",
      value: "define",
      description: "Use an expression to reference data in previous nodes or enter static text"
    }
  ],
  default: "auto"
};
const textInput = {
  displayName: "Prompt (User Message)",
  name: "text",
  type: "string",
  required: true,
  default: "",
  placeholder: "e.g. Hello, how can you help me?",
  typeOptions: {
    rows: 2
  }
};
const textFromPreviousNode = {
  displayName: "Prompt (User Message)",
  name: "text",
  type: "string",
  required: true,
  default: "={{ $json.chatInput }}",
  typeOptions: {
    rows: 2
  },
  disabledOptions: { show: { promptType: ["auto"] } }
};
const toolDescription = {
  displayName: "Description",
  name: "toolDescription",
  type: "string",
  default: "AI Agent that can call other tools",
  required: true,
  typeOptions: { rows: 2 },
  description: "Explain to the LLM what this tool does, a good, specific description would allow LLMs to produce expected results much more often"
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  buildInputSchemaField,
  buildJsonSchemaExampleField,
  buildJsonSchemaExampleNotice,
  inputSchemaField,
  jsonSchemaExampleField,
  promptTypeOptions,
  schemaTypeField,
  textFromPreviousNode,
  textInput,
  toolDescription
});
//# sourceMappingURL=descriptions.js.map