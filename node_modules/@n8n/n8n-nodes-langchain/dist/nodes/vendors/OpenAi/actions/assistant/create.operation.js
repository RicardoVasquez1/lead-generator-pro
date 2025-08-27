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
var create_operation_exports = {};
__export(create_operation_exports, {
  description: () => description,
  execute: () => execute
});
module.exports = __toCommonJS(create_operation_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_transport = require("../../transport");
var import_descriptions = require("../descriptions");
const properties = [
  (0, import_descriptions.modelRLC)("modelSearch"),
  {
    displayName: "Name",
    name: "name",
    type: "string",
    default: "",
    description: "The name of the assistant. The maximum length is 256 characters.",
    placeholder: "e.g. My Assistant",
    required: true
  },
  {
    displayName: "Description",
    name: "description",
    type: "string",
    default: "",
    description: "The description of the assistant. The maximum length is 512 characters.",
    placeholder: "e.g. My personal assistant"
  },
  {
    displayName: "Instructions",
    name: "instructions",
    type: "string",
    description: "The system instructions that the assistant uses. The maximum length is 32768 characters.",
    default: "",
    typeOptions: {
      rows: 2
    }
  },
  {
    displayName: "Code Interpreter",
    name: "codeInterpreter",
    type: "boolean",
    default: false,
    description: 'Whether to enable the code interpreter that allows the assistants to write and run Python code in a sandboxed execution environment, find more <a href="https://platform.openai.com/docs/assistants/tools/code-interpreter" target="_blank">here</a>'
  },
  {
    displayName: "Knowledge Retrieval",
    name: "knowledgeRetrieval",
    type: "boolean",
    default: false,
    description: 'Whether to augments the assistant with knowledge from outside its model, such as proprietary product information or documents, find more <a href="https://platform.openai.com/docs/assistants/tools/knowledge-retrieval" target="_blank">here</a>'
  },
  //we want to display Files selector only when codeInterpreter true or knowledgeRetrieval true or both
  {
    // eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-multi-options
    displayName: "Files",
    name: "file_ids",
    type: "multiOptions",
    // eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-multi-options
    description: "The files to be used by the assistant, there can be a maximum of 20 files attached to the assistant. You can use expression to pass file IDs as an array or comma-separated string.",
    typeOptions: {
      loadOptionsMethod: "getFiles"
    },
    default: [],
    hint: "Add more files by using the 'Upload a File' operation",
    displayOptions: {
      show: {
        codeInterpreter: [true]
      },
      hide: {
        knowledgeRetrieval: [true]
      }
    }
  },
  {
    // eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-multi-options
    displayName: "Files",
    name: "file_ids",
    type: "multiOptions",
    // eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-multi-options
    description: "The files to be used by the assistant, there can be a maximum of 20 files attached to the assistant",
    typeOptions: {
      loadOptionsMethod: "getFiles"
    },
    default: [],
    hint: "Add more files by using the 'Upload a File' operation",
    displayOptions: {
      show: {
        knowledgeRetrieval: [true]
      },
      hide: {
        codeInterpreter: [true]
      }
    }
  },
  {
    // eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-multi-options
    displayName: "Files",
    name: "file_ids",
    type: "multiOptions",
    // eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-multi-options
    description: "The files to be used by the assistant, there can be a maximum of 20 files attached to the assistant",
    typeOptions: {
      loadOptionsMethod: "getFiles"
    },
    default: [],
    hint: "Add more files by using the 'Upload a File' operation",
    displayOptions: {
      show: {
        knowledgeRetrieval: [true],
        codeInterpreter: [true]
      }
    }
  },
  {
    displayName: "Add custom n8n tools when you <i>message</i> your assistant (rather than when creating it)",
    name: "noticeTools",
    type: "notice",
    default: ""
  },
  {
    displayName: "Options",
    name: "options",
    placeholder: "Add Option",
    type: "collection",
    default: {},
    options: [
      {
        displayName: "Output Randomness (Temperature)",
        name: "temperature",
        default: 1,
        typeOptions: { maxValue: 1, minValue: 0, numberPrecision: 1 },
        description: "Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive. We generally recommend altering this or temperature but not both.",
        type: "number"
      },
      {
        displayName: "Output Randomness (Top P)",
        name: "topP",
        default: 1,
        typeOptions: { maxValue: 1, minValue: 0, numberPrecision: 1 },
        description: "An alternative to sampling with temperature, controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered. We generally recommend altering this or temperature but not both.",
        type: "number"
      },
      {
        displayName: "Fail if Assistant Already Exists",
        name: "failIfExists",
        type: "boolean",
        default: false,
        description: "Whether to fail an operation if the assistant with the same name already exists"
      }
    ]
  }
];
const displayOptions = {
  show: {
    operation: ["create"],
    resource: ["assistant"]
  }
};
const description = (0, import_n8n_workflow.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
  const model = this.getNodeParameter("modelId", i, "", { extractValue: true });
  const name = this.getNodeParameter("name", i);
  const assistantDescription = this.getNodeParameter("description", i);
  const instructions = this.getNodeParameter("instructions", i);
  const codeInterpreter = this.getNodeParameter("codeInterpreter", i);
  const knowledgeRetrieval = this.getNodeParameter("knowledgeRetrieval", i);
  let file_ids = this.getNodeParameter("file_ids", i, []);
  if (typeof file_ids === "string") {
    file_ids = file_ids.split(",").map((file_id) => file_id.trim());
  }
  const options = this.getNodeParameter("options", i, {});
  if (options.failIfExists) {
    const assistants = [];
    let has_more = true;
    let after;
    do {
      const response2 = await import_transport.apiRequest.call(this, "GET", "/assistants", {
        headers: {
          "OpenAI-Beta": "assistants=v2"
        },
        qs: {
          limit: 100,
          after
        }
      });
      for (const assistant of response2.data || []) {
        assistants.push(assistant.name);
      }
      has_more = response2.has_more;
      if (has_more) {
        after = response2.last_id;
      } else {
        break;
      }
    } while (has_more);
    if (assistants.includes(name)) {
      throw new import_n8n_workflow.NodeOperationError(
        this.getNode(),
        `An assistant with the same name '${name}' already exists`,
        { itemIndex: i }
      );
    }
  }
  if (file_ids.length > 20) {
    throw new import_n8n_workflow.NodeOperationError(
      this.getNode(),
      "The maximum number of files that can be attached to the assistant is 20",
      { itemIndex: i }
    );
  }
  const body = {
    model,
    name,
    description: assistantDescription,
    instructions
  };
  const tools = [];
  if (codeInterpreter) {
    tools.push({
      type: "code_interpreter"
    });
    body.tool_resources = {
      ...body.tool_resources ?? {},
      code_interpreter: {
        file_ids
      }
    };
  }
  if (knowledgeRetrieval) {
    tools.push({
      type: "file_search"
    });
    body.tool_resources = {
      ...body.tool_resources ?? {},
      file_search: {
        vector_stores: [
          {
            file_ids
          }
        ]
      }
    };
  }
  if (tools.length) {
    body.tools = tools;
  }
  const response = await import_transport.apiRequest.call(this, "POST", "/assistants", {
    body,
    headers: {
      "OpenAI-Beta": "assistants=v2"
    }
  });
  return [
    {
      json: response,
      pairedItem: { item: i }
    }
  ];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  description,
  execute
});
//# sourceMappingURL=create.operation.js.map