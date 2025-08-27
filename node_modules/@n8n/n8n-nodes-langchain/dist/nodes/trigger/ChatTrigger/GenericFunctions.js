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
var GenericFunctions_exports = {};
__export(GenericFunctions_exports, {
  validateAuth: () => validateAuth
});
module.exports = __toCommonJS(GenericFunctions_exports);
var import_basic_auth = __toESM(require("basic-auth"));
var import_error = require("./error");
async function validateAuth(context) {
  const authentication = context.getNodeParameter("authentication");
  const req = context.getRequestObject();
  const headers = context.getHeaderData();
  if (authentication === "none") {
    return;
  } else if (authentication === "basicAuth") {
    let expectedAuth;
    try {
      expectedAuth = await context.getCredentials("httpBasicAuth");
    } catch {
    }
    if (expectedAuth === void 0 || !expectedAuth.user || !expectedAuth.password) {
      throw new import_error.ChatTriggerAuthorizationError(500, "No authentication data defined on node!");
    }
    const providedAuth = (0, import_basic_auth.default)(req);
    if (!providedAuth) throw new import_error.ChatTriggerAuthorizationError(401);
    if (providedAuth.name !== expectedAuth.user || providedAuth.pass !== expectedAuth.password) {
      throw new import_error.ChatTriggerAuthorizationError(403);
    }
  } else if (authentication === "n8nUserAuth") {
    let getCookie2 = function(name) {
      const value = `; ${headers.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop()?.split(";").shift();
      }
      return "";
    };
    var getCookie = getCookie2;
    const webhookName = context.getWebhookName();
    const authCookie = getCookie2("n8n-auth");
    if (!authCookie && webhookName !== "setup") {
      throw new import_error.ChatTriggerAuthorizationError(500, "User not authenticated!");
    }
  }
  return;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  validateAuth
});
//# sourceMappingURL=GenericFunctions.js.map