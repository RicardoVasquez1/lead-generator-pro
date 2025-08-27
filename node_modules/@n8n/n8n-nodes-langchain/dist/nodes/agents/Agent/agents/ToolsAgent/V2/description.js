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
var description_exports = {};
__export(description_exports, {
  getToolsAgentProperties: () => getToolsAgentProperties
});
module.exports = __toCommonJS(description_exports);
var import_sharedFields = require("../../../../../../utils/sharedFields");
var import_options = require("../options");
const enableStreaminOption = {
  displayName: "Enable Streaming",
  name: "enableStreaming",
  type: "boolean",
  default: true,
  description: "Whether this agent will stream the response in real-time as it generates text"
};
const getToolsAgentProperties = ({
  withStreaming
}) => [
  {
    displayName: "Options",
    name: "options",
    type: "collection",
    default: {},
    placeholder: "Add Option",
    options: [
      ...import_options.commonOptions,
      (0, import_sharedFields.getBatchingOptionFields)(void 0, 1),
      ...withStreaming ? [enableStreaminOption] : []
    ],
    displayOptions: {
      hide: {
        "@version": [{ _cnd: { lt: 2.2 } }]
      }
    }
  },
  {
    displayName: "Options",
    name: "options",
    type: "collection",
    default: {},
    placeholder: "Add Option",
    options: [...import_options.commonOptions, (0, import_sharedFields.getBatchingOptionFields)(void 0, 1)],
    displayOptions: {
      show: {
        "@version": [{ _cnd: { lt: 2.2 } }]
      }
    }
  }
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getToolsAgentProperties
});
//# sourceMappingURL=description.js.map