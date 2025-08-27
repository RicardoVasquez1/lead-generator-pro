"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenWeatherMapApi = void 0;
class OpenWeatherMapApi {
    name = 'openWeatherMapApi';
    displayName = 'OpenWeatherMap API';
    documentationUrl = 'openWeatherMap';
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
exports.OpenWeatherMapApi = OpenWeatherMapApi;
//# sourceMappingURL=OpenWeatherMapApi.credentials.js.map