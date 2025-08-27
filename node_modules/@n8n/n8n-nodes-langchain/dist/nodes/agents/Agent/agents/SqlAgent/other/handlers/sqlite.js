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
var sqlite_exports = {};
__export(sqlite_exports, {
  getSqliteDataSource: () => getSqliteDataSource
});
module.exports = __toCommonJS(sqlite_exports);
var import_typeorm = require("@n8n/typeorm");
var fs = __toESM(require("fs"));
var import_n8n_workflow = require("n8n-workflow");
var sqlite3 = __toESM(require("sqlite3"));
var temp = __toESM(require("temp"));
async function getSqliteDataSource(binary, binaryPropertyName = "data") {
  const binaryData = binary?.[binaryPropertyName];
  if (!binaryData) {
    throw new import_n8n_workflow.NodeOperationError(this.getNode(), "No binary data received.");
  }
  let fileBase64;
  if (binaryData.id) {
    const chunkSize = 256 * 1024;
    const stream = await this.helpers.getBinaryStream(binaryData.id, chunkSize);
    const buffer = await this.helpers.binaryToBuffer(stream);
    fileBase64 = buffer.toString("base64");
  } else {
    fileBase64 = binaryData.data;
  }
  const bufferString = Buffer.from(fileBase64, import_n8n_workflow.BINARY_ENCODING);
  temp.track();
  const tempDbPath = temp.path({ suffix: ".sqlite" });
  fs.writeFileSync(tempDbPath, bufferString);
  const tempDb = new sqlite3.Database(tempDbPath, (error) => {
    if (error) {
      throw new import_n8n_workflow.NodeOperationError(this.getNode(), "Could not connect to database");
    }
  });
  tempDb.close();
  return new import_typeorm.DataSource({
    type: "sqlite",
    database: tempDbPath
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getSqliteDataSource
});
//# sourceMappingURL=sqlite.js.map