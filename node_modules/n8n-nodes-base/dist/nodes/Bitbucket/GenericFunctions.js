"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bitbucketApiRequest = bitbucketApiRequest;
exports.bitbucketApiRequestAllItems = bitbucketApiRequestAllItems;
const n8n_workflow_1 = require("n8n-workflow");
async function bitbucketApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    const credentials = await this.getCredentials('bitbucketApi');
    let options = {
        method,
        auth: {
            user: credentials.username,
            password: credentials.appPassword,
        },
        qs,
        body,
        uri: uri || `https://api.bitbucket.org/2.0${resource}`,
        json: true,
    };
    options = Object.assign({}, options, option);
    if (Object.keys(options.body).length === 0) {
        delete options.body;
    }
    try {
        return await this.helpers.request(options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
/**
 * Make an API request to paginated flow endpoint
 * and return all results
 */
async function bitbucketApiRequestAllItems(propertyName, method, resource, body = {}, query = {}) {
    const returnData = [];
    let responseData;
    let uri;
    do {
        responseData = await bitbucketApiRequest.call(this, method, resource, body, query, uri);
        uri = responseData.next;
        returnData.push.apply(returnData, responseData[propertyName]);
    } while (responseData.next !== undefined);
    return returnData;
}
//# sourceMappingURL=GenericFunctions.js.map