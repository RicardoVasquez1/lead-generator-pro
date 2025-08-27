"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetlifyApi = void 0;
class NetlifyApi {
    name = 'netlifyApi';
    displayName = 'Netlify API';
    documentationUrl = 'netlify';
    properties = [
        {
            displayName: 'Access Token',
            name: 'accessToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
}
exports.NetlifyApi = NetlifyApi;
//# sourceMappingURL=NetlifyApi.credentials.js.map