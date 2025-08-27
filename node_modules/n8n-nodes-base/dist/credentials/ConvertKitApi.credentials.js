"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertKitApi = void 0;
class ConvertKitApi {
    name = 'convertKitApi';
    displayName = 'ConvertKit API';
    documentationUrl = 'convertKit';
    properties = [
        {
            displayName: 'API Secret',
            name: 'apiSecret',
            type: 'string',
            default: '',
            typeOptions: {
                password: true,
            },
        },
    ];
}
exports.ConvertKitApi = ConvertKitApi;
//# sourceMappingURL=ConvertKitApi.credentials.js.map