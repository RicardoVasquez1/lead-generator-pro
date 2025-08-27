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
var mysql_exports = {};
__export(mysql_exports, {
  getMysqlDataSource: () => getMysqlDataSource
});
module.exports = __toCommonJS(mysql_exports);
var import_typeorm = require("@n8n/typeorm");
async function getMysqlDataSource() {
  const credentials = await this.getCredentials("mySql");
  const dataSource = new import_typeorm.DataSource({
    type: "mysql",
    host: credentials.host,
    port: credentials.port,
    username: credentials.user,
    password: credentials.password,
    database: credentials.database,
    ssl: {
      rejectUnauthorized: credentials.ssl
    }
  });
  return dataSource;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getMysqlDataSource
});
//# sourceMappingURL=mysql.js.map