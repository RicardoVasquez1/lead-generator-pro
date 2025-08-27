"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LingvaNexApi = void 0;
class LingvaNexApi {
    name = 'lingvaNexApi';
    displayName = 'LingvaNex API';
    documentationUrl = 'lingvaNex';
    properties = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
}
exports.LingvaNexApi = LingvaNexApi;
//# sourceMappingURL=LingvaNexApi.credentials.js.map