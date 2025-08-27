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
var logWrapper_exports = {};
__export(logWrapper_exports, {
  callMethodAsync: () => callMethodAsync,
  callMethodSync: () => callMethodSync,
  logWrapper: () => logWrapper
});
module.exports = __toCommonJS(logWrapper_exports);
var import_embeddings = require("@langchain/core/embeddings");
var import_retrievers = require("@langchain/core/retrievers");
var import_document_compressors = require("@langchain/core/retrievers/document_compressors");
var import_vectorstores = require("@langchain/core/vectorstores");
var import_textsplitters = require("@langchain/textsplitters");
var import_n8n_workflow = require("n8n-workflow");
var import_helpers = require("./helpers");
var import_N8nBinaryLoader = require("./N8nBinaryLoader");
var import_N8nJsonLoader = require("./N8nJsonLoader");
async function callMethodAsync(parameters) {
  try {
    return await parameters.method.call(this, ...parameters.arguments);
  } catch (e) {
    const connectedNode = parameters.executeFunctions.getNode();
    const error = new import_n8n_workflow.NodeOperationError(connectedNode, e, {
      functionality: "configuration-node"
    });
    const metadata = (0, import_n8n_workflow.parseErrorMetadata)(error);
    parameters.executeFunctions.addOutputData(
      parameters.connectionType,
      parameters.currentNodeRunIndex,
      error,
      metadata
    );
    if (error.message) {
      if (!error.description) {
        error.description = error.message;
      }
      throw error;
    }
    throw new import_n8n_workflow.NodeOperationError(
      connectedNode,
      `Error on node "${connectedNode.name}" which is connected via input "${parameters.connectionType}"`,
      { functionality: "configuration-node" }
    );
  }
}
function callMethodSync(parameters) {
  try {
    return parameters.method.call(this, ...parameters.arguments);
  } catch (e) {
    const connectedNode = parameters.executeFunctions.getNode();
    const error = new import_n8n_workflow.NodeOperationError(connectedNode, e);
    parameters.executeFunctions.addOutputData(
      parameters.connectionType,
      parameters.currentNodeRunIndex,
      error
    );
    throw new import_n8n_workflow.NodeOperationError(
      connectedNode,
      `Error on node "${connectedNode.name}" which is connected via input "${parameters.connectionType}"`,
      { functionality: "configuration-node" }
    );
  }
}
function logWrapper(originalInstance, executeFunctions) {
  return new Proxy(originalInstance, {
    get: (target, prop) => {
      let connectionType;
      if ((0, import_helpers.isBaseChatMemory)(originalInstance)) {
        if (prop === "loadMemoryVariables" && "loadMemoryVariables" in target) {
          return async (values) => {
            connectionType = import_n8n_workflow.NodeConnectionTypes.AiMemory;
            const { index } = executeFunctions.addInputData(connectionType, [
              [{ json: { action: "loadMemoryVariables", values } }]
            ]);
            const response = await callMethodAsync.call(target, {
              executeFunctions,
              connectionType,
              currentNodeRunIndex: index,
              method: target[prop],
              arguments: [values]
            });
            const chatHistory = response?.chat_history ?? response;
            executeFunctions.addOutputData(connectionType, index, [
              [{ json: { action: "loadMemoryVariables", chatHistory } }]
            ]);
            return response;
          };
        } else if (prop === "saveContext" && "saveContext" in target) {
          return async (input, output) => {
            connectionType = import_n8n_workflow.NodeConnectionTypes.AiMemory;
            const { index } = executeFunctions.addInputData(connectionType, [
              [{ json: { action: "saveContext", input, output } }]
            ]);
            const response = await callMethodAsync.call(target, {
              executeFunctions,
              connectionType,
              currentNodeRunIndex: index,
              method: target[prop],
              arguments: [input, output]
            });
            const chatHistory = await target.chatHistory.getMessages();
            executeFunctions.addOutputData(connectionType, index, [
              [{ json: { action: "saveContext", chatHistory } }]
            ]);
            return response;
          };
        }
      }
      if ((0, import_helpers.isBaseChatMessageHistory)(originalInstance)) {
        if (prop === "getMessages" && "getMessages" in target) {
          return async () => {
            connectionType = import_n8n_workflow.NodeConnectionTypes.AiMemory;
            const { index } = executeFunctions.addInputData(connectionType, [
              [{ json: { action: "getMessages" } }]
            ]);
            const response = await callMethodAsync.call(target, {
              executeFunctions,
              connectionType,
              currentNodeRunIndex: index,
              method: target[prop],
              arguments: []
            });
            const payload = { action: "getMessages", response };
            executeFunctions.addOutputData(connectionType, index, [[{ json: payload }]]);
            (0, import_helpers.logAiEvent)(executeFunctions, "ai-messages-retrieved-from-memory", { response });
            return response;
          };
        } else if (prop === "addMessage" && "addMessage" in target) {
          return async (message) => {
            connectionType = import_n8n_workflow.NodeConnectionTypes.AiMemory;
            const payload = { action: "addMessage", message };
            const { index } = executeFunctions.addInputData(connectionType, [[{ json: payload }]]);
            await callMethodAsync.call(target, {
              executeFunctions,
              connectionType,
              currentNodeRunIndex: index,
              method: target[prop],
              arguments: [message]
            });
            (0, import_helpers.logAiEvent)(executeFunctions, "ai-message-added-to-memory", { message });
            executeFunctions.addOutputData(connectionType, index, [[{ json: payload }]]);
          };
        }
      }
      if (originalInstance instanceof import_retrievers.BaseRetriever) {
        if (prop === "getRelevantDocuments" && "getRelevantDocuments" in target) {
          return async (query, config) => {
            connectionType = import_n8n_workflow.NodeConnectionTypes.AiRetriever;
            const { index } = executeFunctions.addInputData(connectionType, [
              [{ json: { query, config } }]
            ]);
            const response = await callMethodAsync.call(target, {
              executeFunctions,
              connectionType,
              currentNodeRunIndex: index,
              method: target[prop],
              arguments: [query, config]
            });
            const executionId = response[0]?.metadata?.executionId;
            const workflowId = response[0]?.metadata?.workflowId;
            const metadata = {};
            if (executionId && workflowId) {
              metadata.subExecution = {
                executionId,
                workflowId
              };
            }
            (0, import_helpers.logAiEvent)(executeFunctions, "ai-documents-retrieved", { query });
            executeFunctions.addOutputData(
              connectionType,
              index,
              [[{ json: { response } }]],
              metadata
            );
            return response;
          };
        }
      }
      if (originalInstance instanceof import_embeddings.Embeddings) {
        if (prop === "embedDocuments" && "embedDocuments" in target) {
          return async (documents) => {
            connectionType = import_n8n_workflow.NodeConnectionTypes.AiEmbedding;
            const { index } = executeFunctions.addInputData(connectionType, [
              [{ json: { documents } }]
            ]);
            const response = await callMethodAsync.call(target, {
              executeFunctions,
              connectionType,
              currentNodeRunIndex: index,
              method: target[prop],
              arguments: [documents]
            });
            (0, import_helpers.logAiEvent)(executeFunctions, "ai-document-embedded");
            executeFunctions.addOutputData(connectionType, index, [[{ json: { response } }]]);
            return response;
          };
        }
        if (prop === "embedQuery" && "embedQuery" in target) {
          return async (query) => {
            connectionType = import_n8n_workflow.NodeConnectionTypes.AiEmbedding;
            const { index } = executeFunctions.addInputData(connectionType, [
              [{ json: { query } }]
            ]);
            const response = await callMethodAsync.call(target, {
              executeFunctions,
              connectionType,
              currentNodeRunIndex: index,
              method: target[prop],
              arguments: [query]
            });
            (0, import_helpers.logAiEvent)(executeFunctions, "ai-query-embedded");
            executeFunctions.addOutputData(connectionType, index, [[{ json: { response } }]]);
            return response;
          };
        }
      }
      if (originalInstance instanceof import_document_compressors.BaseDocumentCompressor) {
        if (prop === "compressDocuments" && "compressDocuments" in target) {
          return async (documents, query) => {
            connectionType = import_n8n_workflow.NodeConnectionTypes.AiReranker;
            const { index } = executeFunctions.addInputData(connectionType, [
              [{ json: { query, documents } }]
            ]);
            const response = await callMethodAsync.call(target, {
              executeFunctions,
              connectionType,
              currentNodeRunIndex: index,
              method: target[prop],
              // compressDocuments mutates the original object
              // messing up the input data logging
              arguments: [(0, import_n8n_workflow.deepCopy)(documents), query]
            });
            (0, import_helpers.logAiEvent)(executeFunctions, "ai-document-reranked", { query });
            executeFunctions.addOutputData(connectionType, index, [[{ json: { response } }]]);
            return response;
          };
        }
      }
      if (originalInstance instanceof import_N8nJsonLoader.N8nJsonLoader || originalInstance instanceof import_N8nBinaryLoader.N8nBinaryLoader) {
        if (prop === "processAll" && "processAll" in target) {
          return async (items) => {
            connectionType = import_n8n_workflow.NodeConnectionTypes.AiDocument;
            const { index } = executeFunctions.addInputData(connectionType, [items]);
            const response = await callMethodAsync.call(target, {
              executeFunctions,
              connectionType,
              currentNodeRunIndex: index,
              method: target[prop],
              arguments: [items]
            });
            executeFunctions.addOutputData(connectionType, index, [[{ json: { response } }]]);
            return response;
          };
        }
        if (prop === "processItem" && "processItem" in target) {
          return async (item, itemIndex) => {
            connectionType = import_n8n_workflow.NodeConnectionTypes.AiDocument;
            const { index } = executeFunctions.addInputData(connectionType, [[item]]);
            const response = await callMethodAsync.call(target, {
              executeFunctions,
              connectionType,
              currentNodeRunIndex: index,
              method: target[prop],
              arguments: [item, itemIndex]
            });
            (0, import_helpers.logAiEvent)(executeFunctions, "ai-document-processed");
            executeFunctions.addOutputData(connectionType, index, [
              [{ json: { response }, pairedItem: { item: itemIndex } }]
            ]);
            return response;
          };
        }
      }
      if (originalInstance instanceof import_textsplitters.TextSplitter) {
        if (prop === "splitText" && "splitText" in target) {
          return async (text) => {
            connectionType = import_n8n_workflow.NodeConnectionTypes.AiTextSplitter;
            const { index } = executeFunctions.addInputData(connectionType, [
              [{ json: { textSplitter: text } }]
            ]);
            const response = await callMethodAsync.call(target, {
              executeFunctions,
              connectionType,
              currentNodeRunIndex: index,
              method: target[prop],
              arguments: [text]
            });
            (0, import_helpers.logAiEvent)(executeFunctions, "ai-text-split");
            executeFunctions.addOutputData(connectionType, index, [[{ json: { response } }]]);
            return response;
          };
        }
      }
      if ((0, import_helpers.isToolsInstance)(originalInstance)) {
        if (prop === "_call" && "_call" in target) {
          return async (query) => {
            connectionType = import_n8n_workflow.NodeConnectionTypes.AiTool;
            const inputData = { query };
            if (target.metadata?.isFromToolkit) {
              inputData.tool = {
                name: target.name,
                description: target.description
              };
            }
            const { index } = executeFunctions.addInputData(connectionType, [
              [{ json: inputData }]
            ]);
            const response = await callMethodAsync.call(target, {
              executeFunctions,
              connectionType,
              currentNodeRunIndex: index,
              method: target[prop],
              arguments: [query]
            });
            (0, import_helpers.logAiEvent)(executeFunctions, "ai-tool-called", { ...inputData, response });
            executeFunctions.addOutputData(connectionType, index, [[{ json: { response } }]]);
            if (typeof response === "string") return response;
            return JSON.stringify(response);
          };
        }
      }
      if (originalInstance instanceof import_vectorstores.VectorStore) {
        if (prop === "similaritySearch" && "similaritySearch" in target) {
          return async (query, k, filter, _callbacks) => {
            connectionType = import_n8n_workflow.NodeConnectionTypes.AiVectorStore;
            const { index } = executeFunctions.addInputData(connectionType, [
              [{ json: { query, k, filter } }]
            ]);
            const response = await callMethodAsync.call(target, {
              executeFunctions,
              connectionType,
              currentNodeRunIndex: index,
              method: target[prop],
              arguments: [query, k, filter, _callbacks]
            });
            (0, import_helpers.logAiEvent)(executeFunctions, "ai-vector-store-searched", { query });
            executeFunctions.addOutputData(connectionType, index, [[{ json: { response } }]]);
            return response;
          };
        }
      }
      return target[prop];
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  callMethodAsync,
  callMethodSync,
  logWrapper
});
//# sourceMappingURL=logWrapper.js.map