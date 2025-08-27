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
var TokenTextSplitter_exports = {};
__export(TokenTextSplitter_exports, {
  TokenTextSplitter: () => TokenTextSplitter
});
module.exports = __toCommonJS(TokenTextSplitter_exports);
var import_textsplitters = require("@langchain/textsplitters");
var import_helpers = require("../../../utils/helpers");
var import_tiktoken = require("../../../utils/tokenizer/tiktoken");
var import_token_estimator = require("../../../utils/tokenizer/token-estimator");
class TokenTextSplitter extends import_textsplitters.TextSplitter {
  static lc_name() {
    return "TokenTextSplitter";
  }
  constructor(fields) {
    super(fields);
    this.encodingName = fields?.encodingName ?? "cl100k_base";
    this.allowedSpecial = fields?.allowedSpecial ?? [];
    this.disallowedSpecial = fields?.disallowedSpecial ?? "all";
  }
  async splitText(text) {
    try {
      if (!text || typeof text !== "string") {
        return [];
      }
      if ((0, import_helpers.hasLongSequentialRepeat)(text)) {
        const splits = (0, import_token_estimator.estimateTextSplitsByTokens)(
          text,
          this.chunkSize,
          this.chunkOverlap,
          this.encodingName
        );
        return splits;
      }
      try {
        this.tokenizer ??= (0, import_tiktoken.getEncoding)(this.encodingName);
        const splits = [];
        const input_ids = this.tokenizer.encode(text, this.allowedSpecial, this.disallowedSpecial);
        let start_idx = 0;
        let chunkCount = 0;
        while (start_idx < input_ids.length) {
          if (start_idx > 0) {
            start_idx = Math.max(0, start_idx - this.chunkOverlap);
          }
          const end_idx = Math.min(start_idx + this.chunkSize, input_ids.length);
          const chunk_ids = input_ids.slice(start_idx, end_idx);
          splits.push(this.tokenizer.decode(chunk_ids));
          chunkCount++;
          start_idx = end_idx;
        }
        return splits;
      } catch (tiktokenError) {
        return (0, import_token_estimator.estimateTextSplitsByTokens)(
          text,
          this.chunkSize,
          this.chunkOverlap,
          this.encodingName
        );
      }
    } catch (error) {
      return [];
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TokenTextSplitter
});
//# sourceMappingURL=TokenTextSplitter.js.map