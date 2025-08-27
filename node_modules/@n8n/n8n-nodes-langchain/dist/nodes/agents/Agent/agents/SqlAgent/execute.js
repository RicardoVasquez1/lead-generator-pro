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
var execute_exports = {};
__export(execute_exports, {
  sqlAgentAgentExecute: () => sqlAgentAgentExecute
});
module.exports = __toCommonJS(execute_exports);
var import_sql = require("langchain/agents/toolkits/sql");
var import_sql_db = require("langchain/sql_db");
var import_n8n_workflow = require("n8n-workflow");
var import_helpers = require("../../../../../utils/helpers");
var import_tracing = require("../../../../../utils/tracing");
var import_mysql = require("./other/handlers/mysql");
var import_postgres = require("./other/handlers/postgres");
var import_sqlite = require("./other/handlers/sqlite");
var import_prompts = require("./other/prompts");
const parseTablesString = (tablesString) => tablesString.split(",").map((table) => table.trim()).filter((table) => table.length > 0);
async function sqlAgentAgentExecute() {
  this.logger.debug("Executing SQL Agent");
  const model = await this.getInputConnectionData(
    import_n8n_workflow.NodeConnectionTypes.AiLanguageModel,
    0
  );
  const items = this.getInputData();
  const returnData = [];
  for (let i = 0; i < items.length; i++) {
    try {
      const item = items[i];
      let input;
      if (this.getNode().typeVersion <= 1.2) {
        input = this.getNodeParameter("input", i);
      } else {
        input = (0, import_helpers.getPromptInputByType)({
          ctx: this,
          i,
          inputKey: "text",
          promptTypeKey: "promptType"
        });
      }
      if (input === void 0) {
        throw new import_n8n_workflow.NodeOperationError(this.getNode(), "The \u2018prompt\u2019 parameter is empty.");
      }
      const options = this.getNodeParameter("options", i, {});
      const selectedDataSource = this.getNodeParameter("dataSource", i, "sqlite");
      const includedSampleRows = options.includedSampleRows;
      const includedTablesArray = parseTablesString(options.includedTables ?? "");
      const ignoredTablesArray = parseTablesString(options.ignoredTables ?? "");
      let dataSource = null;
      if (selectedDataSource === "sqlite") {
        if (!item.binary) {
          throw new import_n8n_workflow.NodeOperationError(
            this.getNode(),
            "No binary data found, please connect a binary to the input if you want to use SQLite as data source"
          );
        }
        const binaryPropertyName = this.getNodeParameter("binaryPropertyName", i, "data");
        dataSource = await import_sqlite.getSqliteDataSource.call(this, item.binary, binaryPropertyName);
      }
      if (selectedDataSource === "postgres") {
        dataSource = await import_postgres.getPostgresDataSource.call(this);
      }
      if (selectedDataSource === "mysql") {
        dataSource = await import_mysql.getMysqlDataSource.call(this);
      }
      if (!dataSource) {
        throw new import_n8n_workflow.NodeOperationError(
          this.getNode(),
          "No data source found, please configure data source"
        );
      }
      const agentOptions = {
        topK: options.topK ?? 10,
        prefix: options.prefixPrompt ?? import_prompts.SQL_PREFIX,
        suffix: options.suffixPrompt ?? import_prompts.SQL_SUFFIX,
        inputVariables: ["chatHistory", "input", "agent_scratchpad"]
      };
      const dbInstance = await import_sql_db.SqlDatabase.fromDataSourceParams({
        appDataSource: dataSource,
        includesTables: includedTablesArray.length > 0 ? includedTablesArray : void 0,
        ignoreTables: ignoredTablesArray.length > 0 ? ignoredTablesArray : void 0,
        sampleRowsInTableInfo: includedSampleRows ?? 3
      });
      const toolkit = new import_sql.SqlToolkit(dbInstance, model);
      const agentExecutor = (0, import_sql.createSqlAgent)(model, toolkit, agentOptions);
      const memory = await this.getInputConnectionData(import_n8n_workflow.NodeConnectionTypes.AiMemory, 0);
      agentExecutor.memory = memory;
      let chatHistory = "";
      if (memory) {
        const messages = await memory.chatHistory.getMessages();
        chatHistory = (0, import_helpers.serializeChatHistory)(messages);
      }
      let response;
      try {
        response = await agentExecutor.withConfig((0, import_tracing.getTracingConfig)(this)).invoke({
          input,
          signal: this.getExecutionCancelSignal(),
          chatHistory
        });
      } catch (error) {
        if (error.message?.output) {
          response = error.message;
        } else {
          throw new import_n8n_workflow.NodeOperationError(this.getNode(), error.message, { itemIndex: i });
        }
      }
      returnData.push({ json: response });
    } catch (error) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
        continue;
      }
      throw error;
    }
  }
  return [returnData];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sqlAgentAgentExecute
});
//# sourceMappingURL=execute.js.map