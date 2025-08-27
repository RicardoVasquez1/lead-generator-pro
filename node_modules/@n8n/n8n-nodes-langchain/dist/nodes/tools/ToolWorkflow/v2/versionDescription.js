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
var versionDescription_exports = {};
__export(versionDescription_exports, {
  versionDescription: () => versionDescription
});
module.exports = __toCommonJS(versionDescription_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_sharedFields = require("../../../../utils/sharedFields");
const versionDescription = {
  displayName: "Call n8n Workflow Tool",
  name: "toolWorkflow",
  group: ["transform"],
  description: "Uses another n8n workflow as a tool. Allows packaging any n8n node(s) as a tool.",
  defaults: {
    name: "Call n8n Workflow Tool"
  },
  version: [2, 2.1, 2.2],
  inputs: [],
  outputs: [import_n8n_workflow.NodeConnectionTypes.AiTool],
  outputNames: ["Tool"],
  properties: [
    (0, import_sharedFields.getConnectionHintNoticeField)([import_n8n_workflow.NodeConnectionTypes.AiAgent]),
    {
      displayName: 'See an example of a workflow to suggest meeting slots using AI <a href="/templates/1953" target="_blank">here</a>.',
      name: "noticeTemplateExample",
      type: "notice",
      default: ""
    },
    {
      displayName: "Name",
      name: "name",
      type: "string",
      default: "",
      placeholder: "e.g. My_Color_Tool",
      validateType: "string-alphanumeric",
      description: "The name of the function to be called, could contain letters, numbers, and underscores only",
      displayOptions: {
        show: {
          "@version": [{ _cnd: { lte: 2.1 } }]
        }
      }
    },
    {
      displayName: "Description",
      name: "description",
      type: "string",
      default: "",
      placeholder: "Call this tool to get a random color. The input should be a string with comma separated names of colors to exclude.",
      typeOptions: {
        rows: 3
      }
    },
    {
      displayName: "This tool will call the workflow you define below, and look in the last node for the response. The workflow needs to start with an Execute Workflow trigger",
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
          name: "Define Below",
          value: "parameter",
          description: "Pass the JSON code of a workflow"
        }
      ],
      default: "database",
      description: "Where to get the workflow to execute from"
    },
    // ----------------------------------
    //         source:database
    // ----------------------------------
    {
      displayName: "Workflow",
      name: "workflowId",
      type: "workflowSelector",
      displayOptions: {
        show: {
          source: ["database"]
        }
      },
      default: "",
      required: true
    },
    // -----------------------------------------------
    //         Resource mapper for workflow inputs
    // -----------------------------------------------
    {
      displayName: "Workflow Inputs",
      name: "workflowInputs",
      type: "resourceMapper",
      noDataExpression: true,
      default: {
        mappingMode: "defineBelow",
        value: null
      },
      required: true,
      typeOptions: {
        loadOptionsDependsOn: ["workflowId.value"],
        resourceMapper: {
          localResourceMapperMethod: "loadSubWorkflowInputs",
          valuesLabel: "Workflow Inputs",
          mode: "map",
          fieldWords: {
            singular: "workflow input",
            plural: "workflow inputs"
          },
          addAllFields: true,
          multiKeyMatch: false,
          supportAutoMap: false
        }
      },
      displayOptions: {
        show: {
          source: ["database"]
        },
        hide: {
          workflowId: [""]
        }
      }
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
      default: "\n\n\n\n\n\n\n\n\n",
      required: true,
      description: "The workflow JSON code to execute"
    }
  ]
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  versionDescription
});
//# sourceMappingURL=versionDescription.js.map