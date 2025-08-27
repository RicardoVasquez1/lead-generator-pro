"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeApi = void 0;
class StripeApi {
    name = 'stripeApi';
    displayName = 'Stripe API';
    documentationUrl = 'stripe';
    properties = [
        {
            displayName: 'Secret Key',
            name: 'secretKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bearer {{$credentials.secretKey}}',
            },
        },
    };
    test = {
        request: {
            baseURL: 'https://api.stripe.com/v1',
            url: '/charges',
            json: true,
        },
    };
}
exports.StripeApi = StripeApi;
//# sourceMappingURL=StripeApi.credentials.js.map