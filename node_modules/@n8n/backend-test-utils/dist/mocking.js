"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockInstance = void 0;
const di_1 = require("@n8n/di");
const jest_mock_extended_1 = require("jest-mock-extended");
const mockInstance = (serviceClass, data = undefined) => {
    const instance = (0, jest_mock_extended_1.mock)(data);
    di_1.Container.set(serviceClass, instance);
    return instance;
};
exports.mockInstance = mockInstance;
//# sourceMappingURL=mocking.js.map