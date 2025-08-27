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
var n8nDefaultFailedAttemptHandler_exports = {};
__export(n8nDefaultFailedAttemptHandler_exports, {
  n8nDefaultFailedAttemptHandler: () => n8nDefaultFailedAttemptHandler
});
module.exports = __toCommonJS(n8nDefaultFailedAttemptHandler_exports);
const STATUS_NO_RETRY = [
  400,
  // Bad Request
  401,
  // Unauthorized
  402,
  // Payment Required
  403,
  // Forbidden
  404,
  // Not Found
  405,
  // Method Not Allowed
  406,
  // Not Acceptable
  407,
  // Proxy Authentication Required
  409
  // Conflict
];
const n8nDefaultFailedAttemptHandler = (error) => {
  if (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
    error?.message?.startsWith?.("Cancel") || error?.message?.startsWith?.("AbortError") || error?.name === "AbortError"
  ) {
    throw error;
  }
  if (error?.code === "ECONNABORTED") {
    throw error;
  }
  const status = (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    error?.response?.status ?? error?.status
  );
  if (status && STATUS_NO_RETRY.includes(+status)) {
    throw error;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  n8nDefaultFailedAttemptHandler
});
//# sourceMappingURL=n8nDefaultFailedAttemptHandler.js.map