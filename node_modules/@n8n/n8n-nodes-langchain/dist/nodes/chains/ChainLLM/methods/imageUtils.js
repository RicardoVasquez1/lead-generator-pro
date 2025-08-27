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
var imageUtils_exports = {};
__export(imageUtils_exports, {
  UnsupportedMimeTypeError: () => UnsupportedMimeTypeError,
  createImageMessage: () => createImageMessage,
  dataUriFromImageData: () => dataUriFromImageData
});
module.exports = __toCommonJS(imageUtils_exports);
var import_messages = require("@langchain/core/messages");
var import_google_genai = require("@langchain/google-genai");
var import_ollama = require("@langchain/ollama");
var import_n8n_workflow = require("n8n-workflow");
class UnsupportedMimeTypeError extends import_n8n_workflow.OperationalError {
}
function dataUriFromImageData(binaryData, bufferData) {
  if (!binaryData.mimeType?.startsWith("image/")) {
    throw new UnsupportedMimeTypeError(
      `${binaryData.mimeType} is not a supported type of binary data. Only images are supported.`
    );
  }
  return `data:${binaryData.mimeType};base64,${bufferData.toString("base64")}`;
}
async function createImageMessage({
  context,
  itemIndex,
  message
}) {
  if (message.messageType !== "imageBinary" && message.messageType !== "imageUrl") {
    throw new import_n8n_workflow.NodeOperationError(
      context.getNode(),
      "Invalid message type. Only imageBinary and imageUrl are supported"
    );
  }
  const detail = message.imageDetail === "auto" ? void 0 : message.imageDetail;
  if (message.messageType === "imageUrl" && message.imageUrl) {
    return new import_messages.HumanMessage({
      content: [
        {
          type: "image_url",
          image_url: {
            url: message.imageUrl,
            detail
          }
        }
      ]
    });
  }
  const binaryDataKey = message.binaryImageDataKey ?? "data";
  const inputData = context.getInputData()[itemIndex];
  const binaryData = inputData.binary?.[binaryDataKey];
  if (!binaryData) {
    throw new import_n8n_workflow.NodeOperationError(context.getNode(), "No binary data set.");
  }
  const bufferData = await context.helpers.getBinaryDataBuffer(itemIndex, binaryDataKey);
  const model = await context.getInputConnectionData(
    import_n8n_workflow.NodeConnectionTypes.AiLanguageModel,
    0
  );
  try {
    const dataURI = dataUriFromImageData(binaryData, bufferData);
    const directUriModels = [import_google_genai.ChatGoogleGenerativeAI, import_ollama.ChatOllama];
    const imageUrl = directUriModels.some((i) => model instanceof i) ? dataURI : { url: dataURI, detail };
    return new import_messages.HumanMessage({
      content: [
        {
          type: "image_url",
          image_url: imageUrl
        }
      ]
    });
  } catch (error) {
    if (error instanceof UnsupportedMimeTypeError)
      throw new import_n8n_workflow.NodeOperationError(context.getNode(), error.message);
    throw error;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UnsupportedMimeTypeError,
  createImageMessage,
  dataUriFromImageData
});
//# sourceMappingURL=imageUtils.js.map