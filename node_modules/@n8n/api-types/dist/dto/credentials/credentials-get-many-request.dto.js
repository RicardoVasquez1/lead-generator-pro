"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialsGetManyRequestQuery = void 0;
const zod_class_1 = require("zod-class");
const boolean_from_string_1 = require("../../schemas/boolean-from-string");
class CredentialsGetManyRequestQuery extends zod_class_1.Z.class({
    includeScopes: boolean_from_string_1.booleanFromString.optional(),
    includeData: boolean_from_string_1.booleanFromString.optional(),
    onlySharedWithMe: boolean_from_string_1.booleanFromString.optional(),
}) {
}
exports.CredentialsGetManyRequestQuery = CredentialsGetManyRequestQuery;
//# sourceMappingURL=credentials-get-many-request.dto.js.map