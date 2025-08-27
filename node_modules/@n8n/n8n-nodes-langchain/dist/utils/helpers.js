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
var helpers_exports = {};
__export(helpers_exports, {
  escapeSingleCurlyBrackets: () => escapeSingleCurlyBrackets,
  getConnectedTools: () => getConnectedTools,
  getMetadataFiltersValues: () => getMetadataFiltersValues,
  getPromptInputByType: () => getPromptInputByType,
  getSessionId: () => getSessionId,
  hasLongSequentialRepeat: () => hasLongSequentialRepeat,
  isBaseChatMemory: () => isBaseChatMemory,
  isBaseChatMessageHistory: () => isBaseChatMessageHistory,
  isChatInstance: () => isChatInstance,
  isToolsInstance: () => isToolsInstance,
  logAiEvent: () => logAiEvent,
  serializeChatHistory: () => serializeChatHistory,
  unwrapNestedOutput: () => unwrapNestedOutput
});
module.exports = __toCommonJS(helpers_exports);
var import_agents = require("langchain/agents");
var import_n8n_workflow = require("n8n-workflow");
var import_N8nTool = require("./N8nTool");
function hasMethods(obj, ...methodNames) {
  return methodNames.every(
    (methodName) => typeof obj === "object" && obj !== null && methodName in obj && typeof obj[methodName] === "function"
  );
}
function getMetadataFiltersValues(ctx, itemIndex) {
  const options = ctx.getNodeParameter("options", itemIndex, {});
  if (options.metadata) {
    const { metadataValues: metadata } = options.metadata;
    if (metadata.length > 0) {
      return metadata.reduce((acc, { name, value }) => ({ ...acc, [name]: value }), {});
    }
  }
  if (options.searchFilterJson) {
    return ctx.getNodeParameter("options.searchFilterJson", itemIndex, "", {
      ensureType: "object"
    });
  }
  return void 0;
}
function isBaseChatMemory(obj) {
  return hasMethods(obj, "loadMemoryVariables", "saveContext");
}
function isBaseChatMessageHistory(obj) {
  return hasMethods(obj, "getMessages", "addMessage");
}
function isChatInstance(model) {
  const namespace = model?.lc_namespace ?? [];
  return namespace.includes("chat_models");
}
function isToolsInstance(model) {
  const namespace = model?.lc_namespace ?? [];
  return namespace.includes("tools");
}
function getPromptInputByType(options) {
  const { ctx, i, promptTypeKey, inputKey } = options;
  const promptType = ctx.getNodeParameter(promptTypeKey, i, "define");
  let input;
  if (promptType === "auto") {
    input = ctx.evaluateExpression('{{ $json["chatInput"] }}', i);
  } else {
    input = ctx.getNodeParameter(inputKey, i);
  }
  if (input === void 0) {
    throw new import_n8n_workflow.NodeOperationError(ctx.getNode(), "No prompt specified", {
      description: "Expected to find the prompt in an input field called 'chatInput' (this is what the chat trigger node outputs). To use something else, change the 'Prompt' parameter"
    });
  }
  return input;
}
function getSessionId(ctx, itemIndex, selectorKey = "sessionIdType", autoSelect = "fromInput", customKey = "sessionKey") {
  let sessionId = "";
  const selectorType = ctx.getNodeParameter(selectorKey, itemIndex);
  if (selectorType === autoSelect) {
    if ("getBodyData" in ctx) {
      const bodyData = ctx.getBodyData() ?? {};
      sessionId = bodyData.sessionId;
    } else {
      sessionId = ctx.evaluateExpression("{{ $json.sessionId }}", itemIndex);
      if (!sessionId || sessionId === void 0) {
        try {
          const chatTrigger = ctx.getChatTrigger();
          if (chatTrigger) {
            sessionId = ctx.evaluateExpression(
              `{{ $('${chatTrigger.name}').first().json.sessionId }}`,
              itemIndex
            );
          }
        } catch (error) {
        }
      }
    }
    if (sessionId === "" || sessionId === void 0) {
      throw new import_n8n_workflow.NodeOperationError(ctx.getNode(), "No session ID found", {
        description: "Expected to find the session ID in an input field called 'sessionId' (this is what the chat trigger node outputs). To use something else, change the 'Session ID' parameter",
        itemIndex
      });
    }
  } else {
    sessionId = ctx.getNodeParameter(customKey, itemIndex, "");
    if (sessionId === "" || sessionId === void 0) {
      throw new import_n8n_workflow.NodeOperationError(ctx.getNode(), "Key parameter is empty", {
        description: "Provide a key to use as session ID in the 'Key' parameter or use the 'Connected Chat Trigger Node' option to use the session ID from your Chat Trigger",
        itemIndex
      });
    }
  }
  return sessionId;
}
function logAiEvent(executeFunctions, event, data) {
  try {
    executeFunctions.logAiEvent(event, data ? (0, import_n8n_workflow.jsonStringify)(data) : void 0);
  } catch (error) {
    executeFunctions.logger.debug(`Error logging AI event: ${event}`);
  }
}
function serializeChatHistory(chatHistory) {
  return chatHistory.map((chatMessage) => {
    if (chatMessage._getType() === "human") {
      return `Human: ${chatMessage.content}`;
    } else if (chatMessage._getType() === "ai") {
      return `Assistant: ${chatMessage.content}`;
    } else {
      return `${chatMessage.content}`;
    }
  }).join("\n");
}
function escapeSingleCurlyBrackets(text) {
  if (text === void 0) return void 0;
  let result = text;
  result = result.replace(/(?<!{){{{(?!{)/g, "{{{{").replace(/(?<!})}}}(?!})/g, "}}}}").replace(/(?<!{){(?!{)/g, "{{").replace(/(?<!})}(?!})/g, "}}");
  return result;
}
const getConnectedTools = async (ctx, enforceUniqueNames, convertStructuredTool = true, escapeCurlyBrackets = false) => {
  const connectedTools = (await ctx.getInputConnectionData(import_n8n_workflow.NodeConnectionTypes.AiTool, 0) ?? []).flatMap((toolOrToolkit) => {
    if (toolOrToolkit instanceof import_agents.Toolkit) {
      return toolOrToolkit.getTools();
    }
    return toolOrToolkit;
  });
  if (!enforceUniqueNames) return connectedTools;
  const seenNames = /* @__PURE__ */ new Set();
  const finalTools = [];
  for (const tool of connectedTools) {
    const { name } = tool;
    if (seenNames.has(name)) {
      throw new import_n8n_workflow.NodeOperationError(
        ctx.getNode(),
        `You have multiple tools with the same name: '${name}', please rename them to avoid conflicts`
      );
    }
    seenNames.add(name);
    if (escapeCurlyBrackets) {
      tool.description = escapeSingleCurlyBrackets(tool.description) ?? tool.description;
    }
    if (convertStructuredTool && tool instanceof import_N8nTool.N8nTool) {
      finalTools.push(tool.asDynamicTool());
    } else {
      finalTools.push(tool);
    }
  }
  return finalTools;
};
function unwrapNestedOutput(output) {
  if ("output" in output && Object.keys(output).length === 1 && typeof output.output === "object" && output.output !== null && "output" in output.output && Object.keys(output.output).length === 1) {
    return output.output;
  }
  return output;
}
function hasLongSequentialRepeat(text, threshold = 1e3) {
  try {
    if (text === null || typeof text !== "string" || text.length === 0 || threshold <= 0 || text.length < threshold) {
      return false;
    }
    const iterator = text[Symbol.iterator]();
    let prev = iterator.next();
    if (prev.done) {
      return false;
    }
    let count = 1;
    for (const char of iterator) {
      if (char === prev.value) {
        count++;
        if (count >= threshold) {
          return true;
        }
      } else {
        count = 1;
        prev = { value: char, done: false };
      }
    }
    return false;
  } catch (error) {
    return false;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  escapeSingleCurlyBrackets,
  getConnectedTools,
  getMetadataFiltersValues,
  getPromptInputByType,
  getSessionId,
  hasLongSequentialRepeat,
  isBaseChatMemory,
  isBaseChatMessageHistory,
  isChatInstance,
  isToolsInstance,
  logAiEvent,
  serializeChatHistory,
  unwrapNestedOutput
});
//# sourceMappingURL=helpers.js.map