"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBinaryResponse = void 0;
const n8n_core_1 = require("n8n-core");
const n8n_workflow_1 = require("n8n-workflow");
const setContentLength = (responseBody, headers) => {
    if (Buffer.isBuffer(responseBody)) {
        headers['content-length'] = responseBody.length;
    }
    else if (typeof responseBody === 'string') {
        headers['content-length'] = Buffer.byteLength(responseBody, 'utf8');
    }
};
/**
 * Returns a response body for a binary data and sets the content-type header.
 */
const getBinaryResponse = (binaryData, headers) => {
    const contentType = headers['content-type'];
    let shouldSandboxResponseData;
    if ((0, n8n_core_1.isIframeSandboxDisabled)()) {
        shouldSandboxResponseData = false;
    }
    else {
        shouldSandboxResponseData =
            (0, n8n_core_1.isHtmlRenderedContentType)(binaryData.mimeType) ||
                (contentType && (0, n8n_core_1.isHtmlRenderedContentType)(contentType));
    }
    let responseBody;
    if (binaryData.id) {
        responseBody = shouldSandboxResponseData
            ? (0, n8n_core_1.sandboxHtmlResponse)(binaryData.data)
            : { binaryData };
    }
    else {
        const responseBuffer = Buffer.from(binaryData.data, n8n_workflow_1.BINARY_ENCODING);
        responseBody = shouldSandboxResponseData
            ? (0, n8n_core_1.sandboxHtmlResponse)(responseBuffer.toString())
            : responseBuffer;
        setContentLength(responseBody, headers);
    }
    headers['content-type'] ??= binaryData.mimeType;
    return responseBody;
};
exports.getBinaryResponse = getBinaryResponse;
//# sourceMappingURL=binary.js.map