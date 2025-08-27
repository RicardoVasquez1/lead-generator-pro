"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryIoApi = void 0;
class SentryIoApi {
    name = 'sentryIoApi';
    displayName = 'Sentry.io API';
    documentationUrl = 'sentryIo';
    properties = [
        {
            displayName: 'Token',
            name: 'token',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
}
exports.SentryIoApi = SentryIoApi;
//# sourceMappingURL=SentryIoApi.credentials.js.map