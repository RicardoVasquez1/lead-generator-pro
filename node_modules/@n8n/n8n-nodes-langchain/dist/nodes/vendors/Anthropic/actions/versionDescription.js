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
var versionDescription_exports = {};
__export(versionDescription_exports, {
  versionDescription: () => versionDescription
});
module.exports = __toCommonJS(versionDescription_exports);
var import_n8n_workflow = require("n8n-workflow");
var document = __toESM(require("./document"));
var file = __toESM(require("./file"));
var image = __toESM(require("./image"));
var prompt = __toESM(require("./prompt"));
var text = __toESM(require("./text"));
const versionDescription = {
  displayName: "Anthropic",
  name: "anthropic",
  icon: "file:anthropic.svg",
  group: ["transform"],
  version: 1,
  subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
  description: "Interact with Anthropic AI models",
  defaults: {
    name: "Anthropic"
  },
  usableAsTool: true,
  codex: {
    alias: ["LangChain", "document", "image", "assistant", "claude"],
    categories: ["AI"],
    subcategories: {
      AI: ["Agents", "Miscellaneous", "Root Nodes"]
    },
    resources: {
      primaryDocumentation: [
        {
          url: "https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.anthropic/"
        }
      ]
    }
  },
  inputs: `={{
		(() => {
			const resource = $parameter.resource;
	  	const operation = $parameter.operation;
			if (resource === 'text' && operation === 'message') {
				return [{ type: 'main' }, { type: 'ai_tool', displayName: 'Tools' }];
			}

			return ['main'];
		})()
	}}`,
  outputs: [import_n8n_workflow.NodeConnectionTypes.Main],
  credentials: [
    {
      name: "anthropicApi",
      required: true
    }
  ],
  properties: [
    {
      displayName: "Resource",
      name: "resource",
      type: "options",
      noDataExpression: true,
      options: [
        {
          name: "Document",
          value: "document"
        },
        {
          name: "File",
          value: "file"
        },
        {
          name: "Image",
          value: "image"
        },
        {
          name: "Prompt",
          value: "prompt"
        },
        {
          name: "Text",
          value: "text"
        }
      ],
      default: "text"
    },
    ...document.description,
    ...file.description,
    ...image.description,
    ...prompt.description,
    ...text.description
  ]
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  versionDescription
});
//# sourceMappingURL=versionDescription.js.map