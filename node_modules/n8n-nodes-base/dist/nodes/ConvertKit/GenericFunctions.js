"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertKitApiRequest = convertKitApiRequest;
const n8n_workflow_1 = require("n8n-workflow");
async function convertKitApiRequest(method, endpoint, body = {}, qs = {}, uri, option = {}) {
    const credentials = await this.getCredentials('convertKitApi');
    let options = {
        headers: {
            'Content-Type': 'application/json',
        },
        method,
        qs,
        body,
        uri: uri || `https://api.convertkit.com/v3${endpoint}`,
        json: true,
    };
    options = Object.assign({}, options, option);
    if (Object.keys(options.body).length === 0) {
        delete options.body;
    }
    // it's a webhook so include the api secret on the body
    if (options.uri.includes('/automations/hooks')) {
        options.body.api_secret = credentials.apiSecret;
    }
    else {
        qs.api_secret = credentials.apiSecret;
    }
    if (Object.keys(options.qs).length === 0) {
        delete options.qs;
    }
    try {
        return await this.helpers.request(options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
//# sourceMappingURL=GenericFunctions.js.map