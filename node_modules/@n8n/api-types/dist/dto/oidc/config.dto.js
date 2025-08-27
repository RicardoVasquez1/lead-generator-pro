"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OidcConfigDto = void 0;
const zod_1 = require("zod");
const zod_class_1 = require("zod-class");
class OidcConfigDto extends zod_class_1.Z.class({
    clientId: zod_1.z.string().min(1),
    clientSecret: zod_1.z.string().min(1),
    discoveryEndpoint: zod_1.z.string().url(),
    loginEnabled: zod_1.z.boolean().optional().default(false),
}) {
}
exports.OidcConfigDto = OidcConfigDto;
//# sourceMappingURL=config.dto.js.map