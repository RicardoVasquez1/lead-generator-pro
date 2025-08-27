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
var sharedFields_exports = {};
__export(sharedFields_exports, {
  getBatchingOptionFields: () => getBatchingOptionFields,
  getConnectionHintNoticeField: () => getConnectionHintNoticeField,
  getTemplateNoticeField: () => getTemplateNoticeField,
  metadataFilterField: () => metadataFilterField
});
module.exports = __toCommonJS(sharedFields_exports);
var import_n8n_workflow = require("n8n-workflow");
const metadataFilterField = {
  displayName: "Metadata Filter",
  name: "metadata",
  type: "fixedCollection",
  description: "Metadata to filter the document by",
  typeOptions: {
    multipleValues: true
  },
  default: {},
  placeholder: "Add filter field",
  options: [
    {
      name: "metadataValues",
      displayName: "Fields to Set",
      values: [
        {
          displayName: "Name",
          name: "name",
          type: "string",
          default: "",
          required: true
        },
        {
          displayName: "Value",
          name: "value",
          type: "string",
          default: ""
        }
      ]
    }
  ]
};
function getTemplateNoticeField(templateId) {
  return {
    displayName: `Save time with an <a href="/templates/${templateId}" target="_blank">example</a> of how this node works`,
    name: "notice",
    type: "notice",
    default: ""
  };
}
function getBatchingOptionFields(displayOptions, defaultBatchSize = 5) {
  return {
    displayName: "Batch Processing",
    name: "batching",
    type: "collection",
    placeholder: "Add Batch Processing Option",
    description: "Batch processing options for rate limiting",
    default: {},
    options: [
      {
        displayName: "Batch Size",
        name: "batchSize",
        default: defaultBatchSize,
        type: "number",
        description: "How many items to process in parallel. This is useful for rate limiting, but might impact the log output ordering."
      },
      {
        displayName: "Delay Between Batches",
        name: "delayBetweenBatches",
        default: 0,
        type: "number",
        description: "Delay in milliseconds between batches. This is useful for rate limiting."
      }
    ],
    displayOptions
  };
}
const connectionsString = {
  [import_n8n_workflow.NodeConnectionTypes.AiAgent]: {
    // Root AI view
    connection: "",
    locale: "AI Agent"
  },
  [import_n8n_workflow.NodeConnectionTypes.AiChain]: {
    // Root AI view
    connection: "",
    locale: "AI Chain"
  },
  [import_n8n_workflow.NodeConnectionTypes.AiDocument]: {
    connection: import_n8n_workflow.NodeConnectionTypes.AiDocument,
    locale: "Document Loader"
  },
  [import_n8n_workflow.NodeConnectionTypes.AiVectorStore]: {
    connection: import_n8n_workflow.NodeConnectionTypes.AiVectorStore,
    locale: "Vector Store"
  },
  [import_n8n_workflow.NodeConnectionTypes.AiRetriever]: {
    connection: import_n8n_workflow.NodeConnectionTypes.AiRetriever,
    locale: "Vector Store Retriever"
  }
};
function determineArticle(nextWord) {
  const vowels = /^[aeiouAEIOU]/;
  return vowels.test(nextWord) ? "an" : "a";
}
const getConnectionParameterString = (connectionType) => {
  if (connectionType === "") return "data-action-parameter-creatorview='AI'";
  return `data-action-parameter-connectiontype='${connectionType}'`;
};
const getAhref = (connectionType) => `<a class="test" data-action='openSelectiveNodeCreator'${getConnectionParameterString(
  connectionType.connection
)}'>${connectionType.locale}</a>`;
function getConnectionHintNoticeField(connectionTypes) {
  const groupedConnections = /* @__PURE__ */ new Map();
  connectionTypes.forEach((connectionType) => {
    const connectionString = connectionsString[connectionType].connection;
    const localeString = connectionsString[connectionType].locale;
    if (!groupedConnections.has(connectionString)) {
      groupedConnections.set(connectionString, [localeString]);
      return;
    }
    groupedConnections.get(connectionString)?.push(localeString);
  });
  let displayName;
  if (groupedConnections.size === 1) {
    const [[connection, locales]] = Array.from(groupedConnections);
    displayName = `This node must be connected to ${determineArticle(locales[0])} ${locales[0].toLowerCase().replace(
      /^ai /,
      "AI "
    )}. <a data-action='openSelectiveNodeCreator' ${getConnectionParameterString(
      connection
    )}>Insert one</a>`;
  } else {
    const ahrefs = Array.from(groupedConnections, ([connection, locales]) => {
      const locale = locales.length > 1 ? locales.map((localeString, index, { length }) => {
        return (index === 0 ? `${determineArticle(localeString)} ` : "") + (index < length - 1 ? `${localeString} or ` : localeString);
      }).join("") : `${determineArticle(locales[0])} ${locales[0]}`;
      return getAhref({ connection, locale });
    });
    displayName = `This node needs to be connected to ${ahrefs.join(" or ")}.`;
  }
  return {
    displayName,
    name: "notice",
    type: "notice",
    default: "",
    typeOptions: {
      containerClass: "ndv-connection-hint-notice"
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getBatchingOptionFields,
  getConnectionHintNoticeField,
  getTemplateNoticeField,
  metadataFilterField
});
//# sourceMappingURL=sharedFields.js.map