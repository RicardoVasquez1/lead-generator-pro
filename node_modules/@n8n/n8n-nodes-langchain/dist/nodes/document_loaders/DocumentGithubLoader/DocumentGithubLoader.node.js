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
var DocumentGithubLoader_node_exports = {};
__export(DocumentGithubLoader_node_exports, {
  DocumentGithubLoader: () => DocumentGithubLoader
});
module.exports = __toCommonJS(DocumentGithubLoader_node_exports);
var import_github = require("@langchain/community/document_loaders/web/github");
var import_textsplitters = require("@langchain/textsplitters");
var import_logWrapper = require("../../../utils/logWrapper");
var import_sharedFields = require("../../../utils/sharedFields");
var import_n8n_workflow = require("n8n-workflow");
function getInputs(parameters) {
  const inputs = [];
  const textSplittingMode = parameters?.textSplittingMode;
  if (!textSplittingMode || textSplittingMode === "custom") {
    inputs.push({
      displayName: "Text Splitter",
      maxConnections: 1,
      type: "ai_textSplitter",
      required: true
    });
  }
  return inputs;
}
class DocumentGithubLoader {
  constructor() {
    this.description = {
      displayName: "GitHub Document Loader",
      name: "documentGithubLoader",
      icon: "file:github.svg",
      group: ["transform"],
      version: [1, 1.1],
      defaultVersion: 1.1,
      description: "Use GitHub data as input to this chain",
      defaults: {
        name: "GitHub Document Loader"
      },
      codex: {
        categories: ["AI"],
        subcategories: {
          AI: ["Document Loaders"]
        },
        resources: {
          primaryDocumentation: [
            {
              url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.documentgithubloader/"
            }
          ]
        }
      },
      credentials: [
        {
          name: "githubApi",
          required: true
        }
      ],
      inputs: `={{ ((parameter) => { ${getInputs.toString()}; return getInputs(parameter) })($parameter) }}`,
      inputNames: ["Text Splitter"],
      outputs: [import_n8n_workflow.NodeConnectionTypes.AiDocument],
      outputNames: ["Document"],
      properties: [
        (0, import_sharedFields.getConnectionHintNoticeField)([import_n8n_workflow.NodeConnectionTypes.AiVectorStore]),
        {
          displayName: "Repository Link",
          name: "repository",
          type: "string",
          default: ""
        },
        {
          displayName: "Branch",
          name: "branch",
          type: "string",
          default: "main"
        },
        {
          displayName: "Text Splitting",
          name: "textSplittingMode",
          type: "options",
          default: "simple",
          required: true,
          noDataExpression: true,
          displayOptions: {
            show: {
              "@version": [1.1]
            }
          },
          options: [
            {
              name: "Simple",
              value: "simple",
              description: "Splits every 1000 characters with a 200 character overlap"
            },
            {
              name: "Custom",
              value: "custom",
              description: "Connect a custom text-splitting sub-node"
            }
          ]
        },
        {
          displayName: "Options",
          name: "additionalOptions",
          type: "collection",
          placeholder: "Add Option",
          default: {},
          options: [
            {
              displayName: "Recursive",
              name: "recursive",
              type: "boolean",
              default: false
            },
            {
              displayName: "Ignore Paths",
              name: "ignorePaths",
              type: "string",
              description: 'Comma-separated list of paths to ignore, e.g. "docs, src/tests',
              default: ""
            }
          ]
        }
      ]
    };
  }
  async supplyData(itemIndex) {
    this.logger.debug("Supplying data for Github Document Loader");
    const node = this.getNode();
    const repository = this.getNodeParameter("repository", itemIndex);
    const branch = this.getNodeParameter("branch", itemIndex);
    const credentials = await this.getCredentials("githubApi");
    const { ignorePaths, recursive } = this.getNodeParameter("additionalOptions", 0);
    let textSplitter;
    if (node.typeVersion === 1.1) {
      const textSplittingMode = this.getNodeParameter("textSplittingMode", itemIndex, "simple");
      if (textSplittingMode === "simple") {
        textSplitter = new import_textsplitters.RecursiveCharacterTextSplitter({ chunkSize: 1e3, chunkOverlap: 200 });
      } else if (textSplittingMode === "custom") {
        textSplitter = await this.getInputConnectionData(import_n8n_workflow.NodeConnectionTypes.AiTextSplitter, 0);
      }
    } else {
      textSplitter = await this.getInputConnectionData(import_n8n_workflow.NodeConnectionTypes.AiTextSplitter, 0);
    }
    const { index } = this.addInputData(import_n8n_workflow.NodeConnectionTypes.AiDocument, [
      [{ json: { repository, branch, ignorePaths, recursive } }]
    ]);
    const docs = new import_github.GithubRepoLoader(repository, {
      branch,
      ignorePaths: (ignorePaths ?? "").split(",").map((p) => p.trim()),
      recursive,
      accessToken: credentials.accessToken || "",
      apiUrl: credentials.server
    });
    const loadedDocs = textSplitter ? await textSplitter.splitDocuments(await docs.load()) : await docs.load();
    this.addOutputData(import_n8n_workflow.NodeConnectionTypes.AiDocument, index, [[{ json: { loadedDocs } }]]);
    return {
      response: (0, import_logWrapper.logWrapper)(loadedDocs, this)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DocumentGithubLoader
});
//# sourceMappingURL=DocumentGithubLoader.node.js.map