"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolvePasswordTokenQueryDto = void 0;
const zod_class_1 = require("zod-class");
const password_reset_token_schema_1 = require("../../schemas/password-reset-token.schema");
class ResolvePasswordTokenQueryDto extends zod_class_1.Z.class({
    token: password_reset_token_schema_1.passwordResetTokenSchema,
}) {
}
exports.ResolvePasswordTokenQueryDto = ResolvePasswordTokenQueryDto;
//# sourceMappingURL=resolve-password-token-query.dto.js.map