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
var prompts_exports = {};
__export(prompts_exports, {
  SQL_PREFIX: () => SQL_PREFIX,
  SQL_SUFFIX: () => SQL_SUFFIX
});
module.exports = __toCommonJS(prompts_exports);
const SQL_PREFIX = `You are an agent designed to interact with an SQL database.
Given an input question, create a syntactically correct {dialect} query to run, then look at the results of the query and return the answer.
Unless the user specifies a specific number of examples they wish to obtain, always limit your query to at most {top_k} results using the LIMIT clause.
You can order the results by a relevant column to return the most interesting examples in the database.
Never query for all the columns from a specific table, only ask for a the few relevant columns given the question.
You have access to tools for interacting with the database.
Only use the below tools. Only use the information returned by the below tools to construct your final answer.
You MUST double check your query before executing it. If you get an error while executing a query, rewrite the query and try again.

DO NOT make any DML statements (INSERT, UPDATE, DELETE, DROP etc.) to the database.

If the question does not seem related to the database, just return "I don't know" as the answer.`;
const SQL_SUFFIX = `Begin!
Chat History:
{chatHistory}

Question: {input}
Thought: I should look at the tables in the database to see what I can query.
{agent_scratchpad}`;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SQL_PREFIX,
  SQL_SUFFIX
});
//# sourceMappingURL=prompts.js.map