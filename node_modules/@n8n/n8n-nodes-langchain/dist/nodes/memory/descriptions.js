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
  contextWindowLengthProperty: () => contextWindowLengthProperty,
  expressionSessionKeyProperty: () => expressionSessionKeyProperty,
  sessionIdOption: () => sessionIdOption,
  sessionKeyProperty: () => sessionKeyProperty
});
module.exports = __toCommonJS(descriptions_exports);
const sessionIdOption = {
  displayName: "Session ID",
  name: "sessionIdType",
  type: "options",
  options: [
    {
      name: "Connected Chat Trigger Node",
      value: "fromInput",
      description: "Looks for an input field called 'sessionId' that is coming from a directly connected Chat Trigger"
    },
    {
      // eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
      name: "Define below",
      value: "customKey",
      description: "Use an expression to reference data in previous nodes or enter static text"
    }
  ],
  default: "fromInput"
};
const expressionSessionKeyProperty = (fromVersion) => ({
  displayName: "Session Key From Previous Node",
  name: "sessionKey",
  type: "string",
  default: "={{ $json.sessionId }}",
  disabledOptions: { show: { sessionIdType: ["fromInput"] } },
  displayOptions: {
    show: {
      sessionIdType: ["fromInput"],
      "@version": [{ _cnd: { gte: fromVersion } }]
    }
  }
});
const sessionKeyProperty = {
  displayName: "Key",
  name: "sessionKey",
  type: "string",
  default: "",
  description: "The key to use to store session ID in the memory",
  displayOptions: {
    show: {
      sessionIdType: ["customKey"]
    }
  }
};
const contextWindowLengthProperty = {
  displayName: "Context Window Length",
  name: "contextWindowLength",
  type: "number",
  default: 5,
  hint: "How many past interactions the model receives as context"
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  contextWindowLengthProperty,
  expressionSessionKeyProperty,
  sessionIdOption,
  sessionKeyProperty
});
//# sourceMappingURL=descriptions.js.map