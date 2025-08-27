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
var utils_exports = {};
__export(utils_exports, {
  downloadFile: () => downloadFile,
  uploadFile: () => uploadFile
});
module.exports = __toCommonJS(utils_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_transport = require("../transport");
async function downloadFile(url, fallbackMimeType, qs) {
  const downloadResponse = await this.helpers.httpRequest({
    method: "GET",
    url,
    qs,
    returnFullResponse: true,
    encoding: "arraybuffer"
  });
  const mimeType = downloadResponse.headers?.["content-type"]?.split(";")?.[0] ?? fallbackMimeType;
  const fileContent = Buffer.from(downloadResponse.body);
  return {
    fileContent,
    mimeType
  };
}
async function uploadFile(fileContent, mimeType) {
  const numBytes = fileContent.length.toString();
  const uploadInitResponse = await import_transport.apiRequest.call(this, "POST", "/upload/v1beta/files", {
    headers: {
      "X-Goog-Upload-Protocol": "resumable",
      "X-Goog-Upload-Command": "start",
      "X-Goog-Upload-Header-Content-Length": numBytes,
      "X-Goog-Upload-Header-Content-Type": mimeType,
      "Content-Type": "application/json"
    },
    option: {
      returnFullResponse: true
    }
  });
  const uploadUrl = uploadInitResponse.headers["x-goog-upload-url"];
  const uploadResponse = await this.helpers.httpRequest({
    method: "POST",
    url: uploadUrl,
    headers: {
      "Content-Length": numBytes,
      "X-Goog-Upload-Offset": "0",
      "X-Goog-Upload-Command": "upload, finalize"
    },
    body: fileContent
  });
  while (uploadResponse.file.state !== "ACTIVE" && uploadResponse.file.state !== "FAILED") {
    await new Promise((resolve) => setTimeout(resolve, 1e3));
    uploadResponse.file = await import_transport.apiRequest.call(
      this,
      "GET",
      `/v1beta/${uploadResponse.file.name}`
    );
  }
  if (uploadResponse.file.state === "FAILED") {
    throw new import_n8n_workflow.NodeOperationError(
      this.getNode(),
      uploadResponse.file.error?.message ?? "Unknown error",
      {
        description: "Error uploading file"
      }
    );
  }
  return { fileUri: uploadResponse.file.uri, mimeType: uploadResponse.file.mimeType };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  downloadFile,
  uploadFile
});
//# sourceMappingURL=utils.js.map