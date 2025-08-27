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
var loadOptions_exports = {};
__export(loadOptions_exports, {
  getFiles: () => getFiles
});
module.exports = __toCommonJS(loadOptions_exports);
var import_transport = require("../transport");
async function getFiles() {
  const { data } = await import_transport.apiRequest.call(this, "GET", "/files", { qs: { purpose: "assistants" } });
  const returnData = [];
  for (const file of data || []) {
    returnData.push({
      name: file.filename,
      value: file.id
    });
  }
  return returnData;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getFiles
});
//# sourceMappingURL=loadOptions.js.map