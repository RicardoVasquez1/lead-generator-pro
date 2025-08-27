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
  authenticationProperties: () => authenticationProperties,
  jsonInput: () => jsonInput,
  optimizeResponseProperties: () => optimizeResponseProperties,
  parametersCollection: () => parametersCollection,
  placeholderDefinitionsCollection: () => placeholderDefinitionsCollection,
  specifyBySelector: () => specifyBySelector
});
module.exports = __toCommonJS(descriptions_exports);
const specifyBySelector = {
  displayName: "Specify By",
  name: "specifyBy",
  type: "options",
  options: [
    {
      name: "Using Fields Below",
      value: "keypair"
    },
    {
      name: "Using JSON Below",
      value: "json"
    },
    {
      name: "Let Model Specify Entire Body",
      value: "model"
    }
  ],
  default: "keypair"
};
const parametersCollection = {
  displayName: "Parameters",
  name: "parameters",
  type: "fixedCollection",
  typeOptions: {
    multipleValues: true
  },
  placeholder: "Add Parameter",
  default: {
    values: [
      {
        name: ""
      }
    ]
  },
  options: [
    {
      name: "values",
      displayName: "Values",
      values: [
        {
          displayName: "Name",
          name: "name",
          type: "string",
          default: ""
        },
        {
          displayName: "Value Provided",
          name: "valueProvider",
          type: "options",
          options: [
            {
              // eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
              name: "By Model (and is required)",
              value: "modelRequired"
            },
            {
              // eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
              name: "By Model (but is optional)",
              value: "modelOptional"
            },
            {
              name: "Using Field Below",
              value: "fieldValue"
            }
          ],
          default: "modelRequired"
        },
        {
          displayName: "Value",
          name: "value",
          type: "string",
          default: "",
          hint: "Use a {placeholder} for any data to be filled in by the model",
          displayOptions: {
            show: {
              valueProvider: ["fieldValue"]
            }
          }
        }
      ]
    }
  ]
};
const placeholderDefinitionsCollection = {
  displayName: "Placeholder Definitions",
  name: "placeholderDefinitions",
  type: "fixedCollection",
  typeOptions: {
    multipleValues: true
  },
  placeholder: "Add Definition",
  default: [],
  options: [
    {
      name: "values",
      displayName: "Values",
      values: [
        {
          displayName: "Placeholder Name",
          name: "name",
          type: "string",
          default: ""
        },
        {
          displayName: "Description",
          name: "description",
          type: "string",
          default: ""
        },
        {
          displayName: "Type",
          name: "type",
          type: "options",
          // eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
          options: [
            {
              name: "Not Specified (Default)",
              value: "not specified"
            },
            {
              name: "String",
              value: "string"
            },
            {
              name: "Number",
              value: "number"
            },
            {
              name: "Boolean",
              value: "boolean"
            },
            {
              name: "JSON",
              value: "json"
            }
          ],
          default: "not specified"
        }
      ]
    }
  ]
};
const jsonInput = {
  displayName: "JSON",
  name: "json",
  type: "string",
  typeOptions: {
    rows: 5
  },
  hint: "Use a {placeholder} for any data to be filled in by the model",
  default: ""
};
const authenticationProperties = [
  {
    displayName: "Authentication",
    name: "authentication",
    description: "Select the type of authentication to use if needed, authentication would be done by n8n and your credentials will not be shared with the LLM",
    noDataExpression: true,
    type: "options",
    options: [
      {
        name: "None",
        value: "none"
      },
      {
        name: "Predefined Credential Type",
        value: "predefinedCredentialType",
        description: "We've already implemented auth for many services so that you don't have to set it up manually"
      },
      {
        name: "Generic Credential Type",
        value: "genericCredentialType",
        description: "Fully customizable. Choose between basic, header, OAuth2, etc."
      }
    ],
    default: "none"
  },
  {
    displayName: "Credential Type",
    name: "nodeCredentialType",
    type: "credentialsSelect",
    noDataExpression: true,
    required: true,
    default: "",
    credentialTypes: ["extends:oAuth2Api", "extends:oAuth1Api", "has:authenticate"],
    displayOptions: {
      show: {
        authentication: ["predefinedCredentialType"]
      }
    }
  },
  {
    displayName: "Make sure you have specified the scope(s) for the Service Account in the credential",
    name: "googleApiWarning",
    type: "notice",
    default: "",
    displayOptions: {
      show: {
        nodeCredentialType: ["googleApi"]
      }
    }
  },
  {
    displayName: "Generic Auth Type",
    name: "genericAuthType",
    type: "credentialsSelect",
    required: true,
    default: "",
    credentialTypes: ["has:genericAuth"],
    displayOptions: {
      show: {
        authentication: ["genericCredentialType"]
      }
    }
  }
];
const optimizeResponseProperties = [
  {
    displayName: "Optimize Response",
    name: "optimizeResponse",
    type: "boolean",
    default: false,
    noDataExpression: true,
    description: "Whether the optimize the tool response to reduce amount of data passed to the LLM that could lead to better result and reduce cost"
  },
  {
    displayName: "Expected Response Type",
    name: "responseType",
    type: "options",
    displayOptions: {
      show: {
        optimizeResponse: [true]
      }
    },
    options: [
      {
        name: "JSON",
        value: "json"
      },
      {
        name: "HTML",
        value: "html"
      },
      {
        name: "Text",
        value: "text"
      }
    ],
    default: "json"
  },
  {
    displayName: "Field Containing Data",
    name: "dataField",
    type: "string",
    default: "",
    placeholder: "e.g. records",
    description: "Specify the name of the field in the response containing the data",
    hint: "leave blank to use whole response",
    requiresDataPath: "single",
    displayOptions: {
      show: {
        optimizeResponse: [true],
        responseType: ["json"]
      }
    }
  },
  {
    displayName: "Include Fields",
    name: "fieldsToInclude",
    type: "options",
    description: "What fields response object should include",
    default: "all",
    displayOptions: {
      show: {
        optimizeResponse: [true],
        responseType: ["json"]
      }
    },
    options: [
      {
        name: "All",
        value: "all",
        description: "Include all fields"
      },
      {
        name: "Selected",
        value: "selected",
        description: "Include only fields specified below"
      },
      {
        name: "Except",
        value: "except",
        description: "Exclude fields specified below"
      }
    ]
  },
  {
    displayName: "Fields",
    name: "fields",
    type: "string",
    default: "",
    placeholder: "e.g. field1,field2",
    description: "Comma-separated list of the field names. Supports dot notation. You can drag the selected fields from the input panel.",
    requiresDataPath: "multiple",
    displayOptions: {
      show: {
        optimizeResponse: [true],
        responseType: ["json"]
      },
      hide: {
        fieldsToInclude: ["all"]
      }
    }
  },
  {
    displayName: "Selector (CSS)",
    name: "cssSelector",
    type: "string",
    description: "Select specific element(e.g. body) or multiple elements(e.g. div) of chosen type in the response HTML.",
    placeholder: "e.g. body",
    default: "body",
    displayOptions: {
      show: {
        optimizeResponse: [true],
        responseType: ["html"]
      }
    }
  },
  {
    displayName: "Return Only Content",
    name: "onlyContent",
    type: "boolean",
    default: false,
    description: "Whether to return only content of html elements, stripping html tags and attributes",
    hint: "Uses less tokens and may be easier for model to understand",
    displayOptions: {
      show: {
        optimizeResponse: [true],
        responseType: ["html"]
      }
    }
  },
  {
    displayName: "Elements To Omit",
    name: "elementsToOmit",
    type: "string",
    displayOptions: {
      show: {
        optimizeResponse: [true],
        responseType: ["html"],
        onlyContent: [true]
      }
    },
    default: "",
    placeholder: "e.g. img, .className, #ItemId",
    description: "Comma-separated list of selectors that would be excluded when extracting content"
  },
  {
    displayName: "Truncate Response",
    name: "truncateResponse",
    type: "boolean",
    default: false,
    hint: "Helps save tokens",
    displayOptions: {
      show: {
        optimizeResponse: [true],
        responseType: ["text", "html"]
      }
    }
  },
  {
    displayName: "Max Response Characters",
    name: "maxLength",
    type: "number",
    default: 1e3,
    typeOptions: {
      minValue: 1
    },
    displayOptions: {
      show: {
        optimizeResponse: [true],
        responseType: ["text", "html"],
        truncateResponse: [true]
      }
    }
  }
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  authenticationProperties,
  jsonInput,
  optimizeResponseProperties,
  parametersCollection,
  placeholderDefinitionsCollection,
  specifyBySelector
});
//# sourceMappingURL=descriptions.js.map