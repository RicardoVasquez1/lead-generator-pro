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
var promptUtils_exports = {};
__export(promptUtils_exports, {
  createPromptTemplate: () => createPromptTemplate
});
module.exports = __toCommonJS(promptUtils_exports);
var import_messages = require("@langchain/core/messages");
var import_prompts = require("@langchain/core/prompts");
var import_n8n_workflow = require("n8n-workflow");
var import_helpers = require("../../../../utils/helpers");
var import_imageUtils = require("./imageUtils");
function buildQueryTemplate(formatInstructions) {
  return new import_prompts.PromptTemplate({
    template: `{query}${formatInstructions ? "\n{formatInstructions}" : ""}`,
    inputVariables: ["query"],
    partialVariables: formatInstructions ? { formatInstructions } : void 0
  });
}
async function processMessageTemplates({
  context,
  itemIndex,
  messages
}) {
  return await Promise.all(
    messages.map(async (message) => {
      const messageClass = [
        import_prompts.SystemMessagePromptTemplate,
        import_prompts.AIMessagePromptTemplate,
        import_prompts.HumanMessagePromptTemplate
      ].find((m) => m.lc_name() === message.type);
      if (!messageClass) {
        throw new import_n8n_workflow.OperationalError("Invalid message type", {
          extra: { messageType: message.type }
        });
      }
      if (messageClass === import_prompts.HumanMessagePromptTemplate && message.messageType !== "text") {
        return await (0, import_imageUtils.createImageMessage)({ context, itemIndex, message });
      }
      return messageClass.fromTemplate(
        (message.message || "").replace(/[{}]/g, (match) => match + match)
      );
    })
  );
}
async function finalizePromptTemplate({
  parsedMessages,
  queryTemplate,
  query
}) {
  const lastMessage = parsedMessages[parsedMessages.length - 1];
  if (lastMessage instanceof import_messages.HumanMessage && Array.isArray(lastMessage.content)) {
    const humanMessage = new import_prompts.HumanMessagePromptTemplate(queryTemplate);
    const formattedMessage = await humanMessage.format({ query });
    if (Array.isArray(lastMessage.content)) {
      const updatedContent = [
        ...lastMessage.content,
        {
          text: formattedMessage.content.toString(),
          type: "text"
        }
      ];
      lastMessage.content = updatedContent;
    }
  } else {
    parsedMessages.push(new import_prompts.HumanMessagePromptTemplate(queryTemplate));
  }
  return import_prompts.ChatPromptTemplate.fromMessages(parsedMessages);
}
async function createPromptTemplate({
  context,
  itemIndex,
  llm,
  messages,
  formatInstructions,
  query
}) {
  const queryTemplate = buildQueryTemplate(formatInstructions);
  if (!(0, import_helpers.isChatInstance)(llm)) {
    return queryTemplate;
  }
  const parsedMessages = messages?.length ? await processMessageTemplates({ context, itemIndex, messages }) : [];
  return await finalizePromptTemplate({
    parsedMessages,
    queryTemplate,
    query
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createPromptTemplate
});
//# sourceMappingURL=promptUtils.js.map