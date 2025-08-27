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
var N8nItemListOutputParser_exports = {};
__export(N8nItemListOutputParser_exports, {
  N8nItemListOutputParser: () => N8nItemListOutputParser
});
module.exports = __toCommonJS(N8nItemListOutputParser_exports);
var import_output_parsers = require("@langchain/core/output_parsers");
class N8nItemListOutputParser extends import_output_parsers.BaseOutputParser {
  constructor(options) {
    super();
    this.lc_namespace = ["n8n-nodes-langchain", "output_parsers", "list_items"];
    const { numberOfItems = 3, separator = "\n" } = options;
    if (numberOfItems && numberOfItems > 0) {
      this.numberOfItems = numberOfItems;
    }
    this.separator = separator;
    if (this.separator === "\\n") {
      this.separator = "\n";
    }
  }
  async parse(text) {
    const response = text.split(this.separator).map((item) => item.trim()).filter((item) => item);
    if (this.numberOfItems && response.length < this.numberOfItems) {
      throw new import_output_parsers.OutputParserException(
        `Wrong number of items returned. Expected ${this.numberOfItems} items but got ${response.length} items instead.`
      );
    }
    return response.slice(0, this.numberOfItems);
  }
  getFormatInstructions() {
    const instructions = `Your response should be a list of ${this.numberOfItems ? this.numberOfItems + " " : ""}items separated by`;
    const numberOfExamples = this.numberOfItems ?? 3;
    const examples = [];
    for (let i = 1; i <= numberOfExamples; i++) {
      examples.push(`item${i}`);
    }
    return `${instructions} "${this.separator}" (for example: "${examples.join(this.separator)}")`;
  }
  getSchema() {
    return;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  N8nItemListOutputParser
});
//# sourceMappingURL=N8nItemListOutputParser.js.map